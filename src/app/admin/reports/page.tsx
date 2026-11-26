import Link from "next/link";
import { BarChart3, Download, TrendingUp, ShoppingBag, Banknote, Users } from "lucide-react";
import { sql, desc } from "drizzle-orm";
import { db } from "@/db";
import { products, orders, categories, orderItems } from "@/db/schema";
import { formatPrice, toFaDigits, ORDER_STATUS } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ReportsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const range = ["7", "30", "90"].includes(Array.isArray(sp.range) ? sp.range[0] : sp.range ?? "") ? Number(Array.isArray(sp.range) ? sp.range[0] : sp.range) : 30;

  const [summary] = await db.select({
    revenue: sql<number>`coalesce(sum(total) filter (where status <> 'cancelled'), 0)`,
    count: sql<number>`count(*) filter (where status <> 'cancelled')`,
    avgBasket: sql<number>`coalesce(avg(total) filter (where status <> 'cancelled'), 0)`,
    customers: sql<number>`count(distinct phone)`,
  }).from(orders).where(sql`created_at > now() - (${range} || ' days')::interval`);

  const daily = await db.select({
    day: sql<string>`to_char(created_at, 'YYYY-MM-DD')`,
    total: sql<number>`coalesce(sum(total) filter (where status <> 'cancelled'), 0)`,
    count: sql<number>`count(*) filter (where status <> 'cancelled')`,
  }).from(orders)
    .where(sql`created_at > now() - (${range} || ' days')::interval`)
    .groupBy(sql`1`).orderBy(sql`1`);

  const maxDay = Math.max(1, ...daily.map((d) => Number(d.total)));

  const topProducts = await db.select().from(products).orderBy(desc(products.salesCount)).limit(5);
  const maxSales = Math.max(1, ...topProducts.map((p) => p.salesCount));

  const categoryRows = await db.select({
    name: categories.name,
    revenue: sql<number>`coalesce(sum(${orderItems.price} * ${orderItems.quantity}), 0)`,
  }).from(orderItems)
    .innerJoin(products, sql`${products.id} = ${orderItems.productId}`)
    .innerJoin(categories, sql`${categories.id} = ${products.categoryId}`)
    .groupBy(categories.name)
    .orderBy(sql`2 desc`)
    .limit(7);
  const maxCat = Math.max(1, ...categoryRows.map((c) => Number(c.revenue)));

  const rangeLink = (r: number) => `/admin/reports?range=${r}`;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><BarChart3 className="h-6 w-6 text-pink-600" /> گزارش‌ها و تحلیل فروش</h1>
          <p className="text-[11px] text-slate-500 mt-0.5">داده واقعی {toFaDigits(range)} روز گذشته فروشگاه</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
            {[7, 30, 90].map((r) => (
              <Link key={r} href={rangeLink(r)} className={`h-9 px-3 sm:px-4 rounded-xl text-[10px] sm:text-[11px] font-bold grid place-items-center transition ${range === r ? "bg-[#14264a] text-amber-300" : "text-slate-500"}`}>{toFaDigits(r)} روز</Link>
            ))}
          </div>
          <a href="/api/admin/reports/export" className="h-11 inline-flex items-center gap-1.5 rounded-2xl border border-emerald-300 bg-emerald-50 text-emerald-700 px-4 text-[10px] sm:text-[11px] font-black hover:bg-emerald-100 transition"><Download className="h-4 w-4" /> خروجی CSV</a>
        </div>
      </div>

      {/* KPIها */}
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2">
        {[
          { icon: Banknote, label: "فروش دوره", value: formatPrice(Number(summary.revenue)), tint: "from-emerald-400 to-teal-600" },
          { icon: ShoppingBag, label: "سفارش‌ها", value: toFaDigits(Number(summary.count)), tint: "from-sky-400 to-blue-600" },
          { icon: TrendingUp, label: "میانگین سبد", value: formatPrice(Math.round(Number(summary.avgBasket))), tint: "from-violet-400 to-purple-600" },
          { icon: Users, label: "مشتریان یکتا", value: toFaDigits(Number(summary.customers)), tint: "from-amber-300 to-orange-500" },
        ].map(({ icon: Icon, label, value, tint }) => (
          <div key={label} className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
            <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${tint} grid place-items-center`}><Icon className="h-5 w-5 text-white" strokeWidth={1.8} /></div>
            <small className="block mt-2 text-[9px] font-bold text-slate-400">{label}</small>
            <b className="block text-[13px] sm:text-[15px] font-black text-[#14264a] leading-6">{value}</b>
          </div>
        ))}
      </div>

      <div className="mt-4 grid xl:grid-cols-5 gap-4">
        {/* نمودار روزانه */}
        <section className="xl:col-span-3 rounded-3xl border border-slate-200/70 bg-white shadow-sm p-4 sm:p-5">
          <h2 className="text-[12px] font-black text-[#14264a]">روند فروش روزانه</h2>
          <div className="mt-3 flex items-end gap-[3px] h-40 border-b border-slate-100 pb-1 overflow-x-auto">
            {daily.map((d) => (
              <div key={d.day} className="flex-1 min-w-[10px] flex flex-col items-center gap-1 group" title={`${d.day} — ${formatPrice(Number(d.total))} (${toFaDigits(Number(d.count))} سفارش)`}>
                <div className="w-full rounded-t bg-gradient-to-t from-pink-500 to-rose-400 group-hover:from-pink-600 transition-all" style={{ height: `${(Number(d.total) / maxDay) * 100}%`, minHeight: Number(d.total) > 0 ? 4 : 1 }} />
              </div>
            ))}
            {daily.length === 0 && <p className="text-[11px] text-slate-400 m-auto">در این بازه فروشی ثبت نشده است.</p>}
          </div>
          <p className="mt-1 text-[8px] text-slate-400">هر ستون = یک روز (هاور کنید برای مبلغ دقیق)</p>
        </section>

        {/* پرفروش‌ترین‌ها */}
        <section className="xl:col-span-2 rounded-3xl border border-slate-200/70 bg-white shadow-sm p-4 sm:p-5">
          <h2 className="text-[12px] font-black text-[#14264a]">پرفروش‌ترین محصولات</h2>
          <div className="mt-2 space-y-2">
            {topProducts.map((p) => (
              <div key={p.id} className="text-[10px]">
                <div className="flex items-center justify-between gap-2"><span className="font-bold text-slate-600 line-clamp-1">{p.name}</span><span className="font-black text-[#14264a] whitespace-nowrap">{toFaDigits(p.salesCount)} فروش</span></div>
                <div className="mt-0.5 h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-l from-amber-400 to-orange-400" style={{ width: `${(p.salesCount / maxSales) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* فروش به تفکیک دسته */}
      <section className="mt-4 rounded-3xl border border-slate-200/70 bg-white shadow-sm p-4 sm:p-5">
        <h2 className="text-[12px] font-black text-[#14264a]">سهم دسته‌بندی‌ها از درآمد</h2>
        <div className="mt-2 grid sm:grid-cols-2 gap-x-6 gap-y-2">
          {categoryRows.map((c) => (
            <div key={c.name} className="text-[10px]">
              <div className="flex items-center justify-between gap-2"><span className="font-bold text-slate-600">{c.name}</span><span className="font-black text-emerald-700 whitespace-nowrap">{formatPrice(Number(c.revenue))}</span></div>
              <div className="mt-0.5 h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-l from-emerald-400 to-teal-500" style={{ width: `${(Number(c.revenue) / maxCat) * 100}%` }} /></div>
            </div>
          ))}
          {categoryRows.length === 0 && <p className="text-[11px] text-slate-400">داده‌ای موجود نیست.</p>}
        </div>
      </section>
    </div>
  );
}
