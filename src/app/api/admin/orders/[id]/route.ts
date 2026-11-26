import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";

const VALID = ["pending", "processing", "shipped", "delivered", "cancelled"];

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSessionUser();
  if (session?.role !== "admin") return NextResponse.json({ error: "حالت نمایش عمومی: برای ذخیره تغییرات ابتدا «ورود یک‌کلیکی مدیر» را بزنید." }, { status: 403 });
  const { id } = await ctx.params;
  const orderId = Number(id);
  if (!Number.isFinite(orderId)) return NextResponse.json({ error: "شناسه نامعتبر." }, { status: 400 });
  const body = await req.json().catch(() => ({}));
  const status = String(body.status ?? "");
  if (!VALID.includes(status)) return NextResponse.json({ error: "وضعیت نامعتبر." }, { status: 400 });
  await db.update(orders).set({ status }).where(eq(orders.id, orderId));
  return NextResponse.json({ ok: true });
}
