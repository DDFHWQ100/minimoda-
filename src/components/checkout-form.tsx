"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CreditCard, Banknote, Wallet, Loader2, CheckCircle2, ShieldCheck, Truck, MapPin, Phone, User, FileText, Store,
} from "lucide-react";
import { useStore } from "@/components/store-provider";
import { formatPrice, toFaDigits } from "@/lib/format";

const SHIPPING_COST = 45_000;

export default function CheckoutForm({
  defaultName, defaultPhone, defaultAddress, isLoggedIn, freeAt,
}: {
  defaultName: string; defaultPhone: string; defaultAddress: string; isLoggedIn: boolean; freeAt: number;
}) {
  const router = useRouter();
  const { cart, cartTotal, clearCart, hydrated } = useStore();
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [address, setAddress] = useState(defaultAddress);
  const [note, setNote] = useState("");
  const [payment, setPayment] = useState<"online" | "onsite" | "card">("online");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ orderId: number } | null>(null);

  const shipping = cartTotal >= freeAt || cartTotal === 0 ? 0 : SHIPPING_COST;
  const total = cartTotal + shipping;
  const items = useMemo(() => cart, [cart]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError("لطفاً نام، شماره تماس و آدرس را کامل وارد کنید.");
      return;
    }
    if (!/^09\d{9}$/.test(phone.trim())) {
      setError("شماره موبایل معتبر وارد کنید (مثال: 09121234567)");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          note: note.trim(),
          paymentMethod: payment,
          items: items.map((i) => ({ id: i.id, qty: i.qty, size: i.size, color: i.color })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "ثبت سفارش با خطا مواجه شد.");
      } else {
        clearCart();
        setDone({ orderId: data.orderId });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setError("ارتباط با سرور برقرار نشد؛ دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="mx-auto h-24 w-24 rounded-full bg-emerald-50 grid place-items-center animate-[fadeUp_.5s_ease]">
          <CheckCircle2 className="h-14 w-14 text-emerald-500" strokeWidth={1.6} />
        </div>
        <h1 className="mt-5 text-2xl font-black text-[#14264a]">سفارش شما با موفقیت ثبت شد!</h1>
        <p className="mt-2 text-[13px] text-slate-500 leading-6">
          سفارش شماره <span className="font-black text-pink-600">#MM-{toFaDigits(String(done.orderId).padStart(5, "0"))}</span> در سیستم ثبت شد.
          {payment === "online" ? " پرداخت آنلاین شما با موفقیت انجام شد و" : ""} کارشناسان مینی‌مودا طی ساعات اداری برای هماهنگی ارسال با شما تماس می‌گیرند.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-[11px] font-bold text-amber-800"><Truck className="h-4 w-4" /> زمان تقریبی تحویل: ۱ تا ۴ روز کاری</div>
        <div className="mt-6 flex items-center justify-center gap-2">
          <Link href="/orders" className="rounded-full bg-[#14264a] text-white px-6 h-12 inline-flex items-center font-bold hover:bg-[#1d3a63] transition">پیگیری سفارش</Link>
          <Link href="/products" className="rounded-full border border-slate-300 text-slate-600 px-6 h-12 inline-flex items-center font-bold hover:border-pink-400 hover:text-pink-600 transition">ادامه خرید</Link>
        </div>
      </div>
    );
  }

  if (hydrated && items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-xl font-black text-[#14264a]">سبد خرید شما خالی است</h1>
        <p className="mt-2 text-[13px] text-slate-500">برای ثبت سفارش ابتدا محصولی به سبد اضافه کنید.</p>
        <Link href="/products" className="mt-5 inline-flex items-center gap-2 rounded-full bg-pink-600 text-white px-8 h-12 font-bold hover:bg-pink-500 transition">رفتن به فروشگاه</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6">
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><ShieldCheck className="h-6 w-6 text-emerald-500" /> تکمیل سفارش</h1>
      <p className="mt-1 text-[11px] text-slate-400">{isLoggedIn ? "سفارش با حساب کاربری شما ثبت می‌شود." : "مهمان می‌توانید بدون ثبت‌نام خرید کنید؛ ثبت‌نام سفارش‌ها را قابل پیگیری می‌کند."}</p>

      <form onSubmit={submit} className="mt-4 grid lg:grid-cols-3 gap-4">
        {/* ═══ فرم اطلاعات ارسال ═══ */}
        <div className="lg:col-span-2 space-y-4">
          <section className="rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="font-black text-[#14264a] flex items-center gap-2"><MapPin className="h-5 w-5 text-pink-600" /> اطلاعات گیرنده</h2>
            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1"><User className="h-3.5 w-3.5" /> نام و نام خانوادگی *</span>
                <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="مثلاً سارا محمدی" className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-pink-400 outline-none px-4 text-[13px] transition" />
              </label>
              <label className="block">
                <span className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> شماره موبایل *</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" required placeholder="09121234567" inputMode="numeric" className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-pink-400 outline-none px-4 text-[13px] text-left transition" />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> آدرس کامل پستی *</span>
                <textarea value={address} onChange={(e) => setAddress(e.target.value)} required rows={2} placeholder="استان، شهر، خیابان، کوچه، پلاک، واحد، کد پستی" className="w-full rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-pink-400 outline-none p-4 text-[13px] leading-6 transition resize-none" />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> توضیحات سفارش (اختیاری)</span>
                <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="مثلاً: لطفاً قبل از ارسال هماهنگ کنید" className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-pink-400 outline-none px-4 text-[13px] transition" />
              </label>
            </div>
          </section>

          {/* روش پرداخت */}
          <section className="rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="font-black text-[#14264a] flex items-center gap-2"><CreditCard className="h-5 w-5 text-pink-600" /> روش پرداخت</h2>
            <div className="mt-3 grid sm:grid-cols-3 gap-2">
              {[
                { id: "online" as const, icon: Wallet, t: "پرداخت آنلاین", d: "زرین‌پال — همه کارت‌ها", badge: "پیشنهادی" },
                { id: "onsite" as const, icon: Banknote, t: "پرداخت درب منزل", d: "تهران و کرج — نقد/کارت" },
                { id: "card" as const, icon: Store, t: "کارت به کارت", d: "شماره کارت پس از ثبت" },
              ].map(({ id, icon: Icon, t, d, badge }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPayment(id)}
                  aria-pressed={payment === id}
                  className={`relative rounded-2xl border-2 p-3 text-right transition-all ${payment === id ? "border-pink-600 bg-pink-50/50 shadow-md shadow-pink-100" : "border-slate-200 hover:border-slate-300"}`}
                >
                  {badge && <span className="absolute -top-2.5 right-3 rounded-full bg-pink-600 text-white text-[8px] font-black px-2 py-0.5">{badge}</span>}
                  <Icon className={`h-6 w-6 ${payment === id ? "text-pink-600" : "text-slate-400"}`} strokeWidth={1.8} />
                  <p className="mt-1.5 text-[12px] font-black text-[#14264a]">{t}</p>
                  <p className="text-[9px] text-slate-400 leading-4">{d}</p>
                  <span className={`absolute top-3 left-3 h-5 w-5 rounded-full border-2 grid place-items-center ${payment === id ? "border-pink-600 bg-pink-600" : "border-slate-300"}`}>
                    {payment === id && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* ═══ خلاصه سفارش ═══ */}
        <aside className="lg:col-span-1">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm sticky top-28">
            <h2 className="font-black text-[#14264a]">اقلام سفارش ({toFaDigits(items.length)})</h2>
            <ul className="mt-2 max-h-72 overflow-y-auto divide-y divide-slate-100">
              {items.map((i) => {
                const eff = i.discountPrice && i.discountPrice < i.price ? i.discountPrice : i.price;
                return (
                  <li key={`${i.id}-${i.size}-${i.color}`} className="flex items-center gap-2 py-2">
                    <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-[#f6f4ef]">
                      <Image src={i.image} alt={i.name} fill sizes="60px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold text-slate-600 line-clamp-1">{i.name}</p>
                      <p className="text-[9px] text-slate-400">سایز {toFaDigits(i.size)} · {toFaDigits(i.qty)} عدد</p>
                    </div>
                    <span className="text-[10px] font-black text-[#14264a] shrink-0">{formatPrice(eff * i.qty)}</span>
                  </li>
                );
              })}
            </ul>
            <dl className="mt-3 space-y-1.5 text-[12px] text-slate-600 border-t border-dashed border-slate-200 pt-3">
              <div className="flex justify-between"><dt>جمع کالاها</dt><dd className="font-bold">{formatPrice(cartTotal)}</dd></div>
              <div className="flex justify-between"><dt>ارسال</dt><dd className="font-bold">{shipping === 0 ? <span className="text-emerald-600">رایگان</span> : formatPrice(shipping)}</dd></div>
              <div className="flex justify-between text-[14px] text-[#14264a]"><dt className="font-black">مبلغ نهایی</dt><dd className="font-black">{formatPrice(total)}</dd></div>
            </dl>
            {error && <p className="mt-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-bold px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading} className="mt-3 w-full h-13 py-4 rounded-2xl bg-gradient-to-l from-emerald-600 to-teal-600 text-white font-black shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
              ثبت نهایی سفارش
            </button>
            <p className="mt-2 text-center text-[9px] text-slate-400 leading-4">با ثبت سفارش، <Link href="/help#faq" className="underline hover:text-pink-600">قوانین و مقررات</Link> مینی‌مودا را می‌پذیرید.</p>
          </div>
        </aside>
      </form>
    </div>
  );
}
