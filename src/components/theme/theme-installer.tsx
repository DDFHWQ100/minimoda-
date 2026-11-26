"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Loader2, CheckCircle2, FileJson, Download } from "lucide-react";

/**
 * نصب قالب از فایل ZIP یا JSON (manifest).
 * فقط توکن‌های طراحی (رنگ/فونت/گردی) پذیرفته می‌شود؛ هیچ کد اجرایی وارد سیستم نمی‌شود.
 */
export default function ThemeInstaller() {
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  const parseManifestFromZip = async (buf: ArrayBuffer): Promise<Record<string, unknown>> => {
    // خواننده‌ی حداقلی ZIP (فقط فایل‌های stored/deflate با نام theme.json) — بدون وابستگی خارجی
    const dv = new DataView(buf);
    const bytes = new Uint8Array(buf);
    let offset = 0;
    const td = new TextDecoder();
    while (offset + 30 <= bytes.length) {
      if (dv.getUint32(offset, true) !== 0x04034b50) break;
      const method = dv.getUint16(offset + 8, true);
      const compSize = dv.getUint32(offset + 18, true);
      const nameLen = dv.getUint16(offset + 26, true);
      const extraLen = dv.getUint16(offset + 28, true);
      const name = td.decode(bytes.slice(offset + 30, offset + 30 + nameLen));
      const dataStart = offset + 30 + nameLen + extraLen;
      const data = bytes.slice(dataStart, dataStart + compSize);
      if (/(^|\/)theme\.json$/i.test(name)) {
        let text = "";
        if (method === 0) text = td.decode(data);
        else if (method === 8 && "DecompressionStream" in window) {
          const ds = new DecompressionStream("deflate-raw");
          const stream = new Blob([data]).stream().pipeThrough(ds);
          text = await new Response(stream).text();
        } else throw new Error("فرمت فشرده‌سازی ZIP پشتیبانی نمی‌شود.");
        return JSON.parse(text);
      }
      offset = dataStart + compSize;
    }
    throw new Error("فایل theme.json داخل ZIP پیدا نشد.");
  };

  const handle = async (file: File) => {
    setState("loading"); setMsg("");
    try {
      let manifest: Record<string, unknown>;
      if (file.name.toLowerCase().endsWith(".json")) manifest = JSON.parse(await file.text());
      else if (file.name.toLowerCase().endsWith(".zip")) manifest = await parseManifestFromZip(await file.arrayBuffer());
      else throw new Error("فقط فایل .zip یا .json پذیرفته می‌شود.");
      const res = await fetch("/api/admin/theme", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "installThemeManifest", manifest }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "نصب ناموفق بود.");
      setState("done"); setMsg(`قالب «${manifest.name}» نصب شد.`);
      router.refresh();
    } catch (err) {
      setState("error"); setMsg(err instanceof Error ? err.message : "خطای ناشناخته");
    } finally {
      if (ref.current) ref.current.value = "";
    }
  };

  const sample = JSON.stringify({ name: "قالب من", slug: "my-theme", version: "1.0.0", author: "نام شما", description: "توضیح کوتاه", preview: "https://.../preview.jpg", tokens: { primary: "#1b3a6b", accent: "#e91e63", gold: "#ffc107", font: "Vazirmatn", radius: 20 } }, null, 2);

  return (
    <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-5 text-center"
      onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handle(f); }}>
      {state === "loading" ? <Loader2 className="h-10 w-10 mx-auto text-pink-600 animate-spin" /> : <UploadCloud className="h-10 w-10 mx-auto text-slate-300" strokeWidth={1.5} />}
      <p className="mt-2 text-[12px] font-black text-[#14264a]">نصب قالب از فایل ZIP یا theme.json</p>
      <p className="text-[9px] text-slate-400 mt-0.5">فایل را اینجا رها کنید یا انتخاب کنید — فقط توکن‌های طراحی خوانده می‌شود (ایمن)</p>
      <div className="mt-3 flex items-center justify-center gap-2">
        <button type="button" onClick={() => ref.current?.click()} disabled={state === "loading"} className="inline-flex items-center gap-2 rounded-2xl bg-[#14264a] text-amber-300 px-5 h-11 text-[11px] font-black hover:bg-[#1d3a63] transition disabled:opacity-50"><UploadCloud className="h-4 w-4" /> انتخاب فایل قالب</button>
        <a href={`data:application/json;charset=utf-8,${encodeURIComponent(sample)}`} download="theme.json" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 h-11 text-[11px] font-bold text-slate-600 hover:border-pink-400 hover:text-pink-600 transition"><Download className="h-4 w-4" /> نمونه theme.json</a>
      </div>
      <input ref={ref} type="file" accept=".zip,.json,application/zip,application/json" className="hidden" onChange={(e) => e.target.files?.[0] && handle(e.target.files[0])} />
      {state === "done" && <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-600"><CheckCircle2 className="h-4 w-4" /> {msg}</p>}
      {state === "error" && <p className="mt-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold px-3 py-2">{msg}</p>}
      <p className="mt-3 text-[8px] text-slate-400 flex items-center justify-center gap-1"><FileJson className="h-3 w-3" /> ساختار: name, version, author, preview, tokens{"{primary, accent, gold, font, radius}"}</p>
    </div>
  );
}
