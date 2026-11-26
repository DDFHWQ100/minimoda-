import { BadgeCheck, Trash2 } from "lucide-react";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { brands } from "@/db/schema";
import SimpleForm from "@/components/admin/simple-form";
import ActionButton from "@/components/theme/action-button";
import { toFaDigits, faDay } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const all = await db.select().from(brands).orderBy(asc(brands.id));

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><BadgeCheck className="h-6 w-6 text-pink-600" /> برندهای فروشگاه</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">{toFaDigits(all.length)} برند ثبت‌شده — هویت تولیدکنندگان پوشاک</p>

      <div className="mt-4 grid lg:grid-cols-5 gap-4 items-start">
        <div className="lg:col-span-3 grid sm:grid-cols-2 gap-2">
          {all.map((b) => (
            <article key={b.id} className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm flex items-center gap-3">
              <span className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-50 grid place-items-center text-[16px] font-black text-amber-700">{b.name.trim()[0] ?? "؟"}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-black text-[#14264a]">{b.name}</p>
                <p dir="ltr" className="text-[8px] text-slate-400 font-mono">/{b.slug}</p>
                <p className="text-[8px] text-slate-400 mt-0.5">ثبت: {faDay(b.createdAt)}</p>
              </div>
              <ActionButton action="brands.delete" payload={{ entity: "brands", id: b.id }} label="" icon={<Trash2 className="h-4 w-4" />} confirm={`برند «${b.name}» حذف شود؟`}
                className="h-9 w-9 shrink-0 grid place-items-center rounded-xl border border-rose-100 text-rose-400 hover:bg-rose-50 transition" />
            </article>
          ))}
          {all.length === 0 && <div className="sm:col-span-2 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-[11px] text-slate-400">برندی ثبت نشده است.</div>}
        </div>
        <div className="lg:col-span-2">
          <SimpleForm
            title="افزودن برند جدید"
            entity="brands"
            submitLabel="ثبت برند"
            fields={[
              { name: "name", label: "نام برند *", required: true, placeholder: "مثلاً: آروشا" },
              { name: "slug", label: "اسلاگ (اختیاری)", placeholder: "arusha", dir: "ltr" },
              { name: "logo", label: "آدرس لوگو (اختیاری)", placeholder: "https://...", dir: "ltr" },
            ]}
            note="برندها در گزارش‌های فروش و فیلترهای آینده کاتالوگ استفاده می‌شوند."
          />
        </div>
      </div>
    </div>
  );
}
