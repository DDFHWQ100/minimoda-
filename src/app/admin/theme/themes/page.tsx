import Link from "next/link";
import Image from "next/image";
import { LayoutTemplate, CheckCircle2, Copy, Trash2, BadgeCheck, Power, ShieldCheck, CalendarDays, History, PlusCircle, GitBranch, Eye, FileArchive } from "lucide-react";
import { db } from "@/db";
import { themes } from "@/db/schema";
import { asc } from "drizzle-orm";
import ActionButton from "@/components/theme/action-button";
import ThemeZipUpload from "@/components/theme/theme-zip-upload";
import { faDay, toFaDigits } from "@/lib/format";

export const dynamic = "force-dynamic";

function tokenSwatch(tokens: string): string[] {
  try {
    const t = JSON.parse(tokens || "{}");
    return [t.primary, t.accent, t.gold].filter(Boolean);
  } catch {
    return [];
  }
}

export default async function ThemesPage() {
  const all = await db.select().from(themes).orderBy(asc(themes.id));
  const active = all.find((t) => t.isActive);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><LayoutTemplate className="h-6 w-6 text-pink-600" /> مدیریت قالب‌ها</h1>
          <p className="text-[11px] text-slate-500 mt-0.5">قالب فعال کل سایت را از همین‌جا عوض کنید — نسخه، سازنده، تاریخ نصب و پیش‌نمایش هر قالب مشخص است.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <ThemeZipUpload />
          <Link href="/admin/theme/themes/new" className="inline-flex items-center gap-1.5 rounded-2xl bg-pink-600 text-white px-4 h-11 text-[11px] font-black hover:bg-pink-500 transition shadow-lg shadow-pink-600/20"><PlusCircle className="h-5 w-5" /> افزودن قالب دستی</Link>
        </div>
      </div>

      <div className="mt-4 grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {all.map((theme) => {
          const swatches = tokenSwatch(theme.tokens);
          return (
            <article key={theme.id} className={`rounded-3xl border overflow-hidden bg-white shadow-sm transition ${theme.isActive ? "border-emerald-400 ring-2 ring-emerald-400/40" : "border-slate-200/70"}`}>
              <div className="relative h-36 sm:h-40 bg-slate-100">
                {theme.preview && <Image src={theme.preview} alt={theme.name} fill sizes="420px" className="object-cover object-[50%_15%]" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-2 right-3 left-3 flex items-end justify-between gap-2">
                  <div>
                    <h2 className="text-white font-black text-sm sm:text-base drop-shadow">{theme.name}</h2>
                    <p dir="ltr" className="text-[9px] text-amber-300 font-bold">v{theme.version} · {theme.author}</p>
                  </div>
                  {theme.isActive && <span className="flex items-center gap-1 rounded-full bg-emerald-500 text-white text-[9px] font-black px-2.5 py-1 shadow"><CheckCircle2 className="h-3.5 w-3.5" /> فعال</span>}
                </div>
              </div>
              <div className="p-3">
                <p className="text-[10px] text-slate-500 leading-5 min-h-10">{theme.description}</p>
                <div className="mt-2 flex items-center justify-between gap-2 text-[8px] text-slate-400 border-t border-slate-100 pt-2">
                  <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> نصب: {faDay(theme.installedAt)}</span>
                  <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> سازگار با نسخه فعلی</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex -space-x-1.5" dir="ltr">
                    {swatches.map((c, i) => <span key={i} className="h-5 w-5 rounded-full border-2 border-white shadow" style={{ background: c }} />)}
                  </div>
                  <span className="text-[9px] text-slate-400">پالت قالب</span>
                  {theme.isDefault && <span className="mr-auto flex items-center gap-1 text-[9px] font-black text-amber-700 bg-amber-100 rounded-full px-2 py-0.5"><BadgeCheck className="h-3 w-3" /> پیش‌فرض</span>}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-1.5">
                  {theme.isActive ? (
                    <span className="col-span-2 h-10 grid place-items-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black">در حال استفاده</span>
                  ) : (
                    <div className="col-span-2 grid grid-cols-2 gap-1.5">
                      <a href={`/api/admin/theme/preview?slug=${theme.slug}&action=start`} className="h-10 inline-flex items-center justify-center gap-1 rounded-xl border border-sky-300 bg-sky-50 text-sky-700 text-[10px] font-black hover:bg-sky-100 transition"><Eye className="h-4 w-4" /> پیش‌نمایش</a>
                      <ActionButton action="activateTheme" payload={{ slug: theme.slug }}
                        label="فعال‌سازی" icon={<Power className="h-4 w-4" />}
                        confirm={`قالب «${theme.name}» فعال شود؟ رنگ‌ها، فونت و گردی گوشه‌ها در کل سایت تغییر می‌کنند.`}
                        className="h-10 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#14264a] text-amber-300 text-[10px] font-black hover:bg-[#1d3a63] transition" />
                    </div>
                  )}
                  <ActionButton action="duplicateTheme" payload={{ slug: theme.slug }}
                    promptLabel="نام رونوشت قالب:" promptKey="name" promptPlaceholder={`${theme.name} (رونوشت)`}
                    label="تکثیر" icon={<Copy className="h-4 w-4" />}
                    className="h-10 inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 text-slate-600 text-[10px] font-bold hover:border-pink-400 hover:text-pink-600 transition" />
                  <ActionButton action="createChildTheme" payload={{ slug: theme.slug }}
                    promptLabel="نام قالب فرزند:" promptKey="name" promptPlaceholder={`${theme.name} (فرزند)`}
                    label="فرزند" icon={<GitBranch className="h-4 w-4" />}
                    className="h-10 inline-flex items-center justify-center gap-1 rounded-xl border border-violet-200 text-violet-600 text-[10px] font-bold hover:bg-violet-50 transition" />
                  <ActionButton action="deleteTheme" payload={{ slug: theme.slug }}
                    label="حذف" icon={<Trash2 className="h-4 w-4" />}
                    confirm={theme.isActive ? "قالب فعال حذف نمی‌شود." : `قالب «${theme.name}» برای همیشه حذف شود؟`}
                    className="h-10 inline-flex items-center justify-center gap-1 rounded-xl border border-rose-200 text-rose-500 text-[10px] font-bold hover:bg-rose-50 transition col-span-3" />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-4 rounded-3xl border border-sky-200 bg-sky-50/70 p-4 text-[11px] leading-6 text-sky-800">
        <p className="font-black">چطور یک قالب جدید به سایت اضافه کنید؟</p>
        <p className="mt-1">قالب‌های این فروشگاه از نوع «قالب‌های سیستمی» هستند و با هر به‌روزرسانی هسته هم‌ساز می‌مانند. برای افزودن قالب جدید: ابتدا روی «تکثیر» یک قالب نزدیک به سلیقه‌تان کلیک کنید، سپس از «رنگ‌ها و فونت» و «ویرایشگر کد» آن را سفارشی کنید و در پایان همان رونوشت را «فعال‌سازی» کنید. نصب مستقیم فایل ZIP قالب‌های جانبی به زیرساخت ایزوله‌سازی کد نیاز دارد (به چک‌لیست پایان همین پنل مراجعه کنید) — به همین دلیل در این نسخه، مسیر امن «تکثیر + سفارشی‌سازی + فعال‌سازی» ارائه شده است.</p>
      </div>
    </div>
  );
}
