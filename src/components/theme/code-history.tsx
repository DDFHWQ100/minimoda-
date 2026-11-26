"use client";

import { useMemo, useState } from "react";
import { History, Undo2, GitCompare, ChevronDown } from "lucide-react";
import ActionButton from "@/components/theme/action-button";
import { faDate, toFaDigits } from "@/lib/format";

export type CodeHistoryRow = { id: number; key: string; content: string; createdBy: string; createdAt: string };

/** مقایسه خطی ساده (LCS-free): خطوط افزوده/حذف‌شده نسبت به نسخه فعلی */
function diffLines(oldText: string, newText: string) {
  const a = oldText.split("\n"), b = newText.split("\n");
  const setA = new Set(a), setB = new Set(b);
  const removed = a.filter((l) => !setB.has(l));
  const added = b.filter((l) => !setA.has(l));
  return { added, removed };
}

const KEY_LABEL: Record<string, string> = { "custom.css": "CSS سفارشی", "custom.js": "JavaScript سفارشی", "custom.head": "کدهای Head" };

export default function CodeHistory({ history, current }: { history: CodeHistoryRow[]; current: Record<string, string> }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const grouped = useMemo(() => history.reduce<Record<string, CodeHistoryRow[]>>((acc, h) => { (acc[h.key] ??= []).push(h); return acc; }, {}), [history]);

  if (history.length === 0) return (
    <div className="rounded-3xl border border-slate-200/70 bg-white p-6 text-center text-[11px] text-slate-400"><History className="h-9 w-9 mx-auto text-slate-300 mb-2" />هنوز تاریخچه‌ای ثبت نشده — با هر ذخیره در ویرایشگر، نسخه قبلی اینجا نگه داشته می‌شود.</div>
  );

  return (
    <div className="space-y-3">
      {Object.entries(grouped).map(([key, rows]) => (
        <section key={key} className="rounded-3xl border border-slate-200/70 bg-white shadow-sm overflow-hidden">
          <header className="px-4 py-3 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
            <h3 className="text-[12px] font-black text-[#14264a] flex items-center gap-2"><History className="h-4 w-4 text-slate-400" /> تاریخچه {KEY_LABEL[key] ?? key}</h3>
            <span className="text-[9px] text-slate-400">{toFaDigits(rows.length)} نسخه</span>
          </header>
          <ul className="divide-y divide-slate-100">
            {rows.map((h) => {
              const d = diffLines(h.content, current[key] ?? "");
              const open = openId === h.id;
              return (
                <li key={h.id} className="px-4 py-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <button onClick={() => setOpenId(open ? null : h.id)} className="flex items-center gap-1.5 text-[11px] font-bold text-[#14264a] hover:text-pink-700">
                      <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} /> نسخه #{toFaDigits(h.id)} — {faDate(h.createdAt)}
                    </button>
                    <span className="text-[9px] text-slate-400">{h.createdBy}</span>
                    <span className="mr-auto flex items-center gap-2 text-[9px] font-bold"><span className="text-emerald-600">+{toFaDigits(d.added.length)}</span><span className="text-rose-600">−{toFaDigits(d.removed.length)}</span><span className="text-slate-400">({toFaDigits(h.content.length)} کاراکتر)</span></span>
                    <ActionButton action="restoreCode" payload={{ id: h.id }} label="بازگردانی" icon={<Undo2 className="h-4 w-4" />} confirm="کد فعلی با این نسخه جایگزین شود؟ (نسخه فعلی هم در تاریخچه ذخیره می‌شود)"
                      className="h-8 px-3 rounded-lg border border-amber-200 text-amber-700 text-[9px] font-bold hover:bg-amber-50 inline-flex items-center gap-1" />
                  </div>
                  {open && (
                    <div className="mt-2 rounded-2xl bg-[#0e1c36] p-3 font-mono text-[10px] leading-5 overflow-auto max-h-64" dir="ltr">
                      <p className="text-slate-400 mb-1 flex items-center gap-1"><GitCompare className="h-3.5 w-3.5" /> diff: this version → current</p>
                      {d.removed.map((l, i) => <div key={`r${i}`} className="text-rose-300 bg-rose-500/10 px-1">− {l || " "}</div>)}
                      {d.added.map((l, i) => <div key={`a${i}`} className="text-emerald-300 bg-emerald-500/10 px-1">+ {l || " "}</div>)}
                      {d.added.length === 0 && d.removed.length === 0 && <div className="text-slate-500">بدون تفاوت با نسخه فعلی</div>}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
