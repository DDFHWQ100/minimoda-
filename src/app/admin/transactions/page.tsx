import Link from "next/link";
import { Banknote, Receipt, Calculator, RotateCcw, CreditCard, Store, Wallet } from "lucide-react";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, returnsRequests } from "@/db/schema";
import { formatPrice, toFaDigits, faDate, PAYMENT_METHODS, ORDER_STATUS } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function TransactionsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const methodFilter = Array.isArray(sp.m) ? sp.m[0] : sp.m ?? "";

  const [agg] = await db.select({
    gross: sql<number>`coalesce(sum(total) filter (where status <> 'cancelled'), 0)`,
    count: sql<number>`count(*) filter (where status <> 'cancelled')`,
    avg: sql<number>`coalesce(avg(total) filter (where status <> 'cancelled'), 0)`,
    onsite: sql<number>`coalesce(sum(total) filter (where payment_method = 'onsite' and status <> 'cancelled'), 0)`,
  }).from(orders);
  const [refundAgg] = await db.select({ refunds: sql<number>`count(*)` }).from(returnsRequests).where(eq(returnsRequests.type, "refund"));
  const [paidBackAgg] = await db.select({ total: sql<number>`coalesce(sum(${orders.total}), 0)` }).from(returnsRequests).innerJoin(orders, eq(orders.id, returnsRequests.orderId)).where(eq(returnsRequests.status, "done"));

  const txWhere = methodFilter && ["online", "onsite", "card"].includes(methodFilter) ? eq(orders.paymentMethod, methodFilter) : undefined;
  const txs = await db.select().from(orders).where(txWhere).orderBy(desc(orders.createdAt)).limit(50);

  const kpis = [
    { icon: Banknote, label: "فروش ناخالص", value: formatPrice(Number(agg.gross)), tint: "from-emerald-400 to-teal-600" },
    { icon: Receipt, label: "تعداد تراکنش", value: toFaDigits(Number(agg.count)), tint: "from-sky-400 to-blue-600" },
    { icon: Calculator, label: "میانگین سبد خرید", value: formatPrice(Math.round(Number(agg.avg))), tint: "from-violet-400 to-purple-600" },
    { icon: Store, label: "فروش درب منزل", value: formatPrice(Number(agg.onsite)), tint: "from-amber-300 to-orange-500" },
    { icon: RotateCcw, label: "مرجوعی‌های بازپرداختی", value: toFaDigits(Number(refundAgg.refunds)), tint: "from-rose-400 to-red-600" },
    { icon: Wallet, label: "بازپرداخت انجام‌شده", value: formatPrice(Number(paidBackAgg.total)), tint: "from-slate-400 to-slate-600" },
  ];

  const chip = (label: string, value: string) => (
    <Link key={value} href={value ? `/admin/transactions?m=${value}` : "/admin/transactions"}
      className={`rounded-full px-3 h-8 inline-flex items-center text-[10px] font-bold border transition ${methodFilter === value ? "bg-[#14264a] border-[#14264a] text-amber-300" : "bg-white border-slate-200 text-slate-600"}`}>{label}</Link>
  );

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><Banknote className="h-6 w-6 text-pink-600" /> امور مالی و تراکنش‌ها</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">خلاصه مالی واقعی فروشگاه + دفتر تراکنش‌ها (۵۰ تراکنش آخر)</p>

      <div className="mt-4 grid grid-cols-2 lg:grid-cols-6 gap-2">
        {kpis.map(({ icon: Icon, label, value, tint }) => (
          <div key={label} className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm col-span-1">
            <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${tint} grid place-items-center`}><Icon className="h-5 w-5 text-white" strokeWidth={1.8} /></div>
            <small className="block mt-1.5 text-[8px] font-bold text-slate-400">{label}</small>
            <b className="block text-[11px] sm:text-[12px] font-black text-[#14264a] leading-5 break-words">{value}</b>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-[12px] font-black text-[#14264a]">دفتر تراکنش‌ها</h2>
        <div className="flex gap-1.5">{chip("همه", "")}{chip("آنلاین", "online")}{chip("درب منزل", "onsite")}{chip("کارت‌به‌کارت", "card")}</div>
      </div>
      <div className="mt-2 overflow-x-auto rounded-3xl border border-slate-200/70 bg-white shadow-sm">
        <table className="w-full text-[10px] min-w-[640px]">
          <thead className="bg-slate-50 text-slate-500 text-right">
            <tr><th className="py-2.5 px-4 font-black">سفارش</th><th className="py-2.5 px-2 font-black">تاریخ</th><th className="py-2.5 px-2 font-black">مشتری</th><th className="py-2.5 px-2 font-black">روش</th><th className="py-2.5 px-2 font-black">وضعیت</th><th className="py-2.5 px-4 font-black">مبلغ</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {txs.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50/60">
                <td className="py-2 px-4 font-black text-[#14264a]">#MM-{toFaDigits(String(o.id).padStart(5, "0"))}</td>
                <td className="py-2 px-2 text-slate-400">{faDate(o.createdAt)}</td>
                <td className="py-2 px-2 text-slate-600">{o.customerName}</td>
                <td className="py-2 px-2 text-slate-500">{PAYMENT_METHODS[o.paymentMethod]}</td>
                <td className="py-2 px-2"><span className="text-slate-500">{ORDER_STATUS[o.status]?.label}</span></td>
                <td className="py-2 px-4 font-black text-[#14264a] whitespace-nowrap">{formatPrice(o.total)}</td>
              </tr>
            ))}
            {txs.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-slate-400">تراکنشی با این روش پرداخت ثبت نشده.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
