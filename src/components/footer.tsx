"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Crown, AtSign, Send, Phone, Mail, MapPin, Clock, ShieldCheck, BadgeCheck,
  CheckCircle2, Loader2, Heart, Sparkles,
} from "lucide-react";

type FooterLink = { label: string; href: string };
export default function Footer({
  storeName = "مینی‌مودا", tagline = "مد و پوشاک کودک و نوزاد",
  about, quickLinks, serviceLinks, instagram, telegram, phone, copyright, showTrustBadges = true,
}: {
  storeName?: string; tagline?: string; about?: string;
  quickLinks?: FooterLink[]; serviceLinks?: FooterLink[];
  instagram?: string; telegram?: string; phone?: string; copyright?: string; showTrustBadges?: boolean;
}) {
  const quick: FooterLink[] = quickLinks && quickLinks.length ? quickLinks : [
    { label: "محصولات پرفروش", href: "/products?sort=sales" }, { label: "تخفیف‌های ویژه", href: "/products?offer=1" },
    { label: "مجله مد", href: "/blog" }, { label: "لباس مجلسی", href: "/products?cat=formal" },
    { label: "کفش و کتانی", href: "/products?cat=shoes" }, { label: "نوزاد", href: "/products?cat=baby" },
  ];
  const service: FooterLink[] = serviceLinks && serviceLinks.length ? serviceLinks : [
    { label: "راهنمای خرید", href: "/help#delivery" }, { label: "شیوه‌های ارسال", href: "/help#delivery" },
    { label: "پیگیری سفارش", href: "/orders" }, { label: "سوالات متداول", href: "/help#faq" },
    { label: "ضمانت بازگشت کالا", href: "/help#return" }, { label: "تماس با ما", href: "/help#contact" },
  ];
  const ig = instagram ?? "https://www.instagram.com/minimoda.ir";
  const tg = telegram ?? "https://t.me/minimoda_ir";
  const tel = phone ?? "021-88766554";
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      setState(res.ok ? "done" : "error");
      if (res.ok) setEmail("");
    } catch {
      setState("error");
    }
  };

  return (
    <footer className="text-white/85 mt-10" style={{ background: "var(--brand-primary)" }}>
      {/* ── بدنه فوتر ─────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-[12px]">
        {/* لوگو و توضیح */}
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-11 w-11 rounded-2xl grid place-items-center" style={{ background: "linear-gradient(135deg, #fcd34d, #f59e0b)" }}>
              <Crown className="h-6 w-6 text-[#1b3a6b]" />
            </div>
            <span className="leading-tight">
              <span className="block text-2xl font-black text-white">Mini<span className="text-pink-400">Moda</span></span>
              <span className="block text-[9px] text-white/60">Kids &amp; Teens Fashion</span>
            </span>
          </Link>
          <p className="mt-3 text-white/60 leading-6">
{about ?? `${storeName}، فروشگاه اینترنتی ${tagline} — کیفیت و جدیدترین مدل‌ها با ضمانت اصالت کالا و ارسال سریع به سراسر ایران.`}
          </p>
          <div className="flex items-center gap-2 mt-4">
            <a href={ig} target="_blank" rel="noreferrer" aria-label="اینستاگرام" className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-pink-500 transition"><AtSign className="h-4 w-4 text-white" /></a>
            <a href={tg} target="_blank" rel="noreferrer" aria-label="تلگرام" className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-sky-500 transition"><Send className="h-4 w-4 text-white" /></a>
            <a href={`tel:${tel.replace(/\D/g, "")}`} aria-label="تلفن" className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-emerald-500 transition"><Phone className="h-4 w-4 text-white" /></a>
          </div>
        </div>

        {/* دسترسی سریع */}
        <div>
          <h4 className="text-white font-black mb-3 text-[13px] flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-amber-400" /> دسترسی سریع</h4>
          <ul className="space-y-2 text-white/65">
            {quick.map((l) => <li key={l.label + l.href}><Link href={l.href} className="hover:text-amber-300 transition">{l.label}</Link></li>)}
          </ul>
        </div>

        {/* خدمات مشتریان */}
        <div>
          <h4 className="text-white font-black mb-3 text-[13px] flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-amber-400" /> خدمات مشتریان</h4>
          <ul className="space-y-2 text-white/65">
            {service.map((l) => <li key={l.label + l.href}><Link href={l.href} className="hover:text-amber-300 transition">{l.label}</Link></li>)}
          </ul>
        </div>

        {/* خبرنامه */}
        <div>
          <h4 className="text-white font-black mb-3 text-[13px] flex items-center gap-1.5"><Mail className="h-4 w-4 text-amber-400" /> عضویت در خبرنامه</h4>
          <p className="text-white/60 leading-6">جدیدترین اخبار و تخفیف‌ها را دریافت کنید.</p>
          {state === "done" ? (
            <div className="mt-3 flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 rounded-2xl px-4 py-3 text-[11px] font-bold">
              <CheckCircle2 className="h-5 w-5" /> عضویت شما ثبت شد ✓
            </div>
          ) : (
            <form onSubmit={subscribe} className="mt-3">
              <div className="flex rounded-full bg-white/10 border border-white/15 overflow-hidden focus-within:border-amber-400 transition">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="آدرس ایمیل خود را وارد کنید" dir="ltr"
                  className="flex-1 h-11 bg-transparent px-4 text-[11px] placeholder:text-white/40 outline-none text-left" />
                <button type="submit" disabled={state === "loading"} className="h-11 px-5 text-white text-[11px] font-black flex items-center gap-1.5 hover:brightness-110 transition disabled:opacity-60" style={{ background: "var(--brand-accent)" }}>
                  {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : null} عضویت
                </button>
              </div>
              {state === "error" && <p className="mt-2 text-rose-300 text-[10px]">این ایمیل قبلاً ثبت شده یا نامعتبر است.</p>}
            </form>
          )}
          {showTrustBadges && (
          <div className="flex items-center gap-2 mt-4">
            <div className="flex flex-col items-center justify-center h-14 px-3 rounded-xl border border-white/20 bg-white/5">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <span className="text-[8px] text-white/70 mt-1">نماد اعتماد الکترونیکی</span>
            </div>
            <div className="flex flex-col items-center justify-center h-14 px-3 rounded-xl border border-white/20 bg-white/5">
              <BadgeCheck className="h-5 w-5 text-sky-400" />
              <span className="text-[8px] text-white/70 mt-1">ساماندهی رسانه</span>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* ── نوار پایین ─────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-white/50">
          <div className="flex items-center gap-3">
            <Link href="/pages/terms" className="hover:text-white transition">قوانین و مقررات</Link>
            <span className="text-white/20">|</span>
            <Link href="/pages/privacy" className="hover:text-white transition">حریم خصوصی</Link>
          </div>
          <p>{copyright ?? `© ۱۴۰۴ ${storeName} — کلیه حقوق محفوظ است`}</p>
        </div>
      </div>
    </footer>
  );
}
