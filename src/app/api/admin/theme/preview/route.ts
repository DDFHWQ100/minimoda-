import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { themes } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** پیش‌نمایش زنده قالب — کوکی موقت، قبل از فعال‌سازی واقعی */
export async function GET(req: Request) {
  const user = await getSessionUser();
  if (user?.role !== "admin") {
    return NextResponse.json({ error: "فقط مدیر می‌تواند پیش‌نمایش را فعال کند." }, { status: 403 });
  }
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug") ?? "";
  const stop = url.searchParams.get("action") === "stop";

  if (!stop) {
    const rows = await db.select({ id: themes.id }).from(themes).where(eq(themes.slug, slug)).limit(1);
    if (rows.length === 0) {
      return NextResponse.redirect(new URL("/admin/theme/themes", req.url));
    }
  }

  const res = NextResponse.redirect(new URL(stop ? "/admin/theme/themes" : "/", req.url));
  if (stop) {
    res.cookies.set("mm_preview_theme", "", { path: "/", maxAge: 0 });
  } else {
    res.cookies.set("mm_preview_theme", slug, { path: "/", maxAge: 60 * 60, sameSite: "lax", httpOnly: false });
  }
  return res;
}
