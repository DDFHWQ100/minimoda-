import Link from "next/link";
import { Truck, Trash2, CheckCircle2, Circle, Settings2 } from "lucide-react";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { shippingMethods } from "@/db/schema";
import SimpleForm from "@/components/admin/simple-form";
import ActionButton from "@/components/theme/action-button";
import { toFaDigits, formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ShippingPage() {
  const methods = await db.select().from(shippingMethods).orderBy(asc(shippingMethods.sort), asc(shippingMethods.id));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><Truck className="h-6 w-6 text-pink-600" /> ارسال و حمل‌ونقل</h1>
          <p className="text-[11px] text-slate-500 mt-0.5">روش‌های ارسال فعال فروشگاه — هزینه‌ها و زمان تقریبی تحویل</p>
        </div>
        <Link href="/admin/theme/settings" className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-300 bg-white px-4 h-11 text-[10px] font-bold text-slate-600 hover:border-pink-400 hover:text-pink-600 transition"><Settings2 className="h-4 w-4" /> آستانه ارسال رایگان (تنظیمات فروشگاه)</Link>
      </div>

      <div className="mt-4 grid lg:grid-cols-5 gap-4 items-start">
        <div className="lg:col-span-3 space-y-2">
          {methods.map((m) => (
            <div key={m.id} className={`flex items-center gap-3 sm:gap-4 rounded-2xl border bg-white p-3 shadow-sm transition ${m.active ? "border-slate-200/70" : "border-slate-200/70 opacity-60"}`}>
              <div className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-sky-100 to-cyan-50 grid place-items-center"><Truck className="h-6 w-6 text-sky-600" /></div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-black text-[#14264a]">{m.name}</p>
                <p className="text-[9px] text-slate-400 mt-0.5">زمان تقریبی تحویل: {toFaDigits(m.etaDays)} روز کاری · رایگان برای خریدهای بالای {m.freeOver > 0 ? formatPrice(m.freeOver) : "—"}</p>
              </div>
              <div className="text-left shrink-0">
                <p className="text-[13px] font-black text-[#14264a]">{m.cost === 0 ? "رایگان" : formatPrice(m.cost)}</p>
                <p className="text-[8px] text-slate-400">هزینه هر ارسال</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <ActionButton action="shipping.toggle" payload={{ entity: "shipping", id: m.id, active: !m.active }} label="" icon={m.active ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-slate-300" />}
                  className="h-9 w-9 grid place-items-center rounded-xl hover:bg-slate-50 transition" />
                <ActionButton action="shipping.delete" payload={{ entity: "shipping", id: m.id }} label="" icon={<Trash2 className="h-5 w-5" />} confirm={`روش «${m.name}» حذف شود؟`}
                  className="h-9 w-9 grid place-items-center rounded-xl text-rose-400 hover:bg-rose-50 transition" />
              </div>
            </div>
          ))}
          {methods.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-[11px] text-slate-400">روشی ثبت نشده است.</div>}
          <p className="text-[9px] text-slate-400 leading-5 pr-1">هزینه و زمان واقعی نمایش داده‌شده به مشتری از همین جدول خوانده می‌شود؛ آستانه ارسال رایگان سراسری از «تنظیمات فروشگاه» اعمال می‌شود.</p>
        </div>

        <div className="lg:col-span-2">
          <SimpleForm
            title="افزودن روش ارسال"
            entity="shipping"
            submitLabel="ثبت روش ارسال"
            fields={[
              { name: "name", label: "نام روش *", required: true, placeholder: "مثلاً: پیک اختصاصی سعادت‌آباد" },
              { name: "cost", label: "هزینه ارسال (تومان)", type: "number", required: true, placeholder: "45000", dir: "ltr" },
              { name: "freeOver", label: "رایگان برای خرید بالای (تومان)", type: "number", placeholder: "2000000", dir: "ltr" },
              { name: "etaDays", label: "زمان تقریبی تحویل (روز کاری)", type: "number", required: true, placeholder: "2", dir: "ltr" },
              { name: "sort", label: "اولویت نمایش", type: "number", placeholder: "1", dir: "ltr" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
