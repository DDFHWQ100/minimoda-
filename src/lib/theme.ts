import { cache } from "react";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  themeSettings,
  themes,
  homepageSections,
  banners,
  activityLogs,
  revisions,
} from "@/db/schema";

/* ═══════════════════════════════════════════════
   دسترسی به داده‌های قالب و پوسته — سمت سرور
   ═══════════════════════════════════════════════ */

export type ThemeSettingsMap = Record<string, string>;

export const getThemeSettings = cache(async (): Promise<ThemeSettingsMap> => {
  try {
    const rows = await db.select().from(themeSettings);
    const map: ThemeSettingsMap = {};
    for (const r of rows) map[r.key] = r.value;
    return map;
  } catch {
    return {};
  }
});

export const getThemeBundle = cache(async () => {
  const [settings, themeRows, sectionRows, bannerRows] = await Promise.all([
    getThemeSettings(),
    db.select().from(themes).orderBy(asc(themes.id)).catch(() => []),
    db.select().from(homepageSections).orderBy(asc(homepageSections.sort)).catch(() => []),
    db.select().from(banners).orderBy(asc(banners.sort)).catch(() => []),
  ]);
  const list = themeRows as (typeof themes.$inferSelect)[];
  const activeTheme = list.find((t) => t.isActive) ?? null;
  return { settings, themes: list, sections: sectionRows as (typeof homepageSections.$inferSelect)[], banners: bannerRows as (typeof banners.$inferSelect)[], activeTheme };
});

export function settingBool(settings: ThemeSettingsMap, key: string, fallback = false): boolean {
  const v = settings[key];
  if (v === undefined) return fallback;
  return v === "true" || v === "1" || v === "yes";
}

export function settingInt(settings: ThemeSettingsMap, key: string, fallback: number): number {
  const n = Number(settings[key]);
  return Number.isFinite(n) && settings[key] !== "" ? n : fallback;
}

/** آپدیت چند تنظیم + ثبت لاگ */
export async function setThemeSettings(entries: Record<string, string>, actor: string): Promise<void> {
  for (const [key, rawValue] of Object.entries(entries)) {
    const value = String(rawValue ?? "");
    const existing = await db.select({ key: themeSettings.key }).from(themeSettings).where(eq(themeSettings.key, key)).limit(1);
    if (existing.length > 0) {
      await db.update(themeSettings).set({ value, updatedBy: actor, updatedAt: new Date() }).where(eq(themeSettings.key, key));
    } else {
      await db.insert(themeSettings).values({ key, value, label: key, group: "custom", updatedBy: actor });
    }
  }
}

export async function logActivity(actor: string, action: string, detail = ""): Promise<void> {
  try {
    await db.insert(activityLogs).values({ actor, action, detail });
  } catch {
    /* لاگ هرگز نباید اپ را از کار بیندازد */
  }
}

/* ═══════════ نسخه‌بندی (پشتیبان‌گیری و بازیابی) ═══════════ */

export async function snapshotNow(label: string, actor: string): Promise<number> {
  const [settings, themeRows, sectionRows, bannerRows] = await Promise.all([
    db.select().from(themeSettings),
    db.select().from(themes),
    db.select().from(homepageSections),
    db.select().from(banners),
  ]);
  const snapshot = JSON.stringify({
    version: 1,
    takenAt: new Date().toISOString(),
    settings: settings.map(({ key, value }) => ({ key, value })),
    themes: themeRows.map(({ id, slug, isActive, isDefault, tokens, version }) => ({ slug, isActive, isDefault, tokens, version })),
    sections: sectionRows.map(({ id, enabled, sort }) => ({ id, enabled, sort })),
    banners: bannerRows.map((b) => ({ title: b.title, subtitle: b.subtitle, cta: b.cta, href: b.href, image: b.image, tone: b.tone, sort: b.sort, active: b.active })),
  });
  const [row] = await db.insert(revisions).values({ label, snapshot, createdBy: actor }).returning({ id: revisions.id });
  return row.id;
}

