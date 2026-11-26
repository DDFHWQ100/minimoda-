import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { verifyPassword, createSession, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) return NextResponse.json({ error: "ایمیل و رمز عبور را وارد کنید." }, { status: 400 });

    const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = rows[0];
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "ایمیل یا رمز عبور اشتباه است." }, { status: 401 });
    }

    const { token, expiresAt } = await createSession(user.id);
    const store = await cookies();
    const forwarded = req.headers.get("x-forwarded-proto");
    const secure = forwarded ? forwarded === "https" : new URL(req.url).protocol === "https:";
    store.set(SESSION_COOKIE, token, {
      httpOnly: true, sameSite: "lax", path: "/",
      expires: expiresAt,
      secure,
    });
    return NextResponse.json({ ok: true, role: user.role });
  } catch (err) {
    console.error("login error", err);
    return NextResponse.json({ error: "خطای داخلی سرور؛ دوباره تلاش کنید." }, { status: 500 });
  }
}
