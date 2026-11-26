import Link from "next/link";
import { desc, sql } from "drizzle-orm";
import { promises as fs } from "fs";
import path from "path";
import {
  LayoutTemplate, PackageCheck, FileText, Blocks, FolderOpen, HardDrive,
  History, Bell, ShieldCheck, Gauge, ArrowLeft, Sparkles, AlertTriangle, CheckCircle2, ChevronLeft,
} from "lucide-react";
import { db } from "@/db";
import { activityLogs, notices, themes, homepageSections, menuItems, widgets, layoutPresets, banners, products } from "@/db/schema";
import { getThemeBundle } from "@/lib/theme";
import { faDate, toFaDigits } from "@/lib/format";

export const dynamic = "force-dynamic";

async function countAssets(): Promise<{ count: number; bytes: number }> {
  const pub = path.join(process.cwd(), "public");
  let count = 0, bytes = 0;
  async function walk(dir: string, depth: number) {
    if (depth > 4) return;
    let entries: import("fs").Dirent[] = [];
    try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) { await walk(full, depth + 1); continue; }
      try { const st = await fs.stat(full); count++; bytes += st.size; } catch { /* skip */ }
    }
  }
  for (const d of ["uploads", "images", "downloads"]) await walk(path.join(pub, d), 0);
  return { count, bytes };
}

