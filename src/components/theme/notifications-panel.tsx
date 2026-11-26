"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, AlertTriangle, ShieldCheck, CheckCircle2, Info, Trash2, Send, Loader2, CheckCheck, Megaphone } from "lucide-react";
import { faDate, toFaDigits } from "@/lib/format";

type Notice = { id: number; level: string; title: string; body: string; read: boolean; createdAt: string };

const LEVELS = [
  { value: "info", label: "اطلاع‌رسانی", icon: Info, tone: "text-sky-700 bg-sky-50 border-sky-200" },
  { value: "success", label: "موفقیت", icon: CheckCircle2, tone: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { value: "warning", label: "هشدار", icon: AlertTriangle, tone: "text-amber-800 bg-amber-50 border-amber-200" },
  { value: "security", label: "امنیتی", icon: ShieldCheck, tone: "text-rose-700 bg-rose-50 border-rose-200" },
];
const levelOf = (l: string) => LEVELS.find((x) => x.value === l) ?? LEVELS[0];

export default function NotificationsPanel({ notices }: { notices: Notice[] }) {
  const router = useRouter();
  const [level, setLevel] = useState("info");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const post = async (payload: Record<string, unknown>) => {
    const res = await fetch("/api/admin/theme", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.error ?? "خطا"); }
    router.refresh();
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await post({ action: "postNotice", level, title, body });
      setTitle(""); setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا");
    } finally {
      setLoading(false);
    }
  };

  const unread = notices.filter((n) => !n.read).length;

  return (
    <div className="mt-4 grid lg:grid-cols-5 gap-4 items-start">
      {/* فرم انتشار اعلان */}
      <form onSubmit={create} className="lg:col-span-2 rounded-3xl border border-slate-200/70 bg-white p-4 sm:p-5 shadow-sm space-y-3">
        <h2 className="flex items-center gap-2 text-[12px] font-black text-[#14264a]"><Megaphone className="h-4 w-4 text-pink-600" /> انتشار اعلان مدیریتی</h2>
        <div>
          <span className="text-[10px] font-bold text-slate-500">نوع اعلان</span>
          <div className="mt-1.5 grid grid-cols-4 gap-1.5">
            {LEVELS.map(({ value, label, icon: Icon }) => (
              <button key={value} type="button" onClick={() => setLevel(value)} className={`rounded-xl border px-1 py-2 text-[9px] font-bold flex flex-col items-center gap-1 transition ${level === value ? "border-pink-600 bg-pink-50 text-pink-700 shadow" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}><Icon className="h-4 w-4" />{label}</button>
            ))}
          </div>
        </div>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان اعلان..." className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[12px] font-bold outline-none focus:border-pink-400" />
        <textarea required value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="متن کامل اعلان..." className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] leading-6 outline-none focus:border-pink-400 resize-none" />
        {error && <p className="rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold px-3 py-2">{error}</p>}
        <button type="submit" disabled={loading} className="w-full h-12 rounded-2xl bg-[#14264a] text-amber-300 font-black text-[12px] hover:bg-[#1d3a63] transition disabled:opacity-50 flex items-center justify-center gap-2">{loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />} انتشار اعلان</button>
        <button type="button" onClick={() => post({ action: "markAllNoticesRead" })} className="w-full h-10 rounded-2xl border border-slate-200 text-slate-500 text-[10px] font-bold hover:border-pink-400 hover:text-pink-600 transition flex items-center justify-center gap-1.5"><CheckCheck className="h-4 w-4" /> علامت‌زدن همه به‌عنوان خوانده‌شده</button>
      </form>

      {/* لیست اعلان‌ها */}
      <div className="lg:col-span-3 space-y-2">
        <p className="text-[10px] font-black text-slate-500">{toFaDigits(unread)} خوانده‌نشده از {toFaDigits(notices.length)} اعلان</p>
        {notices.map((n) => {
          const { icon: Icon, tone } = levelOf(n.level);
          return (
            <article key={n.id} className={`rounded-2xl border px-4 py-3 flex items-start gap-3 shadow-sm transition ${tone} ${n.read ? "opacity-60" : ""}`}>
              <Icon className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-black">{n.title}</p>
                  <span className="text-[8px] whitespace-nowrap opacity-70">{faDate(n.createdAt)}</span>
                </div>
                <p className="mt-0.5 text-[10px] leading-5 opacity-90">{n.body}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  {!n.read && <button onClick={() => post({ action: "dismissNotice", id: n.id })} className="text-[9px] font-black rounded-full border border-current/30 px-2.5 h-6 hover:bg-white/50 transition">خواندم</button>}
                  <button onClick={() => window.confirm("این اعلان حذف شود؟") && post({ action: "deleteNotice", id: n.id })} className="text-[9px] font-black rounded-full border border-current/30 px-2.5 h-6 hover:bg-white/50 transition flex items-center gap-1"><Trash2 className="h-3 w-3" /> حذف</button>
                </div>
              </div>
            </article>
          );
        })}
        {notices.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-[11px] text-slate-400"><Bell className="h-10 w-10 mx-auto text-slate-300 mb-2" />اعلانی ثبت نشده است.</div>}
      </div>
    </div>
  );
}
