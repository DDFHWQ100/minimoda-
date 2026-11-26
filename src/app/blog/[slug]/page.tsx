import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronLeft, Eye, CalendarDays, ArrowRight, Share2 } from "lucide-react";
import { eq, sql, desc, ne } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { faDay, toFaDigits } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const rows = await db.select({ title: blogPosts.title, excerpt: blogPosts.excerpt }).from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return rows[0] ? { title: rows[0].title, description: rows[0].excerpt } : { title: "مقاله یافت نشد" };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // افزایش شمارنده بازدید
  await db.update(blogPosts).set({ views: sql`${blogPosts.views} + 1` }).where(eq(blogPosts.slug, slug));

  const rows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  const post = rows[0];
  if (!post) notFound();

  const related = await db
    .select()
    .from(blogPosts)
    .where(ne(blogPosts.id, post.id))
    .orderBy(desc(blogPosts.views))
    .limit(3);

  return (
    <article className="mx-auto max-w-4xl px-3 sm:px-4 py-6">
      <nav className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500">
        <Link href="/" className="hover:text-pink-600">خانه</Link>
        <ChevronLeft className="h-3.5 w-3.5" />
        <Link href="/blog" className="hover:text-pink-600">وبلاگ</Link>
        <ChevronLeft className="h-3.5 w-3.5" />
        <span className="text-pink-700 font-bold">{post.tag}</span>
      </nav>

      <h1 className="mt-3 text-xl sm:text-3xl font-black text-[#14264a] leading-8 sm:leading-[2.8rem]">{post.title}</h1>
      <div className="mt-2 flex items-center gap-4 text-[10px] sm:text-[11px] text-slate-400">
        <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4" />{faDay(post.createdAt)}</span>
        <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{toFaDigits(post.views.toLocaleString("fa-IR"))} بازدید</span>
        <span className="rounded-md bg-pink-50 border border-pink-200 text-pink-700 text-[9px] font-bold px-2 py-0.5">{post.tag}</span>
        <button className="flex items-center gap-1 hover:text-pink-600 transition" aria-label="اشتراک‌گذاری"><Share2 className="h-4 w-4" /> اشتراک‌گذاری</button>
      </div>

      <div className="relative mt-4 h-56 sm:h-80 rounded-3xl overflow-hidden shadow-md">
        <Image src={post.image} alt={post.title} fill priority sizes="(max-width:896px) 100vw, 896px" className="object-cover" />
      </div>

      <p className="mt-5 text-[13px] sm:text-[15px] font-bold leading-7 sm:leading-8 text-[#14264a] bg-amber-50/60 border border-amber-100 rounded-2xl px-4 py-3">{post.excerpt}</p>
      <div className="mt-4 text-[13px] sm:text-[14px] leading-8 text-slate-600 whitespace-pre-line">{post.content}</div>

      <Link href="/products" className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 rounded-3xl bg-gradient-to-l from-pink-600 to-rose-600 text-white p-5 shadow-lg">
        <div className="flex-1">
          <p className="text-[10px] text-white/70 font-bold">مینی‌مودا</p>
          <p className="font-black text-base sm:text-lg">کالکشن جدید لباس کودک را با ارسال رایگان بالای ۲ میلیون تومان ببینید</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-white text-pink-700 px-5 h-11 text-[12px] font-black w-max">مشاهده محصولات <ArrowRight className="h-4 w-4" /></span>
      </Link>

      {/* مقالات مرتبط */}
      <h2 className="mt-8 text-lg font-black text-[#14264a] flex items-center gap-2"><span className="h-6 w-1.5 rounded-full bg-pink-600" />مقالات مرتبط</h2>
      <div className="mt-3 grid sm:grid-cols-3 gap-3">
        {related.map((r) => (
          <Link key={r.id} href={`/blog/${r.slug}`} className="rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-lg transition overflow-hidden group">
            <div className="relative h-32 overflow-hidden">
              <Image src={r.image} alt={r.title} fill sizes="300px" className="object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <p className="p-3 text-[11px] font-bold text-[#14264a] leading-5 line-clamp-2">{r.title}</p>
          </Link>
        ))}
      </div>
    </article>
  );
}
