import Link from "next/link";
import Image from "next/image";
import { Newspaper, Pencil, Trash2, Eye, FilePenLine } from "lucide-react";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import BlogManager from "@/components/admin/blog-manager";
import ActionButton from "@/components/theme/action-button";
import { toFaDigits, faDay } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const editId = Number(Array.isArray(sp.edit) ? sp.edit[0] : sp.edit ?? 0) || 0;

  const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  const editing = editId ? posts.find((p) => p.id === editId) ?? null : null;

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><Newspaper className="h-6 w-6 text-pink-600" /> بلاگ و مجله مد</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">{toFaDigits(posts.length)} مقاله — انتشار، ویرایش و حذف مقالات مجله مینی‌مودا</p>

      <div className="mt-4 grid lg:grid-cols-2 gap-4 items-start">
        <BlogManager initial={editing ? { id: editing.id, title: editing.title, excerpt: editing.excerpt, content: editing.content, image: editing.image, tag: editing.tag } : null} />

        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-500">مقالات منتشرشده</p>
          {posts.map((p) => (
            <article key={p.id} className="flex gap-3 rounded-2xl border border-slate-200/70 bg-white p-2.5 shadow-sm items-center">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f6f4ef]"><Image src={p.image} alt={p.title} fill sizes="80px" className="object-cover" /></div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black text-[#14264a] leading-5 line-clamp-2">{p.title}</p>
                <p className="mt-0.5 text-[8px] text-slate-400">{p.tag} · {faDay(p.createdAt)}</p>
                <p className="text-[8px] text-slate-400 flex items-center gap-1 mt-0.5"><Eye className="h-3 w-3" />{toFaDigits(p.views)} بازدید</p>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <Link href={`/admin/blog?edit=${p.id}`} aria-label="ویرایش" className="h-8 w-8 grid place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-pink-400 hover:text-pink-600 transition"><Pencil className="h-4 w-4" /></Link>
                <Link href={`/blog/${p.slug}`} target="_blank" aria-label="مشاهده" className="h-8 w-8 grid place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-sky-400 hover:text-sky-600 transition"><Eye className="h-4 w-4" /></Link>
                <ActionButton action="blog.delete" payload={{ entity: "blog", id: p.id }} label="" icon={<Trash2 className="h-4 w-4" />} confirm={`مقاله «${p.title}» حذف شود؟`}
                  className="h-8 w-8 grid place-items-center rounded-lg border border-rose-100 text-rose-400 hover:bg-rose-50 transition" />
              </div>
            </article>
          ))}
          {posts.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-[11px] text-slate-400">هنوز مقاله‌ای منتشر نشده.</div>}
        </div>
      </div>
    </div>
  );
}
