import { NextResponse } from "next/server";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json({ error: "ایمیل نامعتبر است." }, { status: 400 });
    }
    await db.insert(newsletterSubscribers).values({ email }).onConflictDoNothing();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("newsletter error", err);
    return NextResponse.json({ error: "خطای داخلی سرور." }, { status: 500 });
  }
}
