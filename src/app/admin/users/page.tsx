import { ShieldCheck, ShieldEllipsis, ShieldX, Users } from "lucide-react";
import { sql, desc, eq, count } from "drizzle-orm";
import { db } from "@/db";
import { users, orders } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import ActionButton from "@/components/theme/action-button";
import { toFaDigits, faDay } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const me = await getSessionUser();
  const allUsers = await db
    .select({ id: users.id, name: users.name, email: users.email, phone: users.phone, role: users.role, createdAt: users.createdAt, ordersCount: count(orders.id) })
    .from(users)
    .leftJoin(orders, eq(orders.userId, users.id))
    .groupBy(users.id)
    .orderBy(desc(users.createdAt));

  const admins = allUsers.filter((u) => u.role === "admin").length;

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><Users className="h-6 w-6 text-pink-600" /> کاربران و سطح دسترسی</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">{toFaDigits(allUsers.length)} کاربر — {toFaDigits(admins)} مدیر · ارتقا/تنزل نقش با یک کلیک (حذف نشست‌ها هنگام تنزل)</p>

      <div className="mt-4 overflow-x-auto rounded-3xl border border-slate-200/70 bg-white shadow-sm">
        <table className="w-full text-[11px] min-w-[680px]">
          <thead className="bg-slate-50 text-slate-500 text-right">
            <tr><th className="py-3 px-4 font-black">کاربر</th><th className="py-3 px-2 font-black">ایمیل</th><th className="py-3 px-2 font-black">سفارش‌ها</th><th className="py-3 px-2 font-black">عضویت</th><th className="py-3 px-2 font-black">نقش</th><th className="py-3 px-4 font-black">تغییر نقش</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {allUsers.map((u) => {
              const isAdmin = u.role === "admin";
              const isSelf = me?.id === u.id;
              return (
                <tr key={u.id} className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="h-9 w-9 grid place-items-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-[#14264a] text-[12px] font-black">{u.name?.trim()?.[0] ?? "؟"}</span>
                      <div><p className="font-bold text-[#14264a] leading-4">{u.name}{isSelf && <span className="mr-1 text-[8px] text-emerald-600 font-black">(شما)</span>}</p><p className="text-[8px] text-slate-400" dir="ltr">{u.phone}</p></div>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-slate-500" dir="ltr">{u.email}</td>
                  <td className="py-2.5 px-2 text-slate-500">{toFaDigits(Number(u.ordersCount))}</td>
                  <td className="py-2.5 px-2 text-slate-400">{faDay(u.createdAt)}</td>
                  <td className="py-2.5 px-2">{isAdmin ? <span className="inline-flex items-center gap-1 text-[9px] font-black text-amber-800 bg-amber-100 border border-amber-200 rounded-full px-2 py-1"><ShieldCheck className="h-3.5 w-3.5" />مدیر</span> : <span className="text-[9px] font-bold text-slate-500">مشتری</span>}</td>
                  <td className="py-2.5 px-4">
                    {isSelf ? (
                      <span className="text-[9px] text-slate-400">نقش خودتان قابل تغییر نیست</span>
                    ) : (
                      <ActionButton action="users.setRole" payload={{ entity: "users", id: u.id, role: isAdmin ? "user" : "admin" }}
                        label={isAdmin ? "تنزل به مشتری" : "ارتقا به مدیر"}
                        icon={isAdmin ? <ShieldX className="h-4 w-4" /> : <ShieldEllipsis className="h-4 w-4" />}
                        confirm={isAdmin ? `نقش ${u.name} از مدیر به مشتری تغییر کند؟ نشست‌هایش باطل می‌شوند.` : `${u.name} به مدیر فروشگاه ارتقا یابد؟`}
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 h-9 text-[10px] font-bold transition ${isAdmin ? "border-rose-200 text-rose-600 hover:bg-rose-50" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`} />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[9px] text-slate-400">نکته: «مدیریت قالب» (theme) و نشست‌ها در بخش «مدیریت قالب و پوسته» مدیریت می‌شوند؛ همه تغییرات نقش در گزارش فعالیت ثبت می‌شود.</p>
    </div>
  );
}
