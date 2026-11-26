import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { logActivity } from "@/lib/theme";

async function requireAdmin() {
  const session = await getSessionUser();
  return session?.role === "admin" ? session : null;
}
const demoGuard = () =>
  NextResponse.json({ error: "حالت نمایش عمومی: برای ذخیره تغییرات ابتدا «ورود یک‌کلیکی مدیر» را بزنید." }, { status: 403 });

const MAX_IMAGES = 10;

/** ورودی تصاویر را هم به‌صورت آرایه (جدید) و هم رشته چندخطی (سازگاری) می‌پذیرد */
function parseImages(raw: unknown): string[] {
  let list: string[] = [];
  if (Array.isArray(raw)) {
    list = raw.map((v) => String(v ?? "").trim());
  } else {
    list = String(raw ?? "").split("\n").map((s) => s.trim());
  }
  list = list.filter((s) => s.startsWith("http") || s.startsWith("/"));
  // حذف تکراری‌ها با حفظ ترتیب
  return [...new Set(list)].slice(0, MAX_IMAGES);
}

function parseColors(raw: unknown) {
  return String(raw ?? "")
    .split("\n").map((l) => l.split(",")).map(([n, h]) => ({ name: (n ?? "").trim(), hex: (h ?? "#999999").trim() }))
    .filter((c) => c.name);
}

// ایجاد محصول جدید
export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return demoGuard();
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const description = String(body.description ?? "").trim();
    const price = Number(body.price);
    const discountPrice = body.discountPrice ? Number(body.discountPrice) : null;
    const stock = Math.max(0, Number(body.stock) || 0);
    const categoryId = body.categoryId ? Number(body.categoryId) : null;
    const sizes = String(body.sizes ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    const images = parseImages(body.images);
    const colors = parseColors(body.colors);

    if (name.length < 3) return NextResponse.json({ error: "نام محصول نامعتبر است." }, { status: 400 });
    if (!Number.isFinite(price) || price <= 0) return NextResponse.json({ error: "قیمت باید عددی مثبت باشد." }, { status: 400 });
    if (discountPrice !== null && discountPrice >= price) return NextResponse.json({ error: "قیمت تخفیف‌دار باید کمتر از قیمت اصلی باشد." }, { status: 400 });
    if (images.length === 0) return NextResponse.json({ error: "حداقل یک تصویر برای محصول الزامی است." }, { status: 400 });
    if (Array.isArray(body.images) && body.images.length > MAX_IMAGES) return NextResponse.json({ error: `هر محصول حداکثر ${MAX_IMAGES} تصویر می‌تواند داشته باشد.` }, { status: 400 });

    const slug = `mm-${Date.now().toString(36)}`;
    const [created] = await db.insert(products).values({
      name, slug, description, price, discountPrice, stock, categoryId,
      sizes: JSON.stringify(sizes),
      colors: JSON.stringify(colors),
      images: JSON.stringify(images),
      isNew: !!body.isNew,
      isOffer: !!body.isOffer || discountPrice !== null,
      isFeatured: !!body.isFeatured,
      rating: 4.5,
      reviewCount: 0,
      salesCount: 0,
    }).returning({ id: products.id, slug: products.slug });

    await logActivity(admin.name, "افزودن محصول", `«${name}» با ${images.length} تصویر ساخته شد`);
    return NextResponse.json({ ok: true, ...created });
  } catch (err) {
    console.error("admin create product error", err);
    return NextResponse.json({ error: "خطای داخلی سرور." }, { status: 500 });
  }
}

