import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, createSession, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const password = String(body.password ?? "");
    const address = String(body.address ?? "").trim();

    if (name.length < 3) return NextResponse.json({ error: "نام باید حداقل ۳ کاراکتر باشد." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return NextResponse.json({ error: "ایمیل نامعتبر است." }, { status: 400 });
    if (phone && !/^09\d{9}$/.test(phone)) return NextResponse.json({ error: "شماره موبایل نامعتبر است." }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: "رمز عبور باید حداقل ۶ کاراکتر باشد." }, { status: 400 });

    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) return NextResponse.json({ error: "این ایمیل قبلاً ثبت‌نام شده است؛ وارد شوید." }, { status: 409 });

    const [user] = await db
      .insert(users)
      .values({ name, email, phone, address, passwordHash: hashPassword(password), role: "user" })
      .returning({ id: users.id });

    const { token, expiresAt } = await createSession(user.id);
    const store = await cookies();
    const forwarded = req.headers.get("x-forwarded-proto");
    const secure = forwarded ? forwarded === "https" : new URL(req.url).protocol === "https:";
    store.set(SESSION_COOKIE, token, {
      httpOnly: true, sameSite: "lax", path: "/",
      expires: expiresAt,
      secure,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("register error", err);
    return NextResponse.json({ error: "خطای داخلی سرور؛ دوباره تلاش کنید." }, { status: 500 });
  }
}
