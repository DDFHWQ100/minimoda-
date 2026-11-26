import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, isAdminDemoOpen, SESSION_COOKIE } from "@/lib/auth";

/** ورود یک‌کلیکی مدیر — فقط وقتی ADMIN_DEMO_OPEN=true باشد */
export async function GET(req: Request) {
  if (!isAdminDemoOpen()) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }
  const rows = await db.select({ id: users.id }).from(users).where(eq(users.email, "admin@minimoda.ir")).limit(1);
  const admin = rows[0];
  if (!admin) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  const { token, expiresAt } = await createSession(admin.id);
  const forwarded = req.headers.get("x-forwarded-proto");
  const secure = forwarded ? forwarded === "https" : new URL(req.url).protocol === "https:";
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true, sameSite: "lax", path: "/", expires: expiresAt, secure,
  });
  return NextResponse.redirect(new URL("/admin", req.url));
}
