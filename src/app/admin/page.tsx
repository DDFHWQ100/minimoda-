import Link from "next/link";
import Image from "next/image";
import { Banknote, ShoppingBag, Package, Users, AlertTriangle, TrendingUp, ChevronLeft } from "lucide-react";
import { sql, desc, asc, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { orders, orderItems, products, users, categories } from "@/db/schema";
import { formatPrice, toFaDigits, faDate, ORDER_STATUS, parseJsonArray } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [revenueRow] = await db.select({ sum: sql<number>`coalesce(sum(total), 0)`, count: sql<number>`count(*)` }).from(orders).where(ne(orders.status, "cancelled"));
  const [productRow] = await db.select({ count: sql<number>`count(*)` }).from(products);
  const [userRow] = await db.select({ count: sql<number>`count(*)` }).from(users);
  const [stockCount] = await db.select({ count: sql<number>`count(*)` }).from(products).where(sql`stock <= 10`);

  const recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5);
  const topProducts = await db.select().from(products).orderBy(desc(products.salesCount)).limit(5);
  const lowStock = await db.select().from(products).where(sql`stock <= 15`).orderBy(asc(products.stock)).limit(6);

  const avgBasket = revenueRow.count > 0 ? Math.round(revenueRow.sum / revenueRow.count) : 0;

  const stats = [
    { icon: Banknote, label: "فروش کل", value: formatPrice(Number(revenueRow.sum)), tint: "from-emerald-400 to-teal-500" },
    { icon: ShoppingBag, label: "تعداد سفارش‌ها", value: toFaDigits(Number(revenueRow.count)), tint: "from-sky-400 to-blue-600" },
    { icon: Package, label: "محصولات فروشگاه", value: toFaDigits(Number(productRow.count)), tint: "from-violet-400 to-purple-600" },
    { icon: Users, label: "کاربران ثبت‌نامی", value: toFaDigits(Number(userRow.count)), tint: "from-amber-300 to-orange-500" },
    { icon: TrendingUp, label: "میانگین سبد خرید", value: formatPrice(avgBasket), tint: "from-pink-400 to-rose-600" },
    { icon: AlertTriangle, label: "کالاهای کم‌موجودی", value: toFaDigits(Number(stockCount.count)), tint: "from-rose-400 to-red-600" },
  ];

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a]">داشبورد فروشگاه</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">نمای کلی از عملکرد مینی‌مودا — به‌روز</p>

      {/* کارت‌های آمار */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
        {stats.map(({ icon: Icon, label, value, tint }) => (
          <div key={label} className="rounded-2xl border border-slate-200/70 bg-white p-3 sm:p-4 shadow-sm">
            <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-br ${tint} grid place-items-center shadow`}><Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" strokeWidth={1.8} /></div>
            <p className="mt-2 text-[9px] sm:text-[10px] font-bold text-slate-400">{label}</p>
            <p className="text-[12px] sm:text-[15px] font-black text-[#14264a] leading-5 break-words">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid xl:grid-cols-5 gap-4">
        {/* سفارش‌های اخیر */}
        <section className="xl:col-span-3 rounded-3xl border border-slate-200/70 bg-white shadow-sm overflow-hidden">
          <header className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-100">
            <h2 className="font-black text-[#14264a] text-[13px]">سفارش‌های اخیر</h2>
            <Link href="/admin/orders" className="text-[10px] font-bold text-pink-600 flex items-center gap-0.5 hover:text-pink-700">همه سفارش‌ها <ChevronLeft className="h-4 w-4" /></Link>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead className="text-slate-400 text-right">
                <tr className="border-b border-slate-100"><th className="py-2 px-4 font-bold">شماره</th><th className="py-2 px-2 font-bold">مشتری</th><th className="py-2 px-2 font-bold hidden sm:table-cell">تاریخ</th><th className="py-2 px-2 font-bold">وضعیت</th><th className="py-2 px-4 font-bold">مبلغ</th></tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => {
                  const st = ORDER_STATUS[o.status] ?? ORDER_STATUS.pending;
                  return (
                    <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                      <td className="py-2 px-4 font-black text-[#14264a]">#MM-{toFaDigits(String(o.id).padStart(5, "0"))}</td>
                      <td className="py-2 px-2 text-slate-600">{o.customerName}</td>
                      <td className="py-2 px-2 text-slate-400 hidden sm:table-cell">{faDate(o.createdAt)}</td>
                      <td className="py-2 px-2"><span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${st.cls}`}>{st.label}</span></td>
                      <td className="py-2 px-4 font-bold text-[#14264a] whitespace-nowrap">{formatPrice(o.total)}</td>
                    </tr>
                  );
                })}
                {recentOrders.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-slate-400">هنوز سفارشی ثبت نشده است.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        {/* پرفروش‌ترین‌ها */}
        <section className="xl:col-span-2 rounded-3xl border border-slate-200/70 bg-white shadow-sm overflow-hidden">
          <header className="px-4 sm:px-5 py-3 border-b border-slate-100"><h2 className="font-black text-[#14264a] text-[13px]">پرفروش‌ترین محصولات</h2></header>
          <ul className="divide-y divide-slate-50">
            {topProducts.map((p) => {
              const img = parseJsonArray<string>(p.images)[0];
              return (
                <li key={p.id} className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50/60">
                  <div className="relative h-12 w-10 rounded-lg overflow-hidden bg-[#f6f4ef] shrink-0"><Image src={img} alt={p.name} fill sizes="50px" className="object-cover" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-slate-600 line-clamp-1">{p.name}</p>
                    <p className="text-[9px] text-slate-400">{toFaDigits(p.salesCount)} فروش · موجودی {toFaDigits(p.stock)}</p>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-600 whitespace-nowrap">{formatPrice(p.discountPrice ?? p.price)}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* کم‌موجودی‌ها */}
      {lowStock.length > 0 && (
        <section className="mt-4 rounded-3xl border border-amber-200 bg-amber-50/60 p-4">
          <h2 className="flex items-center gap-2 text-[12px] font-black text-amber-800"><AlertTriangle className="h-4 w-4" /> هشدار موجودی — این کالاها رو به اتمام هستند</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {lowStock.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`} className="flex items-center gap-2 rounded-2xl bg-white border border-amber-200 px-3 py-1.5 text-[10px] font-bold text-slate-600 hover:border-amber-400 hover:text-amber-800 transition">
                {p.name}
                <span className="rounded-full bg-rose-100 text-rose-600 px-2 py-0.5 text-[9px]">مانده: {toFaDigits(p.stock)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
