import Link from "next/link";
import { FileText, Pencil, Trash2, ExternalLink } from "lucide-react";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { contentPages } from "@/db/schema";
import ContentPageForm from "@/components/admin/content-page-form";
import ActionButton from "@/components/theme/action-button";
import { toFaDigits, faDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ContentPagesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const editId = Number(Array.isArray(sp.edit) ? sp.edit[0] : sp.edit ?? 0) || 0;

  const all = await db.select().from(contentPages).orderBy(desc(contentPages.updatedAt));
  const editing = editId ? all.find((p) => p.id === editId) ?? null : null;

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><FileText className="h-6 w-6 text-pink-600" /> صفحات محتوا</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">{toFaDigits(all.length)} صفحه ثابت — درباره ما، قوانین، حریم خصوصی و...</p>

      <div className="mt-4 grid lg:grid-cols-2 gap-4 items-start">
        {/* لیست صفحات */}
        <div className="space-y-2">
          {all.map((p) => (
            <article key={p.id} className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm">
              <span className="h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-br from-sky-100 to-cyan-50 grid place-items-center"><FileText className="h-5 w-5 text-sky-600" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-black text-[#14264a]">{p.title}</p>
                <p dir="ltr" className="text-[9px] text-slate-400 font-mono">/pages/{p.slug}</p>
                <p className="text-[8px] text-slate-400 mt-0.5">آخرین ویرایش: {faDate(p.updatedAt)}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link href={`/pages/${p.slug}`} target="_blank" aria-label="مشاهده" className="h-9 w-9 grid place-items-center rounded-xl border border-slate-200 text-slate-500 hover:border-sky-400 hover:text-sky-600 transition"><ExternalLink className="h-4 w-4" /></Link>
                <Link href={`/admin/content-pages?edit=${p.id}`} aria-label="ویرایش" className="h-9 w-9 grid place-items-center rounded-xl border border-slate-200 text-slate-500 hover:border-pink-400 hover:text-pink-600 transition"><Pencil className="h-4 w-4" /></Link>
                <ActionButton action="pages.delete" payload={{ entity: "pages", id: p.id }} label="" icon={<Trash2 className="h-4 w-4" />} confirm={`صفحه «${p.title}» حذف شود؟`}
                  className="h-9 w-9 grid place-items-center rounded-xl border border-rose-100 text-rose-400 hover:bg-rose-50 transition" />
              </div>
            </article>
          ))}
          {all.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-[11px] text-slate-400">صفحه‌ای ثبت نشده است.</div>}
        </div>

        {/* فرم ساخت/ویرایش */}
        <ContentPageForm editing={editing ? { id: editing.id, title: editing.title, slug: editing.slug, body: editing.body } : null} />
      </div>
    </div>
  );
}
