import { ShieldCheck, MonitorSmartphone, LogIn, KeyRound, FileWarning, Lock, Trash2, CheckCircle2, Info } from "lucide-react";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import ActionButton from "@/components/theme/action-button";
import { faDate, toFaDigits } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SecurityPage() {
  const me = await getSessionUser();
  const allSessions = await db
    .select({ id: sessions.id, userId: sessions.userId, expiresAt: sessions.expiresAt, name: users.name, email: users.email })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .orderBy(desc(sessions.id))
    .limit(30);

  const active = allSessions.length;

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><ShieldCheck className="h-6 w-6 text-pink-600" /> امنیت و کنترل دسترسی قالب</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">نشست‌های فعال، سطح دسترسی ویرایشگرها و وضعیت محافظت از تنظیمات حساس</p>

      {/* نشست‌های فعال */}
      <section className="mt-4 rounded-3xl border border-slate-200/70 bg-white shadow-sm overflow-hidden">
        <header className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-3 border-b border-slate-100 bg-slate-50/60">
          <h2 className="text-[12px] font-black text-[#14264a] flex items-center gap-2"><MonitorSmartphone className="h-4 w-4" /> نشست‌های فعال ({toFaDigits(active)})</h2>
          <ActionButton action="revokeOtherSessions" label="ابطال همه نشست‌های دیگر" icon={<Trash2 className="h-4 w-4" />}
            confirm="همه نشست‌های فعال (به‌جز این نشست) باطل شوند؟ کاربران باید دوباره وارد شوند."
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 text-rose-600 px-3 h-9 text-[10px] font-bold hover:bg-rose-50 transition" />
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] min-w-[620px]">
            <thead className="text-slate-400 text-right bg-white">
              <tr className="border-b border-slate-100"><th className="py-2 px-4 font-bold">کاربر</th><th className="py-2 px-2 font-bold">ایمیل</th><th className="py-2 px-2 font-bold">انقضای نشست</th><th className="py-2 px-4 font-bold">عملیات</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {allSessions.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60">
                  <td className="py-2 px-4 font-bold text-[#14264a]">{s.name}{me?.id === s.userId && <span className="mr-1.5 text-[8px] text-emerald-600 font-black">(شما)</span>}</td>
                  <td className="py-2 px-2 text-slate-500" dir="ltr">{s.email}</td>
                  <td className="py-2 px-2 text-slate-400">{faDate(s.expiresAt)}</td>
                  <td className="py-2 px-4">
                    {me?.id === s.userId ? (
                      <span className="text-[9px] text-slate-400">نشست فعلی</span>
                    ) : (
                      <ActionButton action="revokeSession" payload={{ id: s.id }} label="ابطال" icon={<Trash2 className="h-4 w-4" />}
                        confirm={`نشست ${s.name} باطل شود؟`}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-100 text-rose-500 px-2.5 h-8 text-[10px] font-bold hover:bg-rose-50 transition" />
                    )}
                  </td>
                </tr>
              ))}
              {allSessions.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-slate-400">نشست فعالی وجود ندارد.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {/* ماتریس دسترسی */}
      <section className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-slate-200/70 bg-white shadow-sm p-4 sm:p-5">
          <h2 className="text-[12px] font-black text-[#14264a] flex items-center gap-2"><KeyRound className="h-4 w-4 text-amber-500" /> سطح دسترسی ویرایشگر قالب</h2>
          <ul className="mt-2 divide-y divide-slate-100 text-[11px]">
            {[
              ["مشاهده پنل قالب", "مدیر + ویرایشگر قالب", true],
              ["ویرایش رنگ/فونت/اجزا", "فقط مدیر ارشد", true],
              ["ویرایش کد (CSS/JS)", "فقط مدیر ارشد", true],
              ["حذف قالب و فایل‌ها", "فقط مدیر ارشد", true],
              ["بازیابی نسخه پشتیبان", "فقط مدیر ارشد", true],
            ].map(([perm, who, on]) => (
              <li key={perm as string} className="flex items-center justify-between gap-3 py-2">
                <span className="text-slate-600">{perm}</span>
                <span className="flex items-center gap-1.5 font-bold text-emerald-700"><CheckCircle2 className="h-4 w-4" />{who}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[9px] text-slate-400">نقش «ویرایشگر قالب» در این نسخه به‌صورت سیستمی غیرفعال است؛ همه ویرایش‌ها با حساب مدیر انجام می‌شود و در گزارش فعالیت ثبت می‌گردد.</p>
        </div>
        <div className="rounded-3xl border border-slate-200/70 bg-white shadow-sm p-4 sm:p-5">
          <h2 className="text-[12px] font-black text-[#14264a] flex items-center gap-2"><Lock className="h-4 w-4 text-sky-600" /> محافظت از داده‌های حساس</h2>
          <ul className="mt-2 divide-y divide-slate-100 text-[11px]">
            {[
              ["اعتبارسنجی همه ورودی‌ها در سرور", true, "فعال"],
              ["CSRF روی فرم‌ها (توکن جلسه‌ای)", true, "فعال"],
              ["اسکن کد مخرب در فایل‌های آپلودی", true, "فعال"],
              ["حذف فقط از پوشه uploads", true, "فعال"],
              ["رمزنگاری رمزها با bcrypt/scrypt", true, "فعال"],
              ["تأیید دومرحله‌ای (2FA) برای تغییرات قالب", false, "نیازمند درگاه پیامکی/ایمیل OTP"],
            ].map(([item, on, note]) => (
              <li key={item as string} className="flex items-center justify-between gap-3 py-2">
                <span className="text-slate-600">{item}</span>
                <span className={`flex items-center gap-1.5 text-[9px] font-bold whitespace-nowrap ${on ? "text-emerald-700" : "text-amber-700"}`}>{on ? <CheckCircle2 className="h-4 w-4" /> : <Info className="h-4 w-4" />}{note}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 flex items-start gap-1.5 text-[9px] text-slate-400"><FileWarning className="h-4 w-4 shrink-0 text-amber-500" /> تأیید دومرحله‌ای به یک ارائه‌دهنده OTP بیرونی (مثل کاوه‌نگار یا Twilio) و تأیید شماره موبایل نیاز دارد؛ به همین دلیل در این نسخه غیرفعال است و در «اعلان‌ها» به‌عنوان کار زیرساختی ثبت شده است.</p>
        </div>
      </section>
    </div>
  );
}
