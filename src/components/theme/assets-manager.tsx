"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UploadCloud, Search, Trash2, Loader2, FileImage, FileCode2, FileText, File as FileIcon, Copy, Check, RefreshCw, HardDrive } from "lucide-react";

type Asset = { path: string; name: string; size: number; type: string; modified: string; used?: boolean };
type ListResponse = { files: Asset[]; totalBytes: number; count: number; unusedCount?: number };

const fmtSize = (n: number) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
const typeIcon = (t: string) => {
  if (["jpg", "jpeg", "png", "webp", "gif", "svg", "avif"].includes(t)) return FileImage;
  if (["css", "js", "svg"].includes(t)) return FileCode2;
  if (["pdf", "ttf", "otf", "woff", "woff2"].includes(t)) return FileText;
  return FileIcon;
};

export default function AssetsManager() {
  const [data, setData] = useState<ListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [onlyUnused, setOnlyUnused] = useState(false);
  const [copied, setCopied] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/theme/assets", { cache: "no-store" });
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch {
      setError("بارگذاری فهرست فایل‌ها ناموفق بود — با حساب مدیر وارد شده‌اید؟");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const upload = async (files: FileList | File[]) => {
    if (!files.length) return;
    setUploading(true); setError("");
    const fd = new FormData();
    for (const f of Array.from(files)) fd.append("files", f);
    try {
      const res = await fetch("/api/admin/theme/assets", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) setError(json.error ?? "آپلود ناموفق بود.");
      await load();
    } catch {
      setError("آپلود با خطا مواجه شد.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const remove = async (path: string) => {
    if (!window.confirm(`فایل ${path} حذف شود؟`)) return;
    const res = await fetch(`/api/admin/theme/assets?path=${encodeURIComponent(path)}`, { method: "DELETE" });
    if (!res.ok) { const j = await res.json().catch(() => ({})); setError(j.error ?? "حذف ناموفق بود."); return; }
    load();
  };

  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(`/${text}`); } catch { /* ignore */ }
    setCopied(text);
    window.setTimeout(() => setCopied(""), 1600);
  };

  const filtered = useMemo(() => (data?.files ?? [])
    .filter((f) => !onlyUnused || f.used === false)
    .filter((f) => !query || f.name.toLowerCase().includes(query.toLowerCase()) || f.path.toLowerCase().includes(query.toLowerCase())), [data, query, onlyUnused]);

  return (
    <div className="mt-4 space-y-4">
      {/* نوار آمار و آپلود */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); upload(e.dataTransfer.files); }}
        className={`rounded-3xl border-2 border-dashed p-5 text-center transition ${dragOver ? "border-pink-400 bg-pink-50/50" : "border-slate-200 bg-white"}`}
      >
        {uploading ? <Loader2 className="h-10 w-10 mx-auto text-pink-600 animate-spin" /> : <UploadCloud className="h-10 w-10 mx-auto text-slate-300" strokeWidth={1.5} />}
        <p className="mt-2 text-[12px] font-black text-[#14264a]">فایل‌ها را اینجا رها کنید یا</p>
        <button type="button" onClick={() => fileRef.current?.click()} className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-pink-600 text-white px-6 h-11 text-[12px] font-bold hover:bg-pink-500 transition"><UploadCloud className="h-5 w-5" /> انتخاب فایل از رایانه</button>
        <input ref={fileRef} type="file" multiple accept="image/*,.css,.js,.svg,.woff2,.woff,.ttf,.pdf" className="hidden" onChange={(e) => e.target.files && upload(e.target.files)} />
        <p className="mt-1.5 text-[9px] text-slate-400">حداکثر ۵ مگابیت برای هر فایل · jpg, png, webp, svg, css, js, فونت‌ها، pdf</p>
        {data && <p className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-50 rounded-full px-3 py-1"><HardDrive className="h-4 w-4" /> {data.count.toLocaleString("fa-IR")} فایل · {fmtSize(data.totalBytes)} در مجموع</p>}
      </div>

      {error && <p className="rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-bold px-4 py-2.5 flex items-center justify-between gap-3">{error}<button onClick={load} className="flex items-center gap-1 text-rose-400"><RefreshCw className="h-4 w-4" /> تلاش مجدد</button></p>}

      {/* جستجو + گرید */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative w-full sm:w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="جستجوی فایل..." className="w-full h-11 rounded-2xl border border-slate-200 bg-white pr-10 pl-3 text-[12px] outline-none focus:border-pink-400" />
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setOnlyUnused((v) => !v)} className={`rounded-full px-3 h-9 text-[10px] font-bold border transition ${onlyUnused ? "bg-amber-500 border-amber-500 text-white" : "bg-white border-slate-200 text-slate-600"}`}>فقط استفاده‌نشده‌ها ({(data?.unusedCount ?? 0).toLocaleString("fa-IR")})</button>
          <p className="text-[10px] text-slate-400">{filtered.length.toLocaleString("fa-IR")} فایل</p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 text-[12px]"><Loader2 className="h-8 w-8 mx-auto animate-spin text-pink-500" />در حال بارگذاری...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {filtered.map((f) => {
            const Icon = typeIcon(f.type);
            const isImage = ["jpg", "jpeg", "png", "webp", "gif", "svg", "avif"].includes(f.type);
            const deletable = f.path.startsWith("uploads/");
            return (
              <div key={f.path} className="rounded-2xl border border-slate-200/70 bg-white overflow-hidden shadow-sm group">
                <div className="relative h-24 sm:h-28 bg-slate-50 grid place-items-center overflow-hidden">
                  {isImage ? <img src={`/${f.path}`} alt={f.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} /> : <Icon className="h-9 w-9 text-slate-300" strokeWidth={1.4} />}
                  {f.used === false && <span className="absolute top-1 right-1 rounded-md bg-amber-500 text-white text-[7px] font-black px-1.5 py-0.5">بدون استفاده</span>}
                </div>
                <div className="p-2">
                  <p dir="ltr" className="text-[8px] font-mono text-slate-500 truncate text-left" title={f.path}>{f.name}</p>
                  <p className="text-[8px] text-slate-400 mt-0.5">{fmtSize(f.size)} · {new Date(f.modified).toLocaleDateString("fa-IR")}</p>
                  <div className="mt-1.5 flex items-center justify-between gap-1">
                    <button onClick={() => copy(f.path)} title="کپی آدرس فایل" className="h-7 px-2 rounded-lg border border-slate-200 text-[8px] font-bold text-slate-500 hover:border-pink-400 hover:text-pink-600 flex items-center gap-1 transition">{copied === f.path ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />} آدرس</button>
                    {deletable && <button onClick={() => remove(f.path)} title="حذف فایل" className="h-7 w-7 grid place-items-center rounded-lg border border-rose-100 text-rose-400 hover:bg-rose-50 transition"><Trash2 className="h-3.5 w-3.5" /></button>}
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <div className="col-span-full py-14 text-center text-slate-400 text-[11px]">فایلی با این مشخصات یافت نشد.</div>}
        </div>
      )}
      <p className="text-[9px] text-slate-400 leading-5">نکته: فایل‌های داخل public/images و public/downloads فقط خواندنی هستند و امکان حذف از این‌جا را ندارند (محافظت از فایل‌های اصلی سایت). فقط فایل‌های آپلودی شما در پوشه uploads قابل حذف‌اند.</p>
    </div>
  );
}
