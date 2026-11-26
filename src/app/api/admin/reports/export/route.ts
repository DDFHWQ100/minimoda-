import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { ORDER_STATUS, PAYMENT_METHODS } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSessionUser();
  if (session?.role !== "admin") return NextResponse.json({ error: "دسترسی مجاز نیست." }, { status: 403 });

  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5000);
  const itemsByOrder = new Map<number, number>();
  for (const item of await db.select({ orderId: orderItems.orderId, q: orderItems.quantity }).from(orderItems)) {
    itemsByOrder.set(item.orderId, (itemsByOrder.get(item.orderId) ?? 0) + item.q);
  }

  const esc = (v: unknown) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = ["شماره سفارش", "تاریخ", "مشتری", "موبایل", "آدرس", "روش پرداخت", "وضعیت", "تعداد قلم", "مبلغ (تومان)"].join(",");
  const lines = rows.map((o) => [
    `MM-${String(o.id).padStart(5, "0")}`,
    new Intl.DateTimeFormat("fa-IR", { dateStyle: "short", timeStyle: "short" }).format(o.createdAt),
    o.customerName, o.phone, o.address,
    PAYMENT_METHODS[o.paymentMethod] ?? o.paymentMethod,
    ORDER_STATUS[o.status]?.label ?? o.status,
    itemsByOrder.get(o.id) ?? 0,
    o.total,
  ].map(esc).join(","));

  const csv = "\uFEFF" + [header, ...lines].join("\r\n"); // BOM برای Excel
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="minimoda-orders-${Date.now()}.csv"`,
    },
  });
}
