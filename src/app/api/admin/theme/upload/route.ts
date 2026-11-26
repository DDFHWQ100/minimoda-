import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import AdmZip from "adm-zip";
import { db } from "@/db";
import { themes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth";
import { logActivity } from "@/lib/theme";

export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024;
const MAX_FILES = 200;
const SAFE_EXT = new Set([".json", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".css", ".js", ".md", ".txt", ".woff", ".woff2", ".ttf", ".otf"]);

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (user?.role !== "admin") {
    return NextResponse.json({ error: "حالت نمایش عمومی: برای نصب قالب ابتدا «ورود یک‌کلیکی مدیر» را بزنید." }, { status: 403 });
  }
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "فایل ZIP ارسال نشد." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "حجم فایل ZIP نباید بیشتر از ۵ مگابایت باشد." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // امضای ZIP
    if (buffer.subarray(0, 2).toString("ascii") !== "PK") {
      return NextResponse.json({ error: "فایل ارسالی ZIP معتبر نیست (امضای PK یافت نشد)." }, { status: 400 });
    }

    let zip: AdmZip;
    try {
      zip = new AdmZip(buffer);
    } catch {
      return NextResponse.json({ error: "استخراج ZIP ناموفق بود؛ فایل خراب است." }, { status: 400 });
    }

    const entries = zip.getEntries();
    if (entries.length === 0 || entries.length > MAX_FILES) {
      return NextResponse.json({ error: `تعداد فایل‌ها نامعتبر است (حداکثر ${MAX_FILES}).` }, { status: 400 });
    }

    // باید در ریشه theme.json داشته باشد
    const manifestEntry = entries.find((e) => e.entryName.replace(/\\/g, "/").endsWith("theme.json") && !e.entryName.split(/[\\/]/).slice(0, -1).join("/").includes("__MACOSX"));
    if (!manifestEntry) {
      return NextResponse.json({ error: "فایل theme.json در ریشه قالب یافت نشد." }, { status: 400 });
    }

    let manifest: Record<string, unknown>;
    try {
      manifest = JSON.parse(manifestEntry.getData().toString("utf8"));
    } catch {
      return NextResponse.json({ error: "theme.json نامعتبر است (JSON parse نشد)." }, { status: 400 });
    }

    const name = String(manifest.name ?? "").trim();
    if (name.length < 3) return NextResponse.json({ error: "نام قالب در theme.json نامعتبر است." }, { status: 400 });
    const slug = String(manifest.slug ?? "").toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || `zip-theme-${Date.now().toString(36)}`;
    const version = String(manifest.version ?? "1.0.0").trim() || "1.0.0";
    const description = String(manifest.description ?? "").trim();
    const author = String(manifest.author ?? "Unknown").trim();
    const tokens = {
      primary: String(manifest.primary ?? "#1b3a6b"),
      accent: String(manifest.accent ?? "#e91e63"),
      gold: String(manifest.gold ?? "#ffc107"),
      font: String(manifest.font ?? "Vazirmatn"),
      radius: String(manifest.radius ?? "20"),
    };

    const dup = await db.select({ id: themes.id }).from(themes).where(eq(themes.slug, slug)).limit(1);
    if (dup.length > 0) {
      return NextResponse.json({ error: `قالب با اسلاگ «${slug}» قبلاً نصب شده است.` }, { status: 409 });
    }

    // استخراج امن به public/uploads/themes/<slug>
    const destRoot = path.join(process.cwd(), "public", "uploads", "themes", slug);
    await fs.rm(destRoot, { recursive: true, force: true });
    await fs.mkdir(destRoot, { recursive: true });

    // پیشوند پوشه‌ای theme.json را تشخیص بده (مثلاً my-theme/theme.json)
    const manifestPath = manifestEntry.entryName.replace(/\\/g, "/");
    const rootPrefix = manifestPath.includes("/") ? manifestPath.slice(0, manifestPath.lastIndexOf("/") + 1) : "";

    for (const entry of entries) {
      const raw = entry.entryName.replace(/\\/g, "/");
      if (entry.isDirectory) continue;
      const rel = rootPrefix && raw.startsWith(rootPrefix) ? raw.slice(rootPrefix.length) : raw;
      if (!rel || rel.startsWith("../") || rel.includes("/../")) continue; // جلوگیری از Zip Slip
      if (rel.includes("__MACOSX") || rel.startsWith(".")) continue;
      const ext = path.extname(rel).toLowerCase();
      if (!SAFE_EXT.has(ext)) continue; // فقط فایل‌های امن
      const dest = path.join(destRoot, rel);
      if (!dest.startsWith(destRoot)) continue; // double check
      await fs.mkdir(path.dirname(dest), { recursive: true });
      await fs.writeFile(dest, entry.getData());
    }

    // تصویر پیش‌نمایش اگر وجود داشته باشد
    let preview = String(manifest.preview ?? "");
    if (!preview.startsWith("http") && !preview.startsWith("/")) {
      for (const candidate of ["preview.png", "preview.jpg", "preview.webp", "screenshot.png", "screenshot.jpg", "cover.png", "cover.jpg"]) {
        try {
          await fs.access(path.join(destRoot, candidate));
          preview = `/uploads/themes/${slug}/${candidate}`;
          break;
        } catch { /* not found */ }
      }
    }

    const [created] = await db.insert(themes).values({
      name, slug, description, author, version,
      preview,
      isActive: false, isDefault: false,
      tokens: JSON.stringify(tokens),
    }).returning({ id: themes.id });

    await logActivity(user.name, "نصب قالب از ZIP", `«${name}» v${version} — ${entries.length} فایل — اسلاگ ${slug}`);
    return NextResponse.json({ ok: true, id: created.id, slug, name });
  } catch (err) {
    console.error("theme zip upload error", err);
    return NextResponse.json({ error: "نصب قالب با خطا مواجه شد." }, { status: 500 });
  }
}
