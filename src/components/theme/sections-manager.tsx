"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, CheckCircle2, ArrowUp, ArrowDown, Eye, EyeOff, GripVertical } from "lucide-react";
import { toFaDigits } from "@/lib/format";

type Section = { id: string; label: string; enabled: boolean; sort: number };

const DESCRIPTIONS: Record<string, string> = {
  hero: "اسلایدر تمام‌عرض ROYAL JUNIOR و پیشنهادهای ویژه",
  categories: "آیکن‌های گرد دسته‌بندی‌های اصلی فروشگاه",
  banners: "چهار بنر تبلیغاتی (قابل ویرایش از «بنرها»)",
  trust: "اعتمادسازی: ارسال سریع، پرداخت امن، کالای اصل…",
  festival: "بنر جشنواره + سایدبار پرفروش‌ترین‌های هفته",
  blog: "ردیف مقاله‌های پربیننده وبلاگ مد کودک",
  products: "تب‌های پرفروش‌ترین / تخفیف‌دار / تازه‌رسیده",
  duo: "دو بنر دوگانه پایینی (زمستانی و مجلسی)",
};

export default function SectionsManager({ sections }: { sections: Section[] }) {
  const router = useRouter();
  const [items, setItems] = useState(sections);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const dirty = JSON.stringify(items) !== JSON.stringify(sections);

  const toggle = (id: string) => setItems((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  const move = (id: string, dir: -1 | 1) =>
    setItems((prev) => {
      const next = [...prev];
      const i = next.findIndex((s) => s.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next.map((s, idx) => ({ ...s, sort: idx + 1 }));
    });

  const save = async () => {
    setLoading(true); setError(""); setDone(false);
    try {
      const res = await fetch("/api/admin/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "saveSections",
          sections: items.map((s) => ({ id: s.id, enabled: s.enabled })),
          order: items.map((s) => s.id),
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

  const enabledCount = items.filter((s) => s.enabled).length;

  return (
    <div className="mt-4 grid lg:grid-cols-5 gap-4 items-start">
      <div className="lg:col-span-3 rounded-3xl border border-slate-200/70 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/60">
          <p className="text-[11px] font-black text-[#14264a]">{toFaDigits(enabledCount)} بخش از {toFaDigits(items.length)} بخش فعال است</p>
          {dirty && <span className="text-[9px] font-bold text-amber-700 bg-amber-100 rounded-full px-2.5 py-1">تغییرات ذخیره‌نشده دارید</span>}
        </div>
        <ul className="divide-y divide-slate-100">
          {items.map((s, i) => (
            <li key={s.id} className="flex items-center gap-2 px-3 sm:px-4 py-3 hover:bg-slate-50/60 transition">
              <span className="text-slate-300 cursor-grab" title="ترتیب با فلش‌ها تغییر می‌کند"><GripVertical className="h-5 w-5" /></span>
              <span className="h-7 w-7 grid place-items-center rounded-lg bg-slate-100 text-[10px] font-black text-slate-500">{toFaDigits(i + 1)}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] sm:text-[12px] font-black text-[#14264a]">{s.label}</p>
                <p className="text-[9px] text-slate-400 leading-4">{DESCRIPTIONS[s.id] ?? ""}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => move(s.id, -1)} disabled={i === 0} aria-label="بالا" className="h-8 w-8 grid place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-pink-400 hover:text-pink-600 disabled:opacity-30 transition"><ArrowUp className="h-4 w-4" /></button>
                <button onClick={() => move(s.id, 1)} disabled={i === items.length - 1} aria-label="پایین" className="h-8 w-8 grid place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-pink-400 hover:text-pink-600 disabled:opacity-30 transition"><ArrowDown className="h-4 w-4" /></button>
                <button onClick={() => toggle(s.id)} role="switch" aria-checked={s.enabled} aria-label={s.enabled ? "غیرفعال‌سازی" : "فعال‌سازی"}
                  className={`relative h-7 w-12 rounded-full transition-colors ${s.enabled ? "bg-emerald-500" : "bg-slate-300"}`}>
                  <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${s.enabled ? "right-1" : "right-6"}`} />
                </button>
                <span className="hidden sm:grid h-7 w-7 place-items-center">{s.enabled ? <Eye className="h-4 w-4 text-emerald-500" /> : <EyeOff className="h-4 w-4 text-slate-400" />}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:col-span-2 space-y-3">
        <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-4 text-[10px] leading-6 text-amber-900">
          <p className="font-black text-[11px]">چطور کار می‌کند؟</p>
          <p className="mt-1">هر تغییر بعد از «ذخیره» بلافاصله روی سایت اعمال می‌شود؛ نیازی به انتشار جداگانه نیست. ترتیب اعمال‌شده دقیقاً همان ترتیب نمایش در صفحه اصلی است.</p>
        </div>
        {error && <p className="rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-bold px-4 py-2.5">{error}</p>}
        <button onClick={save} disabled={loading || !dirty} className="w-full h-13 py-4 rounded-2xl bg-[#14264a] text-amber-300 font-black shadow-lg hover:bg-[#1d3a63] transition disabled:opacity-40 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          ذخیره و اعمال روی سایت
        </button>
        {done && <p className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-600"><CheckCircle2 className="h-4 w-4" /> اجزای صفحه اصلی به‌روز شد</p>}
        <a href="/" target="_blank" className="block text-center text-[10px] font-bold text-slate-400 hover:text-pink-600 transition">مشاهده صفحه اصلی با همین تنظیمات ←</a>
      </div>
    </div>
  );
}
