"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { ORDER_STATUS } from "@/lib/format";

export default function OrderStatusSelect({ orderId, status }: { orderId: number; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();

  const change = async (next: string) => {
    const previous = value;
    setValue(next);
    setLoading(true);
    setError("");
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setValue(previous);
      setError(data.error ?? "ذخیره نشد");
      return;
    }
    startTransition(() => router.refresh());
  };

  return (
    <span className="inline-flex items-center gap-1.5">
      <select
        value={value}
        onChange={(e) => change(e.target.value)}
        disabled={loading}
        aria-label="تغییر وضعیت سفارش"
        className="h-8 rounded-lg border border-slate-200 bg-white text-[10px] font-bold px-1.5 outline-none focus:border-pink-400"
      >
        {Object.entries(ORDER_STATUS).map(([k, v]) => (
          <option key={k} value={k}>{v.label}</option>
        ))}
      </select>
      {loading && <Loader2 className="h-4 w-4 animate-spin text-pink-500" />}
      {error && <span className="text-[9px] font-bold text-rose-600 max-w-40" title={error}>ذخیره نشد — ورود یک‌کلیکی را بزنید</span>}
    </span>
  );
}
