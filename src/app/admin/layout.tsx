import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  LayoutDashboard, Package, PlusCircle, ShoppingBag, ArrowRight, Crown, ShieldAlert, Eye, LogIn,
  LayoutGrid, Warehouse, Users, TicketPercent, Truck, Banknote, RotateCcw, MessageSquareText,
  Newspaper, Inbox, BarChart3, UserCog, Store, Megaphone, Ruler, FileText, BadgeCheck,
} from "lucide-react";
import { getSessionUser, isAdminDemoOpen } from "@/lib/auth";

export const dynamic = "force-dynamic";

const NAV_GROUPS = [
  { title: "نمای کلی", items: [
    { href: "/admin", icon: LayoutDashboard, label: "داشبورد اصلی" },
    { href: "/admin/reports", icon: BarChart3, label: "گزارش‌ها و تحلیل" },
  ] },
  { title: "فروش و سفارش‌ها", items: [
    { href: "/admin/orders", icon: ShoppingBag, label: "سفارش‌ها" },
    { href: "/admin/discount-codes", icon: TicketPercent, label: "تخفیف‌ها و کدها" },
    { href: "/admin/campaigns", icon: Megaphone, label: "بازاریابی و کمپین‌ها" },
    { href: "/admin/shipping", icon: Truck, label: "ارسال و حمل‌ونقل" },
    { href: "/admin/returns", icon: RotateCcw, label: "مرجوعی و تعویض" },
    { href: "/admin/transactions", icon: Banknote, label: "امور مالی" },
  ] },
  { title: "کاتالوگ و انبار", items: [
    { href: "/admin/products", icon: Package, label: "محصولات" },
    { href: "/admin/products/new", icon: PlusCircle, label: "افزودن محصول" },
    { href: "/admin/inventory", icon: Warehouse, label: "انبار و موجودی" },
    { href: "/admin/popular-categories", icon: LayoutGrid, label: "دسته‌بندی‌های محبوب" },
    { href: "/admin/size-charts", icon: Ruler, label: "جدول سایزبندی" },
    { href: "/admin/brands", icon: BadgeCheck, label: "برندها" },
    { href: "/admin/suppliers", icon: Store, label: "تأمین‌کنندگان" },
  ] },
  { title: "مشتریان و محتوا", items: [
    { href: "/admin/customers", icon: Users, label: "مشتریان" },
    { href: "/admin/reviews", icon: MessageSquareText, label: "نظرات و امتیازها" },
    { href: "/admin/messages", icon: Inbox, label: "پیام‌ها و پشتیبانی" },
    { href: "/admin/blog", icon: Newspaper, label: "بلاگ و مجله مد" },
    { href: "/admin/content-pages", icon: FileText, label: "صفحات محتوا" },
  ] },
  { title: "سیستم", items: [
    { href: "/admin/users", icon: UserCog, label: "کاربران و دسترسی‌ها" },
    { href: "/admin/theme", icon: Crown, label: "مدیریت قالب و پوسته" },
  ] },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  const demoOpen = isAdminDemoOpen();

  if (!user && !demoOpen) redirect("/login?next=/admin");

  if (user && user.role !== "admin") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <ShieldAlert className="h-16 w-16 text-rose-400 mx-auto" strokeWidth={1.5} />
        <h1 className="mt-4 text-xl font-black text-[#14264a]">دسترسی غیرمجاز</h1>
        <p className="mt-1 text-[12px] text-slate-500">این بخش فقط برای مدیر فروشگاه در دسترس است.</p>
        <Link href="/" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#14264a] text-white px-6 h-11 font-bold">بازگشت به فروشگاه <ArrowRight className="h-4 w-4" /></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6">
      {/* بنر حالت نمایش عمومی دمو */}
      {!user && demoOpen && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-[11px] font-bold text-amber-800 shadow-sm">
          <span className="flex items-center gap-2"><Eye className="h-4 w-4" /> حالت نمایش عمومی — پنل بدون رمز و فقط مشاهده است.</span>
          <a href="/api/auth/demo-login" className="flex items-center gap-1.5 rounded-full bg-[#14264a] text-amber-300 px-3 py-1.5 hover:bg-[#0e1c36] transition"><LogIn className="h-4 w-4" /> ورود با یک کلیک برای ویرایش واقعی</a>
        </div>
      )}
      <div className="grid lg:grid-cols-[240px_1fr] gap-4">
      {/* سایدبار */}
      <aside className="lg:sticky lg:top-28 h-max rounded-3xl border border-[#14264a]/10 bg-[#14264a] text-white p-4 shadow-lg">
        <div className="flex items-center gap-2 px-2 py-2 border-b border-white/10 pb-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-300 to-orange-400 grid place-items-center"><Crown className="h-5 w-5 text-[#14264a]" /></div>
          <div>
            <p className="text-[12px] font-black">پنل مدیریت</p>
            <p className="text-[9px] text-white/60">مینی‌مودا — {user ? user.name : "حالت نمایش عمومی"}</p>
          </div>
        </div>
        <nav className="mt-3 max-h-[78vh] overflow-y-auto pl-0.5">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="mb-2">
              <p className="px-2 pt-1.5 pb-1 text-[8px] font-black tracking-widest text-white/35">{group.title}</p>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-1">
                {group.items.map(({ href, icon: Icon, label }) => (
                  <Link key={href} href={href} className="flex items-center gap-2 rounded-2xl px-2.5 py-2 text-[11px] font-bold text-white/80 hover:bg-white/10 hover:text-amber-300 transition">
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                    <span className="truncate">{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <Link href="/" className="flex items-center gap-2 rounded-2xl px-2.5 py-2 text-[11px] font-bold text-amber-300 hover:bg-white/10 transition border-t border-white/10 pt-2 mt-1">
            <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={1.8} />
            بازگشت به فروشگاه
          </Link>
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
