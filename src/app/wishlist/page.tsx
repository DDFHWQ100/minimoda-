"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ShoppingCart, Sparkles } from "lucide-react";
import { useStore } from "@/components/store-provider";
import { discountPercent, formatPrice, parseJsonArray, toFaDigits } from "@/lib/format";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, hydrated } = useStore();

  if (hydrated && wishlist.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto h-24 w-24 rounded-full bg-rose-50 grid place-items-center">
          <Heart className="h-11 w-11 text-rose-300" strokeWidth={1.5} />
        </div>
        <h1 className="mt-4 text-xl font-black text-[#14264a]">لیست علاقه‌مندی‌های شما خالی است</h1>
        <p className="mt-1 text-[13px] text-slate-500">محصولات دلخواهتان را با زدن آیکون قلب ذخیره کنید تا همیشه در دسترس باشند.</p>
        <Link href="/products" className="mt-5 inline-flex items-center gap-2 rounded-full bg-pink-600 text-white px-8 h-12 font-bold hover:bg-pink-500 transition">
          کشف محصولات <Sparkles className="h-5 w-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6">
      <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-black text-[#14264a]">
        <Heart className="h-6 w-6 text-pink-600 fill-pink-600" />
        علاقه‌مندی‌های من
        <span className="text-sm font-bold text-slate-400">({toFaDigits(wishlist.length)} محصول)</span>
      </h1>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {wishlist.map((item) => {
          const pct = discountPercent(item.price, item.discountPrice);
          const final = item.discountPrice && item.discountPrice < item.price ? item.discountPrice : item.price;
          return (
            <div key={item.id} className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col">
              <Link href={`/products/${item.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-[#f6f4ef]">
                <Image src={item.image} alt={item.name} fill sizes="(max-width:640px) 50vw, 20vw" className="object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                {pct > 0 && <span className="absolute top-2 right-2 rounded-lg bg-pink-600 text-white text-[10px] font-black px-2 py-1">{toFaDigits(pct)}٪-</span>}
              </Link>
              <button
                onClick={() => toggleWishlist(item)}
                aria-label="حذف از علاقه‌مندی‌ها"
                className="absolute top-2 left-2 h-8 w-8 grid place-items-center rounded-full bg-white/90 backdrop-blur text-slate-400 hover:text-rose-500 hover:scale-110 transition shadow"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="p-2.5 flex flex-col gap-1 flex-1">
                <Link href={`/products/${item.slug}`} className="text-[10px] sm:text-[11px] font-bold text-slate-700 leading-4 line-clamp-2 min-h-8 hover:text-pink-700">{item.name}</Link>
                <div className="mt-auto flex items-end justify-between gap-1 pt-1">
                  <div className="leading-tight">
                    {pct > 0 && <span className="block text-[8px] text-slate-400 line-through">{formatPrice(item.price)}</span>}
                    <span className="block text-[11px] sm:text-[12px] font-black text-[#14264a]">{formatPrice(final)}</span>
                  </div>
                  <button
                    onClick={() => addToCart({ id: item.id, slug: item.slug, name: item.name, price: item.price, discountPrice: item.discountPrice, image: item.image, size: "استاندارد", color: "—" })}
                    aria-label="افزودن به سبد خرید"
                    className="h-8 w-8 grid place-items-center rounded-xl bg-[#14264a] text-amber-400 hover:bg-pink-600 hover:text-white transition"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
