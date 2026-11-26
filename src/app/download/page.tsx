import type { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import { Download, Package, FileCode2, CheckCircle2, Database, Terminal, Server, Crown } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "دانلود سورس فروشگاه" };

async function sizeOf(rel: string): Promise<string> {
  try {
    const st = await fs.stat(path.join(process.cwd(), "public", rel));
    return `${(st.size / 1024).toFixed(0)} KB`;
  } catch {
    return "—";
  }
}

export default async function DownloadPage() {
  const [fullSize, phpSize] = await Promise.all([sizeOf("downloads/minimoda-full.zip"), sizeOf("downloads/minimoda-php.zip")]);

  return (
    <div className="mx-auto max-w-4xl px-3 sm:px-4 py-8">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 rounded-3xl grid place-items-center shadow-lg shadow-amber-400/30" style={{ background: "linear-gradient(135deg, #fcd34d, #f59e0b)" }}>
          <Crown className="h-8 w-8 text-[#1b3a6b]" />
        </div>
        <h1 className="mt-4 text-2xl sm:text-3xl font-black text-[#1b3a6b]">دانلود سورس فروشگاه مینی‌مودا</h1>
        <p className="mt-2 text-[12px] text-slate-500">آخرین نسخه با قالب جدید، پنل مدیریت ۲۳ بخشی و دیتابیس نمونه</p>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        {/* Next.js */}
        <div className="rounded-3xl border-2 border-pink-200 bg-white p-6 shadow-lg shadow-pink-100/50 flex flex-col">
          <div className="flex items-center gap-3">
            <span className="h-12 w-12 rounded-2xl bg-[#1b3a6b] grid place-items-center"><Package className="h-6 w-6 text-amber-400" /></span>
            <div>
              <h2 className="font-black text-[#1b3a6b]">نسخه کامل (Next.js + PostgreSQL)</h2>
              <p className="text-[10px] text-slate-400">{fullSize} · ۱۵۰ فایل · همه امکانات</p>
            </div>
          </div>
          <ul className="mt-4 space-y-1.5 text-[11px] text-slate-600 flex-1">
            {["ویترین با قالب جدید مرجع", "پنل مدیریت ۲۳ بخشی کامل", "مدیریت قالب و پوسته (۱۴ صفحه)", "سبد، تسویه، سفارش، نظرات، بلاگ", "اسکریپت‌های seed دیتابیس نمونه"].map((t) => (
              <li key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />{t}</li>
            ))}
          </ul>
          <a href="/api/download/full" className="mt-5 flex items-center justify-center gap-2 rounded-2xl h-13 py-4 text-white font-black text-sm shadow-lg shadow-pink-600/30 hover:brightness-110 hover:-translate-y-0.5 transition-all" style={{ background: "var(--brand-accent)" }}>
            <Download className="h-5 w-5" /> دانلود نسخه کامل
          </a>
          <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-3 text-[10px] text-slate-600 space-y-1.5">
            <p className="font-black text-[#1b3a6b] flex items-center gap-1.5"><Terminal className="h-3.5 w-3.5" /> نصب:</p>
            <code dir="ltr" className="block font-mono text-left text-[9px] bg-white rounded-lg p-2 border border-slate-200 leading-6">npm install<br />cp .env.example .env  # تنظیم DATABASE_URL<br />npx drizzle-kit push<br />npx tsx src/db/seed.ts<br />npm run dev</code>
          </div>
        </div>

        {/* PHP */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-3">
            <span className="h-12 w-12 rounded-2xl bg-slate-100 grid place-items-center"><FileCode2 className="h-6 w-6 text-slate-600" /></span>
            <div>
              <h2 className="font-black text-[#1b3a6b]">نسخه PHP + MySQL</h2>
              <p className="text-[10px] text-slate-400">{phpSize} · ۲۳ فایل · برای هاست اشتراکی / XAMPP</p>
            </div>
          </div>
          <ul className="mt-4 space-y-1.5 text-[11px] text-slate-600 flex-1">
            {["بدون نیاز به Node.js", "نصب با phpMyAdmin و کپی فایل", "فایل check.php برای تشخیص خودکار نصب", "پنل مدیریت پایه (محصول/سفارش)", "راهنمای فارسی کامل در README"].map((t) => (
              <li key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />{t}</li>
            ))}
          </ul>
          <a href="/api/download/php" className="mt-5 flex items-center justify-center gap-2 rounded-2xl h-13 py-4 bg-[#1b3a6b] text-amber-300 font-black text-sm hover:bg-[#15305a] hover:-translate-y-0.5 transition-all">
            <Download className="h-5 w-5" /> دانلود نسخه PHP
          </a>
          <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-3 text-[10px] text-slate-600 space-y-1.5">
            <p className="font-black text-[#1b3a6b] flex items-center gap-1.5"><Server className="h-3.5 w-3.5" /> نصب روی XAMPP:</p>
            <ol className="list-decimal pr-4 space-y-0.5 leading-5">
              <li>پوشه php را در <code dir="ltr">htdocs/minimoda</code> کپی کنید</li>
              <li>در phpMyAdmin دیتابیس <code>minimoda</code> بسازید و <code>database.sql</code> را Import کنید</li>
              <li><code>config.php</code> را تنظیم کنید</li>
              <li><code dir="ltr">localhost/minimoda/check.php</code> را باز کنید</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-[11px] text-amber-900 flex items-start gap-2">
        <Database className="h-4 w-4 shrink-0 mt-0.5" />
        <p><b>حساب‌های آزمایشی:</b> مدیر <code dir="ltr">admin@minimoda.ir / admin123</code> — مشتری <code dir="ltr">sara@example.com / user123</code>. بعد از نصب روی سرور واقعی حتماً رمز مدیر را عوض کنید.</p>
      </div>
    </div>
  );
}
