"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileArchive, Loader2, CheckCircle2, UploadCloud, ChevronDown } from "lucide-react";

/** نصب قالب از فایل ZIP — با اعتبارسنجی واقعی manifest و ایمنی فایل‌ها */
export default function ThemeZipUpload() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setLoading(true); setError(""); setDone("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/theme/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.error ?? "نصب ناموفق بود."); return; }
      setDone(`قالب «${data.name}» با موفقیت نصب شد`);
      router.refresh();
      window.setTimeout(() => setDone(""), 4000);
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div>
      <button type="button" onClick={() => setOpen((v) => !v)} className="inline-flex items-center gap-1.5 rounded-2xl border border-emerald-300 bg-emerald-50 text-emerald-800 px-4 h-11 text-[11px] font-black hover:bg-emerald-100 transition">
        <FileArchive className="h-5 w-5" /> نصب قالب از فایل ZIP <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="mt-2 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3 text-[10px] leading-6 text-emerald-900">
          <p className="font-black">فرمت بسته قالب (theme.json در ریشه ZIP):</p>
          <pre dir="ltr" className="mt-1 bg-emerald-900/90 text-emerald-200 rounded-xl p-2 overflow-x-auto text-[8px] font-mono">{`my-theme.zip
└─ my-theme/
   ├─ theme.json   ← {"name":"...","version":"1.0.0","primary":"#1b3a6b","accent":"#e91e63","gold":"#ffc107","font":"Vazirmatn","radius":"20"}
   └─ preview.jpg  (اختیاری — به‌عنوان تصویر قالب ثبت می‌شود)`}</pre>
          <button type="button" onClick={() => fileRef.current?.click()} disabled={loading} className="mt-2 inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-4 h-10 text-[10px] font-black hover:bg-emerald-500 transition disabled:opacity-60">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            {loading ? "در حال نصب و اعتبارسنجی..." : "انتخاب فایل ZIP و نصب"}
          </button>
          <input ref={fileRef} type="file" accept=".zip,application/zip" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          {error && <p className="mt-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold px-3 py-2">{error}</p>}
          {done && <p className="mt-2 flex items-center gap-1.5 font-black text-emerald-800"><CheckCircle2 className="h-4 w-4" />{done} — از لیست بالا آن را پیش‌نمایش/فعال کنید.</p>}
        </div>
      )}
    </div>
  );
}
