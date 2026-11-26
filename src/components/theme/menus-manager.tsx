"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Loader2, Save, X, CornerDownLeft, Star } from "lucide-react";

export type MenuRow = { id: number; location: string; label: string; href: string; parentId: number | null; sort: number; enabled: boolean; highlight: boolean };

const LOCATIONS = [
  { value: "main", label: "منوی اصلی (هدر)" },
  { value: "footer_quick", label: "فوتر — دسترسی سریع" },
  { value: "footer_service", label: "فوتر — خدمات مشتریان" },
];

export default function MenusManager({ items }: { items: MenuRow[] }) {
  const router = useRouter();
  const [location, setLocation] = useState("main");
  const [form, setForm] = useState({ id: 0, label: "", href: "/", parentId: 0, highlight: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const post = async (payload: Record<string, unknown>) => {
    const res = await fetch("/api/admin/theme", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error ?? "عملیات ناموفق بود.");
    router.refresh();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await post({ action: "saveMenuItem", ...form, location, parentId: form.parentId || null });
      setForm({ id: 0, label: "", href: "/", parentId: 0, highlight: false });
    } catch (err) { setError(err instanceof Error ? err.message : "خطا"); } finally { setLoading(false); }
  };

  const act = async (payload: Record<string, unknown>) => { setError(""); try { await post(payload); } catch (err) { setError(err instanceof Error ? err.message : "خطا"); } };

  const inLoc = items.filter((m) => m.location === location);
  const roots = inLoc.filter((m) => !m.parentId).sort((a, b) => a.sort - b.sort);
  const childrenOf = (id: number) => inLoc.filter((m) => m.parentId === id).sort((a, b) => a.sort - b.sort);

  const Row = ({ m, depth }: { m: MenuRow; depth: number }) => (
    <li className={`flex items-center gap-2 px-3 py-2 hover:bg-slate-50/60 transition ${m.enabled ? "" : "opacity-50"}`} style={{ paddingRight: 12 + depth * 24 }}>
      {depth > 0 && <CornerDownLeft className="h-4 w-4 text-slate-300 shrink-0" />}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-black text-[#14264a] flex items-center gap-1.5">{m.label}{m.highlight && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}</p>
        <p dir="ltr" className="text-[8px] text-slate-400 font-mono truncate text-left">{m.href}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => act({ action: "moveMenuItem", id: m.id, dir: "up" })} aria-label="بالا" className="h-8 w-8 grid place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-pink-400"><ArrowUp className="h-4 w-4" /></button>
        <button onClick={() => act({ action: "moveMenuItem", id: m.id, dir: "down" })} aria-label="پایین" className="h-8 w-8 grid place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-pink-400"><ArrowDown className="h-4 w-4" /></button>
        <button onClick={() => act({ action: "toggleMenuItem", id: m.id })} aria-label="نمایش/پنهان" className="h-8 w-8 grid place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-pink-400">{m.enabled ? <Eye className="h-4 w-4 text-emerald-600" /> : <EyeOff className="h-4 w-4" />}</button>
        <button onClick={() => setForm({ id: m.id, label: m.label, href: m.href, parentId: m.parentId ?? 0, highlight: m.highlight })} aria-label="ویرایش" className="h-8 w-8 grid place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-pink-400 hover:text-pink-600"><Pencil className="h-4 w-4" /></button>
        <button onClick={() => window.confirm(`«${m.label}» و زیرمنوهایش حذف شود؟`) && act({ action: "deleteMenuItem", id: m.id })} aria-label="حذف" className="h-8 w-8 grid place-items-center rounded-lg border border-rose-100 text-rose-400 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
      </div>
    </li>
  );

  return (
    <div className="mt-4 grid lg:grid-cols-5 gap-4 items-start">
      <div className="lg:col-span-3 rounded-3xl border border-slate-200/70 bg-white shadow-sm overflow-hidden">
        <div className="flex gap-1 p-2 border-b border-slate-100 bg-slate-50/60 overflow-x-auto">
          {LOCATIONS.map((l) => (
            <button key={l.value} onClick={() => { setLocation(l.value); setForm({ id: 0, label: "", href: "/", parentId: 0, highlight: false }); }} className={`shrink-0 rounded-xl px-3 h-9 text-[10px] font-bold transition ${location === l.value ? "bg-[#14264a] text-amber-300" : "text-slate-500 hover:bg-white"}`}>{l.label} <span className="opacity-60">({items.filter((m) => m.location === l.value).length})</span></button>
          ))}
        </div>
        <ul className="divide-y divide-slate-100">
          {roots.map((r) => (
            <div key={r.id}>
              <Row m={r} depth={0} />
              {childrenOf(r.id).map((c) => <Row key={c.id} m={c} depth={1} />)}
            </div>
          ))}
          {roots.length === 0 && <li className="py-10 text-center text-[11px] text-slate-400">آیتمی در این منو نیست.</li>}
        </ul>
      </div>

      <form onSubmit={submit} className="lg:col-span-2 rounded-3xl border border-slate-200/70 bg-white p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[12px] font-black text-[#14264a]">{form.id ? `ویرایش «${form.label}»` : "افزودن آیتم منو"}</h2>
          {form.id > 0 && <button type="button" onClick={() => setForm({ id: 0, label: "", href: "/", parentId: 0, highlight: false })} className="p-1 text-slate-400 hover:text-rose-500" aria-label="انصراف"><X className="h-5 w-5" /></button>}
        </div>
        <p className="text-[9px] text-slate-400 -mt-2">مکان: {LOCATIONS.find((l) => l.value === location)?.label}</p>
        <input required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="عنوان آیتم (مثلاً: دخترانه)" className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[12px] outline-none focus:border-pink-400" />
        <input required dir="ltr" value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} placeholder="/products?cat=girls" className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[11px] font-mono outline-none focus:border-pink-400 text-left" />
        {location === "main" && (
          <>
            <select value={form.parentId} onChange={(e) => setForm({ ...form, parentId: Number(e.target.value) })} className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[12px] outline-none focus:border-pink-400">
              <option value={0}>آیتم سطح اول (بدون والد)</option>
              {roots.filter((r) => r.id !== form.id).map((r) => <option key={r.id} value={r.id}>زیرمنوی «{r.label}»</option>)}
            </select>
            <label className="flex items-center gap-2 text-[11px] font-bold text-slate-600 cursor-pointer"><input type="checkbox" checked={form.highlight} onChange={(e) => setForm({ ...form, highlight: e.target.checked })} className="h-4 w-4 accent-pink-600" /> نمایش برجسته (پس‌زمینه صورتی مثل «خانه»)</label>
          </>
        )}
        {error && <p className="rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold px-3 py-2">{error}</p>}
        <button type="submit" disabled={loading} className="w-full h-11 rounded-2xl bg-[#14264a] text-amber-300 text-[12px] font-black hover:bg-[#1d3a63] transition disabled:opacity-50 flex items-center justify-center gap-2">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : form.id ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{form.id ? "ذخیره تغییرات" : "افزودن به منو"}</button>
        <p className="text-[9px] text-slate-400 leading-5">تغییرات بلافاصله در هدر/فوتر سایت اعمال می‌شود. آیتم‌های غیرفعال نمایش داده نمی‌شوند.</p>
      </form>
    </div>
  );
}
