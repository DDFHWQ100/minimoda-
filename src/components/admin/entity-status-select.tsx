"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const OPTIONS: Record<string, Record<string, string>> = {
  returns: { requested: "در انتظار بررسی", approved: "تأیید شده", rejected: "رد شده", done: "انجام شد" },
};
const TONES: Record<string, string> = {
  requested: "border-amber-300 text-amber-800 bg-amber-50",
  approved: "border-sky-300 text-sky-800 bg-sky-50",
  rejected: "border-rose-300 text-rose-800 bg-rose-50",
  done: "border-emerald-300 text-emerald-800 bg-emerald-50",
};

/** انتخاب وضعیت عمومی برای موجودیت‌های مدیریتی (در حال حاضر: مرجوعی) */
export default function EntityStatusSelect({ entity, id, status }: { entity: string; id: number; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();
  const options = OPTIONS[entity] ?? {};

  const change = async (next: string) => {
    const prev = value;
    setValue(next);
    setLoading(true);
    const res = await fetch("/api/admin/manage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity, action: "setStatus", id, status: next }),
    });
    setLoading(false);
    if (!res.ok) { setValue(prev); window.alert("ذخیره نشد — با حساب مدیر وارد شده‌اید؟"); return; }
    startTransition(() => router.refresh());
  };

  return (
    <span className="inline-flex items-center gap-1.5">
      <select value={value} onChange={(e) => change(e.target.value)} disabled={loading} aria-label="تغییر وضعیت"
        className={`h-8 rounded-lg border text-[10px] font-bold px-2 outline-none cursor-pointer ${TONES[value] ?? "border-slate-200"}`}>
        {Object.entries(options).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
      {loading && <Loader2 className="h-4 w-4 animate-spin text-pink-500" />}
    </span>
  );
}
