"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import {
  UploadCloud, Star, Trash2, RefreshCw, Loader2, GripVertical, ImageIcon, AlertCircle,
} from "lucide-react";

const MAX_IMAGES = 10;

/**
 * گالری تصاویر محصول — حداکثر ۱۰ تصویر
 * تصویر اول = تصویر اصلی محصول
 * ترتیب با Drag & Drop تغییر می‌کند
 */
export default function ImageManager({
  images,
  onChange,
  productId,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  productId?: number;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const canAdd = images.length < MAX_IMAGES;

  const upload = useCallback(async (files: FileList | File[], replacingIndex?: number) => {
    const list = Array.from(files);
    if (list.length === 0) return;
    setError("");

    const slotsLeft = MAX_IMAGES - (replacingIndex !== undefined ? images.length - 1 : images.length);
    if (list.length > slotsLeft) {
      setError(`فقط ${slotsLeft} جای خالی باقی مانده (حداکثر ${MAX_IMAGES} تصویر).`);
      return;
    }

    const fd = new FormData();
    for (const f of list) fd.append("files", f);
    if (productId) fd.append("productId", String(productId));

    setUploading(true);
    try {
      const res = await fetch("/api/admin/products/images", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "آپلود ناموفق بود."); return; }
      const urls: string[] = data.urls ?? [];
      if (replacingIndex !== undefined && urls.length > 0) {
        const next = [...images];
        next[replacingIndex] = urls[0];
        onChange(next);
      } else {
        onChange([...images, ...urls].slice(0, MAX_IMAGES));
      }
    } catch {
      setError("آپلود با خطا مواجه شد؛ دوباره تلاش کنید.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
      if (replaceRef.current) replaceRef.current.value = "";
    }
  }, [images, onChange, productId]);

  const remove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const setMain = (index: number) => {
    if (index === 0) return;
    const next = [...images];
    const [picked] = next.splice(index, 1);
    next.unshift(picked);
    onChange(next);
  };

  const onDrop = (target: number) => {
    if (dragIndex === null || dragIndex === target) { setDragIndex(null); setOverIndex(null); return; }
    const next = [...images];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(target, 0, moved);
    onChange(next);
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3">
      {/* سربرگ گالری */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-[11px] font-black text-[#14264a] flex items-center gap-1.5"><ImageIcon className="h-4 w-4 text-pink-600" /> تصاویر محصول <span className="text-slate-400">({images.length} از {MAX_IMAGES})</span></p>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => fileRef.current?.click()} disabled={!canAdd || uploading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#14264a] text-amber-300 px-3 h-9 text-[10px] font-black hover:bg-[#1d3a63] transition disabled:opacity-40">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            {uploading ? "در حال آپلود..." : "افزودن تصویر"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && upload(e.target.files)} />
          {/* ورودی جایگزینی تصویر */}
          <input ref={replaceRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.length && replaceIndex !== null) upload(e.target.files, replaceIndex); setReplaceIndex(null); }} />
        </div>
      </div>

      {/* نوار پیشرفت ۱۰ تصویر */}
      <div className="mt-2 h-1.5 rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-l from-pink-500 to-rose-400 transition-all duration-500" style={{ width: `${(images.length / MAX_IMAGES) * 100}%` }} />
      </div>

      {error && <p className="mt-2 flex items-center gap-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold px-3 py-2"><AlertCircle className="h-4 w-4 shrink-0" />{error}</p>}

      {/* گرید تصاویر */}
      {images.length > 0 ? (
        <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-5 gap-2">
          {images.map((src, i) => (
            <div
              key={`${src}-${i}`}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => { e.preventDefault(); setOverIndex(i); }}
              onDrop={() => onDrop(i)}
              onDragEnd={() => { setDragIndex(null); setOverIndex(null); }}
              className={`relative group rounded-xl overflow-hidden border-2 bg-white transition-all select-none ${
                i === 0 ? "border-amber-400 ring-2 ring-amber-300" : overIndex === i ? "border-pink-500 scale-105" : "border-transparent"
              } ${dragIndex === i ? "opacity-40" : ""}`}
            >
              <div className="relative aspect-[4/5]">
                <Image src={src} alt={`تصویر ${i + 1}`} fill sizes="120px" className="object-cover" unoptimized={src.startsWith("http")} />
              </div>
              {/* دستگیره جابه‌جایی */}
              <span className="absolute top-1 right-1 h-6 w-6 grid place-items-center rounded-md bg-black/45 text-white/80 cursor-grab active:cursor-grabbing" title="کشیدن برای تغییر ترتیب"><GripVertical className="h-4 w-4" /></span>
              {/* نشان تصویر اصلی */}
              {i === 0 && <span className="absolute top-1 left-1 rounded-md bg-amber-400 text-[#14264a] text-[7px] font-black px-1.5 py-0.5">اصلی</span>}
              {/* اکشن‌ها */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 to-transparent p-1 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {i !== 0 && (
                  <button type="button" onClick={() => setMain(i)} title="تبدیل به تصویر اصلی" className="h-7 w-7 grid place-items-center rounded-lg bg-amber-400 text-[#14264a] hover:bg-amber-300 transition"><Star className="h-4 w-4" /></button>
                )}
                <button type="button" onClick={() => { setReplaceIndex(i); replaceRef.current?.click(); }} title="جایگزینی تصویر" className="h-7 w-7 grid place-items-center rounded-lg bg-sky-500 text-white hover:bg-sky-400 transition"><RefreshCw className="h-4 w-4" /></button>
                <button type="button" onClick={() => remove(i)} title="حذف تصویر" className="h-7 w-7 grid place-items-center rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition"><Trash2 className="h-4 w-4" /></button>
              </div>
              <span className="absolute bottom-1 right-1 text-[8px] font-black text-white/70 bg-black/40 rounded px-1">{i + 1}</span>
            </div>
          ))}
          {/* اسلات افزودن سریع */}
          {canAdd && (
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="aspect-[4/5] rounded-xl border-2 border-dashed border-slate-300 grid place-items-center text-slate-400 hover:border-pink-400 hover:text-pink-500 transition">
              <span className="flex flex-col items-center gap-1"><UploadCloud className="h-7 w-7" /><span className="text-[9px] font-bold">افزودن</span></span>
            </button>
          )}
        </div>
      ) : (
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="mt-3 w-full aspect-[16/7] rounded-2xl border-2 border-dashed border-slate-300 grid place-items-center text-slate-400 hover:border-pink-400 hover:text-pink-500 transition">
          <span className="flex flex-col items-center gap-1.5"><UploadCloud className="h-9 w-9" /><span className="text-[11px] font-black">تصاویر محصول را بکشید و رها کنید یا کلیک کنید</span><span className="text-[8px]">تا {MAX_IMAGES} تصویر — jpg، png، webp، gif، avif (هر کدام حداکثر ۵ مگابایت)</span></span>
        </button>
      )}
      <p className="mt-2 text-[8px] text-slate-400">تصویر اول به‌عنوان تصویر اصلی در کاتالوگ و صفحه محصول نمایش داده می‌شود. ترتیب تصاویر (و تصویر اصلی) با کشیدن و رها کردن تغییر می‌کند.</p>
    </div>
  );
}
