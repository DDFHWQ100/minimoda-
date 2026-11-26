import { NextResponse } from "next/server";
import { desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { getThemeSettings, settingInt } from "@/lib/theme";

const SHIPPING_COST = 45_000;

type IncomingItem = { id: number; qty: number; size?: string; color?: string };

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "وارد حساب خود شوید." }, { status: 401 });
  const rows = await db.select().from(orders).where(eq(orders.userId, session.id)).orderBy(desc(orders.createdAt));
  const withItems = await Promise.all(
    rows.map(async (o) => ({
      ...o,
      items: await db.select().from(orderItems).where(eq(orderItems.orderId, o.id)),
    }))
  );
  return NextResponse.json({ orders: withItems });
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    const body = await req.json();
    const customerName = String(body.customerName ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const address = String(body.address ?? "").trim();
    const note = String(body.note ?? "").trim();
    const paymentMethod = ["online", "onsite", "card"].includes(body.paymentMethod) ? body.paymentMethod : "online";
    const items: IncomingItem[] = Array.isArray(body.items) ? body.items : [];

    if (customerName.length < 3) return NextResponse.json({ error: "نام گیرنده را وارد کنید." }, { status: 400 });
    if (!/^09\d{9}$/.test(phone)) return NextResponse.json({ error: "شماره موبایل نامعتبر است." }, { status: 400 });
    if (address.length < 10) return NextResponse.json({ error: "آدرس کامل را وارد کنید." }, { status: 400 });
    const clean = items
      .map((i) => ({ id: Number(i.id), qty: Math.max(1, Math.min(99, Number(i.qty) || 1)), size: String(i.size ?? ""), color: String(i.color ?? "") }))
      .filter((i) => Number.isFinite(i.id) && i.id > 0);
    if (clean.length === 0) return NextResponse.json({ error: "سبد خرید خالی است." }, { status: 400 });

    const ids = [...new Set(clean.map((i) => i.id))];
    const dbProducts = await db.select().from(products).where(inArray(products.id, ids));
    const byId = new Map(dbProducts.map((p) => [p.id, p]));

    let subtotal = 0;
    const lines = clean.map((i) => {
      const p = byId.get(i.id);
      if (!p) throw new Error("محصول یافت نشد");
      const eff = p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price;
      subtotal += eff * i.qty;
      const image = (() => { try { return JSON.parse(p.images)[0] ?? ""; } catch { return ""; } })();
      return { productId: p.id, name: p.name, image, price: eff, quantity: i.qty, size: i.size, color: i.color };
    });

    const themeSettingsMap = await getThemeSettings().catch(() => ({}) as Record<string, string>);
    const freeAt = settingInt(themeSettingsMap, "free_shipping_at", 2_000_000);
    const shipping = subtotal >= freeAt ? 0 : SHIPPING_COST;
    const total = subtotal + shipping;

    const orderId = await db.transaction(async (tx) => {
      const [order] = await tx
        .insert(orders)
        .values({
          userId: session?.id ?? null,
          total,
          status: paymentMethod === "onsite" ? "processing" : "pending",
          customerName, phone, address, note, paymentMethod,
        })
        .returning({ id: orders.id });

      await tx.insert(orderItems).values(lines.map((l) => ({ ...l, orderId: order.id })));

      for (const l of lines) {
        await tx
          .update(products)
          .set({
            stock: sql`GREATEST(${products.stock} - ${l.quantity}, 0)`,
            salesCount: sql`${products.salesCount} + ${l.quantity}`,
          })
          .where(eq(products.id, l.productId!));
      }
      return order.id;
    });

    return NextResponse.json({ ok: true, orderId });
  } catch (err) {
    console.error("create order error", err);
    return NextResponse.json({ error: "ثبت سفارش با خطا مواجه شد؛ دوباره تلاش کنید." }, { status: 500 });
  }
}
