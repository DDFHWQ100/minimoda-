import { LayoutGrid, Play, Trash2, Save, Layers } from "lucide-react";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { layoutPresets } from "@/db/schema";
import ActionButton from "@/components/theme/action-button";
import { faDate, toFaDigits } from "@/lib/format";

export const dynamic = "force-dynamic";

type Snap = { sections?: { id: string; enabled: boolean }[]; tokens?: Record<string, string> };
const SECTION_LABELS: Record<string, string> = { hero: "هیرو", categories: "دسته‌ها", banners: "بنرها", trust: "اعتماد", festival: "جشنواره", blog: "مجله", products: "محصولات", duo: "بنر دوگانه" };

export default async function PresetsPage() {
  const presets = await db.select().from(layoutPresets).orderBy(desc(layoutPresets.createdAt));
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><Layers className="h-6 w-6 text-pink-600" /> الگوهای آماده چیدمان</h1>
          <p className="text-[11px] text-slate-500 mt-0.5">چیدمان فعلی (ترتیب بخش‌ها + رنگ‌ها + تنظیمات واکنش‌گرا) را به‌عنوان الگو ذخیره کنید و با یک کلیک بین الگوها جابه‌جا شوید</p>
        </div>
        <ActionButton action="savePreset" promptLabel="نام الگوی چیدمان فعلی:" promptKey="name" promptPlaceholder="مثلاً: چیدمان کمپین نوروز" label="ذخیره چیدمان فعلی به‌عنوان الگو" icon={<Save className="h-5 w-5" />}
          className="inline-flex items-center gap-2 rounded-2xl bg-pink-600 text-white px-5 h-12 text-[12px] font-black hover:bg-pink-500 transition shadow-lg shadow-pink-600/20" />
      </div>

      <div className="mt-4 grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {presets.map((p) => {
          let snap: Snap = {};
          try { snap = JSON.parse(p.snapshot); } catch { snap = {}; }
          const enabled = (snap.sections ?? []).filter((s) => s.enabled);
          const t = snap.tokens ?? {};
          return (
            <article key={p.id} className="rounded-3xl border border-slate-200/70 bg-white shadow-sm overflow-hidden">
              <div className="h-24 relative" style={{ background: `linear-gradient(135deg, ${t.primary ?? "#1b3a6b"} 0%, ${t.accent ?? "#e91e63"} 100%)` }}>
                <div className="absolute bottom-2 right-3 flex -space-x-1.5" dir="ltr">
                  {[t.primary, t.accent, t.gold].filter(Boolean).map((c, i) => <span key={i} className="h-6 w-6 rounded-full border-2 border-white shadow" style={{ background: c }} />)}
                </div>
                <span className="absolute top-2 left-3 rounded-full bg-white/90 text-[#14264a] text-[9px] font-black px-2 py-0.5">{toFaDigits(enabled.length)} بخش فعال</span>
              </div>
              <div className="p-3">
                <h2 className="font-black text-[13px] text-[#14264a]">{p.name}</h2>
                <p className="text-[10px] text-slate-500 leading-5 min-h-10">{p.description || "—"}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {(snap.sections ?? []).map((s) => <span key={s.id} className={`rounded-md px-1.5 py-0.5 text-[8px] font-bold ${s.enabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400 line-through"}`}>{SECTION_LABELS[s.id] ?? s.id}</span>)}
                </div>
                <p className="mt-2 text-[8px] text-slate-400">{p.createdBy} · {faDate(p.createdAt)}</p>
                <div className="mt-3 grid grid-cols-3 gap-1.5">
                  <ActionButton action="applyPreset" payload={{ id: p.id }} label="اعمال" icon={<Play className="h-4 w-4" />} confirm={`الگوی «${p.name}» روی سایت اعمال شود؟ (قبل از اعمال، پشتیبان خودکار گرفته می‌شود)`}
                    className="col-span-2 h-10 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#14264a] text-amber-300 text-[10px] font-black hover:bg-[#1d3a63] transition" />
                  <ActionButton action="deletePreset" payload={{ id: p.id }} label="" icon={<Trash2 className="h-4 w-4" />} confirm={`الگوی «${p.name}» حذف شود؟`}
                    className="h-10 grid place-items-center rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 transition" />
                </div>
              </div>
            </article>
          );
        })}
        {presets.length === 0 && <div className="md:col-span-3 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-[11px] text-slate-400"><LayoutGrid className="h-10 w-10 mx-auto text-slate-300 mb-2" />هنوز الگویی ذخیره نشده است.</div>}
      </div>
      <p className="mt-3 text-[9px] text-slate-400">ترتیب و فعال/غیرفعال‌کردن بخش‌ها با فلش‌ها در «اجزای صفحه اصلی» انجام می‌شود؛ Drag & Drop بصری تمام‌صفحه در چک‌لیست زیرساخت ثبت شده است.</p>
    </div>
  );
}
