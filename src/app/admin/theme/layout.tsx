"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  LayoutDashboard, LayoutTemplate, PlusSquare, Code2, Brush, FileText, Layers, PanelTop, ListTree,
  SlidersHorizontal, Palette, FolderOpen, Braces, MonitorSmartphone, Gauge, History, ShieldCheck,
  ScrollText, Bell, Settings, ArrowRight, Search, Sun, Moon, ImageIcon, LayoutList, Menu, X,
} from "lucide-react";

type Item = { href: string; label: string; icon: typeof LayoutDashboard; keywords?: string };
const GROUPS: { title: string; items: Item[] }[] = [
  { title: "نمای کلی", items: [{ href: "/admin/theme", label: "نمای کلی", icon: LayoutDashboard, keywords: "داشبورد آمار" }] },
  { title: "قالب‌ها", items: [
    { href: "/admin/theme/themes", label: "مدیریت قالب‌ها", icon: LayoutTemplate, keywords: "فعال‌سازی تکثیر فرزند" },
    { href: "/admin/theme/themes#install", label: "افزودن قالب", icon: PlusSquare, keywords: "نصب zip" },
    { href: "/admin/theme/editor", label: "ویرایشگر قالب", icon: Code2, keywords: "css js head کد" },
  ] },
  { title: "پوسته و صفحات", items: [
    { href: "/admin/theme/sections", label: "مدیریت پوسته", icon: LayoutList, keywords: "اجزای صفحه اصلی ترتیب" },
    { href: "/admin/theme/pages", label: "مدیریت صفحات", icon: FileText, keywords: "الگو کاتالوگ" },
    { href: "/admin/theme/presets", label: "الگوهای آماده", icon: Layers, keywords: "چیدمان preset" },
    { href: "/admin/theme/header-footer", label: "هدر و فوتر", icon: PanelTop, keywords: "نوار اطلاع‌رسانی تماس" },
    { href: "/admin/theme/menus", label: "منوها و ابزارک‌ها", icon: ListTree, keywords: "زیرمنو پاپ‌آپ" },
    { href: "/admin/theme/banners", label: "بنرها و اسلایدر", icon: ImageIcon, keywords: "تبلیغ" },
  ] },
  { title: "ظاهر", items: [
    { href: "/admin/theme/design", label: "تنظیمات ظاهری", icon: SlidersHorizontal, keywords: "فاصله سایه عرض انیمیشن" },
    { href: "/admin/theme/customize", label: "رنگ‌ها و فونت‌ها", icon: Palette, keywords: "پالت" },
    { href: "/admin/theme/assets", label: "مدیریت فایل‌ها", icon: FolderOpen, keywords: "تصویر آپلود" },
    { href: "/admin/theme/editor#code", label: "کدهای سفارشی", icon: Braces, keywords: "css" },
    { href: "/admin/theme/responsive", label: "تنظیمات واکنش‌گرا", icon: MonitorSmartphone, keywords: "موبایل تبلت پیش‌نمایش" },
  ] },
  { title: "کیفیت و سیستم", items: [
    { href: "/admin/theme/seo", label: "سئو و عملکرد", icon: Gauge },
    { href: "/admin/theme/revisions", label: "نسخه‌بندی و پشتیبان", icon: History },
    { href: "/admin/theme/security", label: "امنیت و دسترسی‌ها", icon: ShieldCheck },
    { href: "/admin/theme/activity", label: "گزارش فعالیت‌ها", icon: ScrollText },
    { href: "/admin/theme/notifications", label: "اعلان‌ها", icon: Bell },
    { href: "/admin/theme/settings", label: "تنظیمات عمومی", icon: Settings },
  ] },
];

