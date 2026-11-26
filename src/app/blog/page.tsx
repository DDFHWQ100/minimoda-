import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Newspaper, Eye, CalendarDays, ChevronLeft } from "lucide-react";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { faDay, toFaDigits } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "وبلاگ مد و پوشاک کودک" };

export default async function BlogPage() {
  const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 py-6">
      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-black text-[#14264a]"><Newspaper className="h-7 w-7 text-pink-600" /> وبلاگ مینی‌مودا</h1>
      <p className="mt-1 text-[12px] text-slate-500">ترندهای مد کودک، راهنمای خرید و نکات سلامتی لباس و کفش فرزندتان</p>

      {/* مقاله شاخص */}
      {featured && (
        <Link href={`/blog/${featured.slug}`} className="mt-5 relative block h-60 sm:h-80 lg:h-96 rounded-3xl overflow-hidden group shadow-md">
          <Image src={featured.image} alt={featured.title} fill priority sizes="100vw" className="object-cover group-hover:scale-105 transition-transform duration-[1.2s]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1c36]/90 via-[#0e1c36]/35 to-transparent" />
          <div className="absolute inset-0 p-5 sm:p-8 flex flex-col justify-end max-w-2xl">
            <span className="w-max rounded-md bg-pink-600 text-white text-[9px] sm:text-[10px] font-black px-2.5 py-1">{featured.tag}</span>
            <h2 className="mt-2 text-lg sm:text-3xl font-black text-white leading-7 sm:leading-[2.6rem]">{featured.title}</h2>
            <p className="hidden sm:block mt-2 text-[12px] text-white/75 leading-6 line-clamp-2">{featured.excerpt}</p>
            <span className="mt-3 flex items-center gap-3 text-[9px] sm:text-[10px] text-white/60">
              <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4" />{faDay(featured.createdAt)}</span>
              <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{toFaDigits(featured.views.toLocaleString("fa-IR"))} بازدید</span>
            </span>
          </div>
        </Link>
      )}

      {/* گرید مقالات */}
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {rest.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all group">
            <div className="relative h-40 sm:h-48 overflow-hidden">
              <Image src={post.image} alt={post.title} fill sizes="(max-width:1024px) 50vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-700" />
              <span className="absolute top-2 right-2 rounded-md bg-[#14264a]/80 backdrop-blur text-amber-300 text-[9px] font-bold px-2 py-1">{post.tag}</span>
            </div>
            <div className="p-4">
              <h3 className="text-[13px] sm:text-[14px] font-black text-[#14264a] leading-6 line-clamp-2 min-h-12 group-hover:text-pink-700 transition-colors">{post.title}</h3>
              <p className="mt-1 text-[10px] text-slate-400 leading-5 line-clamp-2">{post.excerpt}</p>
              <div className="mt-2 flex items-center justify-between text-[9px] text-slate-400">
                <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{faDay(post.createdAt)}</span>
                <span className="flex items-center gap-2"><span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{toFaDigits(post.views.toLocaleString("fa-IR"))}</span><ChevronLeft className="h-3.5 w-3.5 text-pink-500" /></span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
