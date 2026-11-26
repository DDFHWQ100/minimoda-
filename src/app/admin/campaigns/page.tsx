import Image from "next/image";
import { Megaphone, Trash2, CheckCircle2, Circle, CalendarDays, TicketPercent } from "lucide-react";
import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { campaigns, discountCodes } from "@/db/schema";
import SimpleForm from "@/components/admin/simple-form";
import ActionButton from "@/components/theme/action-button";
import { toFaDigits, faDay } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const [all, codes] = await Promise.all([
    db.select().from(campaigns).orderBy(desc(campaigns.createdAt)),
    db.select({ id: discountCodes.id, code: discountCodes.code }).from(discountCodes),
  ]);
  const codeOf = (id: number | null) => codes.find((c) => c.id === id)?.code;

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><Megaphone className="h-6 w-6 text-pink-600" /> بازاریابی و کمپین‌ها</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">{toFaDigits(all.length)} کمپین — بازه زمانی، بنر و کد تخفیف مرتبط</p>

      <div className="mt-4 grid lg:grid-cols-5 gap-4 items-start">
        <div className="lg:col-span-3 space-y-2">
          {all.map((c) => {
            const now = new Date();
            const live = c.active && (!c.startAt || c.startAt <= now) && (!c.endAt || c.endAt >= now);
            return (
              <article key={c.id} className={`flex gap-3 rounded-2xl border bg-white p-3 shadow-sm transition ${c.active ? "border-slate-200/70" : "border-slate-200/70 opacity-60"}`}>
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-[#f6f4ef]">
                  {c.bannerImage ? <Image src={c.bannerImage} alt={c.title} fill sizes="120px" className="object-cover" /> : <span className="absolute inset-0 grid place-items-center text-slate-300"><Megaphone className="h-8 w-8" /></span>}
                  {live && <span className="absolute top-1 right-1 rounded-md bg-emerald-500 text-white text-[7px] font-black px-1.5 py-0.5">در حال اجرا</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-black text-[#14264a]">{c.title}</p>
                  <p className="text-[9px] text-slate-500 leading-5 line-clamp-2">{c.description}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[8px] text-slate-400">
                    <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{c.startAt ? faDay(c.startAt) : "—"} تا {c.endAt ? faDay(c.endAt) : "—"}</span>
                    {codeOf(c.discountCodeId) && <span className="flex items-center gap-1 text-pink-700 font-bold"><TicketPercent className="h-3 w-3" />کد: {codeOf(c.discountCodeId)}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <ActionButton action="campaigns.toggle" payload={{ entity: "campaigns", id: c.id, active: !c.active }} label="" icon={c.active ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-slate-300" />}
                    className="h-9 w-9 grid place-items-center rounded-xl hover:bg-slate-50 transition" />
                  <ActionButton action="campaigns.delete" payload={{ entity: "campaigns", id: c.id }} label="" icon={<Trash2 className="h-5 w-5" />} confirm={`کمپین «${c.title}» حذف شود؟`}
                    className="h-9 w-9 grid place-items-center rounded-xl text-rose-400 hover:bg-rose-50 transition" />
                </div>
              </article>
            );
          })}
          {all.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-[11px] text-slate-400">کمپینی ثبت نشده است.</div>}
        </div>

        <div className="lg:col-span-2">
          <SimpleForm
            title="ایجاد کمپین جدید"
            entity="campaigns"
            submitLabel="ثبت کمپین"
            fields={[
              { name: "title", label: "عنوان کمپین *", required: true, placeholder: "مثلاً: جشنواره تابستانی" },
              { name: "slug", label: "اسلاگ (اختیاری)", placeholder: "summer-festival", dir: "ltr" },
              { name: "description", label: "توضیحات", type: "textarea", placeholder: "شرح کمپین و شرایط استفاده..." },
              { name: "bannerImage", label: "آدرس بنر کمپین", placeholder: "https://...", dir: "ltr" },
              { name: "startAt", label: "شروع کمپین", type: "date" },
              { name: "endAt", label: "پایان کمپین", type: "date" },
              { name: "discountCodeId", label: "کد تخفیف مرتبط", type: "select", options: [{ value: "0", label: "بدون کد تخفیف" }, ...codes.map((c) => ({ value: String(c.id), label: c.code }))] },
            ]}
            note="کمپین‌های فعال و در بازه زمانی، در گزارش‌ها و داشبورد مشخص می‌شوند."
          />
        </div>
      </div>
    </div>
  );
}
