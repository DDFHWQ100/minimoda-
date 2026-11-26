import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Package, ChevronLeft, ShoppingBag, MapPin, Phone, Receipt } from "lucide-react";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { formatPrice, faDate, ORDER_STATUS, PAYMENT_METHODS, toFaDigits } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "سفارش‌های من" };

export default async function OrdersPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/orders");

  const myOrders = await db.select().from(orders).where(eq(orders.userId, user.id)).orderBy(desc(orders.createdAt));
  const withItems = await Promise.all(
    myOrders.map(async (o) => ({ order: o, items: await db.select().from(orderItems).where(eq(orderItems.orderId, o.id)) }))
  );

  return (
    <div className="mx-auto max-w-5xl px-3 sm:px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-black text-[#14264a]"><Package className="h-6 w-6 text-pink-600" /> سفارش‌های من</h1>
        <Link href="/products" className="inline-flex items-center gap-1 rounded-full border border-slate-300 text-slate-600 px-4 h-9 text-[11px] font-bold hover:border-pink-400 hover:text-pink-600 transition"><ShoppingBag className="h-4 w-4" /> خرید جدید</Link>
      </div>

      {withItems.length === 0 ? (
        <div className="mt-10 text-center py-16 rounded-3xl border border-dashed border-slate-300 bg-white">
          <Package className="h-14 w-14 text-slate-300 mx-auto" strokeWidth={1.4} />
          <h2 className="mt-3 font-black text-[#14264a]">هنوز سفارشی ثبت نکرده‌اید</h2>
          <p className="mt-1 text-[12px] text-slate-500">اولین سفارش شما با ارسال رایگان بالای ۲ میلیون تومان همراه است!</p>
          <Link href="/products" className="mt-4 inline-flex items-center gap-2 rounded-full bg-pink-600 text-white px-6 h-11 font-bold hover:bg-pink-500 transition">شروع خرید <ChevronLeft className="h-5 w-5" /></Link>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {withItems.map(({ order, items }) => {
            const st = ORDER_STATUS[order.status] ?? ORDER_STATUS.pending;
            return (
              <article key={order.id} className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
                <header className="flex flex-wrap items-center gap-2 sm:gap-4 px-4 sm:px-5 py-3 bg-slate-50/70 border-b border-slate-100 text-[10px] sm:text-[11px]">
                  <span className="flex items-center gap-1.5 font-black text-[#14264a]"><Receipt className="h-4 w-4 text-slate-400" />#MM-{toFaDigits(String(order.id).padStart(5, "0"))}</span>
                  <span className="text-slate-400">{faDate(order.createdAt)}</span>
                  <span className={`rounded-full border px-3 py-0.5 font-bold ${st.cls}`}>{st.label}</span>
                  <span className="mr-auto font-bold text-slate-500">{PAYMENT_METHODS[order.paymentMethod] ?? order.paymentMethod}</span>
                </header>
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex gap-2 overflow-x-auto no-scrollbar flex-1">
                    {items.map((item) => (
                      <div key={item.id} className="shrink-0 w-24">
                        <div className="relative h-24 w-24 rounded-2xl overflow-hidden bg-[#f6f4ef] border border-slate-100">
                          {item.image && <Image src={item.image} alt={item.name} fill sizes="100px" className="object-cover" />}
                          <span className="absolute bottom-1 left-1 rounded-md bg-black/55 text-white text-[9px] font-bold px-1.5 py-0.5">×{toFaDigits(item.quantity)}</span>
                        </div>
                        <p className="mt-1 text-[8px] text-slate-500 leading-4 line-clamp-2">{item.name}</p>
                      </div>
                    ))}
                  </div>
                  <div className="md:w-60 shrink-0 md:border-r md:border-slate-100 md:pr-4">
                    <p className="text-[10px] text-slate-400 flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{order.address}</p>
                    <p className="mt-1 text-[10px] text-slate-400 flex items-center gap-1" dir="ltr"><Phone className="h-3.5 w-3.5" />{order.phone}</p>
                    <p className="mt-2 text-[15px] font-black text-[#14264a]">{formatPrice(order.total)}</p>
                    <p className="text-[9px] text-slate-400">{toFaDigits(items.reduce((s, i) => s + i.quantity, 0))} کالا · پرداخت {order.paymentMethod === "onsite" ? "درب منزل" : "آنلاین"}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
