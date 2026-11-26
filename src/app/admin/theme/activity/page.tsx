import { ScrollText, Search, Trash2 } from "lucide-react";
import { desc, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { activityLogs } from "@/db/schema";
import ActionButton from "@/components/theme/action-button";
import { faDate, toFaDigits } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ActivityPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const where = query ? or(ilike(activityLogs.action, `%${query}%`), ilike(activityLogs.detail, `%${query}%`), ilike(activityLogs.actor, `%${query}%`)) : undefined;
  const logs = await db.select().from(activityLogs).where(where).orderBy(desc(activityLogs.createdAt)).limit(100);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><ScrollText className="h-6 w-6 text-pink-600" /> گزارش فعالیت‌ها</h1>
          <p className="text-[11px] text-slate-500 mt-0.5">همه تغییرات قالب با نام انجام‌دهنده و زمان ثبت می‌شود — {toFaDigits(logs.length)} رویداد اخیر</p>
        </div>
        <ActionButton action="clearActivity" payload={{ days: 30 }} label="پاک‌سازی لاگ‌های قدیمی‌تر از ۳۰ روز" icon={<Trash2 className="h-4 w-4" />} confirm="فعالیت‌های قدیمی‌تر از ۳۰ روز حذف شوند؟" className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-200 text-rose-600 px-4 h-11 text-[10px] font-bold hover:bg-rose-50 transition" />
      </div>

      <form method="get" action="/admin/theme/activity" className="mt-3 relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input type="text" name="q" defaultValue={query} placeholder="جستجو در اقدام، جزئیات یا نام کاربر..." className="w-full h-11 rounded-2xl border border-slate-200 bg-white pr-10 pl-16 text-[12px] outline-none focus:border-pink-400" />
        <button type="submit" className="absolute left-1.5 top-1/2 -translate-y-1/2 h-8 px-4 rounded-xl bg-[#14264a] text-white text-[10px] font-bold">جستجو</button>
      </form>

      <ol className="mt-4 relative border-r-2 border-slate-200 pr-6 space-y-3">
        {logs.map((log) => (
          <li key={log.id} className="relative">
            <span className="absolute -right-[31px] top-1.5 h-4 w-4 rounded-full border-2 border-white bg-pink-500 shadow" />
            <div className="rounded-2xl border border-slate-200/70 bg-white px-4 py-2.5 shadow-sm flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="text-[10px] font-black text-[#14264a] whitespace-nowrap">{log.action}</span>
              <span className="text-[10px] text-slate-500 leading-5 flex-1 min-w-40">{log.detail}</span>
              <span className="text-[9px] text-slate-400 whitespace-nowrap">{log.actor} · {faDate(log.createdAt)}</span>
            </div>
          </li>
        ))}
        {logs.length === 0 && <li className="text-center text-slate-400 text-[12px] py-10">فعالیتی با این مشخصات ثبت نشده است.</li>}
      </ol>
    </div>
  );
}
