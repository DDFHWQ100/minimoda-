import { NextResponse } from "next/server";
import { and, asc, desc, eq, inArray, lt, sql } from "drizzle-orm";
// inArray برای diff نسخه‌ها استفاده می‌شود
import { db } from "@/db";
import {
  themeSettings,
  themes,
  banners,
  homepageSections,
  revisions,
  notices,
  activityLogs,
  sessions,
  menuItems,
  widgets,
  layoutPresets,
  codeHistory,
} from "@/db/schema";
import { getSessionUser, isAdminDemoOpen } from "@/lib/auth";
import {
  setThemeSettings,
  logActivity,
  snapshotNow,
  restoreRevision,
  validateCustomCss,
} from "@/lib/theme";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const user = await getSessionUser();
  if (user?.role === "admin") return { user, actor: user.name };
  return null;
}

const demoGuard = () =>
  NextResponse.json({ error: "حالت نمایش عمومی: برای ذخیره تغییرات ابتدا «ورود یک‌کلیکی مدیر» را بزنید." }, { status: 403 });

const str = (v: unknown, max = 500) => String(v ?? "").trim().slice(0, max);

export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return demoGuard();
  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  if (action === "diff") {
    const id1 = Number(url.searchParams.get("id1"));
    const id2 = Number(url.searchParams.get("id2"));
    const rows = await db.select().from(revisions).where(inArray(revisions.id, [id1, id2]));
    if (rows.length !== 2) return NextResponse.json({ error: "دو نسخه انتخاب کنید." }, { status: 400 });
    const parse = (s: string) => { try { return JSON.parse(s); } catch { return null; } };
    const a = parse(rows.find((r) => r.id === id1)!.snapshot), b = parse(rows.find((r) => r.id === id2)!.snapshot);
    if (!a || !b) return NextResponse.json({ error: "فایل پشتیبان خراب است." }, { status: 400 });
    const diffs: string[] = [];
    const aSettings = new Map<string, string>((a.settings ?? []).map((s: { key: string; value: string }) => [s.key, s.value]));
    const bSettings = new Map<string, string>((b.settings ?? []).map((s: { key: string; value: string }) => [s.key, s.value]));
    for (const [k, v] of aSettings) {
      if (!bSettings.has(k)) diffs.push(`تنظیم «${k}»: فقط در نسخه #${id1} — مقدار: ${v}`);
      else if (bSettings.get(k) !== v) diffs.push(`تنظیم «${k}»: ${v} → ${bSettings.get(k)}`);
    }
    for (const [k, v] of bSettings) {
      if (!aSettings.has(k)) diffs.push(`تنظیم «${k}»: فقط در نسخه #${id2} — مقدار: ${v}`);
    }
    const aSections = new Map<string, boolean>((a.sections ?? []).map((s: { id: string; enabled: boolean }) => [s.id, s.enabled]));
    const bSections = new Map<string, boolean>((b.sections ?? []).map((s: { id: string; enabled: boolean }) => [s.id, s.enabled]));
    for (const [k, v] of aSections) {
      if (bSections.get(k) !== v) diffs.push(`بخش «${k}»: ${v ? "نمایش" : "مخفی"} → ${bSections.get(k) ? "نمایش" : "مخفی"}`);
    }
    const aBanners = new Map<number, Record<string, unknown>>((a.banners ?? []).map((bn: Record<string, unknown>, i: number) => [i, bn]));
    const bBanners = new Map<number, Record<string, unknown>>((b.banners ?? []).map((bn: Record<string, unknown>, i: number) => [i, bn]));
    if ((a.banners ?? []).length !== (b.banners ?? []).length) diffs.push(`تعداد بنرها: ${a.banners?.length ?? 0} → ${b.banners?.length ?? 0}`);
    if (aBanners.size === bBanners.size) {
      for (const [i, bn] of aBanners) {
        if (JSON.stringify(bn) !== JSON.stringify(bBanners.get(i))) diffs.push(`بنر شماره ${i + 1} تغییر کرده است`);
      }
    }
    return NextResponse.json({ ok: true, diffs, count: diffs.length });
  }

  if (action === "revisionDownload") {
    const id = Number(url.searchParams.get("id"));
    const rows = await db.select().from(revisions).where(eq(revisions.id, id)).limit(1);
    if (!rows[0]) return NextResponse.json({ error: "نسخه یافت نشد." }, { status: 404 });
    return new NextResponse(rows[0].snapshot, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="theme-backup-${id}.json"`,
      },
    });
  }
  return NextResponse.json({ error: "اکشن نامعتبر است." }, { status: 400 });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return demoGuard();
  const { actor } = admin;

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "بدنه درخواست نامعتبر است." }, { status: 400 });
  }
  const action = String(body.action ?? "");

  try {
    switch (action) {
      /* ───────── مدیریت قالب‌ها ───────── */
      case "activateTheme": {
        const slug = String(body.slug ?? "");
        const rows = await db.select().from(themes).where(eq(themes.slug, slug)).limit(1);
        const theme = rows[0];
        if (!theme) return NextResponse.json({ error: "قالب یافت نشد." }, { status: 404 });

        await db.transaction(async (tx) => {
          await tx.update(themes).set({ isActive: false });
          await tx.update(themes).set({ isActive: true, isDefault: true, updatedAt: new Date() }).where(eq(themes.slug, slug));
        });
        // اعمال توکن‌های قالب روی تنظیمات طراحی
        let tokens: Record<string, string> = {};
        try { tokens = JSON.parse(theme.tokens || "{}"); } catch { tokens = {}; }
        const entries: Record<string, string> = {};
        if (tokens.primary) entries["theme.primary"] = tokens.primary;
        if (tokens.accent) entries["theme.accent"] = tokens.accent;
        if (tokens.gold) entries["theme.gold"] = tokens.gold;
        if (tokens.font) entries["theme.font"] = tokens.font;
        if (tokens.radius) entries["theme.radius"] = String(tokens.radius);
        await setThemeSettings(entries, actor);
        await logActivity(actor, "فعال‌سازی قالب", `قالب «${theme.name}» نسخه ${theme.version} فعال شد`);
        return NextResponse.json({ ok: true });
      }

      case "createTheme": {
        const name = String(body.name ?? "").trim();
        if (name.length < 3) return NextResponse.json({ error: "نام قالب باید حداقل ۳ کاراکتر باشد." }, { status: 400 });
        const slug = String(body.slug ?? "").toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || `theme-${Date.now().toString(36)}`;
        const dup = await db.select({ id: themes.id }).from(themes).where(eq(themes.slug, slug)).limit(1);
        if (dup.length > 0) return NextResponse.json({ error: "این اسلاگ قبلاً استفاده شده است." }, { status: 409 });
        const version = str(body.version, 20) || "1.0.0";
        const author = str(body.author, 80) || actor;
        const description = str(body.description, 500);
        const preview = str(body.preview, 500);
        const tokens = JSON.stringify({
          primary: str(body.primary, 20) || "#1b3a6b",
          accent: str(body.accent, 20) || "#e91e63",
          gold: str(body.gold, 20) || "#ffc107",
          font: str(body.font, 40) || "Vazirmatn",
          radius: str(body.radius, 10) || "20",
        });
        await db.insert(themes).values({ name, slug, description, author, version, preview, isActive: false, isDefault: false, tokens });
        await logActivity(actor, "افزودن قالب", `قالب «${name}» (v${version}) نصب شد`);
        return NextResponse.json({ ok: true, slug });
      }

      case "createChildTheme": {
        const slug = String(body.slug ?? "");
        const rows = await db.select().from(themes).where(eq(themes.slug, slug)).limit(1);
        const parent = rows[0];
        if (!parent) return NextResponse.json({ error: "قالب والد یافت نشد." }, { status: 404 });
        const name = String(body.name ?? `${parent.name} (فرزند)`).trim() || `${parent.name} (فرزند)`;
        const newSlug = `${slug}-child-${Date.now().toString(36)}`;
        const tokens = JSON.parse(parent.tokens || "{}");
        if (body.primary) tokens.primary = str(body.primary, 20);
        if (body.accent) tokens.accent = str(body.accent, 20);
        await db.insert(themes).values({
          name, slug: newSlug,
          description: `قالب فرزندِ «${parent.name}» — توکن‌های طراحی از والد به ارث می‌برد و فقط رنگ‌های مشخص‌شده تغییر کرده‌اند.`,
          author: actor,
          version: parent.version,
          preview: parent.preview,
          isActive: false, isDefault: false,
          tokens: JSON.stringify(tokens),
        });
        await logActivity(actor, "ساخت قالب فرزند", `فرزند «${name}» از والد «${parent.name}» ساخته شد`);
        return NextResponse.json({ ok: true, slug: newSlug });
      }

      case "duplicateTheme": {
        const slug = String(body.slug ?? "");
        const rows = await db.select().from(themes).where(eq(themes.slug, slug)).limit(1);
        const theme = rows[0];
        if (!theme) return NextResponse.json({ error: "قالب یافت نشد." }, { status: 404 });
        const name = String(body.name ?? `${theme.name} (رونوشت)`).trim() || `${theme.name} (رونوشت)`;
        const newSlug = `${slug}-copy-${Date.now().toString(36)}`;
        await db.insert(themes).values({
          name, slug: newSlug, description: theme.description, author: actor,
          version: theme.version, preview: theme.preview, isActive: false, isDefault: false, tokens: theme.tokens,
        });
        await logActivity(actor, "تکثیر قالب", `از «${theme.name}» نسخه رونوشت «${name}» ساخته شد`);
        return NextResponse.json({ ok: true, slug: newSlug });
      }

      case "deleteTheme": {
        const slug = String(body.slug ?? "");
        const rows = await db.select().from(themes).where(eq(themes.slug, slug)).limit(1);
        const theme = rows[0];
        if (!theme) return NextResponse.json({ error: "قالب یافت نشد." }, { status: 404 });
        if (theme.isActive) return NextResponse.json({ error: "قالب فعال را نمی‌توان حذف کرد؛ ابتدا قالب دیگری را فعال کنید." }, { status: 400 });
        await db.delete(themes).where(eq(themes.slug, slug));
        await logActivity(actor, "حذف قالب", `قالب «${theme.name}» حذف شد`);
        return NextResponse.json({ ok: true });
      }

      /* ───────── ذخیره تنظیمات (طراحی/عمومی/کدها) ───────── */
      case "saveSettings": {
        const entries = (body.entries ?? {}) as Record<string, string>;
        if (typeof entries !== "object" || !entries) return NextResponse.json({ error: "ورودی نامعتبر." }, { status: 400 });
        if (typeof entries["custom.css"] === "string" && entries["custom.css"].length > 0) {
          const check = validateCustomCss(entries["custom.css"]);
          if (!check.ok) return NextResponse.json({ error: `CSS نامعتبر است: ${check.error}` }, { status: 400 });
        }
        // تاریخچه کد: نسخه قبلی هر کد سفارشی را قبل از بازنویسی ذخیره کن
        for (const codeKey of ["custom.css", "custom.js", "custom.head"]) {
          if (typeof entries[codeKey] === "string") {
            const prev = await db.select({ value: themeSettings.value }).from(themeSettings).where(eq(themeSettings.key, codeKey)).limit(1);
            const prevVal = prev[0]?.value ?? "";
            if (prevVal !== entries[codeKey]) {
              await db.insert(codeHistory).values({ key: codeKey, content: prevVal, createdBy: actor });
            }
          }
        }
        if (typeof entries["free_shipping_at"] === "string") {
          const n = Number(entries["free_shipping_at"]);
          if (!Number.isFinite(n) || n < 0) return NextResponse.json({ error: "آستانه ارسال رایگان باید عددی مثبت باشد." }, { status: 400 });
        }
        await setThemeSettings(entries, actor);
        await logActivity(actor, "ویرایش تنظیمات", `ذخیره ${Object.keys(entries).length} تنظیم${body.note ? ` — ${body.note}` : ""}`);
        return NextResponse.json({ ok: true });
      }

      /* ───────── اجزای صفحه اصلی ───────── */
      case "saveSections": {
        const items = (body.sections ?? []) as { id: string; enabled: boolean }[];
        for (const item of items) {
          if (typeof item?.id !== "string") continue;
          await db.update(homepageSections).set({ enabled: !!item.enabled }).where(eq(homepageSections.id, item.id));
        }
        const order = Array.isArray(body.order) ? (body.order as string[]) : [];
        for (let i = 0; i < order.length; i++) {
          await db.update(homepageSections).set({ sort: i + 1 }).where(eq(homepageSections.id, order[i]));
        }
        await logActivity(actor, "ویرایش اجزای صفحه اصلی", "ترتیب و وضعیت نمایش بخش‌های صفحه اصلی به‌روز شد");
        return NextResponse.json({ ok: true });
      }

      /* ───────── بنرها ───────── */
      case "saveBanner": {
        const b = (body.banner ?? {}) as Record<string, unknown>;
        const data = {
          title: String(b.title ?? "").trim(),
          subtitle: String(b.subtitle ?? "").trim(),
          cta: String(b.cta ?? "خرید").trim() || "خرید",
          href: String(b.href ?? "/products").trim() || "/products",
          image: String(b.image ?? "").trim(),
          tone: String(b.tone ?? "from-slate-900/85").trim(),
          active: b.active !== false,
        };
        if (data.title.length < 2) return NextResponse.json({ error: "عنوان بنر را وارد کنید." }, { status: 400 });
        if (!data.image.startsWith("http") && !data.image.startsWith("/")) return NextResponse.json({ error: "آدرس تصویر بنر نامعتبر است." }, { status: 400 });
        const id = Number(b.id) || 0;
        if (id > 0) {
          await db.update(banners).set(data).where(eq(banners.id, id));
          await logActivity(actor, "ویرایش بنر", `بنر «${data.title}» به‌روز شد`);
        } else {
          const maxSort = await db.select({ m: sql<number>`coalesce(max(sort),0)` }).from(banners);
          await db.insert(banners).values({ ...data, sort: (Number(maxSort[0]?.m) || 0) + 1 });
          await logActivity(actor, "افزودن بنر", `بنر «${data.title}» ایجاد شد`);
        }
        return NextResponse.json({ ok: true });
      }
      case "deleteBanner": {
        const id = Number(body.id);
        await db.delete(banners).where(eq(banners.id, id));
        await logActivity(actor, "حذف بنر", `بنر #${id} حذف شد`);
        return NextResponse.json({ ok: true });
      }
      case "toggleBanner": {
        const id = Number(body.id);
        await db.update(banners).set({ active: sql`not ${banners.active}` }).where(eq(banners.id, id));
        return NextResponse.json({ ok: true });
      }
      case "moveBanner": {
        const id = Number(body.id);
        const dir = body.dir === "up" ? -1 : 1;
        const rows = await db.select().from(banners).orderBy(asc(banners.sort), asc(banners.id));
        const idx = rows.findIndex((r) => r.id === id);
        const swapWith = rows[idx + dir];
        if (idx >= 0 && swapWith) {
          const a = rows[idx].sort, bSort = swapWith.sort;
          await db.update(banners).set({ sort: bSort }).where(eq(banners.id, id));
          await db.update(banners).set({ sort: a }).where(eq(banners.id, swapWith.id));
        }
        return NextResponse.json({ ok: true });
      }

      /* ───────── نسخه‌بندی ───────── */
      case "createRevision": {
        const label = String(body.label ?? "پشتیبان دستی").trim() || "پشتیبان دستی";
        const id = await snapshotNow(label, actor);
        await logActivity(actor, "تهیه پشتیبان", `تصویر لحظه‌ای «${label}» (#${id}) گرفته شد`);
        return NextResponse.json({ ok: true, id });
      }
      case "restoreRevision": {
        const id = Number(body.id);
        const ok = await restoreRevision(id, actor);
        if (!ok) return NextResponse.json({ error: "بازیابی ناموفق بود؛ فایل پشتیبان خراب است." }, { status: 400 });
        return NextResponse.json({ ok: true });
      }
      case "deleteRevision": {
        const id = Number(body.id);
        await db.delete(revisions).where(eq(revisions.id, id));
        await logActivity(actor, "حذف پشتیبان", `پشتیبان #${id} حذف شد`);
        return NextResponse.json({ ok: true });
      }

      /* ───────── اعلان‌ها ───────── */
      case "postNotice": {
        const level = ["info", "warning", "security", "success"].includes(String(body.level)) ? String(body.level) : "info";
        const title = String(body.title ?? "").trim();
        const text = String(body.body ?? "").trim();
        if (title.length < 3) return NextResponse.json({ error: "عنوان اعلان کوتاه است." }, { status: 400 });
        await db.insert(notices).values({ level, title, body: text, read: false });
        await logActivity(actor, "ثبت اعلان", `اعلان مدیریتی «${title}» منتشر شد`);
        return NextResponse.json({ ok: true });
      }
      case "dismissNotice": {
        const id = Number(body.id);
        await db.update(notices).set({ read: true }).where(eq(notices.id, id));
        return NextResponse.json({ ok: true });
      }
      case "deleteNotice": {
        const id = Number(body.id);
        await db.delete(notices).where(eq(notices.id, id));
        return NextResponse.json({ ok: true });
      }
      case "markAllNoticesRead": {
        await db.update(notices).set({ read: true });
        return NextResponse.json({ ok: true });
      }

      /* ───────── امنیت: ابطال نشست‌ها ───────── */
      case "revokeSession": {
        const id = Number(body.id);
        await db.delete(sessions).where(eq(sessions.id, id));
        await logActivity(actor, "ابطال نشست", `نشست #${id} باطل شد`);
        return NextResponse.json({ ok: true });
      }
      case "revokeOtherSessions": {
        const keep = Number(body.keep ?? 0);
        await db.delete(sessions).where(keep > 0 ? sql`${sessions.id} <> ${keep}` : sql`1=1`);
        await logActivity(actor, "ابطال همه نشست‌ها", keep > 0 ? `همه نشست‌ها به‌جز #${keep} باطل شدند` : "همه نشست‌ها باطل شدند");
        return NextResponse.json({ ok: true });
      }

      /* ───────── قالب فرزند + نصب از ZIP (JSON manifest) + بازگشت به نسخه قبلی ───────── */
      case "createChildTheme": {
        const parentSlug = String(body.slug ?? "");
        const rows = await db.select().from(themes).where(eq(themes.slug, parentSlug)).limit(1);
        const parent = rows[0];
        if (!parent) return NextResponse.json({ error: "قالب والد یافت نشد." }, { status: 404 });
        const name = String(body.name ?? `${parent.name} — فرزند`).trim() || `${parent.name} — فرزند`;
        const childSlug = `${parentSlug}-child-${Date.now().toString(36)}`;
        await db.insert(themes).values({
          name, slug: childSlug, author: actor, version: `${parent.version}-child`,
          description: `قالب فرزند «${parent.name}» — تغییرات شما روی این نسخه اعمال می‌شود و والد دست‌نخورده می‌ماند.`,
          preview: parent.preview, isActive: false, isDefault: false, tokens: parent.tokens,
        });
        await logActivity(actor, "ایجاد قالب فرزند", `«${name}» از «${parent.name}»`);
        return NextResponse.json({ ok: true, slug: childSlug });
      }
      case "installThemeManifest": {
        // نصب قالب از فایل (manifest JSON داخل ZIP یا مستقیم) — فقط توکن‌های طراحی، بدون کد اجرایی
        const m = (body.manifest ?? {}) as Record<string, unknown>;
        const name = String(m.name ?? "").trim();
        const version = String(m.version ?? "1.0.0").trim();
        const tokens = (m.tokens ?? {}) as Record<string, string>;
        if (name.length < 2) return NextResponse.json({ error: "فایل قالب نامعتبر است: نام قالب وجود ندارد." }, { status: 400 });
        const hex = /^#[0-9a-fA-F]{6}$/;
        for (const k of ["primary", "accent", "gold"]) {
          if (tokens[k] && !hex.test(String(tokens[k]))) return NextResponse.json({ error: `رنگ ${k} در فایل قالب نامعتبر است.` }, { status: 400 });
        }
        if (!/^\d+\.\d+\.\d+/.test(version)) return NextResponse.json({ error: "شماره نسخه قالب نامعتبر است (مثل 1.2.0)." }, { status: 400 });
        const slug = `${String(m.slug ?? name).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "theme"}-${Date.now().toString(36)}`;
        await db.insert(themes).values({
          name, slug, version,
          author: String(m.author ?? "ناشناس").slice(0, 80),
          description: String(m.description ?? "").slice(0, 400),
          preview: String(m.preview ?? "").startsWith("http") ? String(m.preview) : "",
          isActive: false, isDefault: false,
          tokens: JSON.stringify({
            primary: tokens.primary ?? "#1b3a6b", accent: tokens.accent ?? "#e91e63",
            gold: tokens.gold ?? "#ffc107", font: String(tokens.font ?? "Vazirmatn").slice(0, 40),
            radius: String(Number(tokens.radius ?? 20) || 20),
          }),
        });
        await db.insert(notices).values({ level: "success", title: "قالب جدید نصب شد", body: `قالب «${name}» نسخه ${version} با موفقیت نصب شد و آماده فعال‌سازی است.`, read: false });
        await logActivity(actor, "نصب قالب از فایل", `«${name}» v${version}`);
        return NextResponse.json({ ok: true, slug });
      }
      case "rollbackTheme": {
        // بازگشت به آخرین نسخه پشتیبان که توکن‌های این قالب را دارد
        const slug = String(body.slug ?? "");
        const revs = await db.select().from(revisions).orderBy(desc(revisions.createdAt)).limit(30);
        for (const rev of revs) {
          try {
            const data = JSON.parse(rev.snapshot) as { themes?: { slug: string; tokens: string; version: string }[] };
            const t = data.themes?.find((x) => x.slug === slug);
            if (t) {
              await db.update(themes).set({ tokens: t.tokens, version: t.version, updatedAt: new Date() }).where(eq(themes.slug, slug));
              await logActivity(actor, "بازگشت نسخه قالب", `«${slug}» به نسخه ${t.version} از پشتیبان «${rev.label}»`);
              return NextResponse.json({ ok: true, from: rev.label });
            }
          } catch { /* skip */ }
        }
        return NextResponse.json({ error: "نسخه قبلی برای این قالب در پشتیبان‌ها یافت نشد؛ ابتدا یک پشتیبان بگیرید." }, { status: 404 });
      }

      /* ───────── منوها ───────── */
      case "saveMenuItem": {
        const label = String(body.label ?? "").trim();
        const href = String(body.href ?? "/").trim() || "/";
        const location = ["main", "footer_quick", "footer_service"].includes(String(body.location)) ? String(body.location) : "main";
        const parentId = Number(body.parentId) > 0 ? Number(body.parentId) : null;
        if (label.length < 1) return NextResponse.json({ error: "عنوان آیتم منو الزامی است." }, { status: 400 });
        if (!href.startsWith("/") && !href.startsWith("http") && !href.startsWith("#")) return NextResponse.json({ error: "لینک باید با / یا http شروع شود." }, { status: 400 });
        const id = Number(body.id) || 0;
        if (id > 0) {
          await db.update(menuItems).set({ label, href, location, parentId, highlight: body.highlight === true }).where(eq(menuItems.id, id));
          await logActivity(actor, "ویرایش آیتم منو", label);
        } else {
          const [{ m }] = await db.select({ m: sql<number>`coalesce(max(sort),0)` }).from(menuItems).where(eq(menuItems.location, location));
          await db.insert(menuItems).values({ label, href, location, parentId, sort: Number(m) + 1, enabled: true, highlight: body.highlight === true });
          await logActivity(actor, "افزودن آیتم منو", `${label} (${location})`);
        }
        return NextResponse.json({ ok: true });
      }
      case "toggleMenuItem": {
        const id = Number(body.id);
        await db.update(menuItems).set({ enabled: sql`not ${menuItems.enabled}` }).where(eq(menuItems.id, id));
        return NextResponse.json({ ok: true });
      }
      case "deleteMenuItem": {
        const id = Number(body.id);
        await db.delete(menuItems).where(eq(menuItems.parentId, id)); // زیرمنوها
        await db.delete(menuItems).where(eq(menuItems.id, id));
        await logActivity(actor, "حذف آیتم منو", `#${id}`);
        return NextResponse.json({ ok: true });
      }
      case "moveMenuItem": {
        const id = Number(body.id);
        const dir = body.dir === "up" ? -1 : 1;
        const cur = (await db.select().from(menuItems).where(eq(menuItems.id, id)).limit(1))[0];
        if (!cur) return NextResponse.json({ error: "آیتم یافت نشد." }, { status: 404 });
        const siblings = await db.select().from(menuItems)
          .where(and(eq(menuItems.location, cur.location), cur.parentId === null ? sql`${menuItems.parentId} is null` : eq(menuItems.parentId, cur.parentId)))
          .orderBy(asc(menuItems.sort), asc(menuItems.id));
        const idx = siblings.findIndex((s) => s.id === id);
        const swap = siblings[idx + dir];
        if (swap) {
          await db.update(menuItems).set({ sort: swap.sort }).where(eq(menuItems.id, id));
          await db.update(menuItems).set({ sort: cur.sort }).where(eq(menuItems.id, swap.id));
        }
        return NextResponse.json({ ok: true });
      }

      /* ───────── ابزارک‌ها / پاپ‌آپ ───────── */
      case "saveWidget": {
        const id = Number(body.id) || 0;
        const title = String(body.title ?? "").trim();
        const type = ["popup", "announcement", "trust_badge", "contact_block"].includes(String(body.type)) ? String(body.type) : "popup";
        let config: Record<string, unknown> = {};
        try { config = typeof body.config === "string" ? JSON.parse(body.config) : (body.config as Record<string, unknown>) ?? {}; } catch { return NextResponse.json({ error: "تنظیمات ابزارک JSON معتبر نیست." }, { status: 400 }); }
        if (title.length < 2) return NextResponse.json({ error: "عنوان ابزارک الزامی است." }, { status: 400 });
        // جلوگیری از کد اجرایی در متن پاپ‌آپ
        const text = JSON.stringify(config);
        if (/<script|javascript:|onerror=|onload=/i.test(text)) return NextResponse.json({ error: "محتوای ابزارک حاوی کد غیرمجاز است." }, { status: 400 });
        if (id > 0) {
          await db.update(widgets).set({ title, type, config: JSON.stringify(config), enabled: body.enabled !== false, updatedAt: new Date() }).where(eq(widgets.id, id));
        } else {
          await db.insert(widgets).values({ title, type, config: JSON.stringify(config), enabled: body.enabled !== false });
        }
        await logActivity(actor, id > 0 ? "ویرایش ابزارک" : "افزودن ابزارک", title);
        return NextResponse.json({ ok: true });
      }
      case "toggleWidget": {
        await db.update(widgets).set({ enabled: sql`not ${widgets.enabled}`, updatedAt: new Date() }).where(eq(widgets.id, Number(body.id)));
        return NextResponse.json({ ok: true });
      }
      case "deleteWidget": {
        await db.delete(widgets).where(eq(widgets.id, Number(body.id)));
        await logActivity(actor, "حذف ابزارک", `#${body.id}`);
        return NextResponse.json({ ok: true });
      }

      /* ───────── الگوهای چیدمان ───────── */
      case "savePreset": {
        const name = String(body.name ?? "").trim();
        if (name.length < 2) return NextResponse.json({ error: "نام الگو الزامی است." }, { status: 400 });
        const [sections, settings] = await Promise.all([
          db.select().from(homepageSections),
          db.select().from(themeSettings),
        ]);
        const s = Object.fromEntries(settings.map((x) => [x.key, x.value]));
        const snapshot = JSON.stringify({
          sections: sections.map((x) => ({ id: x.id, enabled: x.enabled, sort: x.sort })),
          tokens: { primary: s["theme.primary"], accent: s["theme.accent"], gold: s["theme.gold"], radius: s["theme.radius"], font: s["theme.font"] },
          design: Object.fromEntries(Object.entries(s).filter(([k]) => k.startsWith("design.") || k.startsWith("responsive."))),
        });
        await db.insert(layoutPresets).values({ name, description: String(body.description ?? "").slice(0, 200), snapshot, createdBy: actor });
        await logActivity(actor, "ذخیره الگوی چیدمان", name);
        return NextResponse.json({ ok: true });
      }
      case "applyPreset": {
        const id = Number(body.id);
        const rows = await db.select().from(layoutPresets).where(eq(layoutPresets.id, id)).limit(1);
        if (!rows[0]) return NextResponse.json({ error: "الگو یافت نشد." }, { status: 404 });
        // پشتیبان خودکار قبل از اعمال
        await snapshotNow(`پیش از اعمال الگوی «${rows[0].name}»`, actor);
        const data = JSON.parse(rows[0].snapshot) as { sections?: { id: string; enabled: boolean; sort: number }[]; tokens?: Record<string, string>; design?: Record<string, string> };
        for (const sct of data.sections ?? []) await db.update(homepageSections).set({ enabled: sct.enabled, sort: sct.sort }).where(eq(homepageSections.id, sct.id));
        const entries: Record<string, string> = {};
        if (data.tokens?.primary) entries["theme.primary"] = data.tokens.primary;
        if (data.tokens?.accent) entries["theme.accent"] = data.tokens.accent;
        if (data.tokens?.gold) entries["theme.gold"] = data.tokens.gold;
        if (data.tokens?.radius) entries["theme.radius"] = data.tokens.radius;
        if (data.tokens?.font) entries["theme.font"] = data.tokens.font;
        Object.assign(entries, data.design ?? {});
        await setThemeSettings(entries, actor);
        await logActivity(actor, "اعمال الگوی چیدمان", rows[0].name);
        return NextResponse.json({ ok: true });
      }
      case "deletePreset": {
        await db.delete(layoutPresets).where(eq(layoutPresets.id, Number(body.id)));
        await logActivity(actor, "حذف الگوی چیدمان", `#${body.id}`);
        return NextResponse.json({ ok: true });
      }

      /* ───────── تاریخچه کد سفارشی ───────── */
      case "restoreCode": {
        const id = Number(body.id);
        const rows = await db.select().from(codeHistory).where(eq(codeHistory.id, id)).limit(1);
        if (!rows[0]) return NextResponse.json({ error: "نسخه یافت نشد." }, { status: 404 });
        await setThemeSettings({ [rows[0].key]: rows[0].content }, actor);
        await logActivity(actor, "بازگردانی کد سفارشی", `${rows[0].key} → نسخه #${id}`);
        return NextResponse.json({ ok: true });
      }

      /* ───────── پاک‌سازی گزارش فعالیت‌ها ───────── */
      case "clearActivity": {
        const days = Number(body.days ?? 30) || 30;
        const cutoff = new Date(Date.now() - days * 24 * 3600 * 1000);
        await db.delete(activityLogs).where(lt(activityLogs.createdAt, cutoff));
        await logActivity(actor, "پاک‌سازی لاگ", `فعالیت‌های قدیمی‌تر از ${days} روز حذف شدند`);
        return NextResponse.json({ ok: true });
      }

      default:
        return NextResponse.json({ error: `اکشن «${action}» شناخته‌شده نیست.` }, { status: 400 });
    }
  } catch (err) {
    console.error("theme api error", err);
    return NextResponse.json({ error: "خطای داخلی سرور؛ جزئیات در لاگ ثبت شد." }, { status: 500 });
  }
}
