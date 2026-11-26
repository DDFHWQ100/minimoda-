import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { logActivity } from "@/lib/theme";

export const dynamic = "force-dynamic";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads", "products");
const MAX_BYTES = 5 * 1024 * 1024;
const MAX_IMAGES_PER_PRODUCT = 10;
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

async function requireAdmin() {
  const user = await getSessionUser();
  return user?.role === "admin" ? user : null;
}
const demoGuard = () =>
  NextResponse.json({ error: "حالت نمایش عمومی: برای ذخیره تغییرات ابتدا «ورود یک‌کلیکی مدیر» را بزنید." }, { status: 403 });

/**
 * آپلود تصاویر محصول (چندتایی در یک درخواست)
 * فرم‌دیتای: files[] — و برای محصول موجود: productId
 */
export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return demoGuard();

  try {
    const form = await req.formData();
    const files = form.getAll("files").filter((f): f is File => f instanceof File);
    const productId = Number(form.get("productId") ?? 0);
    if (files.length === 0) return NextResponse.json({ error: "فایلی ارسال نشد." }, { status: 400 });

    // محدودیت ۱۰ تصویر برای محصول موجود — اعمال در بک‌اند
    let existingCount = 0;
    if (Number.isFinite(productId) && productId > 0) {
      const rows = await db.select({ images: products.images }).from(products).where(eq(products.id, productId)).limit(1);
      if (rows[0]) {
        try { existingCount = (JSON.parse(rows[0].images) as unknown[]).length; } catch { existingCount = 0; }
      }
    }
    if (existingCount + files.length > MAX_IMAGES_PER_PRODUCT) {
      return NextResponse.json({ error: `هر محصول حداکثر ${MAX_IMAGES_PER_PRODUCT} تصویر می‌تواند داشته باشد (${existingCount} تصویر موجود + ${files.length} جدید).` }, { status: 400 });
    }

    await fs.mkdir(UPLOAD_ROOT, { recursive: true });
    const urls: string[] = [];

    for (const file of files) {
      if (file.size > MAX_BYTES) {
        return NextResponse.json({ error: `فایل «${file.name}» بزرگ‌تر از ۵ مگابایت است.` }, { status: 400 });
      }
      const ext = path.extname(file.name).toLowerCase();
      if (!ALLOWED_EXT.has(ext)) {
        return NextResponse.json({ error: `پسوند «${ext}» مجاز نیست؛ فقط تصویر (jpg/png/webp/gif/avif).` }, { status: 400 });
      }
      if (file.type && !file.type.startsWith("image/")) {
        return NextResponse.json({ error: `نوع فایل «${file.type}» تصویر نیست.` }, { status: 400 });
      }
      const buf = Buffer.from(await file.arrayBuffer());
      // تأیید ضمنی محتوا: امضای فایل‌های تصویری شناخته‌شده
      const sigOk =
        buf.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])) || // jpeg
        buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) || // png
        buf.subarray(0, 4).toString("ascii") === "RIFF" || // webp
        buf.subarray(0, 6).toString("ascii").startsWith("GIF") || // gif
        buf.subarray(4, 8).toString("ascii") === "ftyp"; // avif/heic
      if (!sigOk) {
        return NextResponse.json({ error: `فایل «${file.name}» تصویر معتبری نیست.` }, { status: 400 });
      }
      const base = path.basename(file.name, ext).replace(/[^\w\-]+/g, "-").replace(/-+/g, "-").slice(0, 40) || "img";
      const finalName = `${base}-${randomBytes(5).toString("hex")}${ext}`;
      await fs.writeFile(path.join(UPLOAD_ROOT, finalName), buf);
      urls.push(`/uploads/products/${finalName}`);
    }

    if (urls.length > 0) {
      await logActivity(admin.name, "بارگذاری تصاویر محصول", `${urls.length} تصویر بارگذاری شد${productId ? ` برای محصول #${productId}` : ""}`);
    }
    return NextResponse.json({ ok: true, urls });
  } catch (err) {
    console.error("product image upload error", err);
    return NextResponse.json({ error: "آپلود تصویر با خطا مواجه شد." }, { status: 500 });
  }
}
