import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  discountCodes, suppliers, returnsRequests, reviews, contactMessages,
  users, shippingMethods, productVariants, stockMovements, products, blogPosts, sessions,
  campaigns, sizeCharts, contentPages, brands,
} from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { logActivity } from "@/lib/theme";

export const dynamic = "force-dynamic";

const demoGuard = () =>
  NextResponse.json({ error: "حالت نمایش عمومی: برای ذخیره تغییرات ابتدا «ورود یک‌کلیکی مدیر» را بزنید." }, { status: 403 });

const int = (v: unknown, def = 0) => { const n = Number(v); return Number.isFinite(n) ? Math.trunc(n) : def; };
const str = (v: unknown, max = 500) => String(v ?? "").trim().slice(0, max);

export async function POST(req: Request) {
  const session = await getSessionUser();
  if (session?.role !== "admin") return demoGuard();
  const actor = session.name;

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { return NextResponse.json({ error: "بدنه نامعتبر." }, { status: 400 }); }

  const entity = str(body.entity, 40);
  const action = str(body.action, 40);
  const values = (body.values ?? body) as Record<string, unknown>;
  const id = Number(values.id ?? body.id ?? 0);

  try {
    switch (`${entity}.${action}`) {

      /* ════════ کدهای تخفیف ════════ */
      case "discounts.create": {
        const code = str(values.code, 40).toUpperCase().replace(/\s+/g, "");
        const type = values.type === "fixed" ? "fixed" : "percent";
        const value = int(values.value);
        if (!/^[A-Z0-9_-]{3,40}$/.test(code)) return NextResponse.json({ error: "کد باید ۳ تا ۴۰ کاراکتر (حروف انگلیسی/عدد) باشد." }, { status: 400 });
        if (value <= 0 || (type === "percent" && value > 100)) return NextResponse.json({ error: "مقدار تخفیف نامعتبر است (درصدی: ۱ تا ۱۰۰)." }, { status: 400 });
        const exists = await db.select({ id: discountCodes.id }).from(discountCodes).where(eq(discountCodes.code, code)).limit(1);
        if (exists.length > 0) return NextResponse.json({ error: "این کد قبلاً ثبت شده است." }, { status: 409 });
        const exp = values.expiresAt ? new Date(String(values.expiresAt)) : null;
        await db.insert(discountCodes).values({
          code, type, value,
          minOrder: Math.max(0, int(values.minOrder)),
          maxUses: Math.max(1, int(values.maxUses, 100)),
          expiresAt: exp && !isNaN(exp.getTime()) ? exp : null,
          active: true,
        });
        await logActivity(actor, "ایجاد کد تخفیف", `${code} — ${type === "percent" ? `${value}٪` : `${value} تومان`}`);
        return NextResponse.json({ ok: true });
      }
      case "discounts.setActive": {
        await db.update(discountCodes).set({ active: values.active === true }).where(eq(discountCodes.id, id));
        await logActivity(actor, values.active ? "فعال‌سازی کد تخفیف" : "غیرفعال‌سازی کد تخفیف", `#${id}`);
        return NextResponse.json({ ok: true });
      }
      case "discounts.delete": {
        await db.delete(discountCodes).where(eq(discountCodes.id, id));
        await logActivity(actor, "حذف کد تخفیف", `#${id}`);
        return NextResponse.json({ ok: true });
      }

      /* ════════ تأمین‌کنندگان ════════ */
      case "suppliers.create": {
        const name = str(values.name, 120);
        if (name.length < 2) return NextResponse.json({ error: "نام تأمین‌کننده الزامی است." }, { status: 400 });
        await db.insert(suppliers).values({
          name,
          contactPerson: str(values.contactPerson, 80),
          phone: str(values.phone, 30),
          address: str(values.address, 300),
          notes: str(values.notes, 500),
        });
        await logActivity(actor, "افزودن تأمین‌کننده", name);
        return NextResponse.json({ ok: true });
      }
      case "suppliers.delete": {
        await db.delete(suppliers).where(eq(suppliers.id, id));
        await logActivity(actor, "حذف تأمین‌کننده", `#${id}`);
        return NextResponse.json({ ok: true });
      }

      /* ════════ مرجوعی و تعویض ════════ */
      case "returns.create": {
        const orderId = int(values.orderId);
        const type = values.type === "exchange" ? "exchange" : "refund";
        const reason = str(values.reason, 300);
        if (orderId <= 0) return NextResponse.json({ error: "شناسه سفارش نامعتبر است." }, { status: 400 });
        if (reason.length < 3) return NextResponse.json({ error: "دلیل مرجوعی را بنویسید." }, { status: 400 });
        const order = await db.execute(sql`select id from orders where id = ${orderId}`);
        if (!order.rows?.length) return NextResponse.json({ error: "سفارش یافت نشد." }, { status: 404 });
        await db.insert(returnsRequests).values({ orderId, type, reason, status: "requested", note: str(values.note, 300) });
        await logActivity(actor, "ثبت درخواست مرجوعی", `سفارش #MM-${String(orderId).padStart(5, "0")} — ${type === "refund" ? "بازپرداخت" : "تعویض"}`);
        return NextResponse.json({ ok: true });
      }
      case "returns.setStatus": {
        const status = str(values.status, 20);
        if (!["requested", "approved", "rejected", "done"].includes(status)) return NextResponse.json({ error: "وضعیت نامعتبر." }, { status: 400 });
        await db.update(returnsRequests).set({ status }).where(eq(returnsRequests.id, id));
        await logActivity(actor, "تغییر وضعیت مرجوعی", `#${id} → ${status}`);
        return NextResponse.json({ ok: true });
      }

      /* ════════ نظرات ════════ */
      case "reviews.delete": {
        const rows = await db.select({ productId: reviews.productId }).from(reviews).where(eq(reviews.id, id)).limit(1);
        await db.delete(reviews).where(eq(reviews.id, id));
        if (rows[0]) {
          await db.update(products)
            .set({
              rating: sql`coalesce((select avg(rating) from reviews where product_id = ${rows[0].productId}), 4.5)`,
              reviewCount: sql`(select count(*) from reviews where product_id = ${rows[0].productId})`,
            })
            .where(eq(products.id, rows[0].productId));
        }
        await logActivity(actor, "حذف نظر", `#${id}`);
        return NextResponse.json({ ok: true });
      }

      /* ════════ پیام‌ها و پشتیبانی ════════ */
      case "messages.setRead": {
        await db.update(contactMessages).set({ read: values.read === true }).where(eq(contactMessages.id, id));
        return NextResponse.json({ ok: true });
      }
      case "messages.delete": {
        await db.delete(contactMessages).where(eq(contactMessages.id, id));
        await logActivity(actor, "حذف پیام", `#${id}`);
        return NextResponse.json({ ok: true });
      }

      /* ════════ کاربران و دسترسی ════════ */
      case "users.setRole": {
        const role = values.role === "admin" ? "admin" : "user";
        if (id === session.id) return NextResponse.json({ error: "نقش خودتان را نمی‌توانید تغییر دهید." }, { status: 400 });
        await db.update(users).set({ role }).where(eq(users.id, id));
        if (role === "user") {
          // ابطال نشست‌های کاربر تنزل‌یافته
          await db.delete(sessions).where(eq(sessions.userId, id));
        }
        await logActivity(actor, "تغییر نقش کاربر", `#${id} → ${role}`);
        return NextResponse.json({ ok: true });
      }

      /* ════════ روش‌های ارسال ════════ */
      case "shipping.create": {
        const name = str(values.name, 120);
        if (name.length < 2) return NextResponse.json({ error: "نام روش ارسال الزامی است." }, { status: 400 });
        await db.insert(shippingMethods).values({
          name,
          cost: Math.max(0, int(values.cost)),
          freeOver: Math.max(0, int(values.freeOver)),
          etaDays: Math.max(1, int(values.etaDays, 2)),
          sort: int(values.sort, 99),
          active: true,
        });
        await logActivity(actor, "افزودن روش ارسال", name);
        return NextResponse.json({ ok: true });
      }
      case "shipping.toggle": {
        await db.update(shippingMethods).set({ active: values.active === true }).where(eq(shippingMethods.id, id));
        return NextResponse.json({ ok: true });
      }
      case "shipping.delete": {
        await db.delete(shippingMethods).where(eq(shippingMethods.id, id));
        await logActivity(actor, "حذف روش ارسال", `#${id}`);
        return NextResponse.json({ ok: true });
      }

      /* ════════ تنوع‌ها و انبار ════════ */
      case "variants.setStock": {
        const stock = int(values.stock);
        if (stock < 0) return NextResponse.json({ error: "موجودی نمی‌تواند منفی باشد." }, { status: 400 });
        const rows = await db.select().from(productVariants).where(eq(productVariants.id, id)).limit(1);
        if (!rows[0]) return NextResponse.json({ error: "تنوع یافت نشد." }, { status: 404 });
        const diff = stock - rows[0].stock;
        await db.update(productVariants).set({ stock }).where(eq(productVariants.id, id));
        // همگام‌سازی تقریبی موجودی کل محصول (مجموع همه تنوع‌ها)
        await db.execute(sql`
          update products set stock = greatest((select coalesce(sum(stock),0) from product_variants where product_id = ${rows[0].productId}), 0)
          where id = ${rows[0].productId}`);
        if (diff !== 0) {
          await db.insert(stockMovements).values({
            productId: rows[0].productId,
            delta: diff,
            reason: diff > 0 ? "افزایش موجودی تنوع" : "کاهش موجودی تنوع",
            note: `سایز ${rows[0].size} — SKU ${rows[0].sku}`,
          });
        }
        return NextResponse.json({ ok: true });
      }
      case "stock.adjust": {
        const productId = int(values.productId);
        const delta = int(values.delta);
        const reason = str(values.reason, 120) || "تنظیم دستی";
        if (!productId || delta === 0) return NextResponse.json({ error: "محصول و مقدار تغییر الزامی است." }, { status: 400 });
        const rows = await db.select({ id: products.id, stock: products.stock }).from(products).where(eq(products.id, productId)).limit(1);
        if (!rows[0]) return NextResponse.json({ error: "محصول یافت نشد." }, { status: 404 });
        await db.update(products).set({ stock: sql`greatest(${products.stock} + ${delta}, 0)` }).where(eq(products.id, productId));
        await db.insert(stockMovements).values({ productId, delta, reason, note: str(values.note, 200) });
        await logActivity(actor, "ثبت حرکت انبار", `${delta > 0 ? "+" : ""}${delta} — ${reason}`);
        return NextResponse.json({ ok: true });
      }

      /* ════════ وبلاگ ════════ */
      case "blog.create": {
        const title = str(values.title, 220);
        const content = str(values.content, 8000);
        if (title.length < 5 || content.length < 20) return NextResponse.json({ error: "عنوان حداقل ۵ و متن حداقل ۲۰ کاراکتر باشد." }, { status: 400 });
        const slug = str(values.slug, 160).toLowerCase().trim().replace(/[^a-z0-9\u0600-\u06ff\s-]+/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 120) || `post-${Date.now().toString(36)}`;
        const exists = await db.select({ id: blogPosts.id }).from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
        const finalSlug = exists.length > 0 ? `${slug}-${Date.now().toString(36)}` : slug;
        await db.insert(blogPosts).values({
          title, slug: finalSlug,
          excerpt: str(values.excerpt, 300),
          content,
          image: str(values.image, 500) || "https://images.pexels.com/photos/35607631/pexels-photo-35607631.jpeg",
          tag: str(values.tag, 60) || "مد و پوشاک",
          views: 0,
        });
        await logActivity(actor, "انتشار مقاله", title);
        return NextResponse.json({ ok: true });
      }
      case "blog.update": {
        const title = str(values.title, 220);
        const content = str(values.content, 8000);
        if (title.length < 5 || content.length < 20) return NextResponse.json({ error: "عنوان حداقل ۵ و متن حداقل ۲۰ کاراکتر باشد." }, { status: 400 });
        await db.update(blogPosts).set({
          title,
          excerpt: str(values.excerpt, 300),
          content,
          image: str(values.image, 500),
          tag: str(values.tag, 60) || "مد و پوشاک",
        }).where(eq(blogPosts.id, id));
        await logActivity(actor, "ویرایش مقاله", title);
        return NextResponse.json({ ok: true });
      }
      case "blog.delete": {
        await db.delete(blogPosts).where(eq(blogPosts.id, id));
        await logActivity(actor, "حذف مقاله", `#${id}`);
        return NextResponse.json({ ok: true });
      }

      /* ════════ کمپین‌های بازاریابی ════════ */
      case "campaigns.create": {
        const title = str(values.title, 160);
        if (title.length < 3) return NextResponse.json({ error: "عنوان کمپین الزامی است." }, { status: 400 });
        const slug = str(values.slug, 120).toLowerCase().replace(/[^a-z0-9\u0600-\u06ff\s-]+/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 100) || `camp-${Date.now().toString(36)}`;
        const exists = await db.select({ id: campaigns.id }).from(campaigns).where(eq(campaigns.slug, slug)).limit(1);
        const finalSlug = exists.length > 0 ? `${slug}-${Date.now().toString(36)}` : slug;
        const startAt = values.startAt ? new Date(String(values.startAt)) : null;
        const endAt = values.endAt ? new Date(String(values.endAt)) : null;
        const codeId = int(values.discountCodeId);
        await db.insert(campaigns).values({
          title, slug: finalSlug,
          description: str(values.description, 600),
          bannerImage: str(values.bannerImage, 500),
          startAt: startAt && !isNaN(startAt.getTime()) ? startAt : null,
          endAt: endAt && !isNaN(endAt.getTime()) ? endAt : null,
          discountCodeId: codeId > 0 ? codeId : null,
          active: true,
        });
        await logActivity(actor, "ایجاد کمپین", title);
        return NextResponse.json({ ok: true });
      }
      case "campaigns.toggle": {
        await db.update(campaigns).set({ active: values.active === true }).where(eq(campaigns.id, id));
        await logActivity(actor, values.active ? "فعال‌سازی کمپین" : "غیرفعال‌سازی کمپین", `#${id}`);
        return NextResponse.json({ ok: true });
      }
      case "campaigns.delete": {
        await db.delete(campaigns).where(eq(campaigns.id, id));
        await logActivity(actor, "حذف کمپین", `#${id}`);
        return NextResponse.json({ ok: true });
      }

      /* ════════ جدول‌های سایزبندی ════════ */
      case "sizecharts.save": {
        const name = str(values.name, 120);
        if (name.length < 2) return NextResponse.json({ error: "نام جدول سایزبندی الزامی است." }, { status: 400 });
        let rows: unknown[] = [];
        try {
          rows = JSON.parse(str(values.rows, 8000));
          if (!Array.isArray(rows) || rows.length === 0) throw new Error();
        } catch {
          return NextResponse.json({ error: "فرمت ردیف‌ها نامعتبر است؛ باید آرایه JSON باشد." }, { status: 400 });
        }
        const clean = rows.map((r) => {
          const row = (r ?? {}) as Record<string, unknown>;
          return { size: str(row.size, 20), height: str(row.height, 20), chest: str(row.chest, 20), waist: str(row.waist, 20) };
        }).filter((r) => r.size);
        if (clean.length === 0) return NextResponse.json({ error: "حداقل یک ردیف معتبر لازم است." }, { status: 400 });
        if (id > 0) {
          await db.update(sizeCharts).set({ name, rows: JSON.stringify(clean) }).where(eq(sizeCharts.id, id));
          await logActivity(actor, "ویرایش جدول سایزبندی", `${name} (${clean.length} ردیف)`);
        } else {
          await db.insert(sizeCharts).values({ name, rows: JSON.stringify(clean), active: true });
          await logActivity(actor, "ایجاد جدول سایزبندی", `${name} (${clean.length} ردیف)`);
        }
        return NextResponse.json({ ok: true });
      }
      case "sizecharts.toggle": {
        await db.update(sizeCharts).set({ active: values.active === true }).where(eq(sizeCharts.id, id));
        return NextResponse.json({ ok: true });
      }
      case "sizecharts.delete": {
        await db.delete(sizeCharts).where(eq(sizeCharts.id, id));
        await logActivity(actor, "حذف جدول سایزبندی", `#${id}`);
        return NextResponse.json({ ok: true });
      }

      /* ════════ صفحات محتوا ════════ */
      case "pages.save": {
        const title = str(values.title, 160);
        const body = str(values.body, 20000);
        if (title.length < 2) return NextResponse.json({ error: "عنوان صفحه الزامی است." }, { status: 400 });
        if (body.length < 20) return NextResponse.json({ error: "متن صفحه باید حداقل ۲۰ کاراکتر باشد." }, { status: 400 });
        const slug = str(values.slug, 120).toLowerCase().trim().replace(/[^a-z0-9\u0600-\u06ff\s-]+/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 100) || `page-${Date.now().toString(36)}`;
        if (id > 0) {
          const dup = await db.select({ id: contentPages.id }).from(contentPages).where(eq(contentPages.slug, slug)).limit(1);
          if (dup.length > 0 && dup[0].id !== id) return NextResponse.json({ error: "این اسلاگ قبلاً استفاده شده است." }, { status: 409 });
          await db.update(contentPages).set({ title, slug, body, updatedAt: new Date() }).where(eq(contentPages.id, id));
          await logActivity(actor, "ویرایش صفحه محتوا", title);
        } else {
          const dup = await db.select({ id: contentPages.id }).from(contentPages).where(eq(contentPages.slug, slug)).limit(1);
          if (dup.length > 0) return NextResponse.json({ error: "این اسلاگ قبلاً استفاده شده است." }, { status: 409 });
          await db.insert(contentPages).values({ title, slug, body });
          await logActivity(actor, "ایجاد صفحه محتوا", title);
        }
        return NextResponse.json({ ok: true });
      }
      case "pages.delete": {
        await db.delete(contentPages).where(eq(contentPages.id, id));
        await logActivity(actor, "حذف صفحه محتوا", `#${id}`);
        return NextResponse.json({ ok: true });
      }

      /* ════════ برندها ════════ */
      case "brands.create": {
        const name = str(values.name, 120);
        if (name.length < 2) return NextResponse.json({ error: "نام برند الزامی است." }, { status: 400 });
        const slug = str(values.slug, 120).toLowerCase().replace(/[^a-z0-9\u0600-\u06ff\s-]+/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 100) || `brand-${Date.now().toString(36)}`;
        const exists = await db.select({ id: brands.id }).from(brands).where(eq(brands.slug, slug)).limit(1);
        if (exists.length > 0) return NextResponse.json({ error: "این اسلاگ قبلاً ثبت شده است." }, { status: 409 });
        await db.insert(brands).values({ name, slug, logo: str(values.logo, 500) });
        await logActivity(actor, "افزودن برند", name);
        return NextResponse.json({ ok: true });
      }
      case "brands.delete": {
        await db.delete(brands).where(eq(brands.id, id));
        await logActivity(actor, "حذف برند", `#${id}`);
        return NextResponse.json({ ok: true });
      }

      default:
        return NextResponse.json({ error: `عملیات «${entity}.${action}» پشتیبانی نمی‌شود.` }, { status: 400 });
    }
  } catch (err) {
    console.error("admin manage api error", err);
    return NextResponse.json({ error: "خطای داخلی سرور." }, { status: 500 });
  }
}
