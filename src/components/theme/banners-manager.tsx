"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Save, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Loader2, Pencil, X, Link2 } from "lucide-react";

type Banner = { id: number; title: string; subtitle: string; cta: string; href: string; image: string; tone: string; sort: number; active: boolean };

const TONES = [
  { value: "from-rose-900/80", label: "زرشکی" },
  { value: "from-purple-900/80", label: "بنفش" },
  { value: "from-sky-900/80", label: "آبی" },
  { value: "from-slate-900/85", label: "دودی" },
  { value: "from-emerald-900/80", label: "زمردی" },
  { value: "from-amber-900/80", label: "عسلی" },
];
const EMPTY = { title: "", subtitle: "", cta: "خرید کنید", href: "/products", image: "", tone: TONES[0].value, active: true };

export default function BannersManager({ banners }: { banners: Banner[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ ...EMPTY });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const edit = (b: Banner) => { setEditingId(b.id); setForm({ title: b.title, subtitle: b.subtitle, cta: b.cta, href: b.href, image: b.image, tone: b.tone, active: b.active }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const reset = () => { setEditingId(null); setForm({ ...EMPTY }); setError(""); };

  const post = async (payload: Record<string, unknown>) => {
    const res = await fetch("/api/admin/theme", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error ?? "عملیات ناموفق بود.");
    return data;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await post({ action: "saveBanner", banner: { ...form, id: editingId ?? 0 } });
      reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا");
    } finally {
      setLoading(false);
    }
  };

  const simple = async (payload: Record<string, unknown>) => {
    setError("");
    try { await post(payload); router.refresh(); } catch (err) { setError(err instanceof Error ? err.message : "خطا"); }
  };

  return (
    <div className="mt-4 grid lg:grid-cols-5 gap-4 items-start">
      {/* فرم ساخت/ویرایش */}
      <form onSubmit={submit} className="lg:col-span-2 rounded-3xl border border-slate-200/70 bg-white p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-black text-[#14264a] text-[13px]">{editingId ? `ویرایش بنر #${editingId}` : "افزودن بنر جدید"}</h2>
          {editingId && <button type="button" onClick={reset} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100" aria-label="انصراف"><X className="h-5 w-5" /></button>}
        </div>
        <label className="block"><span className="text-[10px] font-bold text-slate-500">عنوان بنر *</span><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="مثلاً کاپشن‌های زمستانی" className="mt-1 w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[12px] outline-none focus:border-pink-400" /></label>
        <label className="block"><span className="text-[10px] font-bold text-slate-500">زیرعنوان / برچسب تخفیف</span><input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="تا ۳۰٪ تخفیف" className="mt-1 w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[12px] outline-none focus:border-pink-400" /></label>
        <div className="grid grid-cols-2 gap-2">
          <label className="block"><span className="text-[10px] font-bold text-slate-500">متن دکمه</span><input value={form.cta} onChange={(e) => setForm({ ...form, cta: e.target.value })} className="mt-1 w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[12px] outline-none focus:border-pink-400" /></label>
          <label className="block"><span className="text-[10px] font-bold text-slate-500">رنگ پس‌زمینه متن</span><select value={form.tone} onChange={(e) => setForm({ ...form, tone: e.target.value })} className="mt-1 w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[12px] outline-none focus:border-pink-400">{TONES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select></label>
        </div>
        <label className="block"><span className="text-[10px] font-bold text-slate-500">لینک مقصد *</span><input dir="ltr" required value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} placeholder="/products?cat=formal" className="mt-1 w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[11px] font-mono outline-none focus:border-pink-400 text-left" /></label>
        <label className="block"><span className="text-[10px] font-bold text-slate-500">آدرس تصویر * (لینک http یا مسیر داخلی مثل /images/hero-royal-junior.jpg)</span><input dir="ltr" required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://images.pexels.com/..." className="mt-1 w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[11px] font-mono outline-none focus:border-pink-400 text-left" /></label>
        {form.image && (
          <div className="relative h-28 rounded-2xl overflow-hidden border border-slate-200"><Image src={form.image} alt="پیش‌نمایش" fill sizes="400px" className="object-cover" unoptimized={!form.image.startsWith("/")} /><div className={`absolute inset-0 bg-gradient-to-t ${form.tone} to-transparent`} /><p className="absolute bottom-2 right-3 text-white font-black text-[13px] drop-shadow">{form.title || "عنوان بنر"}</p></div>
        )}
        {error && <p className="rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold px-3 py-2">{error}</p>}
        <button type="submit" disabled={loading} className="w-full h-12 rounded-2xl bg-[#14264a] text-amber-300 font-black text-[12px] hover:bg-[#1d3a63] transition disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : editingId ? <Save className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          {editingId ? "ذخیره تغییرات بنر" : "افزودن بنر به صفحه اصلی"}
        </button>
      </form>

      {/* لیست بنرهای موجود */}
      <div className="lg:col-span-3 space-y-2">
        <p className="text-[11px] font-black text-slate-500">{banners.length} بنر ثبت‌شده — با فلش‌ها ترتیب نمایش را تغییر دهید</p>
        {banners.map((b, i) => (
          <div key={b.id} className={`flex items-center gap-3 rounded-2xl border bg-white p-2 shadow-sm transition ${b.active ? "border-slate-200/70" : "border-slate-200/70 opacity-60"}`}>
            <div className="relative h-16 w-24 sm:h-20 sm:w-32 shrink-0 overflow-hidden rounded-xl bg-slate-100">
              <Image src={b.image} alt={b.title} fill sizes="140px" className="object-cover" />
              <div className={`absolute inset-0 bg-gradient-to-t ${b.tone} to-transparent`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] sm:text-[12px] font-black text-[#14264a] leading-4 truncate">{b.title}</p>
              <p className="text-[9px] text-slate-400 mt-0.5">{b.subtitle}</p>
              <a dir="ltr" href={b.href} target="_blank" rel="noreferrer" className="mt-0.5 inline-flex items-center gap-1 text-[8px] text-sky-600 hover:underline"><Link2 className="h-3 w-3" />{b.href.slice(0, 44)}</a>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <div className="flex gap-1">
                <button onClick={() => simple({ action: "moveBanner", id: b.id, dir: "up" })} disabled={i === 0} aria-label="بالا" className="h-7 w-7 grid place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-pink-400 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                <button onClick={() => simple({ action: "moveBanner", id: b.id, dir: "down" })} disabled={i === banners.length - 1} aria-label="پایین" className="h-7 w-7 grid place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-pink-400 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                <button onClick={() => simple({ action: "toggleBanner", id: b.id })} aria-label={b.active ? "غیرفعال" : "فعال"} className="h-7 w-7 grid place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-pink-400">{b.active ? <Eye className="h-4 w-4 text-emerald-600" /> : <EyeOff className="h-4 w-4" />}</button>
                <button onClick={() => edit(b)} aria-label="ویرایش" className="h-7 w-7 grid place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-pink-400 hover:text-pink-600"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => { if (window.confirm(`بنر «${b.title}» حذف شود؟`)) simple({ action: "deleteBanner", id: b.id }); }} aria-label="حذف" className="h-7 w-7 grid place-items-center rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {banners.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-[11px] text-slate-400">هنوز بنری ثبت نشده؛ اولین بنر را از فرم کنار اضافه کنید.</div>}
      </div>
    </div>
  );
}