export default function ThemeLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState<number | null>(null);

  useEffect(() => {
    try { setDark(localStorage.getItem("mm_admin_dark") === "1"); } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem("mm_admin_dark", dark ? "1" : "0"); } catch { /* ignore */ }
  }, [dark]);
  useEffect(() => {
    fetch("/api/admin/theme/notices-count", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((d) => d && setUnread(d.unread)).catch(() => undefined);
  }, [pathname]);

  const isActive = (href: string) => {
    const base = href.split("#")[0];
    return base === "/admin/theme" ? pathname === base : pathname.startsWith(base) && !href.includes("#");
  };
  const results = useMemo(() => {
    const t = q.trim();
    if (!t) return [];
    return GROUPS.flatMap((g) => g.items).filter((i) => i.label.includes(t) || (i.keywords ?? "").includes(t)).slice(0, 6);
  }, [q]);

  return (
    <div className={dark ? "theme-admin-dark" : ""}>
      {/* هدر مدیریتی: جستجو + اعلان + حالت تاریک */}
      <div className="mb-3 flex flex-wrap items-center gap-2 rounded-3xl border border-slate-200/70 bg-white px-3 py-2 shadow-sm theme-admin-card">
        <button onClick={() => setOpen((v) => !v)} className="lg:hidden h-10 w-10 grid place-items-center rounded-xl border border-slate-200 text-slate-600" aria-label="منو">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        <div className="relative flex-1 min-w-48">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && results[0]) { router.push(results[0].href); setQ(""); } }} placeholder="جستجو در بخش‌های پنل قالب (مثلاً: فونت، بنر، پشتیبان)..." className="w-full h-10 rounded-2xl border border-slate-200 bg-slate-50 pr-10 pl-3 text-[12px] outline-none focus:border-pink-400 focus:bg-white" />
          {results.length > 0 && (
            <ul className="absolute top-full mt-1 right-0 left-0 z-50 rounded-2xl border border-slate-200 bg-white shadow-2xl p-1">
              {results.map((r) => <li key={r.href}><Link href={r.href} onClick={() => setQ("")} className="flex items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-bold text-slate-700 hover:bg-pink-50 hover:text-pink-700"><r.icon className="h-4 w-4" />{r.label}</Link></li>)}
            </ul>
          )}
        </div>
        <Link href="/admin/theme/notifications" className="relative h-10 w-10 grid place-items-center rounded-xl border border-slate-200 text-slate-600 hover:border-pink-400 hover:text-pink-600" title="اعلان‌ها">
          <Bell className="h-5 w-5" />
          {unread !== null && unread > 0 && <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-pink-600 text-white text-[9px] font-black grid place-items-center">{unread}</span>}
        </Link>
        <button onClick={() => setDark((v) => !v)} className="h-10 w-10 grid place-items-center rounded-xl border border-slate-200 text-slate-600 hover:border-pink-400 hover:text-pink-600" title="حالت روشن/تاریک پنل">{dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button>
        <Link href="/" target="_blank" className="hidden sm:inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#14264a] text-amber-300 px-3 text-[11px] font-black hover:bg-[#1d3a63]">مشاهده سایت</Link>
      </div>

      <div className="grid lg:grid-cols-[235px_minmax(0,1fr)] gap-4">
        <aside className={`${open ? "block" : "hidden"} lg:block h-max lg:sticky lg:top-24 rounded-3xl border border-slate-200/70 bg-white shadow-sm p-3 theme-admin-card`}>
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100">
            <p className="text-[13px] font-black text-[#14264a]">مدیریت قالب و پوسته</p>
            <Link href="/admin" className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-pink-600 transition">پنل اصلی <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <nav className="mt-2 max-h-[72vh] overflow-y-auto">
            {GROUPS.map((group) => (
              <div key={group.title} className="mb-2">
                <p className="px-2 pt-1.5 pb-1 text-[9px] font-black tracking-wider text-slate-400">{group.title}</p>
                <ul className="space-y-0.5">
                  {group.items.map(({ href, label, icon: Icon }) => (
                    <li key={href}>
                      <Link href={href} onClick={() => setOpen(false)} aria-current={isActive(href) ? "page" : undefined}
                        className={`flex items-center gap-2 rounded-xl px-2 py-2 text-[11px] font-bold transition ${isActive(href) ? "bg-[#14264a] text-amber-300 shadow" : "text-slate-600 hover:bg-slate-50 hover:text-[#14264a]"}`}>
                        <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />{label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>

      {/* حالت تاریک پنل قالب — فقط روی این بخش اعمال می‌شود، نه سایت */}
      <style>{`
        .theme-admin-dark { color-scheme: dark; }
        .theme-admin-dark .theme-admin-card, .theme-admin-dark .bg-white { background: #0f1b33 !important; border-color: #1e2d4d !important; color: #e2e8f0; }
        .theme-admin-dark .bg-slate-50, .theme-admin-dark .bg-slate-50\\/60, .theme-admin-dark .bg-slate-100 { background: #152341 !important; }
        .theme-admin-dark .text-\\[\\#14264a\\], .theme-admin-dark .text-slate-700, .theme-admin-dark .text-slate-600 { color: #e2e8f0 !important; }
        .theme-admin-dark .text-slate-500, .theme-admin-dark .text-slate-400 { color: #94a3b8 !important; }
        .theme-admin-dark .border-slate-200, .theme-admin-dark .border-slate-100, .theme-admin-dark .border-slate-200\\/70, .theme-admin-dark .divide-slate-100 > * { border-color: #1e2d4d !important; }
        .theme-admin-dark input, .theme-admin-dark select, .theme-admin-dark textarea { background: #152341 !important; color: #e2e8f0 !important; border-color: #2a3b61 !important; }
        .theme-admin-dark .hover\\:bg-slate-50:hover, .theme-admin-dark .hover\\:bg-slate-50\\/60:hover { background: #1a2a4a !important; }
      `}</style>
    </div>
  );
}
