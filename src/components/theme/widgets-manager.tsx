"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquareDashed, Plus, Save, Trash2, Eye, EyeOff, Loader2, X } from "lucide-react";

export type WidgetRow = { id: number; type: string; title: string; config: string; enabled: boolean };

type PopupCfg = { heading: string; body: string; cta: string; href: string; delay: number; showOnce: boolean };
const EMPTY: PopupCfg = { heading: "", body: "", cta: "مشاهده", href: "/products", delay: 4, showOnce: true };

export default function WidgetsManager({ widgets }: { widgets: WidgetRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<{ id: number; title: string; cfg: PopupCfg } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const post = async (payload: Record<string, unknown>) => {
    const res = await fetch("/api/admin/theme", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(d.error ?? "خطا");
    router.refresh();
  };
  const act = async (p: Record<string, unknown>) => { setError(""); try { await post(p); } catch (e) { setError(e instanceof Error ? e.message : "خطا"); } };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setLoading(true); setError("");
    try { await post({ action: "saveWidget", id: editing.id, type: "popup", title: editing.title, config: editing.cfg, enabled: true }); setEditing(null); }
    catch (err) { setError(err instanceof Error ? err.message : "خطا"); } finally { setLoading(false); }
  };

  const parse = (w: WidgetRow): PopupCfg => { try { return { ...EMPTY, ...JSON.parse(w.config) }; } catch { return EMPTY; } };
  const inputCls = "w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[12px] outline-none focus:border-pink-400";

  return (
    <div className="mt-6 grid lg:grid-cols-5 gap-4 items-start">
      <div className="lg:col-span-3 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-black text-[#14264a] flex items-center gap-2"><MessageSquareDashed className="h-4 w-4 text-pink-600" /> ابزارک‌ها و پاپ‌آپ‌ها ({widgets.length})</h2>
          <button onClick={() => setEditing({ id: 0, title: "پاپ‌آپ جدید", cfg: EMPTY })} className="inline-flex items-center gap-1.5 rounded-xl bg-pink-600 text-white px-3 h-9 text-[10px] font-black hover:bg-pink-500"><Plus className="h-4 w-4" /> پاپ‌آپ جدید</button>
        </div>
        {widgets.map((w) => { const c = parse(w); return (
          <article key={w.id} className={`rounded-2xl border bg-white p-3 shadow-sm flex items-center gap-3 ${w.enabled ? "border-emerald-200" : "border-slate-200/70 opacity-60"}`}>
            <span className="h-11 w-11 shrink-0 rounded-2xl bg-pink-50 grid place-items-center"><MessageSquareDashed className="h-5 w-5 text-pink-600" /></span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-black text-[#14264a]">{w.title} <span className="text-[8px] font-bold text-slate-400 mr-1">({w.type === "popup" ? "پاپ‌آپ" : w.type})</span></p>
              <p className="text-[9px] text-slate-500 line-clamp-1">{c.heading} — {c.body}</p>
              <p className="text-[8px] text-slate-400">نمایش بعد از {c.delay} ثانیه · {c.showOnce ? "فقط یک بار برای هر بازدیدکننده" : "هر بار"}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => act({ action: "toggleWidget", id: w.id })} className="h-8 w-8 grid place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-pink-400" aria-label="فعال/غیرفعال">{w.enabled ? <Eye className="h-4 w-4 text-emerald-600" /> : <EyeOff className="h-4 w-4" />}</button>
              <button onClick={() => setEditing({ id: w.id, title: w.title, cfg: c })} className="h-8 px-2.5 rounded-lg border border-slate-200 text-[9px] font-bold text-slate-600 hover:border-pink-400">ویرایش</button>
              <button onClick={() => window.confirm(`ابزارک «${w.title}» حذف شود؟`) && act({ action: "deleteWidget", id: w.id })} className="h-8 w-8 grid place-items-center rounded-lg border border-rose-100 text-rose-400 hover:bg-rose-50" aria-label="حذف"><Trash2 className="h-4 w-4" /></button>
            </div>
          </article>
        ); })}
        {widgets.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-[11px] text-slate-400">ابزارکی تعریف نشده است.</div>}
        {error && <p className="rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold px-3 py-2">{error}</p>}
      </div>

      {editing && (
        <form onSubmit={save} className="lg:col-span-2 rounded-3xl border border-slate-200/70 bg-white p-4 sm:p-5 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between"><h3 className="text-[12px] font-black text-[#14264a]">{editing.id ? "ویرایش پاپ‌آپ" : "پاپ‌آپ جدید"}</h3><button type="button" onClick={() => setEditing(null)} className="p-1 text-slate-400 hover:text-rose-500"><X className="h-5 w-5" /></button></div>
          <input required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="نام داخلی (برای شما)" className={inputCls} />
          <input required value={editing.cfg.heading} onChange={(e) => setEditing({ ...editing, cfg: { ...editing.cfg, heading: e.target.value } })} placeholder="تیتر پاپ‌آپ" className={inputCls} />
          <textarea value={editing.cfg.body} onChange={(e) => setEditing({ ...editing, cfg: { ...editing.cfg, body: e.target.value } })} rows={3} placeholder="متن پیام" className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-[12px] leading-6 outline-none focus:border-pink-400 resize-none" />
          <div className="grid grid-cols-2 gap-2">
            <input value={editing.cfg.cta} onChange={(e) => setEditing({ ...editing, cfg: { ...editing.cfg, cta: e.target.value } })} placeholder="متن دکمه" className={inputCls} />
            <input dir="ltr" value={editing.cfg.href} onChange={(e) => setEditing({ ...editing, cfg: { ...editing.cfg, href: e.target.value } })} placeholder="/products" className={`${inputCls} font-mono text-left text-[11px]`} />
          </div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <label className="block"><span className="text-[9px] font-bold text-slate-500">تأخیر نمایش (ثانیه)</span><input type="number" min={0} max={60} dir="ltr" value={editing.cfg.delay} onChange={(e) => setEditing({ ...editing, cfg: { ...editing.cfg, delay: Number(e.target.value) } })} className={inputCls} /></label>
            <label className="flex items-center gap-2 text-[11px] font-bold text-slate-600 pt-4 cursor-pointer"><input type="checkbox" checked={editing.cfg.showOnce} onChange={(e) => setEditing({ ...editing, cfg: { ...editing.cfg, showOnce: e.target.checked } })} className="h-4 w-4 accent-pink-600" /> فقط یک بار نمایش</label>
          </div>
          <button type="submit" disabled={loading} className="w-full h-11 rounded-2xl bg-[#14264a] text-amber-300 text-[12px] font-black hover:bg-[#1d3a63] disabled:opacity-50 flex items-center justify-center gap-2">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} ذخیره پاپ‌آپ</button>
          <p className="text-[8px] text-slate-400">پاپ‌آپ فعال روی همه صفحات سایت نمایش داده می‌شود. برای امنیت، HTML و اسکریپت پذیرفته نمی‌شود.</p>
        </form>
      )}
    </div>
  );
}
