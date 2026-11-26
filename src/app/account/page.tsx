import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { User, Package, Heart, ShoppingCart, LogOut, Mail, Phone, MapPin, Crown } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import AccountForm from "@/components/account-form";
import LogoutButton from "@/components/logout-button";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "حساب کاربری من" };

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/account");

  const initials = user.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0] ?? "").join("");

  return (
    <div className="mx-auto max-w-6xl px-3 sm:px-4 py-6">
      {/* سربرگ حساب */}
      <div className="rounded-3xl overflow-hidden border border-slate-200/80 bg-white shadow-sm">
        <div className="relative bg-gradient-to-l from-[#14264a] via-[#1d3a63] to-[#2b4d7d] px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl bg-gradient-to-br from-amber-300 to-orange-400 grid place-items-center text-2xl sm:text-3xl font-black text-[#14264a] shadow-lg shadow-black/20 ring-4 ring-white/20">
            {initials || <User />}
          </div>
          <div className="text-center sm:text-right text-white">
            <p className="flex items-center justify-center sm:justify-start gap-2 text-[10px] text-amber-300 font-bold"><Crown className="h-4 w-4" />{user.role === "admin" ? "مدیر فروشگاه" : "عضو ویژه مینی‌مودا"}</p>
            <h1 className="mt-0.5 text-xl sm:text-2xl font-black">{user.name}</h1>
            <p className="mt-1 text-[11px] text-white/70 flex items-center justify-center sm:justify-start gap-3 flex-wrap">
              <span dir="ltr" className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{user.email}</span>
              {user.phone && <span dir="ltr" className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{user.phone}</span>}
            </p>
          </div>
          <div className="sm:mr-auto"><LogoutButton /></div>
        </div>

        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-100">
          {/* لینک‌های سریع */}
          <div className="p-5 sm:p-6">
            <h2 className="text-[12px] font-black text-slate-400">دسترسی سریع</h2>
            <ul className="mt-2 space-y-1">
              {[
                { href: "/orders", icon: Package, label: "سفارش‌های من", d: "پیگیری ارسال و تاریخچه خرید" },
                { href: "/wishlist", icon: Heart, label: "علاقه‌مندی‌ها", d: "محصولات ذخیره‌شده شما" },
                { href: "/cart", icon: ShoppingCart, label: "سبد خرید", d: "ادامه خرید و پرداخت" },
              ].map(({ href, icon: Icon, label, d }) => (
                <li key={href}>
                  <Link href={href} className="flex items-center gap-3 rounded-2xl px-3 py-2.5 hover:bg-slate-50 transition group">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 grid place-items-center group-hover:bg-pink-100 transition"><Icon className="h-5 w-5 text-slate-500 group-hover:text-pink-600 transition" /></div>
                    <span><span className="block text-[12px] font-black text-[#14264a]">{label}</span><span className="block text-[9px] text-slate-400">{d}</span></span>
                  </Link>
                </li>
              ))}
              {user.role === "admin" && (
                <li>
                  <Link href="/admin" className="flex items-center gap-3 rounded-2xl px-3 py-2.5 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition">
                    <div className="h-10 w-10 rounded-xl bg-amber-200 grid place-items-center"><Crown className="h-5 w-5 text-amber-700" /></div>
                    <span><span className="block text-[12px] font-black text-amber-800">پنل مدیریت فروشگاه</span><span className="block text-[9px] text-amber-600">آمار، محصولات و سفارش‌ها</span></span>
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* فرم ویرایش */}
          <div className="md:col-span-2 p-5 sm:p-6">
            <h2 className="text-[12px] font-black text-slate-400">ویرایش اطلاعات حساب</h2>
            <AccountForm name={user.name} phone={user.phone} address={user.address} />
            {user.address && (
              <p className="mt-3 flex items-start gap-2 text-[11px] text-slate-500"><MapPin className="h-4 w-4 shrink-0 text-pink-500 mt-0.5" />{user.address}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
