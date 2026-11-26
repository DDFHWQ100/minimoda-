"use client";

import { useState } from "react";
import { Monitor, Tablet, Smartphone, RefreshCw, ExternalLink } from "lucide-react";

const SIZES = {
  desktop: { w: 1280, h: 760, label: "دسکتاپ", icon: Monitor },
  tablet: { w: 820, h: 760, label: "تبلت", icon: Tablet },
  mobile: { w: 390, h: 760, label: "موبایل", icon: Smartphone },
} as const;

/** پیش‌نمایش زنده سایت در سه اندازه دستگاه — همان سایت واقعی داخل iframe */
export default function DevicePreview({ path = "/" }: { path?: string }) {
  const [device, setDevice] = useState<keyof typeof SIZES>("desktop");
  const [nonce, setNonce] = useState(0);
  const s = SIZES[device];
  const src = `${path}${path.includes("?") ? "&" : "?"}_preview=${nonce}`;

  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
        <div className="flex gap-1">
          {(Object.keys(SIZES) as (keyof typeof SIZES)[]).map((k) => { const Icon = SIZES[k].icon; return (
            <button key={k} onClick={() => setDevice(k)} className={`inline-flex items-center gap-1.5 rounded-xl px-3 h-9 text-[10px] font-bold transition ${device === k ? "bg-[#14264a] text-amber-300" : "text-slate-500 hover:bg-white"}`}><Icon className="h-4 w-4" />{SIZES[k].label} <span className="opacity-60 font-mono" dir="ltr">{SIZES[k].w}px</span></button>
          ); })}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setNonce((n) => n + 1)} className="h-9 px-3 rounded-xl border border-slate-200 text-[10px] font-bold text-slate-600 hover:border-pink-400 flex items-center gap-1"><RefreshCw className="h-4 w-4" /> تازه‌سازی</button>
          <a href={path} target="_blank" className="h-9 px-3 rounded-xl border border-slate-200 text-[10px] font-bold text-slate-600 hover:border-pink-400 flex items-center gap-1"><ExternalLink className="h-4 w-4" /> تب جدید</a>
        </div>
      </div>
      <div className="bg-slate-200/60 p-4 overflow-auto">
        <div className="mx-auto transition-all duration-500 rounded-2xl overflow-hidden shadow-2xl bg-white ring-8 ring-slate-800/90" style={{ width: Math.min(s.w, 1280), maxWidth: "100%" }}>
          <iframe key={`${device}-${nonce}`} title={`پیش‌نمایش ${s.label}`} src={src} style={{ width: "100%", height: s.h, border: 0 }} />
        </div>
      </div>
    </div>
  );
}
