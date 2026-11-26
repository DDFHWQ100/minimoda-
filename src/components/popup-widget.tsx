"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Gift } from "lucide-react";

type Config = { heading?: string; body?: string; cta?: string; href?: string; delay?: number; showOnce?: boolean };

/** پاپ‌آپ قابل مدیریت از پنل قالب — بدون کد اجرایی، فقط متن و لینک */
export default function PopupWidget({ id, config }: { id: number; config: string }) {
  const [open, setOpen] = useState(false);
  let c: Config = {};
  try { c = JSON.parse(config || "{}"); } catch { c = {}; }
  const storageKey = `mm_popup_${id}`;

  useEffect(() => {
    if (c.showOnce !== false && typeof window !== "undefined" && window.localStorage.getItem(storageKey) === "1") return;
    const t = window.setTimeout(() => setOpen(true), Math.max(0, Number(c.delay ?? 4)) * 1000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const close = () => {
    setOpen(false);
    try { window.localStorage.setItem(storageKey, "1"); } catch { /* ignore */ }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={c.heading ?? "پیام"}>
      <div className="absolute inset-0 bg-[#0b1a33]/60 backdrop-blur-sm" onClick={close} />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-[fadeUp_.35s_ease]">
        <button onClick={close} aria-label="بستن" className="absolute top-3 left-3 h-9 w-9 grid place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"><X className="h-5 w-5" /></button>
        <div className="mx-auto h-16 w-16 rounded-2xl grid place-items-center shadow-lg" style={{ background: "linear-gradient(135deg, #fcd34d, #f59e0b)" }}><Gift className="h-8 w-8 text-[#1b3a6b]" /></div>
        <h2 className="mt-4 text-center text-xl font-black text-[#1b3a6b]">{c.heading ?? "خوش آمدید"}</h2>
        {c.body && <p className="mt-2 text-center text-[13px] leading-7 text-slate-600">{c.body}</p>}
        <Link href={c.href ?? "/products"} onClick={close} className="mt-5 flex h-12 items-center justify-center rounded-full text-white font-black text-sm shadow-lg hover:brightness-110 transition" style={{ background: "var(--brand-accent)" }}>{c.cta ?? "مشاهده"}</Link>
      </div>
    </div>
  );
}
