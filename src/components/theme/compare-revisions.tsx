"use client";

import { useState } from "react";
import { GitCompareArrows, Loader2, FileDiff, CheckCircle2 } from "lucide-react";

type Rev = { id: number; label: string };

export default function CompareRevisions({ revisions }: { revisions: Rev[] }) {
  const [id1, setId1] = useState(revisions[0]?.id ?? 0);
  const [id2, setId2] = useState(revisions[1]?.id ?? 0);
  const [loading, setLoading] = useState(false);
  const [diffs, setDiffs] = useState<string[] | null>(null);
  const [error, setError] = useState("");

  const compare = async () => {
    setLoading(true); setError(""); setDiffs(null);
    try {
      const res = await fetch(`/api/admin/theme?action=diff&id1=${id1}&id2=${id2}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "مقایسه ناموفق بود.");
      else setDiffs(data.diffs ?? []);
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  };

  const selectCls = "h-10 rounded-xl border border-slate-200 bg-slate-50 px-2 text-[11px] font-bold outline-none focus:border-pink-400";

  return (
    <section className="mt-4 rounded-3xl border border-slate-200/70 bg-white shadow-sm p-4">
      <h2 className="flex items-center gap-2 text-[12px] font-black text-[#14264a]"><GitCompareArrows className="h-4 w-4 text-violet-600" /> مقایسه دو نسخه پشتیبان</h2>
      <p className="text-[9px] text-slate-400 mt-0.5">تغییرات واقعی تنظیمات، بخش‌های فعال و بنرها بین دو نسخه نمایش داده می‌شود.</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <select value={id1} onChange={(e) => setId1(Number(e.target.value))} className={selectCls} aria-label="نسخه اول">
          {revisions.map((r) => <option key={r.id} value={r.id}>#{r.id} — {r.label}</option>)}
        </select>
        <span className="text-slate-400 font-black">⟵</span>
        <select value={id2} onChange={(e) => setId2(Number(e.target.value))} className={selectCls} aria-label="نسخه دوم">
          {revisions.map((r) => <option key={r.id} value={r.id}>#{r.id} — {r.label}</option>)}
        </select>
        <button onClick={compare} disabled={loading || id1 === id2 || revisions.length < 2} className="h-10 px-4 rounded-xl bg-violet-600 text-white text-[10px] font-black hover:bg-violet-500 transition disabled:opacity-40 flex items-center gap-1.5">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDiff className="h-4 w-4" />} مقایسه
        </button>
      </div>
      {error && <p className="mt-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold px-3 py-2">{error}</p>}
      {diffs && (
        <div className="mt-3">
          {diffs.length === 0 ? (
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600"><CheckCircle2 className="h-4 w-4" /> هیچ تفاوتی بین دو نسخه وجود ندارد</p>
          ) : (
            <ul className="space-y-1 max-h-56 overflow-y-auto">
              {diffs.map((d, i) => (
                <li key={i} className="rounded-lg bg-violet-50 border border-violet-100 px-3 py-1.5 text-[10px] font-mono text-violet-900 leading-5">{d}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
