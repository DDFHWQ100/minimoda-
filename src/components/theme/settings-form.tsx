"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, CheckCircle2, Store, Megaphone, Truck, Wrench, Globe } from "lucide-react";

type Initial = {
  storeName: string; tagline: string;
  announcementEnabled: boolean; announcementText: string; announcementTone: string;
  freeShippingAt: string;
  maintenanceEnabled: boolean; maintenanceMessage: string;
  seoSuffix: string; ogImage: string;
};

const inputCls = "w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[12px] outline-none focus:border-pink-400 transition";
const labelCls = "text-[10px] font-black text-slate-500 mb-1 block";

export default function SettingsForm({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const set = <K extends keyof Initial>(key: K, value: Initial[K]) => setForm((f) => ({ ...f, [key]: value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setDone(false);
    try {
      const res = await fetch("/api/admin/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "saveSettings",
          note: "تنظیمات عمومی سایت",
          entries: {
            "store.name": form.storeName,
            "store.tagline": form.tagline,
            "announcement.enabled": String(form.announcementEnabled),
            "announcement.text": form.announcementText,
            "announcement.tone": form.announcementTone,
            "free_shipping_at": form.freeShippingAt,
            "maintenance.enabled": String(form.maintenanceEnabled),
            "maintenance.message": form.maintenanceMessage,
            "seo.title_suffix": form.seoSuffix,
            "seo.og_image": form.ogImage,
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

  const switchCls = (on: boolean) => `relative h-7 w-12 rounded-full transition-colors ${on ? "bg-emerald-500" : "bg-slate-300"}`;
  const knobCls = (on: boolean) => `absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "right-1" : "right-6"}`;

  return (
    <form onSubmit={save} className="mt-4 grid lg:grid-cols-2 gap-4 items-start">
      {/* هویت فروشگاه + نوار اطلاع‌رسانی */}
      <div className="rounded-3xl border border-slate-200/70 bg-white p-4 sm:p-5 shadow-sm space-y-3">
        <h2 className="flex items-center gap-2 text-[12px] font-black text-[#14264a]"><Store className="h-4 w-4 text-pink-600" /> هویت فروشگاه</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          <label className="block"><span className={labelCls}>نام فروشگاه</span><input required value={form.storeName} onChange={(e) => set("storeName", e.target.value)} className={inputCls} /></label>
          <label className="block"><span className={labelCls}>شعار / توضیح کوتاه</span><input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} className={inputCls} /></label>
        </div>

        <h2 className="flex items-center gap-2 text-[12px] font-black text-[#14264a] pt-2 border-t border-slate-100"><Megaphone className="h-4 w-4 text-amber-500" /> نوار اطلاع‌رسانی بالای سایت</h2>
        <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-3 cursor-pointer">
          <span className="text-[11px] font-bold text-slate-600">نمایش نوار اطلاع‌رسانی</span>
          <button type="button" role="switch" aria-checked={form.announcementEnabled} onClick={() => set("announcementEnabled", !form.announcementEnabled)} className={switchCls(form.announcementEnabled)}><span className={knobCls(form.announcementEnabled)} /></button>
        </label>
        <label className="block"><span className={labelCls}>متن نوار</span><input value={form.announcementText} onChange={(e) => set("announcementText", e.target.value)} placeholder="مثلاً: ارسال رایگان سفارش‌های بالای ۲ میلیون تومان" className={inputCls} /></label>
        <div>
          <span className={labelCls}>رنگ نوار</span>
          <div className="flex gap-1.5">
            {[["gold", "طلایی"], ["pink", "صورتی"], ["navy", "سرمه‌ای"]].map(([v, l]) => (
              <button key={v} type="button" onClick={() => set("announcementTone", v)} className={`rounded-full px-4 h-9 text-[10px] font-bold border transition ${form.announcementTone === v ? "bg-[#14264a] text-amber-300 border-[#14264a]" : "border-slate-200 text-slate-500"}`}>{l}</button>
            ))}
          </div>
        </div>

        <h2 className="flex items-center gap-2 text-[12px] font-black text-[#14264a] pt-2 border-t border-slate-100"><Truck className="h-4 w-4 text-emerald-600" /> قوانین فروش</h2>
        <label className="block"><span className={labelCls}>آستانه ارسال رایگان (تومان)</span><input type="number" min={0} dir="ltr" value={form.freeShippingAt} onChange={(e) => set("freeShippingAt", e.target.value)} className={`${inputCls} text-left`} /><small className="mt-1 block text-[8px] text-slate-400">همین حالا در سبد خرید، تسویه حساب و سرور اعمال می‌شود.</small></label>
      </div>

      {/* حالت تعمیر + SEO */}
      <div className="rounded-3xl border border-slate-200/70 bg-white p-4 sm:p-5 shadow-sm space-y-3">
        <h2 className="flex items-center gap-2 text-[12px] font-black text-[#14264a]"><Wrench className="h-4 w-4 text-orange-500" /> حالت تعمیر (Maintenance Mode)</h2>
        <label className="flex items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50/50 p-3 cursor-pointer">
          <span className="text-[11px] font-bold text-rose-800">فعال‌سازی حالت تعمیر<small className="block text-[8px] font-normal text-rose-600">غیرمدیران فقط صفحه «در حال به‌روزرسانی» را می‌بینند؛ مدیران وارد می‌شوند.</small></span>
          <button type="button" role="switch" aria-checked={form.maintenanceEnabled} onClick={() => set("maintenanceEnabled", !form.maintenanceEnabled)} className={`relative h-7 w-12 rounded-full transition-colors shrink-0 ${form.maintenanceEnabled ? "bg-rose-500" : "bg-slate-300"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${form.maintenanceEnabled ? "right-1" : "right-6"}`} /></button>
        </label>
        <label className="block"><span className={labelCls}>پیام نمایش داده‌شده به بازدیدکنندگان</span><textarea rows={2} value={form.maintenanceMessage} onChange={(e) => set("maintenanceMessage", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] leading-6 outline-none focus:border-pink-400 resize-none" /></label>

        <h2 className="flex items-center gap-2 text-[12px] font-black text-[#14264a] pt-2 border-t border-slate-100"><Globe className="h-4 w-4 text-sky-600" /> متادیتای اشتراک‌گذاری و عنوان</h2>
        <label className="block"><span className={labelCls}>پسوند عنوان صفحات</span><input dir="ltr" value={form.seoSuffix} onChange={(e) => set("seoSuffix", e.target.value)} className={`${inputCls} text-left`} /></label>
        <label className="block"><span className={labelCls}>تصویر پیش‌فرض اشتراک‌گذاری (مسیر یا URL)</span><input dir="ltr" value={form.ogImage} onChange={(e) => set("ogImage", e.target.value)} className={`${inputCls} text-left`} /></label>

        {error && <p className="rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold px-3 py-2">{error}</p>}
        <button type="submit" disabled={loading || !dirty} className="w-full h-13 py-4 rounded-2xl bg-gradient-to-l from-pink-600 to-rose-600 text-white font-black shadow-lg shadow-pink-600/25 hover:shadow-xl transition-all disabled:opacity-40 flex items-center justify-center gap-2">{loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />} ذخیره تنظیمات عمومی</button>
        {done && <p className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-600"><CheckCircle2 className="h-4 w-4" /> ذخیره شد — سایت به‌روز شد</p>}
      </div>
    </form>
  );
}
