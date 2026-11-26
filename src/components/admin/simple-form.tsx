"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, PlusCircle } from "lucide-react";

export type SimpleField = {
  name: string;
  label: string;
  type?: "text" | "number" | "select" | "textarea" | "date" | "email" | "tel";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  dir?: "ltr" | "rtl";
  full?: boolean;
};

/**
 * فرم عمومی ساخت رکورد — به /api/admin/manage پست می‌کند
 * با props.entity نوع موجودیت و فیلدها مشخص می‌شود
 */
export default function SimpleForm({
  title,
  entity,
  fields,
  submitLabel = "ذخیره",
  note,
}: {
  title: string;
  entity: string;
  fields: SimpleField[];
  submitLabel?: string;
  note?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true); setError(""); setDone(false);
    const fd = new FormData(form);
    const values: Record<string, string> = {};
    for (const [k, v] of fd.entries()) values[k] = String(v);
    try {
      const res = await fetch("/api/admin/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity, action: "create", values }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setError(data.error ?? "ثبت ناموفق بود.");
      else { setDone(true); form.reset(); router.refresh(); setTimeout(() => setDone(false), 2500); }
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full h-10 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-pink-400 outline-none px-3 text-[12px] transition";
  const labelCls = "text-[9px] font-bold text-slate-500 mb-1 block";

  return (
    <form onSubmit={submit} className="rounded-3xl border border-slate-200/70 bg-white shadow-sm p-4 sm:p-5 h-max">
      <h2 className="flex items-center gap-2 text-[12px] font-black text-[#14264a]"><PlusCircle className="h-4 w-4 text-pink-600" /> {title}</h2>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {fields.map((f) => (
          <label key={f.name} className={`block ${f.full || f.type === "textarea" ? "col-span-2" : ""}`}>
            <span className={labelCls}>{f.label}{f.required && " *"}</span>
            {f.type === "select" ? (
              <select name={f.name} required={f.required} className={inputCls} defaultValue={f.options?.[0]?.value}>
                {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : f.type === "textarea" ? (
              <textarea name={f.name} required={f.required} placeholder={f.placeholder} rows={3} className="w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-pink-400 outline-none p-3 text-[12px] leading-6 transition resize-y" />
            ) : (
              <input name={f.name} type={f.type ?? "text"} required={f.required} dir={f.dir} placeholder={f.placeholder} className={inputCls} />
            )}
          </label>
        ))}
      </div>
      {error && <p className="mt-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold px-3 py-2">{error}</p>}
      {done && <p className="mt-2 text-[10px] font-bold text-emerald-600">ثبت شد ✓</p>}
      <button type="submit" disabled={loading} className="mt-3 w-full h-11 rounded-2xl bg-[#14264a] text-amber-300 text-[11px] font-black hover:bg-[#1d3a63] transition disabled:opacity-50 flex items-center justify-center gap-2">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {submitLabel}
      </button>
      {note && <p className="mt-2 text-[8px] text-slate-400 leading-4">{note}</p>}
    </form>
  );
}
