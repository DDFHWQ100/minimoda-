import Link from "next/link";
import { Warehouse, ArrowDownLeft, ArrowUpRight, AlertTriangle, Package } from "lucide-react";
import { asc, desc, eq, lte } from "drizzle-orm";
import { db } from "@/db";
import { products, productVariants, stockMovements } from "@/db/schema";
import SimpleForm from "@/components/admin/simple-form";
import VariantStockEditor from "@/components/admin/variant-stock-editor";
import { toFaDigits, faDate, parseJsonArray, formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const [lowStock, variants, movements, allProducts] = await Promise.all([
    db.select().from(products).where(lte(products.stock, 12)).orderBy(asc(products.stock)).limit(10),
    db.select({ id: productVariants.id, productId: productVariants.productId, size: productVariants.size, stock: productVariants.stock, sku: productVariants.sku, productName: products.name })
      .from(productVariants).innerJoin(products, eq(products.id, productVariants.productId))
      .orderBy(asc(products.id), asc(productVariants.size)).limit(120),
    db.select({ id: stockMovements.id, delta: stockMovements.delta, reason: stockMovements.reason, note: stockMovements.note, createdAt: stockMovements.createdAt, productName: products.name })
      .from(stockMovements).leftJoin(products, eq(products.id, stockMovements.productId))
      .orderBy(desc(stockMovements.createdAt)).limit(12),
    db.select({ id: products.id, name: products.name }).from(products).orderBy(asc(products.name)),
  ]);

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><Warehouse className="h-6 w-6 text-pink-600" /> انبار و موجودی</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">موجودی مستقل هر سایز، ثبت ورود و خروج واقعی انبار و هشدار کالای رو به اتمام</p>

      <div className="mt-4 grid lg:grid-cols-5 gap-4 items-start">
        {/* ستون اصلی: تنوع‌ها + کم‌موجودی */}
        <div className="lg:col-span-3 space-y-4">
          {/* هشدار کم‌موجودی */}
          {lowStock.length > 0 && (
            <section className="rounded-3xl border border-amber-200 bg-amber-50/70 p-4">
              <h2 className="flex items-center gap-2 text-[11px] font-black text-amber-800"><AlertTriangle className="h-4 w-4" /> کالاهای رو به اتمام ({toFaDigits(lowStock.length)})</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {lowStock.map((p) => (
                  <span key={p.id} title={p.name} className="rounded-full bg-white border border-amber-200 px-2.5 h-7 inline-flex items-center text-[9px] font-bold text-slate-600">{p.name.slice(0, 26)}{p.name.length > 26 ? "…" : ""} <b className="mr-1 text-rose-600">{toFaDigits(p.stock)} عدد</b></span>
                ))}
              </div>
            </section>
          )}

          {/* جدول تنوع‌ها */}
          <section className="rounded-3xl border border-slate-200/70 bg-white shadow-sm overflow-hidden">
            <header className="px-4 sm:px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-[12px] font-black text-[#14264a]">موجودی تنوع‌های سایز ({toFaDigits(variants.length)} تنوع)</h2>
              <span className="text-[9px] text-slate-400">ویرایش عدد → ذخیره خودکار + لاگ انبار</span>
            </header>
            <div className="max-h-105 overflow-auto">
              <table className="w-full text-[10px] min-w-[560px]">
                <thead className="text-slate-400 text-right sticky top-0 bg-slate-50">
                  <tr><th className="py-2 px-4 font-bold">محصول</th><th className="py-2 px-2 font-bold">سایز</th><th className="py-2 px-2 font-bold">SKU</th><th className="py-2 px-4 font-bold">موجودی</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {variants.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/60">
                      <td className="py-1.5 px-4 text-slate-600 line-clamp-1 max-w-52">{v.productName}</td>
                      <td className="py-1.5 px-2 font-black text-[#14264a]">{toFaDigits(v.size)}</td>
                      <td className="py-1.5 px-2 font-mono text-[8px] text-slate-400">{v.sku}</td>
                      <td className="py-1.5 px-4"><VariantStockEditor id={v.id} initial={v.stock} /></td>
                    </tr>
                  ))}
                  {variants.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-slate-400">تنوعی ثبت نشده؛ محصولات سایزدار اضافه کنید.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* ستون کناری: ثبت حرکت + تاریخچه */}
        <div className="lg:col-span-2 space-y-4">
          <SimpleForm
            title="ثبت ورود/خروج انبار"
            entity="stock"
            submitLabel="ثبت در دفتر انبار"
            fields={[
              { name: "productId", label: "محصول", type: "select", required: true, options: allProducts.map((p) => ({ value: String(p.id), label: p.name })) },
              { name: "delta", label: "مقدار (مثبت=ورود، منفی=خروج)", type: "number", required: true, placeholder: "مثال: ۵ یا -۳", dir: "ltr" },
              { name: "reason", label: "علت", type: "select", required: true, options: [
                { value: "ورود از تأمین‌کننده", label: "ورود از تأمین‌کننده" },
                { value: "فروش", label: "فروش (خروج)" },
                { value: "مرجوعی مشتری", label: "مرجوعی مشتری (ورود)" },
                { value: "اصلاح موجودی", label: "اصلاح موجودی" },
                { value: "کالای معیوب", label: "کالای معیوب (خروج)" },
              ] },
              { name: "note", label: "توضیحات", type: "textarea", placeholder: "شماره فاکتور، انباردار، توضیحات..." },
            ]}
            note="ثبت حرکت، موجودی محصول را بلافاصله اصلاح می‌کند و در دفتر انبار ثبت می‌شود."
          />

          <section className="rounded-3xl border border-slate-200/70 bg-white shadow-sm overflow-hidden">
            <header className="px-4 py-3 border-b border-slate-100 flex items-center justify-between"><h2 className="text-[12px] font-black text-[#14264a] flex items-center gap-2"><Package className="h-4 w-4 text-slate-400" /> دفتر انبار</h2><Link href="/admin/products" className="text-[9px] font-bold text-pink-600">مدیریت محصولات ←</Link></header>
            <ul className="divide-y divide-slate-50 max-h-80 overflow-auto">
              {movements.map((m) => {
                const isIn = m.delta >= 0;
                return (
                  <li key={m.id} className="flex items-center gap-2 px-4 py-2 text-[10px]">
                    {isIn ? <ArrowDownLeft className="h-4 w-4 text-emerald-500 shrink-0" /> : <ArrowUpRight className="h-4 w-4 text-rose-500 shrink-0" />}
                    <span className="min-w-0 flex-1"><b className="text-[#14264a]">{m.reason}</b><br /><span className="text-slate-400">{m.productName ?? "کل انبار"}{m.note ? ` — ${m.note}` : ""}</span></span>
                    <span className={`font-black whitespace-nowrap ${isIn ? "text-emerald-600" : "text-rose-600"}`} dir="ltr">{isIn ? "+" : ""}{toFaDigits(m.delta)}</span>
                    <span className="text-[8px] text-slate-400 whitespace-nowrap">{faDate(m.createdAt)}</span>
                  </li>
                );
              })}
              {movements.length === 0 && <li className="py-8 text-center text-slate-400">حرکتی ثبت نشده است.</li>}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
