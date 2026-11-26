"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";

/** ویرایشگر موجودی تنوع — با ذخیره خودکار */
export default function VariantStockEditor({ id, initial }: { id: number; initial: number }) {
  const router = useRouter();
  const [value, setValue] = useState(String(initial));
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const save = async () => {
    const stock = Math.max(0, Number(value) || 0);
    if (String(stock) === String(initial) && state === "idle") return;
    setState("saving");
    const res = await fetch("/api/admin/manage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity: "variants", action: "setStock", id, stock }),
    });
    if (!res.ok) { setState("error"); return; }
    setState("saved");
    router.refresh();
    window.setTimeout(() => setState("idle"), 1800);
  };

  return (
    <span className="inline-flex items-center gap-1">
      <input
        type="number" min={0} dir="ltr" value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
        aria-label="موجودی تنوع"
        className={`h-8 w-16 rounded-lg border text-center text-[11px] font-black outline-none transition ${state === "error" ? "border-rose-400 text-rose-600" : "border-slate-200 text-[#14264a] focus:border-pink-400"}`}
      />
      {state === "saving" && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />}
      {state === "saved" && <Check className="h-4 w-4 text-emerald-500" />}
    </span>
  );
}