// ویرایش کامل محصول (فرم ویرایش) + ویرایش سریع (وضعیت‌ها)
export async function PATCH(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return demoGuard();
  try {
    const body = await req.json();
    const id = Number(body.id);
    if (!Number.isFinite(id)) return NextResponse.json({ error: "شناسه نامعتبر." }, { status: 400 });

    const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (!rows[0]) return NextResponse.json({ error: "محصول یافت نشد." }, { status: 404 });

    // ── حالت ویرایش کامل: اگر name یا images یا price ارسال شده ──
    const isFullEdit = body.name !== undefined || body.images !== undefined || body.price !== undefined || body.description !== undefined;

    if (isFullEdit) {
      const current = rows[0];
      const name = String(body.name ?? current.name).trim();
      const description = String(body.description ?? current.description).trim();
      const price = Number(body.price ?? current.price);
      const discountPrice = body.discountPrice === null || body.discountPrice === "" || body.discountPrice === undefined
        ? (body.discountPrice === undefined ? current.discountPrice : null)
        : Number(body.discountPrice);
      const stock = Math.max(0, Number(body.stock ?? current.stock) || 0);
      const categoryId = body.categoryId !== undefined ? (body.categoryId ? Number(body.categoryId) : null) : current.categoryId;
      const sizes = body.sizes !== undefined ? String(body.sizes).split(",").map((s) => s.trim()).filter(Boolean) : JSON.parse(current.sizes || "[]");
      const colors = body.colors !== undefined ? parseColors(body.colors) : JSON.parse(current.colors || "[]");
      const images = body.images !== undefined ? parseImages(body.images) : JSON.parse(current.images || "[]");

      if (name.length < 3) return NextResponse.json({ error: "نام محصول نامعتبر است." }, { status: 400 });
      if (!Number.isFinite(price) || price <= 0) return NextResponse.json({ error: "قیمت باید عددی مثبت باشد." }, { status: 400 });
      if (discountPrice !== null && discountPrice !== undefined && discountPrice >= price) return NextResponse.json({ error: "قیمت تخفیف‌دار باید کمتر از قیمت اصلی باشد." }, { status: 400 });
      if (images.length === 0) return NextResponse.json({ error: "حداقل یک تصویر برای محصول الزامی است." }, { status: 400 });
      if (Array.isArray(body.images) && body.images.length > MAX_IMAGES) return NextResponse.json({ error: `هر محصول حداکثر ${MAX_IMAGES} تصویر می‌تواند داشته باشد.` }, { status: 400 });

      await db.update(products).set({
        name, description, price,
        discountPrice: discountPrice ?? null,
        stock, categoryId,
        sizes: JSON.stringify(sizes),
        colors: JSON.stringify(colors),
        images: JSON.stringify(images),
        isNew: body.isNew !== undefined ? !!body.isNew : current.isNew,
        isOffer: body.isOffer !== undefined ? !!body.isOffer : (discountPrice !== null),
        isFeatured: body.isFeatured !== undefined ? !!body.isFeatured : current.isFeatured,
      }).where(eq(products.id, id));

      await logActivity(admin.name, "ویرایش محصول", `«${name}» با ${images.length} تصویر به‌روز شد`);
      return NextResponse.json({ ok: true });
    }

    // ── حالت ویرایش سریع: فقط وضعیت‌ها ──
    const updates: Record<string, unknown> = {};
    if (body.stock !== undefined) updates.stock = Math.max(0, Number(body.stock) || 0);
    if (body.isFeatured !== undefined) updates.isFeatured = !!body.isFeatured;
    if (body.isNew !== undefined) updates.isNew = !!body.isNew;
    if (body.isOffer !== undefined) updates.isOffer = !!body.isOffer;
    if (body.price !== undefined) updates.price = Math.max(0, Number(body.price) || 0);
    if (Object.keys(updates).length === 0) return NextResponse.json({ error: "چیزی برای ویرایش ارسال نشد." }, { status: 400 });
    await db.update(products).set(updates).where(eq(products.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("admin patch product error", err);
    return NextResponse.json({ error: "خطای داخلی سرور." }, { status: 500 });
  }
}

// حذف محصول
export async function DELETE(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return demoGuard();
  const url = new URL(req.url);
  const id = Number(url.searchParams.get("id"));
  if (!Number.isFinite(id)) return NextResponse.json({ error: "شناسه نامعتبر." }, { status: 400 });
  const rows = await db.select({ name: products.name }).from(products).where(eq(products.id, id)).limit(1);
  await db.delete(products).where(eq(products.id, id));
  await logActivity(admin.name, "حذف محصول", `«${rows[0]?.name ?? id}» حذف شد`);
  return NextResponse.json({ ok: true });
}
