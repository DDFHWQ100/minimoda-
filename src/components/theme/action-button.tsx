"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * دکمه اکشن عمومی پنل قالب — ارسال POST به /api/admin/theme
 * props: confirm (پیام تأیید) | promptLabel (گرفتن ورودی متنی از کاربر)
 */
export default function ActionButton({
  action,
  payload = {},
  label,
  icon,
  className = "",
  confirm,
  promptLabel,
  promptKey = "label",
  promptPlaceholder,
}: {
  action: string;
  payload?: Record<string, unknown>;
  label: ReactNode;
  icon?: ReactNode;
  className?: string;
  confirm?: string;
  promptLabel?: string;
  promptKey?: string;
  promptPlaceholder?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (confirm && !window.confirm(confirm)) return;
    const finalPayload: Record<string, unknown> = { ...payload, action };
    if (promptLabel) {
      const v = window.prompt(promptLabel, promptPlaceholder ?? "");
      if (v === null) return;
      finalPayload[promptKey] = v;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        window.alert(data.error ?? "عملیات ناموفق بود.");
        return;
      }
      router.refresh();
    } catch {
      window.alert("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button type="button" onClick={run} disabled={loading} className={className}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {label}
    </button>
  );
}
