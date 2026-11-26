import { Inbox, MailOpen, Mail, Trash2, Reply, Phone } from "lucide-react";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import ActionButton from "@/components/theme/action-button";
import { toFaDigits, faDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><Inbox className="h-6 w-6 text-pink-600" /> پیام‌ها و پشتیبانی</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">{toFaDigits(unread)} خوانده‌نشده از {toFaDigits(messages.length)} پیام مشتریان</p>

      <div className="mt-4 space-y-2 max-w-4xl">
        {messages.map((m) => (
          <article key={m.id} className={`rounded-2xl border p-3 sm:p-4 shadow-sm transition ${m.read ? "border-slate-200/70 bg-white" : "border-pink-200 bg-pink-50/40"}`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`h-9 w-9 grid place-items-center rounded-xl ${m.read ? "bg-slate-100 text-slate-400" : "bg-pink-100 text-pink-600"}`}>{m.read ? <MailOpen className="h-5 w-5" /> : <Mail className="h-5 w-5" />}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-black text-[#14264a]">{m.name} <span className="font-normal text-slate-400 text-[9px]">· {m.contact}</span></p>
                <p className="text-[12px] font-bold text-slate-700">{m.subject}</p>
              </div>
              <span className="text-[8px] text-slate-400">{faDate(m.createdAt)}</span>
            </div>
            <p className="mt-2 text-[11px] leading-6 text-slate-600">{m.body}</p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              {m.contact.includes("@") ? (
                <a href={`mailto:${m.contact}?subject=پاسخ به «${encodeURIComponent(m.subject)}»`} className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 text-sky-700 px-3 h-9 text-[10px] font-bold hover:bg-sky-100 transition"><Reply className="h-4 w-4" /> پاسخ با ایمیل</a>
              ) : (
                <a href={`tel:${m.contact.replace(/\D/g, "")}`} dir="ltr" className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-3 h-9 text-[10px] font-bold hover:bg-emerald-100 transition"><Phone className="h-4 w-4" /> {m.contact}</a>
              )}
              <div className="flex items-center gap-1.5">
                <ActionButton action="messages.setRead" payload={{ entity: "messages", id: m.id, read: !m.read }} label={m.read ? "علامت نخوانده" : "علامت خوانده‌شده"}
                  className="h-9 px-3 rounded-xl border border-slate-200 text-[9px] font-bold text-slate-500 hover:border-pink-400 hover:text-pink-600 transition" />
                <ActionButton action="messages.delete" payload={{ entity: "messages", id: m.id }} label="" icon={<Trash2 className="h-4 w-4" />} confirm="این پیام حذف شود؟"
                  className="h-9 w-9 grid place-items-center rounded-xl border border-rose-100 text-rose-400 hover:bg-rose-50 transition" />
              </div>
            </div>
          </article>
        ))}
        {messages.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-[11px] text-slate-400">صندوق پیام‌ها خالی است.</div>}
      </div>
    </div>
  );
}
