import { NextResponse } from "next/server";
import { and, asc, desc, eq, inArray, lt, sql } from "drizzle-orm";
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

export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return demoGuard();
  const url = new URL(req.url);
  const action = url.searchParams.get("action");

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
