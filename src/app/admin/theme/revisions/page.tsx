import { History, Download, RotateCcw, Trash2, ArchiveRestore, FileJson } from "lucide-react";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { revisions } from "@/db/schema";
import ActionButton from "@/components/theme/action-button";
import CompareRevisions from "@/components/theme/compare-revisions";
import { faDate, toFaDigits } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function RevisionsPage() {
  const all = await db.select().from(revisions).orderBy(desc(revisions.createdAt)).limit(50);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><History className="h-6 w-6 text-pink-600" /> پشتیبان‌گیری و نسخه‌بندی</h1>
          <p className="text-[11px] text-slate-500 mt-0.5">تصویر لحظه‌ای از کل قالب (رنگ‌ها، فونت، بنرها، اجزا، قالب فعال) — دانلود، بازیابی یا حذف هر نسخه</p>
        </div>
        <ActionButton action="createRevision" promptLabel="برچسب این نسخه پشتیبان:" promptPlaceholder="مثلاً: قبل از کمپین نوروز" label="تهیه پشتیبان جدید" icon={<ArchiveRestore className="h-5 w-5" />} className="inline-flex items-center gap-2 rounded-2xl bg-pink-600 text-white px-5 h-12 text-[12px] font-black hover:bg-pink-500 transition shadow-lg shadow-pink-600/20" />
      </div>

      {all.length >= 2 && <CompareRevisions revisions={all.map((r) => ({ id: r.id, label: r.label }))} />}
      {all.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <FileJson className="h-12 w-12 text-slate-300 mx-auto" strokeWidth={1.4} />
          <h2 className="mt-2 font-black text-[#14264a]">هنوز نسخه پشتیبانی گرفته نشده</h2>
          <p className="mt-1 text-[11px] text-slate-500">قبل از هر تغییر بزرگ، یک پشتیبان بگیرید — بازیابی آن فقط یک کلیک است.</p>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-3xl border border-slate-200/70 bg-white shadow-sm">
          <table className="w-full text-[11px] min-w-[640px]">
            <thead className="bg-slate-50 text-slate-500 text-right">
              <tr><th className="py-3 px-4 font-black">#</th><th className="py-3 px-2 font-black">برچسب</th><th className="py-3 px-2 font-black">تاریخ ثبت</th><th className="py-3 px-2 font-black">ثبت‌کننده</th><th className="py-3 px-2 font-black">حجم</th><th className="py-3 px-4 font-black">عملیات</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {all.map((rev) => (
                <tr key={rev.id} className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-4 font-black text-[#14264a]">#{toFaDigits(rev.id)}</td>
                  <td className="py-2.5 px-2 font-bold text-slate-600">{rev.label}</td>
                  <td className="py-2.5 px-2 text-slate-400">{faDate(rev.createdAt)}</td>
                  <td className="py-2.5 px-2 text-slate-500">{rev.createdBy}</td>
                  <td className="py-2.5 px-2 text-slate-400">{(rev.snapshot.length / 1024).toFixed(1)} KB</td>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-1">
                      <a href={`/api/admin/theme?action=revisionDownload&id=${rev.id}`} title="دانلود فایل JSON" className="h-8 w-8 grid place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-sky-400 hover:text-sky-600 transition"><Download className="h-4 w-4" /></a>
                      <ActionButton action="restoreRevision" payload={{ id: rev.id }} label="" icon={<RotateCcw className="h-4 w-4" />} confirm={`قالب به نسخه «${rev.label}» بازگردانده شود؟ تغییرات فعلی از دست می‌رود.`} className="h-8 w-8 grid place-items-center rounded-lg border border-amber-200 text-amber-600 hover:bg-amber-50 transition" />
                      <ActionButton action="deleteRevision" payload={{ id: rev.id }} label="" icon={<Trash2 className="h-4 w-4" />} confirm={`نسخه «${rev.label}» برای همیشه حذف شود؟`} className="h-8 w-8 grid place-items-center rounded-lg border border-rose-100 text-rose-400 hover:bg-rose-50 transition" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-3 text-[9px] text-slate-400">بازیابی، تنظیمات طراحی، وضعیت اجزای صفحه اصلی، بنرها و قالب فعال را به‌طور کامل بازمی‌گرداند؛ سپس گزارش فعالیت با نام «بازیابی نسخه» ثبت می‌شود.</p>
    </div>
  );
}
