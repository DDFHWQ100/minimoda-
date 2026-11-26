"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, CheckCircle2, LayoutGrid, Rows3 } from "lucide-react";

type Initial = { layoutProducts: string; heroCompact: boolean; catRowMobile: boolean };

export default function PagesManager({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [layoutProducts, setLayoutProducts] = useState(initial.layoutProducts);
  const [heroCompact, setHeroCompact] = useState(initial.heroCompact);
  const [catRowMobile, setCatRowMobile] = useState(initial.catRowMobile);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const dirty = layoutProducts !== initial.layoutProducts || heroCompact !== initial.heroCompact || catRowMobile !== initial.catRowMobile;

  const save = async () => {
    setLoading(true); setError(""); setDone(false);
    try {
      const res = await fetch("/api/admin/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "saveSettings",
          note: "تنظیمات الگوهای صفحه",
          entries: {
            "layout.products": layoutProducts,
            "home.hero_compact": String(heroCompact),
            "responsive.cat_row_mobile": String(catRowMobile),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "ذخیره ناموفق بود.");
      else { setDone(true); router.refresh(); setTimeout(() => setDone(false), 2500); }
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  };

  const choice = (active: boolean) => `flex items-center gap-2 rounded-2xl border-2 p-3 cursor-pointer transition ${active ? "border-pink-600 bg-pink-50/60 shadow" : "border-slate-200 hover:border-slate-300"}`;

  return (
    <div className="mt-4 grid lg:grid-cols-2 gap-4 items-start">
      <div className="rounded-3xl border border-slate-200/70 bg-white p-4 sm:p-5 shadow-sm space-y-5">
        {/* چیدمان کاتالوگ */}
        <fieldset>
          <legend className="text-[12px] font-black text-[#14264a]">الگوی نمایش کاتالوگ (صفحه محصولات)</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setLayoutProducts("grid")} className={choice(layoutProducts === "grid")}>
              <LayoutGrid className="h-6 w-6 text-slate-500 shrink-0" />
              <span className="text-right"><b className="block text-[11px] text-[#14264a]">شبکه‌ای (Grid)</b><small className="block text-[9px] text-slate-400 leading-4">کارت‌های ۴ ستونه — حالت پیش‌فرض فروشگاه</small></span>
            </button>
            <button type="button" onClick={() => setLayoutProducts("list")} className={choice(layoutProducts === "list")}>
              <Rows3 className="h-6 w-6 text-slate-500 shrink-0" />
              <span className="text-right"><b className="block text-[11px] text-[#14264a]">لیستی (List)</b><small className="block text-[9px] text-slate-400 leading-4">ردیفی تمام‌عرض با جزئیات بیشتر هر کالا</small></span>
            </button>
          </div>
        </fieldset>

        {/* هیرو */}
        <fieldset>
          <legend className="text-[12px] font-black text-[#14264a]">ارتفاع اسلایدر صفحه اصلی</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setHeroCompact(false)} className={choice(!heroCompact)}><span className="block w-full"><b className="block text-[11px] text-[#14264a]">تمام‌قد (پیش‌فرض)</b><small className="block text-[9px] text-slate-400">تجربه ویترینی کامل</small></span></button>
            <button type="button" onClick={() => setHeroCompact(true)} className={choice(heroCompact)}><span className="block w-full"><b className="block text-[11px] text-[#14264a]">فشرده (Compact)</b><small className="block text-[9px] text-slate-400">نمایش سریع‌تر؛ محصولات بالاتر می‌آیند</small></span></button>
          </div>
        </fieldset>

        {/* موبایل */}
        <fieldset>
          <legend className="text-[12px] font-black text-[#14264a]">رفتار موبایل</legend>
          <label className="mt-2 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-3 cursor-pointer">
            <span className="text-[11px] font-bold text-slate-600">نمایش ردیف آیکن‌های دسته‌بندی در موبایل<small className="block text-[9px] font-normal text-slate-400">در صورت غیرفعال‌سازی، موبایل سریع‌تر و خلوت‌تر می‌شود</small></span>
            <button type="button" role="switch" aria-checked={catRowMobile} onClick={() => setCatRowMobile((v) => !v)} className={`relative h-7 w-12 rounded-full transition-colors shrink-0 ${catRowMobile ? "bg-emerald-500" : "bg-slate-300"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${catRowMobile ? "right-1" : "right-6"}`} /></button>
          </label>
        </fieldset>

        {error && <p className="rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold px-3 py-2">{error}</p>}
        <button onClick={save} disabled={loading || !dirty} className="w-full h-12 rounded-2xl bg-[#14264a] text-amber-300 font-black text-[12px] hover:bg-[#1d3a63] transition disabled:opacity-40 flex items-center justify-center gap-2">{loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />} ذخیره الگوها</button>
        {done && <p className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-600"><CheckCircle2 className="h-4 w-4" /> الگوها ذخیره و اعمال شد</p>}
      </div>

      {/* رجیستری الگوهای سایت */}
      <div className="rounded-3xl border border-slate-200/70 bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60"><h2 className="text-[12px] font-black text-[#14264a]">الگوهای فعال صفحات (رجیستری قالب)</h2></div>
        <ul className="divide-y divide-slate-100 text-[11px]">
          {[
            ["صفحه اصلی (/)", "Home: Hero + Sections Engine", "فعال — از «اجزای صفحه اصلی» مدیریت می‌شود"],
            ["کاتالوگ (/products)", "Products: Grid/List + Filters", "فعال — انتخاب در همین صفحه"],
            ["صفحه محصول (/products/[slug])", "Product: Gallery + Purchase Panel", "فعال — ثابت"],
            ["سبد خرید (/cart)", "Cart: Lines + Summary", "فعال — ثابت"],
            ["تسویه حساب (/checkout)", "Checkout: Form + Order Summary", "فعال — ثابت"],
            ["حساب کاربری (/account)", "Account: Profile + Orders", "فعال — ثابت"],
            ["ورود و ثبت‌نام (/login, /register)", "Auth: Split-screen", "فعال — ثابت"],
            ["وبلاگ (/blog, /blog/[slug])", "Blog: Featured + Grid + Article", "فعال — ثابت"],
            ["راهنما (/help)", "Help: Accordion FAQ", "فعال — ثابت"],
            ["پنل مدیریت (/admin)", "Admin: Sidebar Layout", "فعال — ثابت"],
            ["صفحه ۴۰۴", "Error: Empty State", "فعال — ثابت"],
            ["صفحه تعمیر (503)", "Maintenance: Full-screen", "فعال — از «تنظیمات عمومی» فعال می‌شود"],
          ].map(([page, tpl, status]) => (
            <li key={page as string} className="px-4 py-2.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-[#14264a]">{page}</p>
                <p dir="ltr" className="text-[8px] text-slate-400 font-mono">{tpl}</p>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[8px] font-bold px-2 py-1">{status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
