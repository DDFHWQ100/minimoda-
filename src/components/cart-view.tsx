"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingCart, Trash2, Minus, Plus, ChevronLeft, Truck, ShieldCheck, Store, ArrowRight, BadgePercent,
} from "lucide-react";
import { useStore } from "@/components/store-provider";
import { formatPrice, toFaDigits } from "@/lib/format";

const SHIPPING_COST = 45_000;

export default function CartView({ freeAt }: { freeAt: number }) {
  const router = useRouter();
  const { cart, setQty, removeFromCart, cartTotal, hydrated } = useStore();

  const savings = cart.reduce((s, i) => {
    const eff = i.discountPrice && i.discountPrice < i.price ? i.discountPrice : i.price;
    return s + (i.price - eff) * i.qty;
  }, 0);
  const shipping = cartTotal >= freeAt || cartTotal === 0 ? 0 : SHIPPING_COST;
  const total = cartTotal + shipping;
  const remainingForFree = freeAt - cartTotal;

  if (hydrated && cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto h-24 w-24 rounded-full bg-pink-50 grid place-items-center">
          <ShoppingCart className="h-11 w-11 text-pink-300" strokeWidth={1.5} />
        </div>
        <h1 className="mt-4 text-xl font-black text-[#14264a]">سبد خرید شما خالی است</h1>
        <p className="mt-1 text-[13px] text-slate-500">هنوز چیزی به سبد اضافه نکرده‌اید؛ کالکشن جدید مینی‌مودا منتظر شماست!</p>
        <Link href="/products" className="mt-5 inline-flex items-center gap-2 rounded-full bg-pink-600 text-white px-8 h-12 font-bold hover:bg-pink-500 transition">
          شروع خرید <ChevronLeft className="h-5 w-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6">
      <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-black text-[#14264a]">
        <ShoppingCart className="h-6 w-6 text-pink-600" />
        سبد خرید شما
        <span className="text-sm font-bold text-slate-400">({toFaDigits(cart.reduce((s, i) => s + i.qty, 0))} کالا)</span>
      </h1>

      {/* نوار ارسال رایگان */}
      <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 flex items-center gap-2 text-[11px] sm:text-[12px] font-bold text-amber-800">
        <Truck className="h-5 w-5 shrink-0 text-amber-500" />
        {remainingForFree > 0 ? (
          <span>فقط <b className="text-pink-700">{formatPrice(remainingForFree)}</b> دیگر تا <b>ارسال رایگان</b> فاصله دارید!</span>
        ) : (
          <span className="text-emerald-700">تبریک! ارسال سفارش شما <b>رایگان</b> خواهد بود.</span>
        )}
        <div className="hidden sm:block flex-1 h-2 rounded-full bg-amber-200 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-l from-amber-400 to-orange-400 transition-all duration-500" style={{ width: `${Math.min(100, (cartTotal / freeAt) * 100)}%` }} />
        </div>
      </div>

      <div className="mt-4 grid lg:grid-cols-3 gap-4">
        {/* ═══ لیست اقلام ═══ */}
        <div className="lg:col-span-2 space-y-2">
          {cart.map((item) => {
            const eff = item.discountPrice && item.discountPrice < item.price ? item.discountPrice : item.price;
            return (
              <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3 rounded-2xl border border-slate-200/80 bg-white p-2.5 sm:p-3 shadow-sm">
                <Link href={`/products/${item.slug}`} className="relative h-24 w-20 sm:h-32 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-[#f6f4ef]">
                  <Image src={item.image} alt={item.name} fill sizes="120px" className="object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/products/${item.slug}`} className="text-[11px] sm:text-[13px] font-bold text-slate-700 leading-5 line-clamp-2 hover:text-pink-700">{item.name}</Link>
                    <button onClick={() => removeFromCart(item.id, item.size, item.color)} aria-label="حذف از سبد" className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition shrink-0">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="mt-0.5 text-[9px] sm:text-[10px] text-slate-400">سایز: <b className="text-slate-600">{toFaDigits(item.size)}</b> · رنگ: <b className="text-slate-600">{item.color}</b></p>
                  <div className="mt-1.5 sm:mt-3 flex flex-wrap items-end justify-between gap-2">
                    <div className="leading-tight">
                      {item.discountPrice && item.discountPrice < item.price && (
                        <span className="block text-[9px] text-slate-400 line-through">{formatPrice(item.price)}</span>
                      )}
                      <span className="block text-[12px] sm:text-[15px] font-black text-[#14264a]">{formatPrice(eff)}</span>
                    </div>
                    <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden">
                      <button onClick={() => setQty(item.id, item.size, item.color, item.qty + 1)} className="h-8 w-8 grid place-items-center hover:bg-slate-50 text-slate-500" aria-label="افزایش"><Plus className="h-4 w-4" /></button>
                      <span className="h-8 w-9 grid place-items-center text-[12px] font-black text-[#14264a] border-x border-slate-200">{toFaDigits(item.qty)}</span>
                      <button onClick={() => setQty(item.id, item.size, item.color, item.qty - 1)} className="h-8 w-8 grid place-items-center hover:bg-slate-50 text-slate-500" aria-label="کاهش"><Minus className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <Link href="/products" className="inline-flex items-center gap-1.5 text-[12px] font-bold text-slate-500 hover:text-pink-600 pt-1 transition"><ArrowRight className="h-4 w-4" /> ادامه خرید از فروشگاه</Link>
        </div>

        {/* ═══ خلاصه سفارش ═══ */}
        <aside className="lg:col-span-1">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm sticky top-28">
            <h2 className="font-black text-[#14264a] flex items-center gap-2"><BadgePercent className="h-5 w-5 text-pink-600" /> خلاصه سفارش</h2>
            <dl className="mt-3 space-y-2 text-[12px] text-slate-600">
              <div className="flex justify-between"><dt>جمع کل کالاها</dt><dd className="font-bold">{formatPrice(cartTotal + savings)}</dd></div>
              {savings > 0 && <div className="flex justify-between text-emerald-600"><dt>تخفیف محصولات</dt><dd className="font-bold">− {formatPrice(savings)}</dd></div>}
              <div className="flex justify-between"><dt>هزینه ارسال</dt><dd className="font-bold">{shipping === 0 ? <span className="text-emerald-600">رایگان</span> : formatPrice(shipping)}</dd></div>
              <div className="border-t border-dashed border-slate-200 pt-2 flex justify-between text-[14px] sm:text-[15px] text-[#14264a]"><dt className="font-black">مبلغ قابل پرداخت</dt><dd className="font-black">{formatPrice(total)}</dd></div>
            </dl>
            <button
              onClick={() => router.push("/checkout")}
              className="mt-4 w-full h-13 py-4 rounded-2xl bg-gradient-to-l from-pink-600 to-rose-600 text-white font-black text-sm sm:text-base shadow-lg shadow-pink-600/30 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              ادامه فرآیند خرید <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="mt-3 space-y-1.5 text-[10px] text-slate-400">
              <p className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> پرداخت امن با درگاه معتبر بانکی</p>
              <p className="flex items-center gap-1.5"><Store className="h-4 w-4 text-sky-500" /> امکان پرداخت درب منزل (تهران و کرج)</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
