import Image from "next/image";
import Link from "next/link";
import { desc, eq, and, or, ilike, count, inArray } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { ShoppingBag, Phone, MapPin, ChevronLeft, ChevronRight, Search, PackageSearch } from "lucide-react";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import OrderStatusSelect from "@/components/order-status-select";
import { formatPrice, faDate, PAYMENT_METHODS, toFaDigits, ORDER_STATUS } from "@/lib/format";

export const dynamic = "force-dynamic";

const PER_PAGE = 30;

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const str = (k: string) => { const v = sp[k]; return Array.isArray(v) ? v[0] : (v ?? ""); };
  const q = str("q").trim().slice(0, 60);
  const status = str("status");
  const validStatus = Object.keys(ORDER_STATUS).includes(status) ? status : "";
  const page = Math.max(1, Number(str("page")) || 1);

  // ── فیلترها (جست‌وجو + وضعیت) ──
  const conditions: SQL[] = [];
  if (validStatus) conditions.push(eq(orders.status, validStatus));
  if (q) {
    const like = `%${q}%`;
    const idMatch = /^#?(mm-?)?0*(\d+)$/i.exec(q);
    const idNum = idMatch ? Number(idMatch[2]) : null;
    const cond = or(
      ilike(orders.customerName, like),
      ilike(orders.phone, like),
      ilike(orders.address, like),
      ...(idNum !== null && Number.isFinite(idNum) ? [eq(orders.id, idNum)] : [])
    );
    if (cond) conditions.push(cond);
  }
  const where = conditions.length ? and(...conditions) : undefined;

  // ── شمارش کل + صفحه‌بندی سمت سرور ──
  const [{ total }] = await db.select({ total: count() }).from(orders).where(where);
  const totalPages = Math.max(1, Math.ceil(Number(total) / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * PER_PAGE;

  const rows = await db
    .select()
    .from(orders)
    .where(where)
    .orderBy(desc(orders.createdAt))
    .limit(PER_PAGE)
    .offset(offset);

  const itemsByOrder: Record<number, (typeof orderItems.$inferSelect)[]> = {};
  if (rows.length > 0) {
    const ids = rows.map((o) => o.id);
    const items = await db.select().from(orderItems).where(inArray(orderItems.orderId, ids));
    for (const item of items) {
      (itemsByOrder[item.orderId] ??= []).push(item);
    }
  }

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (validStatus) params.set("status", validStatus);
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return `/admin/orders${s ? `?${s}` : ""}`;
  };
  const filterHref = (s: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (s) params.set("status", s);
    const qs = params.toString();
    return `/admin/orders${qs ? `?${qs}` : ""}`;
  };
  const from = Number(total) === 0 ? 0 : offset + 1;
  const to = offset + rows.length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><ShoppingBag className="h-6 w-6 text-pink-600" /> مدیریت سفارش‌ها</h1>
          <p className="text-[11px] text-slate-500 mt-0.5">نمایش <b className="text-[#14264a]">{toFaDigits(from)} تا {toFaDigits(to)}</b> از <b className="text-[#14264a]">{toFaDigits(Number(total))}</b> سفارش — {toFaDigits(PER_PAGE)} سفارش در هر صفحه</p>
        </div>
      </div>

      {/* جست‌وجو و فیلتر وضعیت */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <form method="get" action="/admin/orders" className="flex w-full sm:w-auto items-center rounded-2xl border border-slate-200 bg-white h-11 overflow-hidden shadow-sm focus-within:border-pink-400">
          <Search className="h-4 w-4 text-slate-400 mr-3 shrink-0" />
          <input type="text" name="q" defaultValue={q} placeholder="جستجو: نام، موبایل، آدرس یا شماره سفارش (مثلاً ۳ یا MM-00002)..." className="flex-1 sm:w-80 h-full bg-transparent px-2 text-[12px] outline-none" />
          {validStatus && <input type="hidden" name="status" value={validStatus} />}
          <button type="submit" className="h-full px-4 bg-[#14264a] text-amber-300 text-[11px] font-black hover:bg-[#1d3a63] transition">جستجو</button>
        </form>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          <Link href={filterHref("")} className={`shrink-0 rounded-full px-3 h-9 inline-flex items-center text-[10px] font-bold border transition ${!validStatus ? "bg-[#14264a] border-[#14264a] text-amber-300" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}>همه</Link>
          {Object.entries(ORDER_STATUS).map(([key, v]) => (
            <Link key={key} href={filterHref(key)} className={`shrink-0 rounded-full px-3 h-9 inline-flex items-center text-[10px] font-bold border transition ${validStatus === key ? "bg-[#14264a] border-[#14264a] text-amber-300" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}>{v.label}</Link>
          ))}
        </div>
      </div>
      {(q || validStatus) && (
        <p className="mt-2 text-[10px] text-slate-500">فیلتر فعال: {q && <span>«{q}» — </span>}{validStatus && <span className="font-bold">{ORDER_STATUS[validStatus].label} — </span>}<Link href="/admin/orders" className="text-pink-600 font-bold hover:underline">حذف فیلتر و بازگشت به همه سفارش‌ها ←</Link></p>
      )}

      {/* لیست سفارش‌های همین صفحه */}
      <div className="mt-3 space-y-3">
        {rows.length === 0 && (
          <div className="text-center py-14 rounded-3xl border border-dashed border-slate-300 bg-white">
            <PackageSearch className="h-12 w-12 text-slate-300 mx-auto" strokeWidth={1.4} />
            <h2 className="mt-2 font-black text-[#14264a]">سفارشی با این مشخصات یافت نشد</h2>
            <p className="mt-1 text-[11px] text-slate-500">جستجو یا فیلتر را تغییر دهید.</p>
            <Link href="/admin/orders" className="mt-4 inline-flex items-center gap-1 rounded-full bg-pink-600 text-white px-5 h-10 text-[11px] font-bold hover:bg-pink-500">نمایش همه سفارش‌ها</Link>
          </div>
        )}
        {rows.map((order) => {
          const customerItems = itemsByOrder[order.id] ?? [];
          return (
            <article key={order.id} className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
              <header className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 sm:px-5 py-3 bg-slate-50/70 border-b border-slate-100 text-[10px] sm:text-[11px]">
                <span className="font-black text-[#14264a]">#MM-{toFaDigits(String(order.id).padStart(5, "0"))}</span>
                <span className="text-slate-400">{faDate(order.createdAt)}</span>
                <span className="text-slate-500">{PAYMENT_METHODS[order.paymentMethod]}</span>
                <span className="mr-auto"><OrderStatusSelect orderId={order.id} status={order.status} /></span>
              </header>
              <div className="p-4 flex flex-col lg:flex-row gap-4">
                <div className="flex gap-2 overflow-x-auto no-scrollbar flex-1">
                  {customerItems.map((item) => (
                    <img key={item.id} src={item.image || "/images/hero-royal-junior.jpg"} alt={item.name} title={`${item.name} ×${item.quantity}`} className="h-20 w-16 shrink-0 object-cover rounded-xl bg-[#f6f4ef] border border-slate-100" />
                  ))}
                  {customerItems.length === 0 && <span className="text-[10px] text-slate-400 self-center">بدون قلم ثبت‌شده</span>}
                </div>
                <div className="lg:w-64 shrink-0 text-[10px] text-slate-500 space-y-1">
                  <p className="font-black text-[#14264a] text-[11px]">{order.customerName}</p>
                  <p className="flex items-center gap-1" dir="ltr"><Phone className="h-3.5 w-3.5 text-slate-400" />{order.phone}</p>
                  <p className="flex items-start gap-1"><MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />{order.address}</p>
                  {order.note && <p className="rounded-lg bg-amber-50 border border-amber-100 px-2 py-1 text-amber-800">{order.note}</p>}
                  <p className="pt-1 text-[13px] font-black text-[#14264a]">{formatPrice(order.total)}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* صفحه‌بندی استاندارد */}
      {totalPages > 1 && (
        <nav className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-2" aria-label="صفحه‌بندی سفارش‌ها">
          <p className="text-[10px] text-slate-500">صفحه <b className="text-[#14264a]">{toFaDigits(safePage)}</b> از <b className="text-[#14264a]">{toFaDigits(totalPages)}</b> — مجموع {toFaDigits(Number(total))} سفارش</p>
          <div className="flex items-center gap-1.5">
            {safePage > 1 ? (
              <Link href={pageHref(safePage - 1)} aria-label="صفحه قبلی" className="h-9 px-3 inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white text-[11px] font-bold text-slate-600 hover:border-pink-400 hover:text-pink-600 transition"><ChevronRight className="h-4 w-4" /> قبلی</Link>
            ) : (
              <span className="h-9 px-3 inline-flex items-center gap-1 rounded-xl border border-slate-100 text-[11px] text-slate-300 cursor-not-allowed"><ChevronRight className="h-4 w-4" /> قبلی</span>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const near = Math.abs(p - safePage) <= 2;
              const edge = p === 1 || p === totalPages;
              if (!near && !edge) {
                if (p === 2 || p === totalPages - 1) return <span key={p} className="px-1 text-slate-300">…</span>;
                return null;
              }
              return p === safePage ? (
                <span key={p} aria-current="page" className="h-9 w-9 grid place-items-center rounded-xl bg-[#14264a] text-amber-300 text-[12px] font-black">{toFaDigits(p)}</span>
              ) : (
                <Link key={p} href={pageHref(p)} className="h-9 w-9 grid place-items-center rounded-xl border border-slate-200 bg-white text-[12px] font-black text-slate-600 hover:border-pink-400 hover:text-pink-600 transition">{toFaDigits(p)}</Link>
              );
            })}
            {safePage < totalPages ? (
              <Link href={pageHref(safePage + 1)} aria-label="صفحه بعدی" className="h-9 px-3 inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white text-[11px] font-bold text-slate-600 hover:border-pink-400 hover:text-pink-600 transition">بعدی <ChevronLeft className="h-4 w-4" /></Link>
            ) : (
              <span className="h-9 px-3 inline-flex items-center gap-1 rounded-xl border border-slate-100 text-[11px] text-slate-300 cursor-not-allowed">بعدی <ChevronLeft className="h-4 w-4" /></span>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
