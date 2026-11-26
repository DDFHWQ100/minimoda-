"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Star, Zap } from "lucide-react";
import { useStore } from "@/components/store-provider";
import { discountPercent, formatPrice, parseJsonArray, toFaDigits, type ColorOption } from "@/lib/format";

export type ProductCardData = {
  id: number;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  images: string;
  colors: string;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isOffer: boolean;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const images = parseJsonArray<string>(product.images);
  const colors = parseJsonArray<ColorOption>(product.colors);
  const img = images[0] ?? "/images/hero-royal-junior.jpg";
  const finalPrice = product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price;
  const pct = discountPercent(product.price, product.discountPrice);
  const inWish = isInWishlist(product.id);

  return (
    <div className="group relative bg-white rounded-[20px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/70 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      {/* تصویر */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-[#f6f4ef]">
        <Image
          src={img}
          alt={product.name}
          fill
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 20vw"
          className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
        />
        {/* نشان تخفیف */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {pct > 0 && (
            <span className="flex items-center gap-0.5 rounded-full text-white text-[10px] font-black px-2 py-1 shadow" style={{ background: "var(--brand-accent)" }}>
              <Zap className="h-3 w-3 fill-amber-300 text-amber-300" />
              {toFaDigits(pct)}٪-
            </span>
          )}
          {product.isNew && <span className="rounded-full bg-emerald-500 text-white text-[9px] font-black px-2 py-1 shadow">تازه</span>}
        </div>
        {/* علاقه‌مندی */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist({
              id: product.id, slug: product.slug, name: product.name,
              price: product.price, discountPrice: product.discountPrice, image: img,
            });
          }}
          aria-label="افزودن به علاقه‌مندی‌ها"
          className={`absolute top-2 left-2 h-8 w-8 grid place-items-center rounded-full shadow-md backdrop-blur transition-all ${
            inWish ? "bg-pink-600 text-white" : "bg-white/90 text-slate-500 hover:text-pink-600 hover:scale-110"
          }`}
        >
          <Heart className={`h-4 w-4 ${inWish ? "fill-white" : ""}`} />
        </button>
      </Link>

      {/* جزئیات */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <Link href={`/products/${product.slug}`} className="text-[11px] sm:text-[12px] font-bold text-slate-700 leading-5 line-clamp-2 min-h-10 hover:text-pink-700 transition-colors">
          {product.name}
        </Link>

        {/* امتیاز */}
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-black text-slate-700">{toFaDigits(product.rating.toFixed(1))}</span>
          <span>({toFaDigits(product.reviewCount)} نظر)</span>
          {colors.length > 0 && (
            <span className="flex items-center gap-0.5 mr-auto">
              {colors.slice(0, 3).map((c) => (
                <span key={c.name} title={c.name} className="h-3 w-3 rounded-full border border-slate-200" style={{ background: c.hex }} />
              ))}
            </span>
          )}
        </div>

        {/* قیمت */}
        <div className="flex items-end justify-between gap-1 mt-auto pt-1">
          <div className="leading-tight">
            {pct > 0 && <span className="block text-[9px] sm:text-[10px] text-slate-400 line-through">{formatPrice(product.price)}</span>}
            <span className="block text-[12px] sm:text-[14px] font-black text-[#1b3a6b]">{formatPrice(finalPrice)}</span>
          </div>
        </div>

        {/* دکمه افزودن به سبد */}
        <button
          onClick={() =>
            addToCart({
              id: product.id, slug: product.slug, name: product.name,
              price: product.price, discountPrice: product.discountPrice, image: img,
              size: "استاندارد", color: colors[0]?.name ?? "—",
            })
          }
          className="mt-1.5 w-full h-9 rounded-full text-white text-[10px] sm:text-[11px] font-black flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-[.98] transition"
          style={{ background: "var(--brand-accent)" }}
        >
          <ShoppingCart className="h-4 w-4" strokeWidth={2.2} />
          افزودن به سبد خرید
        </button>
      </div>
    </div>
  );
}
