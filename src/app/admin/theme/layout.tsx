"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  LayoutDashboard, LayoutTemplate, Palette, LayoutList, ImageIcon, Code2,
  FileText, FolderOpen, Gauge, ShieldCheck, History, ScrollText, Settings, Bell, ArrowRight,
} from "lucide-react";

const GROUPS: { title: string; items: { href: string; label: string; icon: typeof LayoutDashboard }[] }[] = [
  { title: "نمای کلی", items: [{ href: "/admin/theme", label: "داشبورد قالب", icon: LayoutDashboard }] },
  {
    title: "قالب و پوسته",
    items: [
      { href: "/admin/theme/themes", label: "مدیریت قالب‌ها", icon: LayoutTemplate },
      { href: "/admin/theme/customize", label: "رنگ‌ها و فونت", icon: Palette },
      { href: "/admin/theme/sections", label: "اجزای صفحه اصلی", icon: LayoutList },
      { href: "/admin/theme/banners", label: "بنرها و اسلایدر", icon: ImageIcon },
      { href: "/admin/theme/editor", label: "ویرایشگر کد", icon: Code2 },
      { href: "/admin/theme/assets", label: "فایل‌ها و دارایی‌ها", icon: FolderOpen },
    ],
  },
  { title: "صفحات", items: [{ href: "/admin/theme/pages", label: "صفحات و الگوها", icon: FileText }] },
  {
    title: "کیفیت و سیستم",
    items: [
      { href: "/admin/theme/seo", label: "سئو و عملکرد", icon: Gauge },
      { href: "/admin/theme/security", label: "امنیت و نشست‌ها", icon: ShieldCheck },
      { href: "/admin/theme/revisions", label: "پشتیبان و نسخه‌ها", icon: History },
      { href: "/admin/theme/activity", label: "گزارش فعالیت‌ها", icon: ScrollText },
      { href: "/admin/theme/notifications", label: "اعلان‌ها", icon: Bell },
      { href: "/admin/theme/settings", label: "تنظیمات عمومی", icon: Settings },
    ],
  },
];

export default function ThemeLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/admin/theme" ? pathname === href : pathname.startsWith(href));

  return (
    <div className="grid lg:grid-cols-[235px_minmax(0,1fr)] gap-4">
      <aside className="h-max lg:sticky lg:top-24 rounded-3xl border border-slate-200/70 bg-white shadow-sm p-3">
        <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100">
          <p className="text-[13px] font-black text-[#14264a]">مدیریت قالب و پوسته</p>
          <Link href="/admin" className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-pink-600 transition">پنل اصلی <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        <nav className="mt-2 max-h-[70vh] overflow-y-auto">
          {GROUPS.map((group) => (
            <div key={group.title} className="mb-2">
              <p className="px-2 pt-1.5 pb-1 text-[9px] font-black tracking-wider text-slate-400">{group.title}</p>
              <ul className="space-y-0.5">
                {group.items.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link href={href} aria-current={isActive(href) ? "page" : undefined}
                      className={`flex items-center gap-2 rounded-xl px-2 py-2 text-[11px] font-bold transition ${isActive(href) ? "bg-[#14264a] text-amber-300 shadow" : "text-slate-600 hover:bg-slate-50 hover:text-[#14264a]"}`}>
                      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                      {label}
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
  );
}
