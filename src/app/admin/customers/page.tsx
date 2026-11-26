import Link from "next/link";
import { Users, Phone, ShoppingBag, ChevronLeft, ChevronRight, Search, Crown } from "lucide-react";
import { sql, desc } from "drizzle-orm";
import { db } from "@/db";
import { orders, users } from "@/db/schema";
import { formatPrice, toFaDigits, faDay } from "@/lib/format";

export const dynamic = "force-dynamic";

const PER_PAGE = 20;

export default async function CustomersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const str = (k: string) => { const v = sp[k]; return Array.isArray(v) ? v[0] : (v ?? ""); };
  const q = str("q").trim().slice(0, 60);
  const page = Math.max(1, Number(str("page")) || 1);

  const like = `%${q}%`;
  const whereSql = q ? sql`where phone ilike ${like} or customer_name ilike ${like}` : sql``;

  const countResult = await db.execute(sql`select count(*)::text as total from (select phone from orders ${whereSql} group by phone) t`);
  const total = Number((countResult as unknown as { rows: { total: string }[] }).rows?.[0]?.total ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * PER_PAGE;

  const dataResult = await db.execute(sql`
    select phone, min(customer_name) as name, count(*)::text as orders_count,
           coalesce(sum(total) filter (where status <> 'cancelled'), 0)::text as total_spent,
           max(created_at) as last_order, min(created_at) as first_order
    from orders ${whereSql}
    group by phone
    order by sum(total) desc nulls last
    limit ${PER_PAGE} offset ${offset}
  `);
  const customers = ((dataResult as unknown as { rows: Array<{
    phone: string; name: string; orders_count: string; total_spent: string; last_order: string; first_order: string;
  }> }).rows ?? []);

  const [{ registered }] = await db.select({ registered: sql<number>`count(*)` }).from(users);
  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return `/admin/customers${s ? `?${s}` : ""}`;
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><Users className="h-6 w-6 text-pink-600" /> مدیریت مشتریان</h1>
          <p className="text-[11px] text-slate-500 mt-0.5">{toFaDigits(Number(total))} مشتری یکتا (بر اساس شماره موبایل) · {toFaDigits(Number(registered))} کاربر ثبت‌نامی</p>
        </div>
        <form method="get" action="/admin/customers" className="flex w-full sm:w-auto items-center rounded-2xl border border-slate-200 bg-white h-11 overflow-hidden shadow-sm focus-within:border-pink-400">
          <Search className="h-4 w-4 text-slate-400 mr-3 shrink-0" />
          <input type="text" name="q" defaultValue={q} placeholder="جستجوی نام یا موبایل..." className="flex-1 sm:w-64 h-full bg-transparent px-2 text-[12px] outline-none" />
          <button type="submit" className="h-full px-4 bg-[#14264a] text-amber-300 text-[10px] font-black">جستجو</button>
        </form>
      </div>

      <div className="mt-4 overflow-x-auto rounded-3xl border border-slate-200/70 bg-white shadow-sm">
        <table className="w-full text-[11px] min-w-[720px]">
          <thead className="bg-slate-50 text-slate-500 text-right">
            <tr><th className="py-3 px-4 font-black">مشتری</th><th className="py-3 px-2 font-black">موبایل</th><th className="py-3 px-2 font-black">سفارش‌ها</th><th className="py-3 px-2 font-black">مجموع خرید</th><th className="py-3 px-2 font-black">اولین سفارش</th><th className="py-3 px-4 font-black">آخرین سفارش</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((c, i) => {
              const spent = Number(c.total_spent);
              const vip = spent >= 8000000;
              return (
                <tr key={c.phone + i} className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-4">
                    <Link href={`/admin/orders?q=${encodeURIComponent(c.phone)}`} className="flex items-center gap-2 font-bold text-[#14264a] hover:text-pink-700">
                      <span className="h-9 w-9 grid place-items-center rounded-full bg-gradient-to-br from-pink-100 to-orange-100 text-pink-700 text-[13px] font-black">{c.name?.trim()?.[0] ?? "؟"}</span>
                      <span>{c.name}{vip && <Crown className="inline h-4 w-4 text-amber-500 mr-1 fill-amber-400" />}</span>
                    </Link>
                  </td>
                  <td className="py-2.5 px-2 text-slate-500" dir="ltr">{c.phone}</td>
                  <td className="py-2.5 px-2"><span className="inline-flex items-center gap-1 font-black text-[#14264a]"><ShoppingBag className="h-3.5 w-3.5 text-slate-400" />{toFaDigits(Number(c.orders_count))}</span></td>
                  <td className="py-2.5 px-2 font-black text-emerald-700">{formatPrice(spent)}</td>
                  <td className="py-2.5 px-2 text-slate-400">{c.first_order ? faDay(c.first_order) : "—"}</td>
                  <td className="py-2.5 px-4 text-slate-400">{c.last_order ? faDay(c.last_order) : "—"}</td>
                </tr>
              );
            })}
            {customers.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-slate-400">مشتری‌ای با این مشخصات یافت نشد.</td></tr>}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="mt-4 flex items-center justify-center gap-1.5" aria-label="صفحه‌بندی مشتریان">
          {safePage > 1 && <Link href={pageHref(safePage - 1)} className="h-9 w-9 grid place-items-center rounded-xl border border-slate-200 bg-white text-slate-600"><ChevronRight className="h-5 w-5" /></Link>}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={pageHref(p)} className={`h-9 w-9 grid place-items-center rounded-xl border text-[12px] font-black ${p === safePage ? "bg-[#14264a] border-[#14264a] text-amber-300" : "bg-white border-slate-200 text-slate-600"}`}>{toFaDigits(p)}</Link>
          ))}
          {safePage < totalPages && <Link href={pageHref(safePage + 1)} className="h-9 w-9 grid place-items-center rounded-xl border border-slate-200 bg-white text-slate-600"><ChevronLeft className="h-5 w-5" /></Link>}
        </nav>
      )}
    </div>
  );
}
