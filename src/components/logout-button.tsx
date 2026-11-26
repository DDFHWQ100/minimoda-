"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const logout = async () => {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };
  return (
    <button onClick={logout} disabled={loading} className="inline-flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-rose-500/80 border border-white/20 text-white px-4 h-10 text-[11px] font-bold transition disabled:opacity-60">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      خروج از حساب
    </button>
  );
}
