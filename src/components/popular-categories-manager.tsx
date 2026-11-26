"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Crown, Shirt, Sparkles, Baby, Gem, Footprints, ShoppingBag,
  Save, Loader2, CheckCircle2, Plus, Pencil, Trash2, ArrowUp, ArrowDown, LayoutGrid, Info,
} from "lucide-react";
import { toFaDigits } from "@/lib/format";

type Category = { id: number; name: string; slug: string; icon: string; description: string; sortOrder: number; showOnHome: boolean };
type IconName = "Crown" | "Shirt" | "Sparkles" | "Baby" | "Gem" | "Footprints" | "ShoppingBag";

const ICONS: Record<IconName, typeof Shirt> = { Crown, Shirt, Sparkles, Baby, Gem, Footprints, ShoppingBag };
const ICON_LABELS: Record<IconName, string> = { Crown: "تاج (دخترانه)", Shirt: "تیشرت (عمومی)", Sparkles: "ستاره (بچگانه)", Baby: "نوزاد", Gem: "الماس (مجلسی)", Footprints: "کفش", ShoppingBag: "کیف (اکسسوری)" };
const MAX = 30;

const inputCls = "w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[12px] outline-none focus:border-pink-400 transition";
const labelCls = "text-[10px] font-bold text-slate-500 mb-1 block";

