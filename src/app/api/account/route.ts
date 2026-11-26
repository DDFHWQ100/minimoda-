import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";

export async function PUT(req: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "ابتدا وارد حساب خود شوید." }, { status: 401 });
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const address = String(body.address ?? "").trim();
    if (name.length < 3) return NextResponse.json({ error: "نام نامعتبر است." }, { status: 400 });
    if (phone && !/^09\d{9}$/.test(phone)) return NextResponse.json({ error: "شماره موبایل نامعتبر است." }, { status: 400 });
    await db.update(users).set({ name, phone, address }).where(eq(users.id, session.id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("account update error", err);
    return NextResponse.json({ error: "خطای داخلی سرور." }, { status: 500 });
  }
}
