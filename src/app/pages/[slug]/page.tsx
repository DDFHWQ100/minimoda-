import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronLeft, FileText } from "lucide-react";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { contentPages } from "@/db/schema";
import { faDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const rows = await db.select({ title: contentPages.title, body: contentPages.body }).from(contentPages).where(eq(contentPages.slug, slug)).limit(1);
  return rows[0] ? { title: rows[0].title, description: rows[0].body.slice(0, 160) } : { title: "صفحه یافت نشد" };
}

export default async function ContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rows = await db.select().from(contentPages).where(eq(contentPages.slug, slug)).limit(1);
  const page = rows[0];
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-3xl px-3 sm:px-4 py-6">
      <nav className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500">
        <Link href="/" className="hover:text-pink-600">خانه</Link>
        <ChevronLeft className="h-3.5 w-3.5" />
        <span className="text-pink-700 font-bold">{page.title}</span>
      </nav>

      <article className="mt-4 rounded-3xl border border-slate-200/80 bg-white shadow-sm p-5 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="h-12 w-12 rounded-2xl bg-gradient-to-br from-sky-100 to-cyan-50 grid place-items-center"><FileText className="h-6 w-6 text-sky-600" /></span>
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-[#14264a]">{page.title}</h1>
            <p className="text-[9px] text-slate-400 mt-0.5">آخرین به‌روزرسانی: {faDate(page.updatedAt)}</p>
          </div>
        </div>
        <div className="mt-5 text-[13px] sm:text-[14px] leading-8 text-slate-600 whitespace-pre-line border-t border-slate-100 pt-5">
          {page.body}
        </div>
      </article>

      <Link href="/help" className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 h-12 text-[11px] font-bold text-slate-600 hover:border-pink-400 hover:text-pink-600 transition">
        سوالی دارید؟ راهنمای خرید و سوالات متداول را ببینید ←
      </Link>
    </div>
  );
}
