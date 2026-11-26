import Link from "next/link";
import { and, asc, desc, eq, ilike, isNotNull, gte, lte, type SQL } from "drizzle-orm";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, PackageSearch, X } from "lucide-react";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import ProductCard from "@/components/product-card";
import ProductListRow from "@/components/product-list-row";
import { getThemeSettings } from "@/lib/theme";
import { toFaDigits } from "@/lib/format";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "همه محصولات" };

const PAGE_SIZE = 12;
const SORTS: Record<string, { label: string; order: SQL }> = {
  sales: { label: "پرفروش‌ترین", order: desc(products.salesCount) },
  newest: { label: "جدیدترین", order: desc(products.createdAt) },
  "price-asc": { label: "ارزان‌ترین", order: asc(products.price) },
  "price-desc": { label: "گران‌ترین", order: desc(products.price) },
  rating: { label: "بهترین امتیاز", order: desc(products.rating) },
};

type SP = Record<string, string | string[] | undefined>;
const pick = (sp: SP, key: string): string | undefined => {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
};

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const cat = pick(sp, "cat");
  const q = pick(sp, "q")?.trim();
  const offer = pick(sp, "offer") === "1";
  const fresh = pick(sp, "new") === "1";
  const sortKey = pick(sp, "sort");
  const sort = sortKey && SORTS[sortKey] ? sortKey : "sales";
  const minP = Number(pick(sp, "min")) || undefined;
  const maxP = Number(pick(sp, "max")) || undefined;
  const page = Math.max(1, Number(pick(sp, "page")) || 1);

  const [cats, themeSettingsMap] = await Promise.all([
    db.select().from(categories).orderBy(categories.sortOrder),
    getThemeSettings().catch(() => ({}) as Record<string, string>),
  ]);
  const listLayout = themeSettingsMap["layout.products"] === "list";
  const activeCat = cat ? cats.find((c) => c.slug === cat) : undefined;

  const conditions: SQL[] = [];
  if (activeCat) conditions.push(eq(products.categoryId, activeCat.id));
  if (q) conditions.push(ilike(products.name, `%${q}%`));
  if (offer) conditions.push(isNotNull(products.discountPrice));
  if (fresh) conditions.push(eq(products.isNew, true));
  if (minP) conditions.push(gte(products.price, minP));
  if (maxP) conditions.push(lte(products.price, maxP));
  const where = conditions.length ? and(...conditions) : undefined;

  const all = await db.select().from(products).where(where).orderBy(SORTS[sort].order);
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const items = all.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (cat) params.set("cat", cat);
    if (q) params.set("q", q);
    if (offer) params.set("offer", "1");
    if (fresh) params.set("new", "1");
    if (sort !== "sales") params.set("sort", sort);
    if (minP) params.set("min", String(minP));
    if (maxP) params.set("max", String(maxP));
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return `/products${s ? `?${s}` : ""}`;
  };

  const chipHref = (key: string, value: string | undefined) => {
    const params = new URLSearchParams();
    const state: Record<string, string | undefined> = { cat, q, offer: offer ? "1" : undefined, new: fresh ? "1" : undefined, sort: sort !== "sales" ? sort : undefined, min: minP ? String(minP) : undefined, max: maxP ? String(maxP) : undefined };
    if (value === undefined) delete state[key]; else state[key] = value;
    for (const [k, v] of Object.entries(state)) if (v) params.set(k, v);
    const s = params.toString();
    return `/products${s ? `?${s}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6">
      {/* مسیر صفحه */}
      <nav className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-3">
        <Link href="/" className="hover:text-pink-600">خانه</Link>
        <ChevronLeft className="h-3.5 w-3.5" />
        <Link href="/products" className="hover:text-pink-600">محصولات</Link>
        {activeCat && (<><ChevronLeft className="h-3.5 w-3.5" /><span className="text-pink-700 font-bold">{activeCat.name}</span></>)}
        {q && (<><ChevronLeft className="h-3.5 w-3.5" /><span className="text-pink-700 font-bold">«{q}»</span></>)}
      </nav>

      <div className="flex gap-4 lg:gap-6">
        {/* ═══ فیلترها (دسکتاپ) ═══ */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-4">
          <form method="GET" className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <input type="hidden" name="cat" value={cat ?? ""} />
            <input type="hidden" name="q" value={q ?? ""} />
            <input type="hidden" name="sort" value={sort} />
            <h2 className="flex items-center gap-2 text-[13px] font-black text-[#14264a]"><SlidersHorizontal className="h-4 w-4" /> فیلتر محصولات</h2>

            <p className="mt-3 text-[11px] font-bold text-slate-500">محدوده قیمت (تومان)</p>
            <div className="mt-1.5 flex items-center gap-2">
              <input name="min" type="number" min={0} placeholder="از" defaultValue={minP} dir="ltr" className="w-full h-9 rounded-xl border border-slate-200 px-3 text-[12px] outline-none focus:border-pink-400" />
              <span className="text-slate-400">تا</span>
              <input name="max" type="number" min={0} placeholder="تا" defaultValue={maxP} dir="ltr" className="w-full h-9 rounded-xl border border-slate-200 px-3 text-[12px] outline-none focus:border-pink-400" />
            </div>

            <div className="mt-3 flex gap-2">
              <label className={`flex-1 flex items-center gap-1.5 rounded-xl border px-2 h-9 text-[11px] font-bold cursor-pointer transition ${offer ? "border-pink-500 bg-pink-50 text-pink-700" : "border-slate-200 text-slate-500"}`}>
                <input type="checkbox" name="offer" value="1" defaultChecked={offer} className="accent-pink-600" /> فقط تخفیف‌دار
              </label>
              <label className={`flex-1 flex items-center gap-1.5 rounded-xl border px-2 h-9 text-[11px] font-bold cursor-pointer transition ${fresh ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-500"}`}>
                <input type="checkbox" name="new" value="1" defaultChecked={fresh} className="accent-emerald-600" /> فقط جدید
              </label>
            </div>
            <button type="submit" className="mt-3 w-full h-10 rounded-xl bg-[#14264a] text-white text-[12px] font-bold hover:bg-[#1d3a63] transition">اعمال فیلترها</button>
            {(q || offer || fresh || minP || maxP || cat) && (
              <Link href="/products" className="mt-2 flex items-center justify-center gap-1 h-9 rounded-xl text-[11px] font-bold text-slate-400 hover:text-rose-500 transition"><X className="h-3.5 w-3.5" /> حذف همه فیلترها</Link>
            )}
          </form>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <h2 className="text-[13px] font-black text-[#14264a]">دسته‌بندی‌ها</h2>
            <ul className="mt-2 space-y-0.5 text-[12px]">
              <li>
                <Link href={chipHref("cat", undefined)} className={`flex items-center justify-between rounded-xl px-3 py-2 transition ${!cat ? "bg-[#14264a] text-amber-300 font-bold" : "text-slate-600 hover:bg-slate-50"}`}>همه محصولات</Link>
              </li>
              {cats.map((c) => (
                <li key={c.id}>
                  <Link href={chipHref("cat", c.slug)} className={`flex items-center justify-between rounded-xl px-3 py-2 transition ${cat === c.slug ? "bg-[#14264a] text-amber-300 font-bold" : "text-slate-600 hover:bg-slate-50"}`}>
                    {c.name}
                    <ChevronLeft className="h-4 w-4 opacity-60" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* ═══ نتایج ═══ */}
        <div className="flex-1 min-w-0">
          {/* نوار ابزار */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200/80 bg-white px-3 sm:px-4 h-12 sm:h-14 shadow-sm">
            <p className="text-[11px] sm:text-[12px] font-bold text-slate-600">
              <span className="text-pink-600 font-black">{toFaDigits(total)}</span> محصول {activeCat ? `در «${activeCat.name}»` : ""} {q ? `برای «${q}»` : ""} یافت شد
            </p>
            <form method="GET" className="flex items-center gap-2">
              {cat && <input type="hidden" name="cat" value={cat} />}
              {q && <input type="hidden" name="q" value={q} />}
              {offer && <input type="hidden" name="offer" value="1" />}
              {fresh && <input type="hidden" name="new" value="1" />}
              {minP !== undefined && <input type="hidden" name="min" value={minP} />}
              {maxP !== undefined && <input type="hidden" name="max" value={maxP} />}
              <label className="text-[10px] sm:text-[11px] text-slate-500 hidden sm:block">مرتب‌سازی:</label>
              <select name="sort" defaultValue={sort} className="h-8 sm:h-9 rounded-xl border border-slate-200 text-[11px] sm:text-[12px] font-bold text-[#14264a] px-2 outline-none">
                {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <button type="submit" className="h-8 sm:h-9 px-3 rounded-xl bg-slate-100 text-[11px] font-bold text-[#14264a] hover:bg-slate-200 transition">اعمال</button>
            </form>
          </div>

          {/* فیلترهای موبایل */}
          <div className="lg:hidden flex gap-1.5 overflow-x-auto no-scrollbar mt-2 pb-1">
            <Link href={chipHref("offer", offer ? undefined : "1")} className={`shrink-0 rounded-full px-3 h-8 inline-flex items-center text-[11px] font-bold border ${offer ? "bg-pink-600 border-pink-600 text-white" : "bg-white border-slate-200 text-slate-600"}`}>تخفیف‌دار</Link>
            <Link href={chipHref("new", fresh ? undefined : "1")} className={`shrink-0 rounded-full px-3 h-8 inline-flex items-center text-[11px] font-bold border ${fresh ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-slate-200 text-slate-600"}`}>جدیدها</Link>
            {cats.map((c) => (
              <Link key={c.id} href={chipHref("cat", cat === c.slug ? undefined : c.slug)} className={`shrink-0 rounded-full px-3 h-8 inline-flex items-center text-[11px] font-bold border ${cat === c.slug ? "bg-[#14264a] border-[#14264a] text-amber-300" : "bg-white border-slate-200 text-slate-600"}`}>{c.name}</Link>
            ))}
          </div>

          {/* گرید محصولات */}
          {items.length > 0 ? (
            listLayout ? (
              <div className="mt-3 space-y-2">
                {items.map((p) => <ProductListRow key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                {items.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )
          ) : (
            <div className="mt-10 flex flex-col items-center justify-center text-center py-16 rounded-3xl border border-dashed border-slate-300 bg-white/60">
              <PackageSearch className="h-14 w-14 text-slate-300" strokeWidth={1.4} />
              <h2 className="mt-3 font-black text-[#14264a]">محصولی یافت نشد</h2>
              <p className="mt-1 text-[12px] text-slate-500 max-w-60">عبارت دیگری جستجو کنید یا فیلترها را حذف کنید.</p>
              <Link href="/products" className="mt-4 rounded-full bg-pink-600 text-white text-[12px] font-bold px-6 h-10 inline-flex items-center gap-1.5 hover:bg-pink-500 transition"><Search className="h-4 w-4" /> مشاهده همه محصولات</Link>
            </div>
          )}

          {/* صفحه‌بندی */}
          {totalPages > 1 && (
            <div className="mt-5 flex items-center justify-center gap-1.5">
              <Link href={pageHref(safePage - 1)} aria-disabled={safePage === 1} className={`h-9 w-9 grid place-items-center rounded-xl border border-slate-200 bg-white ${safePage === 1 ? "opacity-40 pointer-events-none" : "hover:border-pink-400 hover:text-pink-600"}`}><ChevronRight className="h-5 w-5" /></Link>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link key={p} href={pageHref(p)} className={`h-9 w-9 grid place-items-center rounded-xl border text-[12px] font-black transition ${p === safePage ? "bg-[#14264a] border-[#14264a] text-amber-300" : "bg-white border-slate-200 text-slate-600 hover:border-pink-400 hover:text-pink-600"}`}>
                  {toFaDigits(p)}
                </Link>
              ))}
              <Link href={pageHref(safePage + 1)} aria-disabled={safePage === totalPages} className={`h-9 w-9 grid place-items-center rounded-xl border border-slate-200 bg-white ${safePage === totalPages ? "opacity-40 pointer-events-none" : "hover:border-pink-400 hover:text-pink-600"}`}><ChevronLeft className="h-5 w-5" /></Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
