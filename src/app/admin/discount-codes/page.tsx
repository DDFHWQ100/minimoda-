import { TicketPercent, Trash2, BadgeCheck, BadgeX, Clock } from "lucide-react";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { discountCodes } from "@/db/schema";
import SimpleForm from "@/components/admin/simple-form";
import ActionButton from "@/components/theme/action-button";
import { toFaDigits, faDay, formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DiscountCodesPage() {
  const codes = await db.select().from(discountCodes).orderBy(desc(discountCodes.createdAt));
  const active = codes.filter((c) => c.active && (!c.expiresAt || c.expiresAt > new Date())).length;

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><TicketPercent className="h-6 w-6 text-pink-600" /> کدهای تخفیف</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">{toFaDigits(codes.length)} کد — {toFaDigits(active)} فعال و معتبر · مدیریت کامل بدون کدنویسی</p>

      <div className="mt-4 grid lg:grid-cols-5 gap-4 items-start">
        <div className="lg:col-span-3 overflow-x-auto rounded-3xl border border-slate-200/70 bg-white shadow-sm">
          <table className="w-full text-[11px] min-w-[560px]">
            <thead className="bg-slate-50 text-slate-500 text-right">
              <tr><th className="py-3 px-4 font-black">کد</th><th className="py-3 px-2 font-black">نوع/مقدار</th><th className="py-3 px-2 font-black">حداقل خرید</th><th className="py-3 px-2 font-black">استفاده</th><th className="py-3 px-2 font-black">وضعیت</th><th className="py-3 px-4 font-black">عملیات</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {codes.map((c) => {
                const expired = c.expiresAt && c.expiresAt <= new Date();
                const exhausted = c.usedCount >= c.maxUses;
                const live = c.active && !expired && !exhausted;
                return (
                  <tr key={c.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-4"><code dir="ltr" className="font-mono font-black text-[#14264a] bg-slate-100 rounded-lg px-2 py-1 text-[11px]">{c.code}</code></td>
                    <td className="py-2.5 px-2 font-bold text-pink-700">{c.type === "percent" ? `${toFaDigits(c.value)}٪` : formatPrice(c.value)}</td>
                    <td className="py-2.5 px-2 text-slate-500">{c.minOrder > 0 ? formatPrice(c.minOrder) : "—"}</td>
                    <td className="py-2.5 px-2 text-slate-500">{toFaDigits(c.usedCount)} / {toFaDigits(c.maxUses)}</td>
                    <td className="py-2.5 px-2">
                      {live ? <span className="inline-flex items-center gap-1 text-emerald-700 text-[9px] font-black"><BadgeCheck className="h-4 w-4" />فعال</span>
                        : expired ? <span className="inline-flex items-center gap-1 text-slate-400 text-[9px] font-black"><Clock className="h-4 w-4" />منقضی</span>
                        : exhausted ? <span className="inline-flex items-center gap-1 text-amber-700 text-[9px] font-black"><BadgeX className="h-4 w-4" />اتمام ظرفیت</span>
                        : <span className="inline-flex items-center gap-1 text-slate-400 text-[9px] font-black"><BadgeX className="h-4 w-4" />غیرفعال</span>}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-1">
                        <ActionButton action="discounts.setActive" payload={{ entity: "discounts", id: c.id, active: !c.active }} label={c.active ? "غیرفعال" : "فعال"}
                          className="h-8 px-2 rounded-lg border border-slate-200 text-[9px] font-bold text-slate-500 hover:border-pink-400 hover:text-pink-600 transition" />
                        <ActionButton action="discounts.delete" payload={{ entity: "discounts", id: c.id }} label="" icon={<Trash2 className="h-4 w-4" />} confirm={`کد ${c.code} حذف شود؟`}
                          className="h-8 w-8 grid place-items-center rounded-lg border border-rose-100 text-rose-400 hover:bg-rose-50 transition" />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {codes.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-slate-400">هنوز کدی ثبت نشده.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="lg:col-span-2">
          <SimpleForm
            title="ایجاد کد تخفیف جدید"
            entity="discounts"
            submitLabel="ثبت کد تخفیف"
            fields={[
              { name: "code", label: "کد تخفیف (انگلیسی)", required: true, placeholder: "SAVE20", dir: "ltr" },
              { name: "type", label: "نوع تخفیف", type: "select", required: true, options: [{ value: "percent", label: "درصدی" }, { value: "fixed", label: "مبلغ ثابت (تومان)" }] },
              { name: "value", label: "مقدار (درصد یا تومان)", type: "number", required: true, placeholder: "20", dir: "ltr" },
              { name: "minOrder", label: "حداقل خرید (تومان)", type: "number", placeholder: "۰ = بدون شرط", dir: "ltr" },
              { name: "maxUses", label: "حداکثر تعداد استفاده", type: "number", placeholder: "100", dir: "ltr" },
              { name: "expiresAt", label: "تاریخ انقضا (خالی = بدون تاریخ)", type: "date" },
            ]}
            note="کدها در لحظه صدور فعال‌اند و تعداد استفاده آن‌ها با هر سفارش اعمال‌شده کم می‌شود."
          />
        </div>
      </div>
    </div>
  );
}