export default async function ThemeOverviewPage() {
  const bundle = await getThemeBundle();
  const activeTheme = bundle.activeTheme;
  const [assets, recentLogs, allNotices, weeklyRows, sectionCount, menuCount, widgetCount, presetCount, bannerCount, noImageCount] = await Promise.all([
    countAssets(),
    db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(6),
    db.select().from(notices),
    db.select({ day: sql<string>`to_char(${activityLogs.createdAt}, 'YYYY-MM-DD')`, c: sql<number>`count(*)` }).from(activityLogs).where(sql`${activityLogs.createdAt} > now() - interval '7 days'`).groupBy(sql`1`).orderBy(sql`1`),
    db.select({ c: sql<number>`count(*)` }).from(homepageSections).where(sql`${homepageSections.enabled} = true`),
    db.select({ c: sql<number>`count(*)` }).from(menuItems),
    db.select({ c: sql<number>`count(*)` }).from(widgets),
    db.select({ c: sql<number>`count(*)` }).from(layoutPresets),
    db.select({ c: sql<number>`count(*)` }).from(banners),
    db.select({ c: sql<number>`count(*)` }).from(products).where(sql`${products.images} = '[]'`),
  ]);
  const customComponents = Number(menuCount[0]?.c ?? 0) + Number(widgetCount[0]?.c ?? 0) + Number(bannerCount[0]?.c ?? 0);
  const issues = Number(noImageCount[0]?.c ?? 0) + (bundle.settings["maintenance.enabled"] === "true" ? 1 : 0);
  const perfScore = Math.max(60, 100 - issues * 5 - (bundle.settings["design.animations"] === "false" ? 0 : 0));

  const enabledSections = Number(sectionCount[0]?.c ?? 0);
  const unread = allNotices.filter((n) => !n.read);
  const securityNotices = unread.filter((n) => n.level === "security" || n.level === "warning").length;
  const latestLog = recentLogs[0];

  // نمودار ۷ روز اخیر
  const days: { day: string; label: string; c: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toISOString().slice(0, 10);
    const row = weeklyRows.find((r) => r.day === key);
    days.push({ day: key, label: new Intl.DateTimeFormat("fa-IR", { weekday: "short" }).format(d), c: Number(row?.c ?? 0) });
  }
  const maxC = Math.max(1, ...days.map((d) => d.c));

  const stats = [
    { icon: LayoutTemplate, label: "قالب‌های نصب‌شده", value: toFaDigits(bundle.themes.length), tint: "from-violet-400 to-purple-600", href: "/admin/theme/themes" },
    { icon: PackageCheck, label: "قالب فعال", value: activeTheme?.name ?? "—", tint: "from-emerald-400 to-teal-600", href: "/admin/theme/themes" },
    { icon: FileText, label: "الگوهای صفحه + چیدمان", value: `۱۲ صفحه · ${toFaDigits(Number(presetCount[0]?.c ?? 0))} الگو`, tint: "from-sky-400 to-blue-600", href: "/admin/theme/presets" },
    { icon: Blocks, label: "اجزای سفارشی (منو/بنر/ابزارک)", value: `${toFaDigits(customComponents)} جزء · ${toFaDigits(enabledSections)}/۸ بخش فعال`, tint: "from-amber-300 to-orange-500", href: "/admin/theme/menus" },
    { icon: FolderOpen, label: "فایل‌های دارایی", value: toFaDigits(assets.count), tint: "from-pink-400 to-rose-600", href: "/admin/theme/assets" },
    { icon: HardDrive, label: "حجم کل دارایی‌ها", value: `${(assets.bytes / 1024 / 1024).toFixed(2)} مگابایت`, tint: "from-slate-400 to-slate-600", href: "/admin/theme/assets" },
    { icon: ShieldCheck, label: "هشدارهای امنیتی/سازگاری", value: toFaDigits(securityNotices), tint: securityNotices > 0 ? "from-rose-400 to-red-600" : "from-emerald-400 to-teal-600", href: "/admin/theme/notifications" },
    { icon: Gauge, label: "وضعیت عملکرد و مشکلات قالب", value: `${toFaDigits(perfScore)}٪ · ${toFaDigits(issues)} مشکل`, tint: issues > 0 ? "from-amber-400 to-orange-600" : "from-cyan-400 to-sky-600", href: "/admin/theme/seo" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><Sparkles className="h-6 w-6 text-pink-600" /> داشبورد مدیریت قالب و پوسته</h1>
          <p className="text-[11px] text-slate-500 mt-0.5">کنترل کامل ظاهر، ساختار صفحات و دارایی‌های بصری سایت — بدون ویرایش کد</p>
        </div>
        <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-300 bg-white px-4 h-11 text-[11px] font-bold text-slate-600 hover:border-pink-400 hover:text-pink-600 transition">پیش‌نمایش زنده سایت <ArrowLeft className="h-4 w-4" /></Link>
      </div>

      {/* کارت‌های آماری */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        {stats.map(({ icon: Icon, label, value, tint, href }) => (
          <Link key={label} href={href} className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${tint} grid place-items-center shadow`}><Icon className="h-5 w-5 text-white" strokeWidth={1.8} /></div>
            <small className="block mt-2 text-[9px] font-bold text-slate-400">{label}</small>
            <b className="block text-[12px] sm:text-[13px] font-black text-[#14264a] leading-5 truncate" title={value}>{value}</b>
          </Link>
        ))}
      </div>

      <div className="mt-4 grid xl:grid-cols-5 gap-4">
        {/* گزارش آخرین تغییرات + نمودار */}
        <section className="xl:col-span-3 rounded-3xl border border-slate-200/70 bg-white shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-[#14264a] text-[13px] flex items-center gap-2"><History className="h-4 w-4 text-slate-400" /> روند فعالیت‌های ۷ روز اخیر</h2>
            <Link href="/admin/theme/activity" className="text-[10px] font-bold text-pink-600 flex items-center gap-0.5">همه گزارش‌ها <ChevronLeft className="h-4 w-4" /></Link>
          </div>
          <div className="mt-3 flex items-end gap-2 sm:gap-3 h-28 border-b border-slate-100 pb-1">
            {days.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group">
                <span className="text-[9px] font-black text-slate-400 group-hover:text-pink-600 transition">{toFaDigits(d.c)}</span>
                <div className="w-full rounded-t-lg bg-gradient-to-t from-pink-500 to-rose-400 transition-all group-hover:from-pink-600" style={{ height: `${(d.c / maxC) * 100}%`, minHeight: d.c > 0 ? 8 : 2, opacity: d.c > 0 ? 1 : 0.25 }} />
                <span className="text-[8px] text-slate-400">{d.label}</span>
              </div>
            ))}
          </div>
          <ul className="mt-3 divide-y divide-slate-50">
            {recentLogs.map((log) => (
              <li key={log.id} className="flex items-center gap-2 py-2 text-[11px]">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="font-bold text-[#14264a] whitespace-nowrap">{log.action}</span>
                <span className="text-slate-400 truncate flex-1">{log.detail}</span>
                <span className="text-[9px] text-slate-400 whitespace-nowrap">{faDate(log.createdAt)}</span>
              </li>
            ))}
            {recentLogs.length === 0 && <li className="py-4 text-center text-slate-400 text-[11px]">فعالیتی ثبت نشده است.</li>}
          </ul>
        </section>

        {/* اعلان‌های مدیریتی */}
        <section className="xl:col-span-2 rounded-3xl border border-slate-200/70 bg-white shadow-sm p-4 sm:p-5 flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-[#14264a] text-[13px] flex items-center gap-2"><Bell className="h-4 w-4 text-pink-600" /> اعلان‌های مدیریتی <span className="text-[9px] bg-pink-100 text-pink-700 rounded-full px-2 py-0.5">{toFaDigits(unread.length)} خوانده‌نشده</span></h2>
            <Link href="/admin/theme/notifications" className="text-[10px] font-bold text-pink-600 flex items-center gap-0.5">همه <ChevronLeft className="h-4 w-4" /></Link>
          </div>
          <ul className="mt-2 space-y-2 flex-1">
            {unread.slice(0, 4).map((n) => {
              const LevelIcon = n.level === "security" || n.level === "warning" ? AlertTriangle : n.level === "success" ? CheckCircle2 : Bell;
              const tone = n.level === "security" ? "text-rose-600 bg-rose-50 border-rose-200" : n.level === "warning" ? "text-amber-700 bg-amber-50 border-amber-200" : n.level === "success" ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-sky-700 bg-sky-50 border-sky-200";
              return (
                <li key={n.id} className={`rounded-2xl border px-3 py-2 text-[10px] leading-5 ${tone}`}>
                  <p className="flex items-center gap-1.5 font-black"><LevelIcon className="h-3.5 w-3.5 shrink-0" />{n.title}</p>
                  <p className="mt-0.5 opacity-80">{n.body}</p>
                </li>
              );
            })}
            {unread.length === 0 && <li className="text-center text-[11px] text-slate-400 py-8">هیچ اعلان خوانده‌نشده‌ای ندارید 🎉</li>}
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link href="/admin/theme/themes" className="rounded-2xl border border-slate-200 px-3 py-2.5 text-[10px] font-bold text-slate-600 hover:border-pink-400 hover:text-pink-700 transition text-center">فعال‌سازی قالب دیگر</Link>
            <Link href="/admin/theme/revisions" className="rounded-2xl border border-slate-200 px-3 py-2.5 text-[10px] font-bold text-slate-600 hover:border-pink-400 hover:text-pink-700 transition text-center">تهیه پشتیبان فوری</Link>
          </div>
          <p className="mt-2 text-[9px] text-slate-400 text-center">آخرین تغییر: {latestLog ? `${latestLog.action} — ${faDate(latestLog.createdAt)}` : "—"}</p>
        </section>
      </div>
    </div>
  );
}