export async function restoreRevision(id: number, actor: string): Promise<boolean> {
  const rows = await db.select().from(revisions).where(eq(revisions.id, id)).limit(1);
  const rev = rows[0];
  if (!rev) return false;

  let data: {
    settings: { key: string; value: string }[];
    sections: { id: string; enabled: boolean; sort: number }[];
    banners: { title: string; subtitle: string; cta: string; href: string; image: string; tone: string; sort: number; active: boolean }[];
    themes: { slug: string; isActive: boolean; isDefault: boolean; tokens: string; version: string }[];
  };
  try {
    data = JSON.parse(rev.snapshot);
  } catch {
    return false;
  }

  // بازگردانی تنظیمات
  for (const s of data.settings ?? []) {
    await db.insert(themeSettings)
      .values({ key: s.key, value: s.value, label: s.key, group: "restored", updatedBy: actor })
      .onConflictDoUpdate({ target: themeSettings.key, set: { value: s.value, updatedBy: actor, updatedAt: new Date() } });
  }
  // بازگردانی وضعیت اجزای صفحه اصلی
  for (const s of data.sections ?? []) {
    await db.update(homepageSections).set({ enabled: s.enabled, sort: s.sort }).where(eq(homepageSections.id, s.id));
  }
  // بازگردانی بنرها (به متن snapshot اعتماد می‌کنیم)
  await db.delete(banners);
  if (data.banners?.length) {
    await db.insert(banners).values(data.banners.map((b) => ({ ...b, sort: Number(b.sort) || 0 })));
  }
  // بازگردانی قالب فعال
  if (data.themes?.length) {
    for (const t of data.themes) {
      await db.update(themes).set({ isActive: t.isActive, isDefault: t.isDefault, tokens: t.tokens, version: t.version }).where(eq(themes.slug, t.slug));
    }
  }
  await logActivity(actor, "بازیابی نسخه", `بازگشت به پشتیبان «${rev.label}» (#${rev.id})`);
  return true;
}

/** اعتبارسنجی ساده CSS سفارشی: تعادل آکولادها و پرانتزها */
export function validateCustomCss(css: string): { ok: boolean; error?: string } {
  let depth = { curly: 0, paren: 0 };
  let inComment = false;
  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    const next = css[i + 1];
    if (inComment) { if (ch === "*" && next === "/") { inComment = false; i++; } continue; }
    if (ch === "/" && next === "*") { inComment = true; i++; continue; }
    if (ch === "{") depth.curly++;
    if (ch === "}") depth.curly--;
    if (ch === "(") depth.paren++;
    if (ch === ")") depth.paren--;
    if (depth.curly < 0) return { ok: false, error: "آکولاد بسته اضافه است (})" };
    if (depth.paren < 0) return { ok: false, error: "پرانتز بسته اضافه است ())" };
  }
  if (inComment) return { ok: false, error: "کامنت CSS بسته نشده است (*/)" };
  if (depth.curly !== 0) return { ok: false, error: "تعداد آکولادها متعادل نیست" };
  if (depth.paren !== 0) return { ok: false, error: "تعداد پرانتزها متعادل نیست" };
  return { ok: true };
}

/** ساخت بلوک CSS متغیرها از توکن‌های فعال */
export function themeCssVariables(settings: ThemeSettingsMap): string {
  const primary = settings["theme.primary"] ?? "#1b3a6b";
  const accent = settings["theme.accent"] ?? "#e91e63";
  const gold = settings["theme.gold"] ?? "#ffc107";
  const radius = Number(settings["theme.radius"] ?? "20") || 20;
  const font = settings["theme.font"] ?? "Vazirmatn";
  return `:root{--brand-primary:${primary};--brand-accent:${accent};--brand-gold:${gold};--brand-radius:${radius}px}`
    + `body{font-family:'${font}',Tahoma,'Segoe UI',sans-serif}`;
}

/** پیوند فونت گوگل متناسب با انتخاب تنظیمات */
export function fontLinkFor(fontName: string | undefined): string {
  const allowed: Record<string, string> = {
    Vazirmatn: "Vazirmatn:wght@300;400;500;600;700;800;900",
    Estedad: "Estedad:wght@300;400;500;600;700;800;900",
    "Noto Kufi Arabic": "Noto+Kufi+Arabic:wght@300;400;500;600;700",
    Harmattan: "Harmattan:wght@300;400;500;600;700",
    Lalezar: "Lalezar&display=swap",
  };
  const family = allowed[fontName ?? ""] ?? allowed.Vazirmatn;
  return `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
}