export default function PopularCategoriesManager({ categories, enabled, rows }: { categories: Category[]; enabled: boolean; rows: number }) {
  const router = useRouter();
  const [sectionEnabled, setSectionEnabled] = useState(enabled);
  const [rowCount, setRowCount] = useState(rows);
  const [sectionSaving, setSectionSaving] = useState(false);
  const [sectionDone, setSectionDone] = useState(false);

  const [form, setForm] = useState({ name: "", slug: "", icon: "Shirt" as IconName, description: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [actionError, setActionError] = useState("");

  const popularCount = useMemo(() => categories.filter((c) => c.showOnHome).length, [categories]);
  const visibleLimit = rowCount * 10;
  const overflow = Math.max(0, popularCount - visibleLimit);

  const post = async (payload: Record<string, unknown>) => {
    const res = await fetch("/api/admin/popular-categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error ?? "عملیات ناموفق بود.");
    return data;
  };

  const saveSection = async () => {
    setSectionSaving(true); setSectionDone(false);
    try {
      await post({ action: "sectionSettings", enabled: sectionEnabled, rows: rowCount });
      setSectionDone(true); router.refresh(); setTimeout(() => setSectionDone(false), 2500);
    } finally {
      setSectionSaving(false);
    }
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true); setFormError("");
    try {
      await post({ action: "saveCategory", id: editingId ?? 0, ...form });
      setForm({ name: "", slug: "", icon: "Shirt", description: "" });
      setEditingId(null);
      router.refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "خطا");
    } finally {
      setFormLoading(false);
    }
  };

  const startEdit = (c: Category) => {
    setEditingId(c.id);
    setForm({ name: c.name, slug: c.slug, icon: (c.icon as IconName) || "Shirt", description: c.description });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggle = async (c: Category) => {
    setBusyId(c.id); setActionError("");
    try {
      await post({ action: "toggleCategory", id: c.id, showOnHome: !c.showOnHome });
      router.refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "خطا");
    } finally {
      setBusyId(null);
    }
  };

  const move = async (c: Category, dir: "up" | "down") => {
    setBusyId(c.id);
    try { await post({ action: "moveCategory", id: c.id, dir }); router.refresh(); } finally { setBusyId(null); }
  };

  const remove = async (c: Category) => {
    if (!window.confirm(`دسته «${c.name}» حذف شود؟ محصولات این دسته بدون دسته‌بندی باقی می‌مانند.`)) return;
    setBusyId(c.id); setActionError("");
    try { await post({ action: "deleteCategory", id: c.id }); router.refresh(); } catch (err) {
      setActionError(err instanceof Error ? err.message : "حذف ناموفق بود.");
    } finally { setBusyId(null); }
  };

  return (
    <div className="mt-4 space-y-4">
      {/* ════ تنظیمات بخش + افزودن/ویرایش ════ */}
      <div className="grid lg:grid-cols-2 gap-4 items-start">
        {/* تنظیمات کلی */}
        <div className="rounded-3xl border border-slate-200/70 bg-white p-4 sm:p-5 shadow-sm space-y-4">
          <h2 className="flex items-center gap-2 text-[12px] font-black text-[#14264a]"><LayoutGrid className="h-4 w-4 text-pink-600" /> نمایش بخش در سایت</h2>

          <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-3 cursor-pointer">
            <span className="text-[11px] font-bold text-slate-600">نمایش ردیف دسته‌بندی‌های محبوب در صفحه اصلی<small className="block text-[9px] font-normal text-slate-400">با خاموش کردن، کل ردیف آیکن‌ها از سایت مخفی می‌شود</small></span>
            <button type="button" role="switch" aria-checked={sectionEnabled} onClick={() => setSectionEnabled((v) => !v)} className={`relative h-7 w-12 rounded-full transition-colors shrink-0 ${sectionEnabled ? "bg-emerald-500" : "bg-slate-300"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${sectionEnabled ? "right-1" : "right-6"}`} /></button>
          </label>

          <div>
            <span className="text-[11px] font-black text-slate-500">تعداد ردیف‌های نمایش</span>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {[1, 2, 3].map((n) => (
                <button key={n} type="button" onClick={() => setRowCount(n)} className={`rounded-2xl border-2 h-16 flex flex-col items-center justify-center transition ${rowCount === n ? "border-pink-600 bg-pink-50/60" : "border-slate-200 hover:border-slate-300"}`}>
                  <b className="text-lg font-black text-[#14264a]">{toFaDigits(n)}</b>
                  <small className="text-[8px] text-slate-400">ردیف × ۱۰ ستون = {toFaDigits(n * 10)} دسته</small>
                </button>
              ))}
            </div>
            <p className="mt-2 flex items-start gap-1.5 text-[9px] text-slate-400 leading-5"><Info className="h-3.5 w-3.5 shrink-0 text-sky-500 mt-0.5" />حداکثر {toFaDigits(MAX)} دسته محبوب قابل فعال‌سازی است. هر ردیف ۱۰ دسته دارد؛ دسته‌های اضافه‌تر از سقف ردیف‌ها نمایش داده نمی‌شوند.</p>
          </div>

          {/* پیش‌نمایش زنده ساختار ردیف‌ها */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
            <p className="text-[9px] font-black text-slate-400 mb-1.5">پیش‌نمایش: {toFaDigits(popularCount)} دسته فعال، نمایش تا {toFaDigits(visibleLimit)} دسته در {toFaDigits(rowCount)} ردیف</p>
            {Array.from({ length: rowCount }).map((_, ri) => {
              const rowItems = categories.filter((c) => c.showOnHome).slice(ri * 10, ri * 10 + 10);
              return (
                <div key={ri} className="flex items-center gap-1 border-t border-dashed border-slate-200 pt-1.5 mt-1.5 first:border-0 first:pt-0 first:mt-0 overflow-hidden">
                  {rowItems.map((c) => { const Icon = ICONS[(c.icon as IconName) ?? "Shirt"] ?? Shirt; return (
                    <span key={c.id} title={c.name} className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 rounded-full bg-white border border-slate-200 grid place-items-center"><Icon className="h-4 w-4 text-[#14264a]" /></span>
                  ); })}
                  {rowItems.length === 0 && <span className="text-[9px] text-slate-300 py-2">ردیف خالی</span>}
                </div>
              );
            })}
          </div>

          {overflow > 0 && <p className="rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[9px] font-bold px-3 py-2">توجه: {toFaDigits(overflow)} دسته فعال به‌دلیل سقف {toFaDigits(visibleLimit)}تایی ردیف‌ها نمایش داده نمی‌شود. ردیف‌ها را بیشتر کنید یا دسته‌ها را غیرفعال کنید.</p>}

          <button onClick={saveSection} disabled={sectionSaving} className="w-full h-12 rounded-2xl bg-[#14264a] text-amber-300 font-black text-[12px] hover:bg-[#1d3a63] transition disabled:opacity-50 flex items-center justify-center gap-2">{sectionSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />} ذخیره تنظیمات بخش</button>
          {sectionDone && <p className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-emerald-600"><CheckCircle2 className="h-4 w-4" /> ذخیره و اعمال شد</p>}
        </div>

        {/* افزودن / ویرایش دسته */}
        <form onSubmit={submitForm} className="rounded-3xl border border-slate-200/70 bg-white p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[12px] font-black text-[#14264a]">{editingId ? `ویرایش دسته — ${form.name}` : "افزودن دسته‌بندی جدید"}</h2>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: "", slug: "", icon: "Shirt", description: "" }); }} className="text-[10px] font-bold text-slate-400 hover:text-rose-500">انصراف از ویرایش ✕</button>}
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            <label className="block"><span className={labelCls}>نام دسته *</span><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثلاً: زمستانی" className={inputCls} /></label>
            <label className="block"><span className={labelCls}>اسلاگ (انگلیسی)</span><input dir="ltr" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="winter-collection" className={`${inputCls} text-left font-mono`} /></label>
          </div>
          <div>
            <span className={labelCls}>آیکون دسته</span>
            <div className="grid grid-cols-7 gap-1">
              {(Object.keys(ICONS) as IconName[]).map((name) => { const Icon = ICONS[name]; return (
                <button key={name} type="button" title={ICON_LABELS[name]} onClick={() => setForm({ ...form, icon: name })} className={`h-11 rounded-xl border grid place-items-center transition ${form.icon === name ? "border-pink-600 bg-pink-50 text-pink-600" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}><Icon className="h-5 w-5" /></button>
              ); })}
            </div>
          </div>
          <label className="block"><span className={labelCls}>توضیح کوتاه (اختیاری)</span><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="مثلاً: کاپشن و پالتوهای زمستانی" className={inputCls} /></label>
          {formError && <p className="rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold px-3 py-2">{formError}</p>}
          <button type="submit" disabled={formLoading} className="w-full h-12 rounded-2xl bg-gradient-to-l from-pink-600 to-rose-600 text-white font-black text-[12px] shadow-lg shadow-pink-600/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2">{formLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : editingId ? <Save className="h-5 w-5" /> : <Plus className="h-5 w-5" />}{editingId ? "ذخیره تغییرات دسته" : "افزودن به فروشگاه"}</button>
          <p className="text-[9px] text-slate-400 leading-5">دسته جدید بلافاصله به‌عنوان «محبوب» در صفحه اصلی نمایش داده می‌شود (تا سقف {toFaDigits(MAX)} دسته) و در فیلتر کاتالوگ هم فعال است.</p>
        </form>
      </div>

      {actionError && <p className="rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-bold px-4 py-2.5">{actionError}</p>}

      {/* ════ فهرست همه دسته‌ها ════ */}
      <div className="rounded-3xl border border-slate-200/70 bg-white shadow-sm overflow-hidden">
        <header className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-100 bg-slate-50/60">
          <p className="text-[11px] font-black text-[#14264a]">{toFaDigits(categories.length)} دسته ثبت‌شده — {toFaDigits(popularCount)} تای آن‌ها محبوب هستند</p>
          <p className="text-[9px] text-slate-400 hidden sm:block">ترتیب: فلش‌ها · نمایش: کلید روشنایی</p>
        </header>
        <ul className="divide-y divide-slate-100">
          {categories.map((c, i) => {
            const Icon = ICONS[(c.icon as IconName) ?? "Shirt"] ?? Shirt;
            const busy = busyId === c.id;
            return (
              <li key={c.id} className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 hover:bg-slate-50/60 transition ${c.showOnHome ? "" : "opacity-60"}`}>
                <span className="text-[9px] text-slate-400 w-6 text-center font-black">{toFaDigits(i + 1)}</span>
                <span className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 grid place-items-center"><Icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#14264a]" /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] sm:text-[12px] font-black text-[#14264a] truncate">{c.name}</p>
                  <p dir="ltr" className="text-[8px] text-slate-400 font-mono truncate text-left">{c.slug}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => move(c, "up")} disabled={busy || i === 0} aria-label="بالا" className="h-8 w-8 grid place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-pink-400 hover:text-pink-600 disabled:opacity-25 transition"><ArrowUp className="h-4 w-4" /></button>
                  <button onClick={() => move(c, "down")} disabled={busy || i === categories.length - 1} aria-label="پایین" className="h-8 w-8 grid place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-pink-400 hover:text-pink-600 disabled:opacity-25 transition"><ArrowDown className="h-4 w-4" /></button>
                  <button onClick={() => toggle(c)} disabled={busy} role="switch" aria-checked={c.showOnHome} aria-label="نمایش/عدم نمایش" title={c.showOnHome ? "نمایش داده می‌شود" : "مخفی است"} className={`relative h-7 w-12 rounded-full transition-colors ${c.showOnHome ? "bg-emerald-500" : "bg-slate-300"}`}>{busy ? <Loader2 className="absolute top-1 right-1 h-5 w-5 animate-spin text-white" /> : <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${c.showOnHome ? "right-1" : "right-6"}`} />}</button>
                  <button onClick={() => startEdit(c)} aria-label="ویرایش" className="h-8 w-8 grid place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-pink-400 hover:text-pink-600 transition"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(c)} disabled={busy} aria-label="حذف" className="h-8 w-8 grid place-items-center rounded-lg border border-rose-100 text-rose-400 hover:bg-rose-50 transition"><Trash2 className="h-4 w-4" /></button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
