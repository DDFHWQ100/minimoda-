import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { getSessionUser } from "@/lib/auth";
import { logActivity } from "@/lib/theme";
import { db } from "@/db";
import { products, banners, blogPosts, themes, themeSettings, categories } from "@/db/schema";

export const dynamic = "force-dynamic";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif", ".css", ".js", ".woff2", ".woff", ".ttf", ".otf", ".pdf"]);
const ALLOWED_MIME = ["image/", "text/css", "text/javascript", "application/javascript", "font/", "application/pdf", "application/octet-stream"];

async function requireAdmin() {
  const user = await getSessionUser();
  if (user?.role === "admin") return user;
  return null;
}

async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_ROOT, { recursive: true });
}

type AssetRow = { path: string; name: string; size: number; type: string; modified: string };

async function walk(dir: string, base: string): Promise<AssetRow[]> {
  const out: AssetRow[] = [];
  let entries: import("fs").Dirent[] = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full, base)));
      continue;
    }
    try {
      const stat = await fs.stat(full);
      const rel = path.relative(base, full).replace(/\\/g, "/");
      const ext = path.extname(entry.name).toLowerCase();
      const type = ext.replace(".", "") || "file";
      out.push({ path: rel, name: entry.name, size: stat.size, type, modified: stat.mtime.toISOString() });
    } catch {
      /* skip unreadable */
    }
  }
  return out;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "دسترسی مجاز نیست." }, { status: 403 });
  await ensureUploadDir();
  const pub = path.join(process.cwd(), "public");
  const [uploads, images, downloads] = await Promise.all([
    walk(UPLOAD_ROOT, pub),
    walk(path.join(pub, "images"), pub),
    walk(path.join(pub, "downloads"), pub),
  ]);
  const all = [...uploads, ...images, ...downloads].sort((a, b) => b.modified.localeCompare(a.modified));
  const totalBytes = all.reduce((s, f) => s + f.size, 0);

  // تشخیص فایل‌های استفاده‌نشده: مسیر فایل در هیچ رکورد دیتابیسی (محصول/بنر/بلاگ/قالب/تنظیمات/دسته) نیامده باشد
  let used = new Set<string>();
  try {
    const [p, b, bl, th, st, ct] = await Promise.all([
      db.select({ v: products.images }).from(products),
      db.select({ v: banners.image }).from(banners),
      db.select({ v: blogPosts.image }).from(blogPosts),
      db.select({ v: themes.preview }).from(themes),
      db.select({ v: themeSettings.value }).from(themeSettings),
      db.select({ v: categories.image }).from(categories),
    ]);
    const blob = [...p, ...b, ...bl, ...th, ...st, ...ct].map((r) => r.v ?? "").join("\n");
    used = new Set(all.filter((f) => blob.includes(f.path) || blob.includes("/" + f.path) || blob.includes(f.name)).map((f) => f.path));
  } catch { /* اگر دیتابیس در دسترس نبود، همه را استفاده‌شده فرض کن */ used = new Set(all.map((f) => f.path)); }

  const files = all.map((f) => ({ ...f, used: used.has(f.path) || f.path.startsWith("downloads/") || f.path.startsWith("images/") }));
  const unusedCount = files.filter((f) => !f.used).length;
  return NextResponse.json({ files, totalBytes, count: all.length, unusedCount });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "دسترسی مجاز نیست." }, { status: 403 });
  try {
    const form = await req.formData();
    const files = form.getAll("files");
    if (files.length === 0) return NextResponse.json({ error: "فایلی ارسال نشد." }, { status: 400 });
    await ensureUploadDir();

    const saved: AssetRow[] = [];
    for (const item of files) {
      if (!(item instanceof File)) continue;
      if (item.size > MAX_BYTES) {
        return NextResponse.json({ error: `فایل «${item.name}» بزرگ‌تر از ۵ مگابایت است.` }, { status: 400 });
      }
      const ext = path.extname(item.name).toLowerCase();
      if (!ALLOWED_EXT.has(ext)) {
        return NextResponse.json({ error: `پسوند «${ext}» مجاز نیست.` }, { status: 400 });
      }
      if (item.type && !ALLOWED_MIME.some((m) => item.type.startsWith(m))) {
        return NextResponse.json({ error: `نوع MIME «${item.type}» مجاز نیست.` }, { status: 400 });
      }
      const buf = Buffer.from(await item.arrayBuffer());
      // اسکن ساده کد مخرب در فایل‌های متنی/SVG
      const textHead = buf.subarray(0, 64 * 1024).toString("utf8");
      if (/<\?php|<script[\s>]|onerror\s*=|javascript:/i.test(textHead) && [".svg", ".css", ".js", ".html"].includes(ext)) {
        return NextResponse.json({ error: `فایل «${item.name}» حاوی کد مشکوک است و بارگذاری نشد.` }, { status: 400 });
      }
      const base = path.basename(item.name, ext).replace(/[^\w.\-آ-ی_ ]+/g, "-").slice(0, 60) || "file";
      const finalName = `${base}-${randomBytes(4).toString("hex")}${ext}`;
      const dest = path.join(UPLOAD_ROOT, finalName);
      await fs.writeFile(dest, buf);
      const stat = await fs.stat(dest);
      saved.push({ path: `uploads/${finalName}`, name: finalName, size: stat.size, type: ext.replace(".", ""), modified: stat.mtime.toISOString() });
    }
    await logActivity(admin.name, "بارگذاری فایل", `${saved.length} فایل در کتابخانه قالب بارگذاری شد`);
    return NextResponse.json({ ok: true, files: saved });
  } catch (err) {
    console.error("asset upload error", err);
    return NextResponse.json({ error: "آپلود با خطا مواجه شد." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "دسترسی مجاز نیست." }, { status: 403 });
  const url = new URL(req.url);
  const rel = (url.searchParams.get("path") ?? "").replace(/\\/g, "/");
  // فقط داخل uploads اجازه حذف می‌دهیم
  if (!rel.startsWith("uploads/") || rel.includes("..")) {
    return NextResponse.json({ error: "فقط فایل‌های داخل پوشه uploads قابل حذف هستند." }, { status: 400 });
  }
  const target = path.join(process.cwd(), "public", rel);
  try {
    await fs.unlink(target);
    await logActivity(admin.name, "حذف فایل", rel);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "فایل یافت نشد یا قبلاً حذف شده است." }, { status: 404 });
  }
}
