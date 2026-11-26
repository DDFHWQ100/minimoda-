"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, CheckCircle2, Undo2, ShoppingCart, Star } from "lucide-react";

const FONTS = [
  { value: "Vazirmatn", label: "وزیرمتن (پیش‌فرض)" },
  { value: "Estedad", label: "استعداد" },
  { value: "Noto Kufi Arabic", label: "نوتو کوفی عربی" },
  { value: "Harmattan", label: "هارمتان" },
  { value: "Lalezar", label: "لاله‌زار (تیترهای نمایشی)" },
];
const RADIUS_PRESETS = [
  { value: "4", label: "تیز" },
  { value: "12", label: "مدرن" },
  { value: "18", label: "کلاسیک" },
  { value: "26", label: "گرد و دوستانه" },
  { value: "36", label: "خیلی گرد" },
];

export default function CustomizeForm({ initial }: { initial: { primary: string; accent: string; gold: string; font: string; radius: string } }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true); setError(""); setDone(false);
    try {
      const res = await fetch("/api/admin/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "saveSettings",
          note: "سفارشی‌سازی طراحی (رنگ/فونت/گردی)",
          entries: {
            "theme.primary": form.primary,
            "theme.accent": form.accent,
            "theme.gold": form.gold,
            "theme.font": form.font,
            "theme.radius": String(Math.max(0, Math.min(48, Number(form.radius) || 18))),
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

  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const radius = Math.max(0, Math.min(48, Number(form.radius) || 0));

  return (
    <form onSubmit={save} className="mt-4 grid lg:grid-cols-5 gap-4 items-start">
      {/* فرم تنظیمات */}
      <div className="lg:col-span-2 rounded-3xl border border-slate-200/70 bg-white p-4 sm:p-5 shadow-sm space-y-4">
        {/* رنگ اصلی */}
        {[
          { key: "primary" as const, label: "رنگ اصلی (سرصفحه، فوتر، دکمه سبد)", hint: "هویت اصلی برند" },
          { key: "accent" as const, label: "رنگ تأکیدی (دکمه‌های خرید و لینک‌ها)", hint: "فراخوانی به اقدام" },
          { key: "gold" as const, label: "رنگ طلایی (هایلایت و امتیازها)", hint: "جزئیات لوکس" },
        ].map(({ key, label, hint }) => (
          <label key={key} className="block">
            <span className="text-[11px] font-black text-slate-500">{label}</span>
            <div className="mt-1.5 flex items-center gap-2">
              <input type="color" value={form[key]} onChange={set(key)} className="h-11 w-16 rounded-xl border border-slate-200 p-1 cursor-pointer bg-white" aria-label={label} />
              <input type="text" dir="ltr" value={form[key]} onChange={set(key)} pattern="^#[0-9a-fA-F]{6}$" className="flex-1 h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[12px] font-mono outline-none focus:border-pink-400" />
              <span className="hidden sm:block h-8 w-8 rounded-lg border border-slate-200" style={{ background: form[key] }} />
            </div>
            <small className="mt-1 block text-[9px] text-slate-400">{hint}</small>
          </label>
        ))}

        {/* فونت */}
        <label className="block">
          <span className="text-[11px] font-black text-slate-500">فونت بدنه</span>
          <select value={form.font} onChange={set("font")} className="mt-1.5 w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[12px] font-bold outline-none focus:border-pink-400">
            {FONTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </label>

        {/* گردی گوشه */}
        <div>
          <span className="text-[11px] font-black text-slate-500">گردی گوشه‌ها — {radius}px</span>
          <input type="range" min={0} max={48} step={2} value={radius} onChange={set("radius")} className="mt-2 w-full accent-pink-600" dir="ltr" />
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {RADIUS_PRESETS.map((p) => (
              <button key={p.value} type="button" onClick={() => setForm((f) => ({ ...f, radius: p.value }))} className={`rounded-full px-3 h-7 text-[10px] font-bold border transition ${form.radius === p.value ? "bg-[#14264a] text-amber-300 border-[#14264a]" : "border-slate-200 text-slate-500 hover:border-pink-400"}`}>{p.label}</button>
            ))}
          </div>
        </div>

        {error && <p className="rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-bold px-3 py-2">{error}</p>}
        <div className="flex items-center gap-2 pt-1">
          <button type="submit" disabled={loading || !dirty} className="flex-1 h-12 rounded-2xl bg-gradient-to-l from-pink-600 to-rose-600 text-white font-black text-[13px] shadow-lg shadow-pink-600/25 hover:shadow-xl transition-all disabled:opacity-40 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            ذخیره و اعمال روی سایت
          </button>
          <button type="button" onClick={() => setForm(initial)} disabled={!dirty} title="بازگشت به حالت ذخیره‌شده" className="h-12 w-12 grid place-items-center rounded-2xl border border-slate-200 text-slate-400 hover:text-pink-600 hover:border-pink-400 transition disabled:opacity-30"><Undo2 className="h-5 w-5" /></button>
        </div>
        {done && <p className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600"><CheckCircle2 className="h-4 w-4" /> ذخیره و اعمال شد — سایت را تازه کنید</p>}
      </div>

      {/* پیش‌نمایش زنده */}
      <div className="lg:col-span-3">
        <div className="rounded-3xl overflow-hidden border border-slate-200/70 shadow-lg" style={{ fontFamily: `'${form.font}', Tahoma, sans-serif` }}>
          {/* نوار مرورگر */}
          <div className="flex items-center gap-2 bg-slate-800 px-4 h-9">
            <span className="h-3 w-3 rounded-full bg-rose-400" /><span className="h-3 w-3 rounded-full bg-amber-400" /><span className="h-3 w-3 rounded-full bg-emerald-400" />
            <span dir="ltr" className="mx-auto text-[10px] text-slate-400 font-mono">minimoda.ir</span>
          </div>
          {/* پیش‌نمایش سایت */}
          <div className="bg-[#f3f4f8] p-3 sm:p-5 select-none pointer-events-none">
            <div className="rounded-2xl overflow-hidden shadow-md">
              <div className="h-7 flex items-center px-4 text-[9px] font-bold text-white/90" style={{ background: form.primary }}>ارسال رایگان سفارش‌های بالای ۲ میلیون تومان</div>
              <div className="bg-white flex items-center justify-between px-4 h-14 border-b border-slate-100">
                <div className="flex items-center gap-2"><div className="h-8 w-8 rounded-xl grid place-items-center font-black text-[#14264a] text-sm" style={{ background: `linear-gradient(135deg, ${form.gold}, #f59e0b)` }}>M</div><b className="text-sm" style={{ color: form.primary }}>Mini<span style={{ color: form.accent }}>Moda</span></b></div>
                <div className="h-8 w-40 rounded-full border border-slate-200 bg-slate-50 hidden sm:block" />
                <div className="h-9 w-16 rounded-xl grid place-items-center" style={{ background: form.primary }}><ShoppingCart className="h-4 w-4" style={{ color: form.gold }} /></div>
              </div>
              <div className="bg-white p-3">
                <div className="rounded-xl h-28 sm:h-36 flex items-center px-5" style={{ background: `linear-gradient(135deg, ${form.primary} 0%, ${form.accent}55 130%)`, borderRadius: radius }}>
                  <div>
                    <small className="text-[8px] font-bold" style={{ color: form.gold }}>کالکشن سلطنتی ۲۰۲۶</small>
                    <p className="text-white font-black text-base sm:text-xl leading-7">ROYAL<br/>JUNIOR</p>
                    <span className="inline-flex mt-1.5 items-center rounded-full px-3 h-7 text-[9px] font-black text-[#3d2b0a]" style={{ background: `linear-gradient(135deg, ${form.gold}, #f59e0b)` }}>مشاهده کالکشن</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-100 p-2" style={{ borderRadius: radius }}>
                  <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1"><Star className="h-3 w-3" style={{ color: form.gold, fill: form.gold }} />۴.۹ · ۱۲۸ نظر</span>
                  <div className="text-left">
                    <p className="text-[10px] font-black leading-4" style={{ color: form.primary }}>۳,۸۹۰,۰۰۰ تومان</p>
                    <span className="inline-block rounded-full px-3 h-6 leading-6 text-[8px] font-black text-white mt-0.5" style={{ background: form.accent, borderRadius: radius / 1.6 }}>افزودن به سبد</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-[9px] text-slate-400 mt-2">پیش‌نمایش زنده — با تغییر مقادیر، همین‌جا به‌روز می‌شود</p>
          </div>
        </div>
      </div>
    </form>
  );
}
