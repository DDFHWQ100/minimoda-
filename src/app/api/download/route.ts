import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const FILES: Record<string, { filename: string; type: string }> = {
  full: { filename: "minimoda-full.zip", type: "application/zip" },
  php: { filename: "minimoda-php.zip", type: "application/zip" },
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const which = url.searchParams.get("file") ?? "full";
  const entry = FILES[which];
  if (!entry) {
    return NextResponse.json({ error: "فایل نامعتبر. گزینه‌ها: ?file=full یا ?file=php" }, { status: 400 });
  }
  try {
    const filePath = path.join(process.cwd(), "public", "downloads", entry.filename);
    const data = await fs.readFile(filePath);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": entry.type,
        "Content-Disposition": `attachment; filename="${entry.filename}"`,
        "Content-Length": String(data.length),
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "فایل هنوز ساخته نشده است." }, { status: 404 });
  }
}
