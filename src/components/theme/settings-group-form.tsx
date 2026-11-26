"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, CheckCircle2, Undo2 } from "lucide-react";

export type GroupField =
  | { key: string; label: string; type: "text" | "textarea" | "url" | "color" | "number"; hint?: string; dir?: "ltr" | "rtl"; min?: number; max?: number }
  | { key: string; label: string; type: "switch"; hint?: string }
  | { key: string; label: string; type: "select"; hint?: string; options: { value: string; label: string }[] }
  | { key: string; label: string; type: "range"; hint?: string; min: number; max: number; step?: number; unit?: string };

/**
 * فرم عمومی ویرایش گروهی از تنظیمات قالب — ذخیره در theme_settings از طریق saveSettings
 */
export default function SettingsGroupForm({
  title, icon, fields, initial, note, children,
}: {
  title: string; icon?: ReactNode; fields: GroupField[]; initial: Record<string, string>; note?: string; children?: ReactNode;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(fields.map((f) => [f.key, initial[f.key] ?? ""])));
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const dirty = fields.some((f) => (values[f.key] ?? "") !== (initial[f.key] ?? ""));
  const set = (k: string, v: string) => setValues((s) => ({ ...s, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setDone(false);
    try {
      const res = await fetch("/api/admin/theme", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "saveSettings", note: title, entries: values }) });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "ذخیره ناموفق بود.");
      else { setDone(true); router.refresh(); setTimeout(() => setDone(false), 2500); }
    } catch { setError("ارتباط با سرور برقرار نشد."); } finally { setLoading(false); }
  };

  const inputCls = "w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[12px] outline-none focus:border-pink-400 focus:bg-white transition";

  return (
    <form onSubmit={save} className="rounded-3xl border border-slate-200/70 bg-white p-4 sm:p-5 shadow-sm space-y-3">
      <h2 className="flex items-center gap-2 text-[12px] font-black text-[#14264a]">{icon}{title}</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {fields.map((f) => (
          <div key={f.key} className={f.type === "textarea" || f.type === "switch" ? "sm:col-span-2" : ""}>
            {f.type === "switch" ? (
              <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-3 cursor-pointer">
                <span className="text-[11px] font-bold text-slate-600">{f.label}{f.hint && <small className="block text-[9px] font-normal text-slate-400">{f.hint}</small>}</span>
                <button type="button" role="switch" aria-checked={values[f.key] === "true"} onClick={() => set(f.key, values[f.key] === "true" ? "false" : "true")} className={`relative h-7 w-12 rounded-full transition-colors shrink-0 ${values[f.key] === "true" ? "bg-emerald-500" : "bg-slate-300"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${values[f.key] === "true" ? "right-1" : "right-6"}`} /></button>
              </label>
            ) : (
              <label className="block">
                <span className="text-[10px] font-bold text-slate-500 mb-1 block">{f.label}{f.type === "range" && <b className="text-pink-600 mr-1">{values[f.key]}{f.unit ?? ""}</b>}</span>
                {f.type === "textarea" && <textarea value={values[f.key]} onChange={(e) => set(f.key, e.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-[12px] leading-6 outline-none focus:border-pink-400 focus:bg-white resize-y" />}
                {f.type === "select" && <select value={values[f.key]} onChange={(e) => set(f.key, e.target.value)} className={inputCls}>{f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>}
                {f.type === "range" && <input type="range" min={f.min} max={f.max} step={f.step ?? 1} value={Number(values[f.key]) || f.min} onChange={(e) => set(f.key, e.target.value)} className="w-full accent-pink-600" dir="ltr" />}
                {f.type === "color" && <div className="flex items-center gap-2"><input type="color" value={values[f.key] || "#000000"} onChange={(e) => set(f.key, e.target.value)} className="h-11 w-14 rounded-xl border border-slate-200 p-1 bg-white cursor-pointer" /><input dir="ltr" value={values[f.key]} onChange={(e) => set(f.key, e.target.value)} className={`${inputCls} font-mono text-left`} /></div>}
                {(f.type === "text" || f.type === "url" || f.type === "number") && <input type={f.type === "number" ? "number" : "text"} dir={f.dir ?? (f.type === "url" ? "ltr" : undefined)} min={f.type === "number" ? f.min : undefined} max={f.type === "number" ? f.max : undefined} value={values[f.key]} onChange={(e) => set(f.key, e.target.value)} className={`${inputCls} ${f.dir === "ltr" || f.type === "url" ? "text-left" : ""}`} />}
                {f.hint && <small className="mt-1 block text-[9px] text-slate-400">{f.hint}</small>}
              </label>
            )}
          </div>
        ))}
      </div>
      {children}
      {error && <p className="rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold px-3 py-2">{error}</p>}
      <div className="flex items-center gap-2">
        <button type="submit" disabled={loading || !dirty} className="flex-1 h-11 rounded-2xl bg-[#14264a] text-amber-300 text-[12px] font-black hover:bg-[#1d3a63] transition disabled:opacity-40 flex items-center justify-center gap-2">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} ذخیره و اعمال</button>
        <button type="button" onClick={() => setValues(Object.fromEntries(fields.map((f) => [f.key, initial[f.key] ?? ""])))} disabled={!dirty} className="h-11 w-11 grid place-items-center rounded-2xl border border-slate-200 text-slate-400 hover:text-pink-600 disabled:opacity-30" title="بازگشت"><Undo2 className="h-4 w-4" /></button>
      </div>
      {done && <p className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600"><CheckCircle2 className="h-4 w-4" /> ذخیره و روی سایت اعمال شد</p>}
      {note && <p className="text-[9px] text-slate-400 leading-5">{note}</p>}
    </form>
  );
}
