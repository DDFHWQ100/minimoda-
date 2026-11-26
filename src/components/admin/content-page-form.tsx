"use client";

import { useState } from "react";
import Link from "next/link";
import { Save, Loader2, CheckCircle2 } from "lucide-react";

export type ContentPageInitial = { id: number; title: string; slug: string; body: string } | null;

export default function ContentPageForm({ editing }: { editing: ContentPageInitial }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true); setError(""); setDone(false);
    try {
      const res = await fetch("/api/admin/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "pages", action: "save",
          id: editing?.id ?? 0,
          values: { title: fd.get("title"), slug: fd.get("slug"), body: fd.get("body") },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.error ?? "ذخیره ناموفق بود."); return; }
      setDone(true);
      window.location.href = "/admin/content-pages";
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white shadow-sm p-4 sm:p-5">
      <h2 className="text-[12px] font-black text-[#14264a]">{editing ? `ویرایش: ${editing.title}` : "ساخت صفحه جدید"}</h2>
      <form onSubmit={submit} className="mt-2 space-y-2">
        <label className="block"><span className="text-[9px] font-bold text-slate-500 mb-1 block">عنوان صفحه *</span><input name="title" required defaultValue={editing?.title ?? ""} className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[12px] outline-none focus:border-pink-400" /></label>
        <label className="block"><span className="text-[9px] font-bold text-slate-500 mb-1 block">اسلاگ (انگلیسی)</span><input name="slug" dir="ltr" defaultValue={editing?.slug ?? ""} placeholder="about" className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[12px] font-mono outline-none focus:border-pink-400 text-left" /></label>
        <label className="block"><span className="text-[9px] font-bold text-slate-500 mb-1 block">متن صفحه * (پاراگراف‌ها با خط خالی جدا شوند)</span><textarea name="body" required defaultValue={editing?.body ?? ""} rows={8} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-[12px] leading-7 outline-none focus:border-pink-400 resize-y" /></label>
        {error && <p className="rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold px-3 py-2">{error}</p>}
        {done && <p className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600"><CheckCircle2 className="h-4 w-4" /> ذخیره شد</p>}
        <button type="submit" disabled={loading} className="w-full h-11 rounded-2xl bg-[#14264a] text-amber-300 text-[11px] font-black hover:bg-[#1d3a63] transition disabled:opacity-50 flex items-center justify-center gap-2">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{editing ? "ذخیره تغییرات صفحه" : "انتشار صفحه"}</button>
        {editing && <Link href="/admin/content-pages" className="block text-center text-[10px] font-bold text-slate-400 hover:text-rose-500">انصراف از ویرایش</Link>}
      </form>
    </div>
  );
}
