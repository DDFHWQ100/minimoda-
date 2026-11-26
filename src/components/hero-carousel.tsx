"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ChevronLeft, Sparkles, ArrowLeft } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    image: "/images/ref-hero.jpg",
    eyebrow: "کالکشن جدید ۲۰۲۶",
    title: "استایل خاص برای نسل خاص!",
    sub: "جدیدترین کالکشن لباس کودک و نوجوان",
    cta: "مشاهده مجموعه",
    ctaHref: "/products?cat=formal",
    badge: "۷۰٪",
    badgeCaption: "تا تخفیف",
    latin: "Be Happy :)",
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/5088176/pexels-photo-5088176.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
    eyebrow: "کالکشن ملوانی",
    title: "ست‌های دونفره ملوانی",
    sub: "روح دریانوردی در هر مهمانی",
    cta: "خرید ست‌های ملوانی",
    ctaHref: "/products?cat=kids",
    badge: "جدید",
    badgeCaption: "تابستانه ۲۰۲۶",
    latin: "Marine Spirit",
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/29224161/pexels-photo-29224161.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
    eyebrow: "کالکشن زمستانی",
    title: "گرم‌ترین زمستان فرزندتان",
    sub: "کاپشن و پالتوهای پشمی تا ۳۰٪ تخفیف",
    cta: "خرید کاپشن‌های زمستانی",
    ctaHref: "/products?cat=kids&q=کاپشن",
    badge: "٪۳۰-",
    badgeCaption: "تخفیف زمستانی",
    latin: "Winter Cozy",
  },
] as const;

export default function HeroCarousel({ compact = false }: { compact?: boolean }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((dir: 1 | -1) => {
    setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5500);
    return () => window.clearInterval(t);
  }, [paused]);

  const slide = SLIDES[index];

  return (
    <div
      className={`relative overflow-hidden rounded-[28px] ring-1 ring-black/5 shadow-xl shadow-sky-200/50 select-none ${compact ? "h-[240px] sm:h-[300px] lg:h-[340px]" : "h-[340px] sm:h-[420px] lg:h-[460px]"}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="اسلایدر پیشنهادهای ویژه"
    >
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <Image
            src={s.image}
            alt={s.title}
            fill
            priority={i === 0}
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-[70%_20%]"
          />
          {/* گرادینت متن — روشن و شاد مثل قالب مرجع */}
          <div className="absolute inset-0 bg-gradient-to-l from-white/85 via-white/45 to-transparent sm:from-white/80 sm:via-white/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-sky-100/40 via-transparent to-transparent" />
        </div>
      ))}

      {/* محتوای متن اسلاید فعلی */}
      <div key={slide.id} className="absolute inset-0 z-20 flex flex-col justify-center pr-5 sm:pr-12 lg:pr-16 max-w-[80%] sm:max-w-[55%] lg:max-w-[48%]">
        <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-pink-600 animate-fadeUp">
          <Sparkles className="h-3.5 w-3.5" />
          {slide.eyebrow}
        </span>
        <h1 className="mt-1 sm:mt-2 text-3xl sm:text-5xl lg:text-[56px] font-black tracking-tight leading-[1.2] text-[#1b3a6b] animate-fadeUp" style={{ animationDelay: ".08s" }}>
          {slide.title}
        </h1>
        <p className="mt-2 sm:mt-3 text-sm sm:text-lg lg:text-xl font-extrabold leading-7 sm:leading-8 text-slate-600 animate-fadeUp" style={{ animationDelay: ".16s" }}>
          {slide.sub}
        </p>
        <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-3 animate-fadeUp" style={{ animationDelay: ".24s" }}>
          <Link href={slide.ctaHref} className="inline-flex items-center gap-2 rounded-full px-5 sm:px-7 h-10 sm:h-12 text-[12px] sm:text-[13px] font-black text-white shadow-lg shadow-pink-600/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110" style={{ background: "var(--brand-accent)" }}>
            {slide.cta}
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="hidden sm:inline-block text-[12px] italic font-bold text-slate-500">{slide.latin}</span>
        </div>
      </div>

      {/* نشان گرد تخفیف */}
      <div key={`badge-${slide.id}`} className="absolute z-20 left-4 sm:left-10 top-4 sm:top-8 h-20 w-20 sm:h-28 sm:w-28 rounded-full ring-4 ring-white/80 shadow-2xl flex flex-col items-center justify-center text-white animate-floatY" style={{ background: "linear-gradient(135deg, #f472b6, #db2777)" }}>
        <span className="text-xl sm:text-3xl font-black leading-none">{slide.badge}</span>
        <span className="text-[8px] sm:text-[10px] font-bold text-white/90 mt-1 text-center px-2 leading-3">{slide.badgeCaption}</span>
      </div>

      {/* فلش‌ها */}
      <button onClick={() => go(1)} aria-label="اسلاید قبلی" className="absolute z-20 right-2 sm:right-4 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-11 sm:w-11 grid place-items-center rounded-full bg-white/80 hover:bg-white text-[#1b3a6b] shadow-lg backdrop-blur transition">
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
      <button onClick={() => go(-1)} aria-label="اسلاید بعدی" className="absolute z-20 left-2 sm:left-4 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-11 sm:w-11 grid place-items-center rounded-full bg-white/80 hover:bg-white text-[#1b3a6b] shadow-lg backdrop-blur transition">
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* نقطه‌ها */}
      <div className="absolute z-20 bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-white/70 backdrop-blur px-3 py-1.5 shadow">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            aria-label={`اسلاید ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-6" : "w-2 bg-slate-300 hover:bg-slate-400"}`}
            style={i === index ? { background: "var(--brand-accent)" } : undefined}
          />
        ))}
      </div>
    </div>
  );
}
