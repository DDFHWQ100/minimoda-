"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Crown, Search, Heart, ShoppingCart, User, LogOut, LayoutDashboard,
  Menu, X, ChevronDown, Flame, Truck, Phone, Mail, MapPin, Clock, Home, Sparkles, AtSign, Send,
} from "lucide-react";
import { useStore } from "@/components/store-provider";
import { formatPrice } from "@/lib/format";

const NAV = [
  { label: "خانه", href: "/", icon: Home },
  { label: "بچگانه", href: "/products?cat=kids" },
  { label: "کودکان", href: "/products?cat=boys" },
  { label: "نوزاد", href: "/products?cat=baby" },
  { label: "پسرانه", href: "/products?cat=boys", sub: [
      { label: "کت و شلوار", href: "/products?cat=boys&q=کت" },
      { label: "تیشرت", href: "/products?cat=boys&q=تیشرت" },
      { label: "رسمی و مجلسی", href: "/products?cat=boys" },
    ] },
  { label: "دخترانه", href: "/products?cat=girls", sub: [
      { label: "پیراهن مجلسی", href: "/products?cat=girls&q=پیراهن" },
      { label: "سارافون و ست", href: "/products?cat=formal" },
      { label: "لباس روزمره", href: "/products?cat=girls" },
    ] },
  { label: "لباس مجلسی", href: "/products?cat=formal" },
  { label: "کفش", href: "/products?cat=shoes" },
  { label: "تماس با ما", href: "/help#contact" },
];

