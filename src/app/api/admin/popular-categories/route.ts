import { NextResponse } from "next/server";
import { asc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { setThemeSettings, logActivity } from "@/lib/theme";

export const dynamic = "force-dynamic";
const MAX_POPULAR = 30;

async function requireAdmin() {
  const user = await getSessionUser();
  return user?.role === "admin" ? user : null;
}
const demoGuard = () =>
  NextResponse.json({ error: "حالت نمایش عمومی: برای ذخیره تغییرات ابتدا «ورود یک‌کلیکی مدیر» را بزنید." }, { status: 403 });

function sanitizeSlug(raw: string): string {
  return raw.toLowerCase().trim().replace(/[^a-z0-9-_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return demoGuard();

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { return NextResponse.json({ error: "بدنه درخواست نامعتبر است." }, { status: 400 }); }
  const action = String(body.action ?? "");

  try {
    switch (action) {
      /* ── تنظیمات کلی بخش ── */
      case "sectionSettings": {
        const enabled = body.enabled !== false;
        const rows = Math.min(3, Math.max(1, Number(body.rows) || 1));
        const enabledCount = await db.select({ c: sql<number>`count(*)` }).from(categories).where(eq(categories.showOnHome, true));
        await setThemeSettings({
          "home.categories_enabled": String(enabled),
          "home.categories_rows": String(rows),
        }, admin.name);
        await logActivity(admin.name, "تنظیمات دسته‌بندی محبوب", `نمایش بخش: ${enabled ? "فعال" : "غیرفعال"} — تعداد ردیف: ${rows} (${Number(enabledCount[0]?.c ?? 0)} دسته فعال)`);
        return NextResponse.json({ ok: true });
      }

      /* ── فعال/غیرفعال کردن هر دسته ── */
      case "toggleCategory": {
        const id = Number(body.id);
        const showOnHome = body.showOnHome === true;
        const rows = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
        const cat = rows[0];
        if (!cat) return NextResponse.json({ error: "دسته‌بندی یافت نشد." }, { status: 404 });
        if (showOnHome) {
          const [{ c }] = await db.select({ c: sql<number>`count(*)` }).from(categories).where(eq(categories.showOnHome, true));
          if (Number(c) >= MAX_POPULAR && !cat.showOnHome) {
            return NextResponse.json({ error: `حداکثر ${MAX_POPULAR} دسته محبوب قابل نمایش است (۳ ردیف × ۱۰ ستون). ابتدا یک دسته را غیرفعال کنید.` }, { status: 400 });
          }
        }
        await db.update(categories).set({ showOnHome }).where(eq(categories.id, id));
        await logActivity(admin.name, showOnHome ? "نمایش دسته در خانه" : "پنهان‌سازی دسته از خانه", `«${cat.name}»`);
        return NextResponse.json({ ok: true });
      }

      /* ── افزودن / ویرایش دسته ── */
      case "saveCategory": {
        const name = String(body.name ?? "").trim();
        if (name.length < 2) return NextResponse.json({ error: "نام دسته باید حداقل ۲ کاراکتر باشد." }, { status: 400 });
        const icon = String(body.icon ?? "Shirt");
        const description = String(body.description ?? "").trim();
        const id = Number(body.id ?? 0);

        if (id > 0) {
          const rows = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
          if (!rows[0]) return NextResponse.json({ error: "دسته‌بندی یافت نشد." }, { status: 404 });
          const slugInput = String(body.slug ?? "").trim();
          const newSlug = sanitizeSlug(slugInput) || rows[0].slug;
          if (newSlug !== rows[0].slug) {
            const dup = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, newSlug)).limit(1);
            if (dup.length > 0) return NextResponse.json({ error: "این اسلاگ قبلاً استفاده شده است." }, { status: 409 });
          }
          await db.update(categories).set({ name, slug: newSlug, icon, description }).where(eq(categories.id, id));
          await logActivity(admin.name, "ویرایش دسته‌بندی", `«${name}» به‌روز شد`);
          return NextResponse.json({ ok: true, slug: newSlug });
        }

        const slugInput = String(body.slug ?? "").trim();
        const slug = sanitizeSlug(slugInput) || `cat-${Date.now().toString(36)}`;
        const dup = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, slug)).limit(1);
        if (dup.length > 0) return NextResponse.json({ error: "این اسلاگ قبلاً استفاده شده است." }, { status: 409 });
        const [{ maxSort }] = await db.select({ maxSort: sql<number>`coalesce(max(sort_order),0)` }).from(categories);
        const [{ c: popularCount }] = await db.select({ c: sql<number>`count(*)` }).from(categories).where(eq(categories.showOnHome, true));
        const showOnHome = Number(popularCount) < MAX_POPULAR;
        const [created] = await db.insert(categories).values({
          name, slug, icon, description, sortOrder: Number(maxSort) + 1, showOnHome,
        }).returning({ id: categories.id });
        await logActivity(admin.name, "افزودن دسته‌بندی", `«${name}» ساخته شد${showOnHome ? " و در دسته‌های محبوب قرار گرفت" : ""}`);
        return NextResponse.json({ ok: true, id: created.id, slug, showOnHome });
      }

      /* ── حذف دسته ── */
      case "deleteCategory": {
        const id = Number(body.id);
        const rows = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
        const cat = rows[0];
        if (!cat) return NextResponse.json({ error: "دسته‌بندی یافت نشد." }, { status: 404 });
        await db.delete(categories).where(eq(categories.id, id));
        await logActivity(admin.name, "حذف دسته‌بندی", `«${cat.name}» حذف شد (محصولات آن بدون دسته شدند)`);
        return NextResponse.json({ ok: true });
      }

      /* ── تغییر ترتیب ── */
      case "moveCategory": {
        const id = Number(body.id);
        const dir = body.dir === "up" ? -1 : 1;
        const rows = await db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.id));
        const idx = rows.findIndex((r) => r.id === id);
        const swap = rows[idx + dir];
        if (idx >= 0 && swap) {
          const a = rows[idx].sortOrder, b = swap.sortOrder;
          await db.update(categories).set({ sortOrder: b }).where(eq(categories.id, id));
          await db.update(categories).set({ sortOrder: a }).where(eq(categories.id, swap.id));
        }
        return NextResponse.json({ ok: true });
      }

      default:
        return NextResponse.json({ error: `اکشن «${action}» شناخته‌شده نیست.` }, { status: 400 });
    }
  } catch (err) {
    console.error("popular categories api error", err);
    return NextResponse.json({ error: "خطای داخلی سرور." }, { status: 500 });
  }
}
