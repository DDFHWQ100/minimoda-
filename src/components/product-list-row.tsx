"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useStore } from "@/components/store-provider";
import { discountPercent, formatPrice, parseJsonArray, toFaDigits, type ColorOption } from "@/lib/format";
import type { ProductCardData } from "@/components/product-card";

export default function ProductListRow({ product }: { product: ProductCardData }) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const images = parseJsonArray<string>(product.images);
  const colors = parseJsonArray<ColorOption>(product.colors);
  const img = images[0] ?? "/images/hero-royal-junior.jpg";
  const finalPrice = product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price;
  const pct = discountPercent(product.price, product.discountPrice);
  const inWish = isInWishlist(product.id);

  return (
    <div className="flex gap-3 sm:gap-4 rounded-2xl border border-slate-200/70 bg-white p-2 sm:p-3 shadow-sm hover:shadow-md transition">
      <Link href={`/products/${product.slug}`} className="relative w-24 sm:w-32 shrink-0 aspect-[4/5] rounded-xl overflow-hidden bg-[#f6f4ef]">
        <Image src={img} alt={product.name} fill sizes="140px" className="object-cover object-top" />
        {pct > 0 && <span className="absolute top-1.5 right-1.5 rounded-md bg-pink-600 text-white text-[9px] font-black px-1.5 py-0.5">{toFaDigits(pct)}٪-</span>}
      </Link>
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${product.slug}`} className="text-[11px] sm:text-[13px] font-bold text-slate-700 leading-5 sm:leading-6 line-clamp-2 hover:text-pink-700">{product.name}</Link>
          <button onClick={() => toggleWishlist({ id: product.id, slug: product.slug, name: product.name, price: product.price, discountPrice: product.discountPrice, image: img })} aria-label="علاقه‌مندی" className={`p-1.5 rounded-lg transition shrink-0 ${inWish ? "text-pink-600" : "text-slate-300 hover:text-pink-500"}`}>
            <Heart className={`h-5 w-5 ${inWish ? "fill-pink-600" : ""}`} />
          </button>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /><span className="font-black text-slate-700">{toFaDigits(product.rating.toFixed(1))}</span><span>({toFaDigits(product.reviewCount)} نظر)</span>
          {colors.length > 0 && <span className="hidden sm:flex items-center gap-1 mr-2">{colors.slice(0, 4).map((c) => <i key={c.name} title={c.name} className="h-3.5 w-3.5 rounded-full border border-slate-200 inline-block" style={{ background: c.hex }} />)}</span>}
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-1.5">
          <div className="leading-tight">
            {pct > 0 && <span className="block text-[9px] text-slate-400 line-through">{formatPrice(product.price)}</span>}
            <span className="block text-[13px] sm:text-[16px] font-black text-[#14264a]">{formatPrice(finalPrice)}</span>
          </div>
          <button onClick={() => addToCart({ id: product.id, slug: product.slug, name: product.name, price: product.price, discountPrice: product.discountPrice, image: img, size: "استاندارد", color: colors[0]?.name ?? "—" })} aria-label="افزودن به سبد" className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl bg-[#14264a] text-amber-400 text-[10px] sm:text-[11px] font-black hover:bg-pink-600 hover:text-white transition flex items-center gap-1.5"><ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" /> خرید</button>
        </div>
      </div>
    </div>
  );
}