export default function Header({ userName, isAdmin }: { userName?: string | null; isAdmin?: boolean }) {
  const router = useRouter();
  const { cartCount, cartTotal, wishlist } = useStore();
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submitSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* ── نوار بالایی سرمه‌ای ─────────────────────────── */}
      <div className="text-white text-[11px] leading-8" style={{ background: "var(--brand-primary)" }}>
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 font-bold">
            <Truck className="h-3.5 w-3.5 text-amber-300" />
            تخفیف ویژه تا ۷۰٪ در جشنواره تابستانی
          </span>
          <div className="hidden md:flex items-center gap-4 text-white/80">
            <a href="/help#contact" className="flex items-center gap-1.5 hover:text-white transition"><Phone className="h-3 w-3" /> پشتیبانی مشتریان</a>
            <span className="text-white/30">|</span>
            <a href="/help#faq" className="hover:text-white transition">سوالات متداول</a>
            <span className="text-white/30">|</span>
            <a href="/help#contact" className="hover:text-white transition">تماس با ما</a>
          </div>
        </div>
      </div>

      {/* ── سربرگ اصلی ─────────────────────────── */}
      <div className={`bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-shadow ${scrolled ? "shadow-[0_8px_30px_-12px_rgba(20,38,74,.35)]" : ""}`}>
        <div className="mx-auto max-w-7xl px-3 sm:px-4">
          <div className="flex items-center gap-3 md:gap-5 h-16 md:h-[76px]">
            <button onClick={() => setMenuOpen(true)} className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-[#1b3a6b]" aria-label="باز کردن منو"><Menu className="h-6 w-6" /></button>

            {/* لوگو */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 select-none">
              <div className="relative h-11 w-11 md:h-12 md:w-12 rounded-2xl grid place-items-center shadow-lg shadow-amber-400/30 ring-1 ring-amber-200" style={{ background: "linear-gradient(135deg, #fcd34d, #f59e0b)" }}>
                <Crown className="h-6 w-6 md:h-7 md:w-7 text-[#1b3a6b]" strokeWidth={2.2} />
              </div>
              <div className="leading-tight">
                <div className="flex items-baseline gap-1">
                  <span className="text-[20px] md:text-[26px] font-black tracking-tight text-[#1b3a6b]">Mini</span>
                  <span className="text-[20px] md:text-[26px] font-black tracking-tight" style={{ color: "var(--brand-accent)" }}>Moda</span>
                </div>
                <p className="hidden sm:block text-[9px] md:text-[10px] font-medium text-slate-500 -mt-0.5">Kids &amp; Teens Fashion</p>
              </div>
            </Link>

            {/* جستجو */}
            <form onSubmit={submitSearch} className="flex-1 max-w-2xl mx-auto hidden sm:flex">
              <div className="relative flex w-full items-center rounded-full border-2 border-slate-200 bg-slate-50 focus-within:border-pink-500 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(233,30,99,.12)] transition-all h-11 overflow-hidden">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجوی محصول، برند یا دسته‌بندی..."
                  className="flex-1 h-full bg-transparent px-5 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none"
                  aria-label="جستجو در محصولات"
                />
                <button type="submit" aria-label="جستجو" className="h-full px-5 grid place-items-center text-white transition hover:brightness-110" style={{ background: "var(--brand-accent)" }}>
                  <Search className="h-5 w-5" strokeWidth={2.4} />
                </button>
              </div>
            </form>

            {/* آیکن‌ها */}
            <div className="flex items-center gap-1 sm:gap-2 mr-auto sm:mr-0">
              <Link href="/wishlist" title="علاقه‌مندی‌ها" className="relative flex flex-col items-center p-1.5 rounded-xl text-slate-600 hover:text-pink-600 hover:bg-pink-50 transition">
                <Heart className="h-6 w-6" strokeWidth={1.8} />
                <span className="text-[10px] mt-0.5 font-medium hidden xs:block">علاقه‌مندی</span>
                {wishlist.length > 0 && <span className="absolute top-0 right-0.5 h-4 min-w-4 px-1 rounded-full bg-pink-600 text-white text-[9px] font-bold grid place-items-center">{wishlist.length}</span>}
              </Link>
              <Link href="/cart" className="relative flex items-center gap-2 py-1.5 pr-1.5 pl-2 sm:pl-3 rounded-2xl border border-slate-200 hover:border-pink-300 hover:shadow-md hover:shadow-pink-100 transition group">
                <div className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-xl grid place-items-center" style={{ background: "var(--brand-primary)" }}>
                  <ShoppingCart className="h-5 w-5 text-amber-400" strokeWidth={2} />
                  {cartCount > 0 && <span className="absolute -top-1.5 -left-1.5 h-5 min-w-5 px-1 rounded-full bg-pink-600 border-2 border-white text-white text-[9px] font-bold grid place-items-center">{cartCount}</span>}
                </div>
                <div className="hidden md:block leading-tight">
                  <span className="block text-[9px] text-slate-400">سبد خرید</span>
                  <span className="block text-[11px] font-extrabold text-[#1b3a6b] group-hover:text-pink-700 transition">{formatPrice(cartTotal)}</span>
                </div>
              </Link>
              {userName ? (
                <div className="flex items-center gap-1">
                  {isAdmin && (
                    <Link href="/admin" title="پنل مدیریت" className="flex flex-col items-center p-1.5 rounded-xl text-slate-600 hover:text-[#1b3a6b] hover:bg-slate-100 transition">
                      <LayoutDashboard className="h-6 w-6" strokeWidth={1.8} />
                      <span className="text-[10px] mt-0.5 font-medium hidden xs:block">مدیریت</span>
                    </Link>
                  )}
                  <Link href="/account" title="حساب من" className="flex flex-col items-center p-1.5 rounded-xl text-slate-600 hover:text-[#1b3a6b] hover:bg-slate-100 transition">
                    <User className="h-6 w-6" strokeWidth={1.8} />
                    <span className="text-[10px] mt-0.5 font-medium hidden xs:block max-w-16 truncate">{userName.split(" ")[0]}</span>
                  </Link>
                </div>
              ) : (
                <Link href="/login" className="flex flex-col items-center p-1.5 rounded-xl text-slate-600 hover:text-[#1b3a6b] hover:bg-slate-100 transition">
                  <User className="h-6 w-6" strokeWidth={1.8} />
                  <span className="text-[10px] mt-0.5 font-medium hidden xs:block">ورود</span>
                </Link>
              )}
            </div>
          </div>

          {/* جستجوی موبایل */}
          <form onSubmit={submitSearch} className="sm:hidden pb-2">
            <div className="relative flex w-full items-center rounded-full border border-slate-200 bg-slate-50 h-10 overflow-hidden">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="جستجو در مینی‌مودا..." className="flex-1 h-full bg-transparent px-4 text-[13px] outline-none" aria-label="جستجو" />
              <button type="submit" className="h-full px-4 text-white grid place-items-center" style={{ background: "var(--brand-accent)" }} aria-label="جستجو"><Search className="h-5 w-5" /></button>
            </div>
          </form>
        </div>

        {/* ── منوی ناوبری (آیتم‌های کپسولی) ─────────────────────────── */}
        <nav className="hidden md:block border-t border-slate-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 flex items-center justify-center gap-1.5 py-2">
            {NAV.map((item, i) => (
              <div key={item.label + item.href} className="relative group">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 px-4 py-2 rounded-full text-[12px] font-bold transition-all ${
                    i === 0 ? "text-white shadow-md shadow-pink-600/30" : "text-[#1b3a6b] hover:bg-pink-50 hover:text-pink-600"
                  }`}
                  style={i === 0 ? { background: "var(--brand-accent)" } : undefined}
                >
                  {item.icon && <item.icon className="h-3.5 w-3.5" />}
                  {item.label}
                  {item.sub && <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />}
                </Link>
                {item.sub && (
                  <div className="absolute top-full right-0 mt-1 min-w-52 rounded-2xl border border-slate-100 bg-white shadow-2xl shadow-slate-900/10 p-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                    {item.sub.map((s) => (
                      <Link key={s.label} href={s.href} className="block px-3 py-2 rounded-xl text-[12px] text-slate-600 hover:bg-pink-50 hover:text-pink-700 transition">{s.label}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link href="/products?offer=1" className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-black text-white shadow-md shadow-pink-600/30 hover:brightness-110 transition" style={{ background: "var(--brand-accent)" }}>
              <Flame className="h-4 w-4 fill-amber-300 text-amber-300" />
              حراج ویژه
            </Link>
          </div>
        </nav>
      </div>

      {/* ── کشوی موبایل ─────────────────────────── */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-[#0b1a33]/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <aside className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col animate-[drawerIn_.3s_ease]">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl grid place-items-center" style={{ background: "linear-gradient(135deg, #fcd34d, #f59e0b)" }}><Crown className="h-5 w-5 text-[#1b3a6b]" /></div>
                <span className="font-black text-lg text-[#1b3a6b]">Mini<span style={{ color: "var(--brand-accent)" }}>Moda</span></span>
              </div>
              <button onClick={() => setMenuOpen(false)} className="p-2 rounded-xl hover:bg-slate-100" aria-label="بستن منو"><X className="h-6 w-6" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <form onSubmit={submitSearch} className="relative flex w-full items-center rounded-2xl border border-slate-200 bg-slate-50 h-11 overflow-hidden mb-4">
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="جستجوی محصولات..." className="flex-1 h-full bg-transparent px-4 text-sm outline-none" />
                <button type="submit" className="h-full px-4 text-white" style={{ background: "var(--brand-accent)" }}><Search className="h-5 w-5" /></button>
              </form>
              <ul className="divide-y divide-slate-100">
                {NAV.map((item) => (
                  <li key={item.label + item.href}>
                    <Link href={item.href} onClick={() => setMenuOpen(false)} className="flex items-center justify-between py-3.5 px-2 font-bold text-[#1b3a6b] hover:text-pink-600">
                      {item.label}
                      <ChevronDown className="h-4 w-4 -rotate-90 text-slate-400" />
                    </Link>
                  </li>
                ))}
                <li><Link href="/products?offer=1" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-3.5 px-2 font-black text-pink-600"><Flame className="h-5 w-5" /> حراج ویژه</Link></li>
                <li><Link href="/blog" onClick={() => setMenuOpen(false)} className="flex items-center justify-between py-3.5 px-2 font-bold text-[#1b3a6b]">مجله مد<ChevronDown className="h-4 w-4 -rotate-90 text-slate-400" /></Link></li>
                <li><Link href="/help" onClick={() => setMenuOpen(false)} className="flex items-center justify-between py-3.5 px-2 font-bold text-[#1b3a6b]">راهنمای خرید و FAQ<ChevronDown className="h-4 w-4 -rotate-90 text-slate-400" /></Link></li>
              </ul>
            </div>
            <div className="p-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-2">
              <a href="tel:02188766554" className="flex items-center gap-2 font-bold text-[#1b3a6b]" dir="ltr"><Phone className="h-4 w-4" /> 021-88766554</a>
              <p>پاسخگویی شنبه تا پنجشنبه ۹ تا ۲۱</p>
              {userName && <Link href="/account" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-slate-600"><LogOut className="h-4 w-4" /> حساب کاربری من</Link>}
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
