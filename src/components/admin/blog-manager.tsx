"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, X, FilePenLine, Eye } from "lucide-react";

export type BlogInitial = {
  id?: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  tag: string;
};

const EMPTY: BlogInitial = { title: "", excerpt: "", content: "", image: "https://images.pexels.com/photos/35607631/pexels-photo-35607631.jpeg", tag: "مد و پوشاک" };
const inputCls = "w-full h-11 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-pink-400 outline-none px-3 text-[12px] transition";
const labelCls = "text-[9px] font-bold text-slate-500 mb-1 block";

export default function BlogManager({ initial }: { initial: BlogInitial | null }) {
  const router = useRouter();
  const isEdit = initial?.id !== undefined;
  const [form, setForm] = useState<BlogInitial>(initial ?? EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { setForm(initial ?? EMPTY); }, [initial]);

  const set = (k: keyof BlogInitial) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: "blog", action: isEdit ? "update" : "create", ...form, id: initial?.id }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "ذخیره ناموفق بود.");
      else { setForm(EMPTY); router.push("/admin/blog"); router.refresh(); }
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-3xl border border-slate-200/70 bg-white p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[12px] font-black text-[#14264a] flex items-center gap-2"><FilePenLine className="h-4 w-4 text-pink-600" />{isEdit ? `ویرایش مقاله #${initial?.id}` : "نوشتن مقاله جدید"}</h2>
        {isEdit && <a href="/admin/blog" className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100" aria-label="انصراف"><X className="h-5 w-5" /></a>}
      </div>
      <input required value={form.title} onChange={set("title")} placeholder="عنوان مقاله..." className={inputCls} />
      <div className="grid grid-cols-2 gap-2">
        <input value={form.tag} onChange={set("tag")} placeholder="برچسب (مثلاً ترند مد)" className={inputCls} />
        <input dir="ltr" value={form.image} onChange={set("image")} placeholder="آدرس تصویر" className={`${inputCls} text-left text-[10px] font-mono`} />
      </div>
      <input value={form.excerpt} onChange={set("excerpt")} placeholder="چکیده یک‌خطی مقاله..." className={inputCls} />
      <textarea required value={form.content} onChange={set("content")} rows={9} placeholder="متن کامل مقاله (پاراگراف‌ها را با خط خالی جدا کنید)..." className="w-full rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-pink-400 outline-none p-3 text-[12px] leading-7 transition resize-y" />
      {error && <p className="rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold px-3 py-2">{error}</p>}
      <button type="submit" disabled={loading} className="w-full h-12 rounded-2xl bg-[#14264a] text-amber-300 font-black text-[12px] hover:bg-[#1d3a63] transition disabled:opacity-50 flex items-center justify-center gap-2">{loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}{isEdit ? "ذخیره تغییرات مقاله" : "انتشار مقاله"}</button>
    </form>
  );
}
