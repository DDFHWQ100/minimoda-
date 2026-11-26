import Link from "next/link";
import { MessageSquareText, Trash2, Star } from "lucide-react";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { reviews, products } from "@/db/schema";
import ActionButton from "@/components/theme/action-button";
import { toFaDigits, faDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ReviewsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const filter = Array.isArray(sp.star) ? sp.star[0] : sp.star ?? "";
  const star = Number(filter) || 0;

  const rows = await db
    .select({ id: reviews.id, rating: reviews.rating, comment: reviews.comment, authorName: reviews.authorName, createdAt: reviews.createdAt, productId: reviews.productId, productName: products.name, productSlug: products.slug })
    .from(reviews)
    .innerJoin(products, eq(products.id, reviews.productId))
    .orderBy(desc(reviews.createdAt))
    .limit(100);

  const filtered = star ? rows.filter((r) => r.rating === star) : rows;
  const avg = rows.length ? rows.reduce((s, r) => s + r.rating, 0) / rows.length : 0;

  const chip = (label: string, value: string) => (
    <Link key={value} href={value ? `/admin/reviews?star=${value}` : "/admin/reviews"}
      className={`rounded-full px-3 h-8 inline-flex items-center text-[10px] font-bold border transition ${filter === value ? "bg-[#14264a] border-[#14264a] text-amber-300" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}>{label}</Link>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><MessageSquareText className="h-6 w-6 text-pink-600" /> نظرات و امتیازها</h1>
          <p className="text-[11px] text-slate-500 mt-0.5">{toFaDigits(rows.length)} نظر ثبت‌شده — میانگین امتیاز <b className="text-amber-600">{toFaDigits(avg.toFixed(1))} ★</b></p>
        </div>
        <div className="flex gap-1.5">{chip("همه", "")}{chip("۵ ★", "5")}{chip("۴ ★", "4")}{chip("۳ ★", "3")}{chip("۲ ★", "2")}{chip("۱ ★", "1")}</div>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-2">
        {filtered.map((r) => (
          <article key={r.id} className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-black text-[#14264a]">{r.authorName}</p>
                <Link href={`/products/${r.productSlug}`} className="text-[9px] text-sky-700 hover:underline line-clamp-1">{r.productName}</Link>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-amber-500 text-[13px] tracking-widest">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                <span className="text-[8px] text-slate-400">{faDate(r.createdAt)}</span>
              </div>
            </div>
            <p className="mt-2 text-[11px] leading-6 text-slate-600">{r.comment}</p>
            <div className="mt-2 flex justify-end">
              <ActionButton action="reviews.delete" payload={{ entity: "reviews", id: r.id }} label="حذف نظر" icon={<Trash2 className="h-4 w-4" />} confirm="این نظر حذف شود؟ امتیاز محصول به‌صورت خودکار دوباره محاسبه می‌شود."
                className="inline-flex items-center gap-1 rounded-lg border border-rose-100 text-rose-500 px-3 h-8 text-[9px] font-bold hover:bg-rose-50 transition" />
            </div>
          </article>
        ))}
        {filtered.length === 0 && <div className="md:col-span-2 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-[11px] text-slate-400">نظری با این امتیاز ثبت نشده است.</div>}
      </div>
    </div>
  );
}
