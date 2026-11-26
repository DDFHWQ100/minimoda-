import Link from "next/link";
import { RotateCcw, PackageOpen, CheckCircle2, Clock3 } from "lucide-react";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { orders, returnsRequests } from "@/db/schema";
import SimpleForm from "@/components/admin/simple-form";
import EntityStatusSelect from "@/components/admin/entity-status-select";
import { toFaDigits, faDate, formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ReturnsPage() {
  const rows = await db
    .select({ r: returnsRequests, order: orders })
    .from(returnsRequests)
    .innerJoin(orders, eq(orders.id, returnsRequests.orderId))
    .orderBy(desc(returnsRequests.createdAt));

  const pending = rows.filter((r) => r.r.status === "requested").length;

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><RotateCcw className="h-6 w-6 text-pink-600" /> مرجوعی و تعویض کالا</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">{toFaDigits(rows.length)} درخواست — <b className="text-amber-700">{toFaDigits(pending)} مورد در انتظار بررسی</b></p>

      <div className="mt-4 grid lg:grid-cols-5 gap-4 items-start">
        <div className="lg:col-span-3 space-y-2">
          {rows.map(({ r, order }) => (
            <article key={r.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm">
              <span className={`h-12 w-12 shrink-0 rounded-2xl grid place-items-center ${r.type === "refund" ? "bg-rose-50 text-rose-500" : "bg-sky-50 text-sky-600"}`}>
                {r.type === "refund" ? <RotateCcw className="h-6 w-6" /> : <PackageOpen className="h-6 w-6" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link href={`/admin/orders?q=${order.id}`} className="font-black text-[12px] text-[#14264a] hover:text-pink-700">#MM-{toFaDigits(String(order.id).padStart(5, "0"))}</Link>
                  <span className="text-[9px] font-bold text-slate-400">{r.type === "refund" ? "بازپرداخت وجه" : "تعویض کالا"}</span>
                  <span className="text-[9px] text-slate-400">· {faDate(r.createdAt)}</span>
                </div>
                <p className="text-[10px] text-slate-600 mt-0.5 leading-5"><b>{order.customerName}:</b> {r.reason}{r.note ? ` — ${r.note}` : ""}</p>
                <p className="text-[9px] text-slate-400">مبلغ سفارش: {formatPrice(order.total)}</p>
              </div>
              <EntityStatusSelect entity="returns" id={r.id} status={r.status} />
            </article>
          ))}
          {rows.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-[11px] text-slate-400">درخواست مرجوعی ثبت نشده است.</div>}
        </div>

        <div className="lg:col-span-2">
          <SimpleForm
            title="ثبت درخواست مرجوعی / تعویض"
            entity="returns"
            submitLabel="ثبت درخواست"
            fields={[
              { name: "orderId", label: "شماره سفارش (مثلاً 5)", type: "number", required: true, placeholder: "35", dir: "ltr" },
              { name: "type", label: "نوع درخواست", type: "select", required: true, options: [{ value: "refund", label: "بازپرداخت وجه" }, { value: "exchange", label: "تعویض کالا" }] },
              { name: "reason", label: "دلیل مرجوعی *", required: true, placeholder: "مثلاً: مغایرت رنگ، سایز کوچک...", full: true },
              { name: "note", label: "توضیحات (اختیاری)", type: "textarea", placeholder: "جزئیات بیشتر یا اقلام درخواستی تعویض..." },
            ]}
            note="پس از ثبت، وضعیت را از «در انتظار بررسی» به «تأیید شده/رد شده/انجام شد» تغییر دهید."
          />
        </div>
      </div>
    </div>
  );
}
