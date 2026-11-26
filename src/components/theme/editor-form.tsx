"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, CheckCircle2, FileCode2, Braces, FileCode, Lightbulb, Trash2 } from "lucide-react";

type Tab = "css" | "js" | "head";
const SNIPPETS = [
  { title: "دکمه‌های صورتی تیره‌تر", tab: "css" as Tab, code: ".bg-pink-600, .from-pink-600 { filter: saturate(1.3) brightness(.95); }" },
  { title: "گردی کارت‌ها", tab: "css" as Tab, code: ".rounded-2xl, .rounded-3xl { border-radius: 26px !important; }" },
  { title: "فونت تیتر درشت‌تر", tab: "css" as Tab, code: "h1, h2, h3 { letter-spacing: -0.5px; }" },
  { title: "پنهان‌سازی واترمارک", tab: "css" as Tab, code: ".card-media > span.absolute { display: none; }" },
  { title: "نمایش ساعت در کنسول (نمونه JS)", tab: "js" as Tab, code: "console.log('مینی‌مودا — ساخته شده با عشق برای کودکان');" },
  { title: "متاترکیب تأیید گوگل", tab: "head" as Tab, code: '<meta name="google-site-verification" content="YOUR_CODE_HERE">' },
];

const CHECK_CSS = (css: string): string | null => {
  let curly = 0;
  for (const ch of css) { if (ch === "{") curly++; if (ch === "}") curly--; if (curly < 0) return "آکولاد بسته اضافه است"; }
  return curly === 0 ? null : "تعداد آکولادها متعادل نیست";
};

export default function EditorForm({ initialCss, initialJs, initialHead }: { initialCss: string; initialJs: string; initialHead: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("css");
  const [css, setCss] = useState(initialCss);
  const [js, setJs] = useState(initialJs);
  const [head, setHead] = useState(initialHead);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const value = tab === "css" ? css : tab === "js" ? js : head;
  const setValue = (v: string) => (tab === "css" ? setCss(v) : tab === "js" ? setJs(v) : setHead(v));
  const validationError = tab === "css" ? CHECK_CSS(css) : null;

  const save = async () => {
    setLoading(true); setError(""); setDone(false);
    try {
      const key = tab === "css" ? "custom.css" : tab === "js" ? "custom.js" : "custom.head";
      const res = await fetch("/api/admin/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveSettings", note: `ویرایشگر کد — ${key}`, entries: { [key]: value } }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "ذخیره ناموفق بود.");
      else { setDone(true); router.refresh(); setTimeout(() => setDone(false), 2500); }
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  };

  const insertSnippet = (code: string) => setValue(value ? `${value}\n${code}` : code);

  const tabBtn = (key: Tab, label: string, Icon: typeof FileCode2) => (
    <button type="button" onClick={() => setTab(key)} className={`flex items-center gap-1.5 h-10 px-4 text-[11px] font-black border-b-2 -mb-px transition-colors ${tab === key ? "border-pink-600 text-pink-700" : "border-transparent text-slate-400 hover:text-[#14264a]"}`}><Icon className="h-4 w-4" />{label}</button>
  );

  return (
    <div className="mt-4 grid xl:grid-cols-4 gap-4 items-start">
      <div className="xl:col-span-3 rounded-3xl border border-slate-200/70 bg-[#0e1c36] shadow-lg overflow-hidden">
        <div className="flex items-center border-b border-white/10 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 pl-4 pr-3 h-11 text-emerald-400"><FileCode2 className="h-5 w-5" /></div>
          {tabBtn("css", "CSS سفارشی", Braces)}
          {tabBtn("js", "JavaScript سفارشی", FileCode)}
          {tabBtn("head", "کدهای Head", FileCode2)}
        </div>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
          dir="ltr"
          placeholder={tab === "css" ? "/* مثال: */\n.rounded-3xl { border-radius: 26px !important; }" : tab === "js" ? "// مثال:\nconsole.log('سالم باشید!');" : '<meta name="..." content="...">'}
          className="w-full h-80 sm:h-96 bg-transparent text-emerald-300/90 font-mono text-[12px] leading-6 p-4 outline-none resize-y placeholder:text-slate-600"
        />
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-4 py-2.5">
          <p className="text-[10px] text-slate-400">{validationError ? <span className="text-rose-400 font-bold">{validationError}</span> : <span className="text-emerald-400">نحو بررسی شد ✓ — {value.length.toLocaleString("fa-IR")} کاراکتر</span>}</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setValue("")} className="h-9 px-3 rounded-xl text-[10px] font-bold text-slate-400 hover:text-rose-300 flex items-center gap-1 transition"><Trash2 className="h-4 w-4" /> پاک‌کردن</button>
            <button type="button" onClick={save} disabled={loading || !!validationError} className="h-9 px-4 rounded-xl bg-emerald-500 text-[10px] font-black text-emerald-950 hover:bg-emerald-400 transition disabled:opacity-40 flex items-center gap-1.5">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} ذخیره و اعمال</button>
          </div>
        </div>
      </div>

      {/* مثال‌های آماده */}
      <div className="rounded-3xl border border-slate-200/70 bg-white p-4 shadow-sm">
        <h2 className="flex items-center gap-2 text-[12px] font-black text-[#14264a]"><Lightbulb className="h-4 w-4 text-amber-500" /> قطعه‌کدهای آماده</h2>
        <p className="text-[9px] text-slate-400 mt-0.5">با یک کلیک به ویرایشگر فعلی اضافه می‌شود.</p>
        <ul className="mt-2 space-y-1.5">
          {SNIPPETS.filter((s) => s.tab === tab).map((s) => (
            <li key={s.title}>
              <button type="button" onClick={() => insertSnippet(s.code)} className="w-full text-right rounded-xl border border-slate-100 hover:border-pink-300 hover:bg-pink-50/40 transition p-2">
                <span className="block text-[10px] font-black text-slate-600">{s.title}</span>
                <code dir="ltr" className="block text-[8px] text-slate-400 font-mono mt-0.5 truncate">{s.code}</code>
              </button>
            </li>
          ))}
        </ul>
        {error && <p className="mt-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold px-3 py-2">{error}</p>}
        {done && <p className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-emerald-600"><CheckCircle2 className="h-4 w-4" /> ذخیره شد و روی سایت اعمال شد</p>}
      </div>
    </div>
  );
}
