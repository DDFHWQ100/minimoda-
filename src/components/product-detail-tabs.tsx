"use client";

import { useState, useTransition } from "react";
import { Star, MessageSquareText, Truck, User, Send, Loader2, CheckCircle2 } from "lucide-react";
import { faDay, toFaDigits } from "@/lib/format";

export type ReviewRow = {
  id: number;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type Props = {
  productId: number;
  description: string;
  specs: { label: string; value: string }[];
  reviews: ReviewRow[];
};

function Stars({ value, onChange, size = "h-6 w-6" }: { value: number; onChange?: (v: number) => void; size?: string }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5" dir="ltr">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = (hover || value) >= i;
        return (
          <button
            key={i}
            type="button"
            disabled={!onChange}
            onMouseEnter={() => onChange && setHover(i)}
            onMouseLeave={() => onChange && setHover(0)}
            onClick={() => onChange?.(i)}
            className={onChange ? "cursor-pointer transition-transform hover:scale-125" : "cursor-default"}
            aria-label={`${i} ستاره`}
          >
            <Star className={`${size} ${filled ? "fill-amber-400 text-amber-400" : "text-slate-300"} transition-colors`} />
          </button>
        );
      })}
    </div>
  );
}

export default function ProductDetailTabs({ productId, description, specs, reviews }: Props) {
  const [tab, setTab] = useState<"desc" | "specs" | "reviews">("desc");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim().length < 5) {
      setError("نظر شما باید حداقل ۵ کاراکتر باشد.");
      return;
    }
    setError("");
    startTransition(async () => {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment: comment.trim() }),
      });
      if (res.ok) {
        setDone(true);
        setComment("");
        window.setTimeout(() => window.location.reload(), 1200);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "ثبت نظر با خطا مواجه شد.");
      }
    });
  };

  const tabCls = (key: typeof tab) =>
    `h-11 px-4 sm:px-6 text-[12px] sm:text-[13px] font-black border-b-2 -mb-px transition-colors ${
      tab === key ? "border-pink-600 text-pink-700" : "border-transparent text-slate-400 hover:text-[#14264a]"
    }`;

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4 mt-6">
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center border-b border-slate-100 overflow-x-auto no-scrollbar">
          <button className={tabCls("desc")} onClick={() => setTab("desc")}>توضیحات محصول</button>
          <button className={tabCls("specs")} onClick={() => setTab("specs")}>مشخصات فنی</button>
          <button className={tabCls("reviews")} onClick={() => setTab("reviews")}>نظرات کاربران ({toFaDigits(reviews.length)})</button>
        </div>

        <div className="p-4 sm:p-6">
          {tab === "desc" && (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h3 className="font-black text-[#14264a]">درباره این محصول</h3>
                <p className="mt-2 text-[13px] leading-7 text-slate-600 whitespace-pre-line">{description}</p>
                <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                  {["دوخت دستی با دقت بالا", "پارچه ضد حساسیت و تنفس‌پذیر", "رنگ ثابت در شستشو", "بسته‌بندی هدیه ویژه مینی‌مودا"].map((t) => (
                    <li key={t} className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2 font-medium"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />{t}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-4">
                <Truck className="h-6 w-6 text-orange-500" />
                <h4 className="mt-2 text-[13px] font-black text-[#14264a]">ارسال و بازگشت</h4>
                <ul className="mt-1.5 space-y-1.5 text-[11px] leading-5 text-slate-600">
                  <li>• ارسال رایگان سفارش‌های بالای ۲,۰۰۰,۰۰۰ تومان</li>
                  <li>• تحویل در تهران ۱ روز کاری، سایر شهرها ۲ تا ۴ روز</li>
                  <li>• ۷ روز مهلت تست و بازگشت کالا با فاکتور</li>
                  <li>• امکان پرداخت درب منزل تهران و کرج</li>
                </ul>
              </div>
            </div>
          )}

          {tab === "specs" && (
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-0 max-w-3xl">
              {specs.map((s) => (
                <div key={s.label} className="flex items-center justify-between border-b border-dashed border-slate-200 py-3 text-[12px]">
                  <span className="text-slate-400 font-medium">{s.label}</span>
                  <span className="font-bold text-[#14264a]">{s.value}</span>
                </div>
              ))}
            </div>
          )}

          {tab === "reviews" && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* لیست نظرات */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center gap-4 rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <div className="text-center">
                    <p className="text-3xl font-black text-[#14264a]">{toFaDigits(avg.toFixed(1))}</p>
                    <Stars value={Math.round(avg)} size="h-4 w-4" />
                    <p className="mt-1 text-[9px] text-slate-400">{toFaDigits(reviews.length)} نظر ثبت‌شده</p>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((s) => {
                      const count = reviews.filter((r) => r.rating === s).length;
                      const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={s} className="flex items-center gap-2 text-[10px]">
                          <span className="w-3 font-bold text-slate-500">{toFaDigits(s)}</span>
                          <div className="h-2 flex-1 rounded-full bg-slate-200 overflow-hidden"><div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} /></div>
                          <span className="w-6 text-slate-400">{toFaDigits(count)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <MessageSquareText className="h-10 w-10 mx-auto mb-2 opacity-40" />
                    هنوز نظری ثبت نشده؛ اولین نظر را شما بنویسید!
                  </div>
                ) : reviews.map((r) => (
                  <article key={r.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-pink-100 to-orange-100 grid place-items-center"><User className="h-4 w-4 text-pink-600" /></div>
                        <div>
                          <p className="text-[12px] font-black text-[#14264a]">{r.authorName}</p>
                          <p className="text-[9px] text-slate-400">{faDay(r.createdAt)}</p>
                        </div>
                      </div>
                      <Stars value={r.rating} size="h-4 w-4" />
                    </div>
                    <p className="mt-2 text-[12px] leading-6 text-slate-600">{r.comment}</p>
                  </article>
                ))}
              </div>

              {/* فرم ثبت نظر */}
              <form onSubmit={submit} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm h-max">
                <h4 className="font-black text-[13px] text-[#14264a]">تجربه شما از این محصول؟</h4>
                <div className="mt-2"><Stars value={rating} onChange={setRating} /></div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder="نظر خود را درباره کیفیت، دوخت، سایزبندی بنویسید..."
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-[12px] leading-6 outline-none focus:border-pink-400 focus:bg-white resize-none"
                />
                {error && <p className="mt-1.5 text-[10px] font-bold text-rose-600">{error}</p>}
                {done && <p className="mt-1.5 text-[10px] font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> نظر شما با موفقیت ثبت شد؛ در حال به‌روزرسانی...</p>}
                <button type="submit" disabled={pending} className="mt-3 w-full h-11 rounded-xl bg-[#14264a] text-white text-[12px] font-bold hover:bg-[#1d3a63] transition flex items-center justify-center gap-2 disabled:opacity-60">
                  {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  ثبت نظر
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
