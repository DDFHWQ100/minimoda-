import Image from "next/image";
import Link from "next/link";
import { LayoutTemplate, CheckCircle2, Copy, Trash2, BadgeCheck, Power, ShieldCheck, CalendarDays, History, GitBranch, Undo2, Search, Eye } from "lucide-react";
import { db } from "@/db";
import { themes } from "@/db/schema";
import { asc } from "drizzle-orm";
import ActionButton from "@/components/theme/action-button";
import ThemeInstaller from "@/components/theme/theme-installer";
import { faDay, toFaDigits } from "@/lib/format";

export const dynamic = "force-dynamic";

function tokenSwatch(tokens: string): string[] {
  try { const t = JSON.parse(tokens || "{}"); return [t.primary, t.accent, t.gold].filter(Boolean); } catch { return []; }
}

export default async function ThemesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q ?? "").trim();
  const filter = Array.isArray(sp.f) ? sp.f[0] : sp.f ?? "all";
  const all = await db.select().from(themes).orderBy(asc(themes.id));
  const list = all
    .filter((t) => !q || t.name.includes(q) || t.author.includes(q) || t.slug.includes(q))
    .filter((t) => filter === "all" || (filter === "active" && t.isActive) || (filter === "child" && t.slug.includes("-child-")) || (filter === "custom" && (t.slug.includes("-copy-") || t.slug.includes("-child-") || !["minimoda-classic", "royal-junior-theme", "minimal-modern"].includes(t.slug))));

  const chip = (key: string, label: string) => (
    <Link key={key} href={`/admin/theme/themes?f=${key}${q ? `&q=${encodeURIComponent(q)}` : ""}`} className={`rounded-full px-3 h-8 inline-flex items-center text-[10px] font-bold border transition ${filter === key ? "bg-[#14264a] border-[#14264a] text-amber-300" : "bg-white border-slate-200 text-slate-600"}`}>{label}</Link>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><LayoutTemplate className="h-6 w-6 text-pink-600" /> مدیریت قالب‌ها</h1>
          <p className="text-[11px] text-slate-500 mt-0.5">{toFaDigits(all.length)} قالب نصب‌شده — فعال‌سازی، تکثیر، قالب فرزند، بازگشت نسخه و نصب از فایل</p>
        </div>
        <ActionButton action="createRevision" payload={{ label: "پشتیبان قبل از تغییر قالب" }} promptLabel="برچسب پشتیبان را وارد کنید:" promptPlaceholder="مثلاً: قبل از تعویض قالب" label="پشتیبان‌گیری قبل از تغییر" icon={<History className="h-4 w-4" />}
          className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-300 bg-white px-4 h-11 text-[11px] font-bold text-slate-600 hover:border-pink-400 hover:text-pink-600 transition" />
      </div>

      {/* جستجو و فیلتر */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <form method="get" className="flex items-center rounded-2xl border border-slate-200 bg-white h-10 overflow-hidden shadow-sm focus-within:border-pink-400 w-full sm:w-72">
          <Search className="h-4 w-4 text-slate-400 mr-3 shrink-0" />
          <input name="q" defaultValue={q} placeholder="جستجوی نام، سازنده یا اسلاگ..." className="flex-1 h-full bg-transparent px-2 text-[12px] outline-none" />
          {filter !== "all" && <input type="hidden" name="f" value={filter} />}
          <button className="h-full px-3 bg-[#14264a] text-amber-300 text-[10px] font-black">جستجو</button>
        </form>
        <div className="flex gap-1.5">{chip("all", "همه")}{chip("active", "فعال")}{chip("child", "قالب‌های فرزند")}{chip("custom", "سفارشی")}</div>
      </div>

      <div className="mt-4 grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {list.map((theme) => {
          const swatches = tokenSwatch(theme.tokens);
          const isChild = theme.slug.includes("-child-");
          return (
            <article key={theme.id} className={`rounded-3xl border overflow-hidden bg-white shadow-sm transition ${theme.isActive ? "border-emerald-400 ring-2 ring-emerald-400/40" : "border-slate-200/70"}`}>
              <div className="relative h-36 sm:h-40 bg-slate-100">
                {theme.preview ? <Image src={theme.preview} alt={theme.name} fill sizes="420px" className="object-cover object-[50%_15%]" /> : <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${swatches[0] ?? "#1b3a6b"}, ${swatches[1] ?? "#e91e63"})` }} />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-2 right-3 left-3 flex items-end justify-between gap-2">
                  <div>
                    <h2 className="text-white font-black text-sm sm:text-base drop-shadow flex items-center gap-1.5">{isChild && <GitBranch className="h-4 w-4 text-sky-300" />}{theme.name}</h2>
                    <p dir="ltr" className="text-[9px] text-amber-300 font-bold">v{theme.version} · {theme.author}</p>
                  </div>
                  {theme.isActive && <span className="flex items-center gap-1 rounded-full bg-emerald-500 text-white text-[9px] font-black px-2.5 py-1 shadow"><CheckCircle2 className="h-3.5 w-3.5" /> فعال</span>}
                </div>
              </div>
              <div className="p-3">
                <p className="text-[10px] text-slate-500 leading-5 min-h-10">{theme.description}</p>
                <div className="mt-2 flex items-center justify-between gap-2 text-[8px] text-slate-400 border-t border-slate-100 pt-2">
                  <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> نصب: {faDay(theme.installedAt)} · به‌روزرسانی: {faDay(theme.updatedAt)}</span>
                  <span className="flex items-center gap-1 text-emerald-600"><ShieldCheck className="h-3.5 w-3.5" /> سازگار</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex -space-x-1.5" dir="ltr">{swatches.map((c, i) => <span key={i} className="h-5 w-5 rounded-full border-2 border-white shadow" style={{ background: c }} />)}</div>
                  <span className="text-[9px] text-slate-400">پالت قالب</span>
                  {theme.isDefault && <span className="mr-auto flex items-center gap-1 text-[9px] font-black text-amber-700 bg-amber-100 rounded-full px-2 py-0.5"><BadgeCheck className="h-3 w-3" /> پیش‌فرض</span>}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-1.5">
                  {theme.isActive ? (
                    <Link href="/" target="_blank" className="col-span-2 h-10 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black"><Eye className="h-4 w-4" /> در حال استفاده — مشاهده سایت</Link>
                  ) : (
                    <>
                      <ActionButton action="activateTheme" payload={{ slug: theme.slug }} label="فعال‌سازی" icon={<Power className="h-4 w-4" />}
                        confirm={`قالب «${theme.name}» فعال شود؟ رنگ‌ها، فونت و گردی گوشه‌ها در کل سایت تغییر می‌کنند.`}
                        className="h-10 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#14264a] text-amber-300 text-[10px] font-black hover:bg-[#1d3a63] transition" />
                      <Link href={`/admin/theme/customize?preview=${theme.slug}`} className="h-10 inline-flex items-center justify-center gap-1.5 rounded-xl border border-sky-200 text-sky-700 text-[10px] font-bold hover:bg-sky-50 transition"><Eye className="h-4 w-4" /> پیش‌نمایش</Link>
                    </>
                  )}
                  <ActionButton action="duplicateTheme" payload={{ slug: theme.slug }} promptLabel="نام رونوشت قالب:" promptKey="name" promptPlaceholder={`${theme.name} (رونوشت)`} label="تکثیر" icon={<Copy className="h-4 w-4" />}
                    className="h-9 inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 text-slate-600 text-[10px] font-bold hover:border-pink-400 hover:text-pink-600 transition" />
                  <ActionButton action="createChildTheme" payload={{ slug: theme.slug }} promptLabel="نام قالب فرزند:" promptKey="name" promptPlaceholder={`${theme.name} — فرزند`} label="قالب فرزند" icon={<GitBranch className="h-4 w-4" />}
                    className="h-9 inline-flex items-center justify-center gap-1 rounded-xl border border-sky-200 text-sky-700 text-[10px] font-bold hover:bg-sky-50 transition" />
                  <ActionButton action="rollbackTheme" payload={{ slug: theme.slug }} label="بازگشت نسخه" icon={<Undo2 className="h-4 w-4" />}
                    confirm={`توکن‌های «${theme.name}» به آخرین نسخه پشتیبان بازگردانده شود؟`}
                    className="h-9 inline-flex items-center justify-center gap-1 rounded-xl border border-amber-200 text-amber-700 text-[10px] font-bold hover:bg-amber-50 transition" />
                  <ActionButton action="deleteTheme" payload={{ slug: theme.slug }} label="حذف" icon={<Trash2 className="h-4 w-4" />}
                    confirm={theme.isActive ? "قالب فعال حذف نمی‌شود." : `قالب «${theme.name}» برای همیشه حذف شود؟`}
                    className="h-9 inline-flex items-center justify-center gap-1 rounded-xl border border-rose-200 text-rose-500 text-[10px] font-bold hover:bg-rose-50 transition" />
                </div>
              </div>
            </article>
          );
        })}
        {list.length === 0 && <div className="md:col-span-3 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-[11px] text-slate-400">قالبی با این مشخصات یافت نشد.</div>}
      </div>

      <div className="mt-5 scroll-mt-28" id="install">
        <h2 className="text-[13px] font-black text-[#14264a] mb-2">افزودن قالب جدید</h2>
        <ThemeInstaller />
      </div>
    </div>
  );
}
