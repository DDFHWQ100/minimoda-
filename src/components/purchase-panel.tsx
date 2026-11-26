"use client";

import { useMemo, useState } from "react";
import {
  Heart, ShoppingCart, Truck, RotateCcw, ShieldCheck, Minus, Plus, Zap, Check,
} from "lucide-react";
import { useStore } from "@/components/store-provider";
import { discountPercent, formatPrice, parseJsonArray, toFaDigits, type ColorOption } from "@/lib/format";

type Props = {
  id: number;
  slug: string;
  name: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  sizes: string;
  colors: string;
  image: string;
  categoryName?: string | null;
};

export default function PurchasePanel(p: Props) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const sizes = useMemo(() => parseJsonArray<string>(p.sizes), [p.sizes]);
  const colors = useMemo(() => parseJsonArray<ColorOption>(p.colors), [p.colors]);
  const [size, setSize] = useState(sizes[0] ?? "");
  const [color, setColor] = useState(colors[0]?.name ?? "—");
  const [qty, setQty] = useState(1);

  const pct = discountPercent(p.price, p.discountPrice);
  const finalPrice = p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price;
  const savings = p.price - finalPrice;
  const inWish = isInWishlist(p.id);

  return (
    <div className="flex flex-col">
      {/* قیمت */}
      <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
        {pct > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 line-through">{formatPrice(p.price)}</span>
            <span className="flex items-center gap-0.5 rounded-md bg-pink-600 text-white text-[10px] font-black px-2 py-0.5"><Zap className="h-3 w-3 fill-amber-300 text-amber-300" />{toFaDigits(pct)}٪ تخفیف</span>
          </div>
        )}
        <div className="mt-0.5 flex flex-wrap items-end gap-x-3 gap-y-1">
          <span className="text-2xl sm:text-3xl font-black text-[#14264a] tracking-tight">{formatPrice(finalPrice)}</span>
          {savings > 0 && <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-0.5 mb-1">سود شما: {formatPrice(savings)}</span>}
        </div>
        <div className="mt-2 flex items-center gap-2 text-[11px] font-bold">
          {p.stock > 10 ? (
            <span className="flex items-center gap-1.5 text-emerald-600"><span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> موجود در انبار مینی‌مودا</span>
          ) : p.stock > 0 ? (
            <span className="flex items-center gap-1.5 text-amber-600"><span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" /> فقط {toFaDigits(p.stock)} عدد باقی مانده!</span>
          ) : (
            <span className="flex items-center gap-1.5 text-rose-600"><span className="h-2 w-2 rounded-full bg-rose-500" /> ناموجود</span>
          )}
          {p.categoryName && <span className="text-slate-400 font-medium">| {p.categoryName}</span>}
        </div>
      </div>

      {/* انتخاب سایز */}
      {sizes.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-black text-[#14264a]">سایز: <span className="text-pink-600">{size}</span></p>
            <a href="/help#size" className="text-[10px] font-bold text-slate-400 hover:text-pink-600 underline underline-offset-2">راهنمای انتخاب سایز</a>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`h-9 min-w-12 px-3 rounded-xl border text-[12px] font-bold transition-all ${
                  size === s ? "border-[#14264a] bg-[#14264a] text-amber-300 shadow-md" : "border-slate-200 text-slate-600 hover:border-slate-400"
                }`}
              >
                {toFaDigits(s)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* انتخاب رنگ */}
      {colors.length > 0 && (
        <div className="mt-4">
          <p className="text-[12px] font-black text-[#14264a]">رنگ: <span className="text-pink-600">{color}</span></p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setColor(c.name)}
                title={c.name}
                aria-label={c.name}
                className={`h-9 w-9 rounded-full border-2 grid place-items-center transition-all ${color === c.name ? "border-pink-600 scale-110 shadow-md" : "border-slate-200"}`}
                style={{ background: c.hex }}
              >
                {color === c.name && <Check className="h-4 w-4 text-emerald-500 bg-white rounded-full p-0.5" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* تعداد + افزودن به سبد */}
      <div className="mt-5 flex items-stretch gap-2">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-1">
          <button onClick={() => setQty((v) => Math.min(99, v + 1))} className="p-1.5 text-slate-500 hover:text-[#14264a]" aria-label="افزایش تعداد"><Plus className="h-4 w-4" /></button>
          <span className="text-[15px] font-black w-8 text-center text-[#14264a]">{toFaDigits(qty)}</span>
          <button onClick={() => setQty((v) => Math.max(1, v - 1))} className="p-1.5 text-slate-500 hover:text-[#14264a]" aria-label="کاهش تعداد"><Minus className="h-4 w-4" /></button>
        </div>
        <button
          disabled={p.stock <= 0}
          onClick={() => addToCart({ id: p.id, slug: p.slug, name: p.name, price: p.price, discountPrice: p.discountPrice, image: p.image, size, color }, qty)}
          className="flex-1 h-14 rounded-2xl bg-gradient-to-l from-pink-600 via-rose-600 to-pink-700 text-white font-black text-sm sm:text-base shadow-lg shadow-pink-600/30 hover:shadow-xl hover:shadow-pink-600/40 hover:-translate-y-0.5 active:scale-[.98] transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
          افزودن به سبد خرید
        </button>
        <button
          onClick={() => toggleWishlist({ id: p.id, slug: p.slug, name: p.name, price: p.price, discountPrice: p.discountPrice, image: p.image })}
          aria-label="افزودن به علاقه‌مندی‌ها"
          className={`h-14 w-14 grid place-items-center rounded-2xl border transition-all ${inWish ? "bg-pink-600 border-pink-600 text-white" : "border-slate-200 text-slate-400 hover:text-pink-600 hover:border-pink-300"}`}
        >
          <Heart className={`h-6 w-6 ${inWish ? "fill-white" : ""}`} />
        </button>
      </div>

      {/* مزایا */}
      <div className="mt-4 grid grid-cols-3 gap-1.5 text-center">
        {[
          { icon: Truck, t: "ارسال ۲ تا ۴ روز", d: "تیپاکس و پست" },
          { icon: RotateCcw, t: "ضمانت بازگشت", d: "۷ روز مهلت تست" },
          { icon: ShieldCheck, t: "پرداخت امن", d: "آنلاین یا درب منزل" },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
            <Icon className="h-5 w-5 mx-auto text-orange-500" strokeWidth={1.8} />
            <p className="mt-1 text-[9px] sm:text-[10px] font-black text-[#14264a]">{t}</p>
            <p className="text-[8px] text-slate-400">{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
