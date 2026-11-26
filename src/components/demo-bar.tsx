"use client";

import { useState } from "react";
import Link from "next/link";
import { Crown, UserRound, Loader2, Sparkles } from "lucide-react";

/** نوار نسخه نمایشی — ورود یک‌کلیکی بدون نیاز به تایپ رمز */
export default function DemoBar() {
  const [loading, setLoading] = useState<"admin" | "user" | null>(null);

  const quickLogin = async (kind: "admin" | "user") => {
    setLoading(kind);
    try {
      const creds =
        kind === "admin"
          ? { email: "admin@minimoda.ir", password: "admin123" }
          : { email: "sara@example.com", password: "user123" };
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
      });
      if (res.ok) {
        window.location.assign(kind === "admin" ? "/admin" : "/");
        return;
      }
    } catch {
      /* ignore */
    }
    setLoading(null);
  };

  return (
    <div className="relative z-[60] bg-gradient-to-l from-amber-400 via-yellow-300 to-amber-400 text-[#3d2b0a] text-[10px] sm:text-[11px]">
      <div className="mx-auto max-w-7xl px-3 h-8 flex items-center justify-center gap-2 sm:gap-3 font-bold whitespace-nowrap overflow-x-auto no-scrollbar">
        <span className="hidden xs:flex items-center gap-1 font-black"><Sparkles className="h-3.5 w-3.5" /> نسخه نمایشی:</span>
        <button onClick={() => quickLogin("admin")} disabled={loading !== null}
          className="flex items-center gap-1 rounded-full bg-[#14264a] text-amber-300 px-3 py-0.5 hover:bg-[#0e1c36] transition font-black disabled:opacity-60">
          {loading === "admin" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Crown className="h-3.5 w-3.5" />}
          ورود یک‌کلیکی مدیر
        </button>
        <button onClick={() => quickLogin("user")} disabled={loading !== null}
          className="flex items-center gap-1 rounded-full border border-[#3d2b0a]/40 px-3 py-0.5 hover:bg-[#3d2b0a] hover:text-amber-300 transition font-black disabled:opacity-60">
          {loading === "user" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserRound className="h-3.5 w-3.5" />}
          ورود یک‌کلیکی مشتری
        </button>
        <Link href="/admin" className="underline underline-offset-2 hover:text-pink-800 transition font-black hidden md:inline">داشبورد مدیریت ←</Link>
      </div>
    </div>
  );
}
