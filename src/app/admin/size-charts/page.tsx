import { Ruler, Trash2, CheckCircle2, Circle, Table2 } from "lucide-react";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { sizeCharts } from "@/db/schema";
import SimpleForm from "@/components/admin/simple-form";
import ActionButton from "@/components/theme/action-button";
import { toFaDigits } from "@/lib/format";

export const dynamic = "force-dynamic";

type Row = { size: string; height: string; chest: string; waist: string };

function parseRows(raw: string): Row[] {
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export default async function SizeChartsPage() {
  const all = await db.select().from(sizeCharts).orderBy(asc(sizeCharts.id));

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><Ruler className="h-6 w-6 text-pink-600" /> جدول‌های سایزبندی</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">{toFaDigits(all.length)} جدول — مرجع اندازه‌گیری سایزهای پوشاک کودک و نوزاد</p>

      <div className="mt-4 grid lg:grid-cols-5 gap-4 items-start">
        <div className="lg:col-span-3 space-y-3">
          {all.map((chart) => {
            const rows = parseRows(chart.rows);
            return (
              <article key={chart.id} className={`rounded-3xl border bg-white shadow-sm overflow-hidden transition ${chart.active ? "border-slate-200/70" : "border-slate-200/70 opacity-60"}`}>
                <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50/60">
                  <h2 className="text-[12px] font-black text-[#14264a] flex items-center gap-2"><Table2 className="h-4 w-4 text-slate-400" />{chart.name}</h2>
                  <div className="flex items-center gap-1">
                    <ActionButton action="sizecharts.toggle" payload={{ entity: "sizecharts", id: chart.id, active: !chart.active }} label="" icon={chart.active ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-slate-300" />}
                      className="h-9 w-9 grid place-items-center rounded-xl hover:bg-slate-50 transition" />
                    <ActionButton action="sizecharts.delete" payload={{ entity: "sizecharts", id: chart.id }} label="" icon={<Trash2 className="h-5 w-5" />} confirm={`جدول «${chart.name}» حذف شود؟`}
                      className="h-9 w-9 grid place-items-center rounded-xl text-rose-400 hover:bg-rose-50 transition" />
                  </div>
                </header>
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] min-w-[420px]">
                    <thead className="text-slate-400 text-right">
                      <tr className="border-b border-slate-100"><th className="py-2 px-4 font-bold">سایز</th><th className="py-2 px-2 font-bold">قد (سانتی‌متر)</th><th className="py-2 px-2 font-bold">دور سینه</th><th className="py-2 px-4 font-bold">دور کمر</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {rows.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50/60">
                          <td className="py-1.5 px-4 font-black text-[#14264a]">{toFaDigits(r.size)}</td>
                          <td className="py-1.5 px-2 text-slate-500">{toFaDigits(r.height)}</td>
                          <td className="py-1.5 px-2 text-slate-500">{toFaDigits(r.chest)}</td>
                          <td className="py-1.5 px-4 text-slate-500">{toFaDigits(r.waist)}</td>
                        </tr>
                      ))}
                      {rows.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-slate-400">ردیفی ثبت نشده.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </article>
            );
          })}
          {all.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-[11px] text-slate-400">جدول سایزبندی ثبت نشده است.</div>}
        </div>

        <div className="lg:col-span-2">
          <SimpleForm
            title="ایجاد جدول سایزبندی جدید"
            entity="sizecharts"
            submitLabel="ثبت جدول"
            fields={[
              { name: "name", label: "نام جدول *", required: true, placeholder: "مثلاً: جدول سایزبندی کودک" },
              { name: "rows", label: "ردیف‌ها (JSON) *", type: "textarea", required: true, placeholder: '[{"size":"4-5","height":"104-110","chest":"60-62","waist":"54-56"}]' },
            ]}
            note="هر ردیف یک شیء JSON است: size (سایز)، height (قد)، chest (دور سینه)، waist (دور کمر). چند ردیف را در یک آرایه بنویسید."
          />
        </div>
      </div>
    </div>
  );
}
