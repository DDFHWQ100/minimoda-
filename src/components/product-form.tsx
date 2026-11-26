"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, CheckCircle2, ImagePlus, PackagePlus } from "lucide-react";
import ImageManager from "@/components/image-manager";
import { EMPTY_PRODUCT_FORM, type ProductFormInitial } from "@/lib/product-form-initial";

type Category = { id: number; name: string };

const EMPTY = EMPTY_PRODUCT_FORM;

const inputCls = "w-full h-11 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-pink-400 outline-none px-4 text-[13px] transition";
const labelCls = "text-[11px] font-bold text-slate-500 mb-1 block";

export default function ProductForm({ categories, initial }: { categories: Category[]; initial?: Partial<ProductFormInitial> }) {
  const router = useRouter();
  const isEdit = initial?.id !== undefined && initial.id !== null;
  const [form, setForm] = useState<ProductFormInitial>({ ...EMPTY, ...initial, categoryId: initial?.categoryId ?? String(categories[0]?.id ?? "") });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const set = (k: keyof ProductFormInitial) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.images.length === 0) { setError("حداقل یک تصویر برای محصول اضافه کنید."); return; }
    if (form.images.length > 10) { setError("هر محصول حداکثر ۱۰ تصویر می‌تواند داشته باشد."); return; }
    setLoading(true);
    try {
      const payload = {
        ...(isEdit ? { id: initial!.id } : {}),
        name: form.name,
        description: form.description,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
        stock: Number(form.stock) || 0,
        categoryId: Number(form.categoryId) || null,
        sizes: form.sizes,
        colors: form.colors,
        images: form.images, // آرایه — ترتیب همان ترتیب نمایش است
        isNew: form.isNew,
        isOffer: form.isOffer,
        isFeatured: form.isFeatured,
      };
      const res = await fetch("/api/admin/products", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setError(data.error ?? "ذخیره محصول ناموفق بود.");
      else {
        setDone(true);
        if (isEdit) { router.refresh(); setTimeout(() => setDone(false), 2500); }
        else router.push("/admin/products");
      }
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  };

  const discountOk = !form.discountPrice || !form.price || Number(form.discountPrice) < Number(form.price);

  return (
    <form onSubmit={submit} className="mt-4 grid lg:grid-cols-5 gap-4">
      <div className="lg:col-span-3 rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-sm space-y-3">
        <h2 className="font-black text-[#14264a] flex items-center gap-2">{isEdit ? <Save className="h-5 w-5 text-pink-600" /> : <PackagePlus className="h-5 w-5 text-pink-600" />} اطلاعات اصلی محصول</h2>
        <label className="block"><span className={labelCls}>نام محصول *</span><input required value={form.name} onChange={set("name")} placeholder="پیراهن مجلسی سلطنتی..." className={inputCls} /></label>
        <label className="block"><span className={labelCls}>توضیحات</span><textarea value={form.description} onChange={set("description")} rows={4} placeholder="توضیح کامل درباره جنس، دوخت و کاربرد محصول..." className="w-full rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-pink-400 outline-none p-4 text-[12px] leading-6 transition resize-y min-h-20" /></label>
        <div className="grid sm:grid-cols-3 gap-3">
          <label className="block"><span className={labelCls}>قیمت (تومان) *</span><input required type="number" min={0} dir="ltr" value={form.price} onChange={set("price")} placeholder="1500000" className={`${inputCls} text-left`} /></label>
          <label className="block"><span className={labelCls}>قیمت تخفیف‌دار</span><input type="number" min={0} dir="ltr" value={form.discountPrice} onChange={set("discountPrice")} placeholder="اختیاری" className={`${inputCls} text-left ${discountOk ? "" : "border-rose-400 bg-rose-50"}`} /></label>
          <label className="block"><span className={labelCls}>موجودی انبار</span><input required type="number" min={0} dir="ltr" value={form.stock} onChange={set("stock")} className={`${inputCls} text-left`} /></label>
        </div>
        {!discountOk && <p className="text-[9px] font-bold text-rose-500 -mt-1">قیمت تخفیف‌دار باید کمتر از قیمت اصلی باشد.</p>}
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block"><span className={labelCls}>دسته‌بندی</span><select value={form.categoryId} onChange={set("categoryId")} className={inputCls}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
          <label className="block"><span className={labelCls}>سایزها (با کاما جدا کنید)</span><input dir="ltr" value={form.sizes} onChange={set("sizes")} placeholder="4-5, 6-7" className={`${inputCls} text-left`} /></label>
        </div>
        <div>
          <span className={labelCls}>رنگ‌ها — هر خط: نام،hex</span>
          <textarea dir="ltr" value={form.colors} onChange={set("colors")} rows={3} placeholder={"صورتی,#f2a7c3\nسرمه‌ای,#22344f"} className="w-full rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-pink-400 outline-none p-3 text-[10px] leading-6 transition resize-y font-mono text-left" />
        </div>
        <div className="flex flex-wrap gap-4 pt-1">
          {[
            { k: "isNew" as const, label: "جدید" },
            { k: "isOffer" as const, label: "دارای تخفیف / پیشنهاد ویژه" },
            { k: "isFeatured" as const, label: "کالای ویژه" },
          ].map(({ k, label }) => (
            <label key={k} className="flex items-center gap-2 text-[12px] font-bold text-slate-600 cursor-pointer select-none">
              <input type="checkbox" checked={form[k] as boolean} onChange={set(k)} className="h-5 w-5 accent-pink-600" />{label}
            </label>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ImageManager images={form.images} onChange={(images) => setForm((f) => ({ ...f, images }))} productId={isEdit ? initial!.id : undefined} />

        {error && <p className="rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-bold px-4 py-3">{error}</p>}
        {done && <p className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600"><CheckCircle2 className="h-4 w-4" /> ذخیره شد</p>}
        <button type="submit" disabled={loading || (!discountOk && !!form.discountPrice)} className="w-full h-13 py-4 rounded-2xl bg-gradient-to-l from-emerald-600 to-teal-600 text-white font-black shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {isEdit ? "ذخیره تغییرات محصول" : "افزودن محصول به فروشگاه"}
        </button>
      </div>
    </form>
  );
}
