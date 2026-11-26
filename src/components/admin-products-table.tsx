"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Trash2, Star, Flame, Sparkles, Loader2, ExternalLink, PackageOpen, Pencil } from "lucide-react";
import { formatPrice, toFaDigits } from "@/lib/format";

export type AdminProductRow = {
  id: number;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  salesCount: number;
  image: string;
  isFeatured: boolean;
  isOffer: boolean;
  isNew: boolean;
  categoryName: string;
};

export default function AdminProductsTable({ rows }: { rows: AdminProductRow[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const patch = async (id: number, data: Record<string, unknown>) => {
    setBusy(id);
    setError("");
    const res = await fetch("/api/admin/products", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...data }) });
    setBusy(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "ذخیره نشد؛ دوباره تلاش کنید.");
      return;
    }
    startTransition(() => router.refresh());
  };

  const remove = async (id: number, name: string) => {
    if (!window.confirm(`آیا از حذف «${name}» مطمئن هستید؟`)) return;
    setBusy(id);
    setError("");
    const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    setBusy(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "حذف نشد؛ دوباره تلاش کنید.");
      return;
    }
    startTransition(() => router.refresh());
  };

  if (rows.length === 0) {
    return (
      <div className="mt-6 text-center py-14 rounded-3xl border border-dashed border-slate-300 bg-white">
        <PackageOpen className="h-12 w-12 text-slate-300 mx-auto" />
        <p className="mt-2 font-bold text-slate-500">محصولی در فروشگاه وجود ندارد.</p>
        <Link href="/admin/products/new" className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-pink-600 text-white px-5 h-10 text-[12px] font-bold">افزودن اولین محصول</Link>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-[11px] font-bold text-amber-800">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-amber-500 hover:text-amber-700 transition" aria-label="بستن">✕</button>
        </div>
      )}
      <div className="mt-4 overflow-x-auto rounded-3xl border border-slate-200/70 bg-white shadow-sm">
      <table className="w-full text-[11px] min-w-[760px]">
        <thead className="bg-slate-50 text-slate-500 text-right">
          <tr>
            <th className="py-3 px-4 font-black">محصول</th>
            <th className="py-3 px-2 font-black">دسته</th>
            <th className="py-3 px-2 font-black">قیمت</th>
            <th className="py-3 px-2 font-black">موجودی</th>
            <th className="py-3 px-2 font-black">فروش</th>
            <th className="py-3 px-2 font-black">وضعیت</th>
            <th className="py-3 px-4 font-black">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((p) => (
            <tr key={p.id} className="hover:bg-slate-50/60">
              <td className="py-2 px-4">
                <div className="flex items-center gap-2">
                  <div className="relative h-14 w-11 rounded-lg overflow-hidden bg-[#f6f4ef] shrink-0"><Image src={p.image} alt={p.name} fill sizes="50px" className="object-cover" /></div>
                  <Link href={`/products/${p.slug}`} className="font-bold text-slate-700 line-clamp-2 max-w-52 hover:text-pink-700 flex items-center gap-1">{p.name}<ExternalLink className="h-3 w-3 shrink-0 opacity-50" /></Link>
                </div>
              </td>
              <td className="py-2 px-2 text-slate-500">{p.categoryName}</td>
              <td className="py-2 px-2 whitespace-nowrap">
                {p.discountPrice ? (
                  <span><span className="block text-[9px] text-slate-400 line-through">{formatPrice(p.price)}</span><span className="font-bold text-pink-700">{formatPrice(p.discountPrice)}</span></span>
                ) : (
                  <span className="font-bold text-[#14264a]">{formatPrice(p.price)}</span>
                )}
              </td>
              <td className="py-2 px-2">
                <span className={`font-black ${p.stock <= 10 ? "text-rose-600" : "text-emerald-600"}`}>{toFaDigits(p.stock)}</span>
              </td>
              <td className="py-2 px-2 text-slate-500">{toFaDigits(p.salesCount)}</td>
              <td className="py-2 px-2">
                <div className="flex flex-wrap gap-1 max-w-28">
                  {p.isOffer && <span className="rounded bg-pink-100 text-pink-700 text-[8px] font-bold px-1.5 py-0.5">تخفیف</span>}
                  {p.isNew && <span className="rounded bg-emerald-100 text-emerald-700 text-[8px] font-bold px-1.5 py-0.5">جدید</span>}
                  {p.isFeatured && <span className="rounded bg-amber-100 text-amber-700 text-[8px] font-bold px-1.5 py-0.5">ویژه</span>}
                </div>
              </td>
              <td className="py-2 px-4">
                <div className="flex items-center gap-1">
                  <Link href={`/admin/products/${p.id}/edit`} title="ویرایش محصول و تصاویر" className="p-1.5 rounded-lg text-slate-400 hover:text-pink-600 hover:bg-pink-50 transition"><Pencil className="h-4 w-4" /></Link>
                  <button title="ویژه/عادی" onClick={() => patch(p.id, { isFeatured: !p.isFeatured })} disabled={busy === p.id || pending} className={`p-1.5 rounded-lg transition ${p.isFeatured ? "bg-amber-100 text-amber-600" : "text-slate-300 hover:bg-slate-100"}`}><Star className="h-4 w-4" /></button>
                  <button title="تخفیف‌دار/عادی" onClick={() => patch(p.id, { isOffer: !p.isOffer })} disabled={busy === p.id || pending} className={`p-1.5 rounded-lg transition ${p.isOffer ? "bg-pink-100 text-pink-600" : "text-slate-300 hover:bg-slate-100"}`}><Flame className="h-4 w-4" /></button>
                  <button title="جدید/عادی" onClick={() => patch(p.id, { isNew: !p.isNew })} disabled={busy === p.id || pending} className={`p-1.5 rounded-lg transition ${p.isNew ? "bg-emerald-100 text-emerald-600" : "text-slate-300 hover:bg-slate-100"}`}><Sparkles className="h-4 w-4" /></button>
                  <button title="حذف محصول" onClick={() => remove(p.id, p.name)} disabled={busy === p.id || pending} className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition">
                    {busy === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}
