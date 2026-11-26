import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// فایل‌های مجاز برای دانلود (whitelist — جلوی path traversal را می‌گیرد)
const ALLOWED: Record<string, { file: string; name: string }> = {
  full: { file: "minimoda-full.zip", name: "minimoda-full.zip" },
  php: { file: "minimoda-php.zip", name: "minimoda-php.zip" },
  "minimoda-full.zip": { file: "minimoda-full.zip", name: "minimoda-full.zip" },
  "minimoda-php.zip": { file: "minimoda-php.zip", name: "minimoda-php.zip" },
};

export async function GET(_req: Request, ctx: { params: Promise<{ file: string }> }) {
  const { file } = await ctx.params;
  const entry = ALLOWED[file];
  if (!entry) {
    return NextResponse.json({ error: "فایل یافت نشد." }, { status: 404 });
  }
  const abs = path.join(process.cwd(), "public", "downloads", entry.file);
  try {
    const buf = await fs.readFile(abs);
    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Length": String(buf.length),
        "Content-Disposition": `attachment; filename="${entry.name}"`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "فایل روی سرور موجود نیست؛ دوباره بیلد کنید." }, { status: 404 });
  }
}
