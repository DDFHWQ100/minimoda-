"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const safe = images.length > 0 ? images : ["/images/hero-royal-junior.jpg"];

  return (
    <div className="w-full">
      <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden rounded-3xl bg-[#f6f4ef] border border-slate-100 shadow-sm group">
        <Image
          key={active}
          src={safe[active]}
          alt={name}
          fill
          priority
          sizes="(max-width:1024px) 100vw, 50vw"
          className="object-cover object-top animate-[fadeUp_.5s_ease]"
        />
        <span className="absolute bottom-3 left-3 rounded-full bg-black/45 backdrop-blur px-3 py-1 text-[9px] text-white/90 font-medium">تصویر رسمی مینی‌مودا</span>
      </div>
      {safe.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar">
          {safe.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`تصویر ${i + 1}`}
              className={`relative h-20 w-16 sm:h-24 sm:w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${i === active ? "border-pink-600 shadow-md" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              <Image src={src} alt={`${name} ${i + 1}`} fill sizes="100px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
