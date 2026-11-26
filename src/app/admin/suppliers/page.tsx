import { Truck, Trash2, Phone, MapPin, User } from "lucide-react";
import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { suppliers } from "@/db/schema";
import SimpleForm from "@/components/admin/simple-form";
import ActionButton from "@/components/theme/action-button";
import { toFaDigits, faDay } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SuppliersPage() {
  const all = await db.select().from(suppliers).orderBy(asc(suppliers.id));

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><Truck className="h-6 w-6 text-pink-600" /> تأمین‌کنندگان</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">{toFaDigits(all.length)} تأمین‌کننده ثبت‌شده — پارچه، پوشاک و کفش</p>

      <div className="mt-4 grid lg:grid-cols-5 gap-4 items-start">
        <div className="lg:col-span-3 grid sm:grid-cols-2 gap-2">
          {all.map((s) => (
            <article key={s.id} className="rounded-3xl border border-slate-200/70 bg-white p-4 shadow-sm flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-black text-[13px] text-[#14264a] leading-6">{s.name}</h2>
                <ActionButton action="suppliers.delete" payload={{ entity: "suppliers", id: s.id }} label="" icon={<Trash2 className="h-4 w-4" />} confirm={`تأمین‌کننده «${s.name}» حذف شود؟`}
                  className="h-8 w-8 shrink-0 grid place-items-center rounded-lg border border-rose-100 text-rose-400 hover:bg-rose-50 transition" />
              </div>
              <div className="mt-2 space-y-1 text-[10px] text-slate-500">
                {s.contactPerson && <p className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-slate-400" />{s.contactPerson}</p>}
                {s.phone && <p className="flex items-center gap-1.5" dir="ltr"><Phone className="h-3.5 w-3.5 text-slate-400" />{s.phone}</p>}
                {s.address && <p className="flex items-start gap-1.5"><MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />{s.address}</p>}
              </div>
              {s.notes && <p className="mt-2 text-[9px] leading-5 text-slate-400 border-t border-dashed border-slate-200 pt-2 flex-1">{s.notes}</p>}
              <p className="mt-2 text-[8px] text-slate-400">ثبت: {faDay(s.createdAt)}</p>
            </article>
          ))}
          {all.length === 0 && <div className="sm:col-span-2 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-[11px] text-slate-400">هنوز تأمین‌کننده‌ای ثبت نشده است.</div>}
        </div>
        <div className="lg:col-span-2">
          <SimpleForm
            title="افزودن تأمین‌کننده"
            entity="suppliers"
            submitLabel="ثبت تأمین‌کننده"
            fields={[
              { name: "name", label: "نام شرکت / کارگاه *", required: true, placeholder: "مثلاً: نساجی پارینه یزد" },
              { name: "contactPerson", label: "رابط", placeholder: "مهندس شریفی" },
              { name: "phone", label: "تلفن", type: "tel", placeholder: "09132567890", dir: "ltr" },
              { name: "address", label: "آدرس", placeholder: "شهر، شهرک صنعتی...", full: true },
              { name: "notes", label: "یادداشت (شرایط پرداخت، MOQ...)", type: "textarea", placeholder: "۱۵ روز تسویه — MOQ هر سایز ۱۰۰ عدد" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
