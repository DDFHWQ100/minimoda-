"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Sparkles, Eye } from "lucide-react";

const FONTS = [
  { value: "Vazirmatn", label: "وزیرمتن (پیش‌فرض)" },
  { value: "Estedad", label: "استعداد" },
  { value: "Noto Kufi Arabic", label: "نوتو کوفی عربی" },
  { value: "Harmattan", label: "هارمتان" },
  { value: "Lalezar", label: "لاله‌زار" },
];
const inputCls = "w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[12px] outline-none focus:border-pink-400 transition";
const labelCls = "text-[10px] font-bold text-slate-500 mb-1 block";

export default function NewThemeForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", slug: "", description: "", author: "MiniModa Studio", version: "1.0.0",
    preview: "https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg",
    primary: "#1b3a6b", accent: "#e91e63", gold: "#ffc107", font: "Vazirmatn", radius: "20",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "createTheme", ...form }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "نصب قالب ناموفق بود.");
      else { router.push("/admin/theme/themes"); router.refresh(); }
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-4 grid lg:grid-cols-5 gap-4 items-start">
      <div className="lg:col-span-3 rounded-3xl border border-slate-200/70 bg-white p-4 sm:p-6 shadow-sm space-y-3">
        <h2 className="font-black text-[#14264a] flex items-center gap-2"><Sparkles className="h-5 w-5 text-pink-600" /> اطلاعات قالب جدید</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          <label className="block"><span className={labelCls}>نام قالب *</span><input required value={form.name} onChange={set("name")} placeholder="مثلاً: بهار مینی‌مودا" className={inputCls} /></label>
          <label className="block"><span className={labelCls}>اسلاگ (انگلیسی)</span><input dir="ltr" value={form.slug} onChange={set("slug")} placeholder="spring-minimoda" className={`${inputCls} text-left font-mono`} /></label>
        </div>
        <label className="block"><span className={labelCls}>توضیحات</span><textarea value={form.description} onChange={set("description")} rows={2} placeholder="شرح کوتاه قالب و ویژگی‌هایش..." className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-[12px] leading-6 outline-none focus:border-pink-400 resize-none" /></label>
        <div className="grid sm:grid-cols-3 gap-2">
          <label className="block"><span className={labelCls}>سازنده</span><input value={form.author} onChange={set("author")} className={inputCls} /></label>
          <label className="block"><span className={labelCls}>نسخه</span><input dir="ltr" value={form.version} onChange={set("version")} className={`${inputCls} text-left font-mono`} /></label>
          <label className="block"><span className={labelCls}>تصویر پیش‌نمایش (URL)</span><input dir="ltr" value={form.preview} onChange={set("preview")} className={`${inputCls} text-left text-[10px] font-mono`} /></label>
        </div>
        <h3 className="text-[11px] font-black text-slate-400 pt-1 border-t border-slate-100">توکن‌های طراحی قالب</h3>
        <div className="grid sm:grid-cols-3 gap-2">
          {[
            { k: "primary" as const, label: "رنگ اصلی" },
            { k: "accent" as const, label: "رنگ تأکیدی" },
            { k: "gold" as const, label: "رنگ طلایی" },
          ].map(({ k, label }) => (
            <label key={k} className="block">
              <span className={labelCls}>{label}</span>
              <div className="flex items-center gap-1.5">
                <input type="color" value={form[k]} onChange={set(k)} className="h-10 w-12 rounded-lg border border-slate-200 p-0.5 cursor-pointer" />
                <input dir="ltr" value={form[k]} onChange={set(k)} className="flex-1 h-10 rounded-lg border border-slate-200 bg-slate-50 px-2 text-[11px] font-mono outline-none focus:border-pink-400" />
              </div>
            </label>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          <label className="block"><span className={labelCls}>فونت</span><select value={form.font} onChange={set("font")} className={inputCls}>{FONTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}</select></label>
          <label className="block"><span className={labelCls}>گردی گوشه‌ها (px)</span><input type="number" min={0} max={48} dir="ltr" value={form.radius} onChange={set("radius")} className={`${inputCls} text-left`} /></label>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        {/* پیش‌نمایش زنده کارت قالب */}
        <div className="rounded-3xl overflow-hidden border border-slate-200/70 shadow-lg">
          <div className="h-9 flex items-center px-4 gap-2" style={{ background: form.primary }}>
            <span className="h-3 w-3 rounded-full" style={{ background: form.accent }} />
            <span className="h-3 w-3 rounded-full" style={{ background: form.gold }} />
            <span className="mx-auto text-[10px] font-black" style={{ color: form.gold }}>پیش‌نمایش قالب</span>
          </div>
          <div className="p-4" style={{ fontFamily: `'${form.font}', Tahoma, sans-serif`, background: "#f3f4f8" }}>
            <div className="rounded-2xl overflow-hidden shadow" style={{ borderRadius: Number(form.radius) || 0 }}>
              <div className="flex items-center justify-between px-3 h-12" style={{ background: form.primary }}>
                <b style={{ color: "#fff", fontSize: 13 }}>Mini<span style={{ color: form.accent }}>Moda</span></b>
                <span className="rounded-full px-3 h-7 leading-7 text-[9px] font-black" style={{ background: form.accent, color: "#fff" }}>خرید</span>
              </div>
              <div className="bg-white p-3">
                <div className="rounded-xl h-20 flex items-center px-4" style={{ background: `linear-gradient(135deg, ${form.primary}, ${form.accent}66)`, borderRadius: Number(form.radius) || 0 }}>
                  <b className="text-white text-[13px] leading-5">کالکشن جدید ۲۰۲۶</b>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] font-black" style={{ color: form.primary }}>۳,۸۹۰,۰۰۰ تومان</span>
                  <span className="text-[9px] font-bold" style={{ color: form.gold }}>★ ۴.۹</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && <p className="rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-bold px-4 py-3">{error}</p>}
        <button type="submit" disabled={loading} className="w-full h-13 py-4 rounded-2xl bg-gradient-to-l from-pink-600 to-rose-600 text-white font-black shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          نصب قالب جدید
        </button>
        <p className="text-[9px] text-slate-400 leading-5 flex items-start gap-1"><Eye className="h-4 w-4 shrink-0 text-sky-500" />قالب پس از نصب غیرفعال می‌ماند؛ هر زمان از «مدیریت قالب‌ها» آن را فعال کنید. پیش‌نمایش زنده بالا دقیقاً همان توکن‌ها را در مینیاتور نشان می‌دهد.</p>
      </div>
    </form>
  );
}
