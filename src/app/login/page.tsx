"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Baby, Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck, UserCheck, ArrowLeft } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "ورود ناموفق بود.");
      } else {
        // هدایت کامل صفحه برای اطمینان از ارسال کوکی نشست در همه حالت‌ها
        window.location.assign(next.startsWith("/") ? next : "/");
        return;
      }
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  };

  const [quickLoading, setQuickLoading] = useState<"admin" | "user" | null>(null);
  const quickLogin = async (kind: "admin" | "user") => {
    setQuickLoading(kind);
    setError("");
    try {
      const creds = kind === "admin"
        ? { email: "admin@minimoda.ir", password: "admin123" }
        : { email: "sara@example.com", password: "user123" };
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
      });
      const data = await res.json();
      if (res.ok) {
        window.location.assign(kind === "admin" ? "/admin" : (next.startsWith("/") ? next : "/"));
        return;
      }
      setError(data.error ?? "ورود ناموفق بود.");
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setQuickLoading(null);
    }
  };

  return (
    <div className="min-h-[70vh] grid lg:grid-cols-2">
      {/* پنل گرافیکی */}
      <div className="relative hidden lg:flex flex-col justify-end overflow-hidden">
        <img src="/images/hero-royal-junior.jpg" alt="کالکشن سلطنتی مینی‌مودا" className="absolute inset-0 h-full w-full object-cover object-[65%_15%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1c36]/90 via-[#0e1c36]/25 to-transparent" />
        <div className="relative p-10 text-white">
          <span className="text-[10px] tracking-[.3em] text-amber-400 font-bold">ROYAL JUNIOR</span>
          <h2 className="mt-2 text-3xl font-black leading-[2.6rem]">به دنیای خاص<br />مینی‌مودا خوش آمدید</h2>
          <p className="mt-2 text-[12px] text-white/80 leading-6">با حساب کاربری خود سفارش‌ها را پیگیری کنید، لیست علاقه‌مندی بسازید و از کدهای تخفیف اختصاصی اعضا بهره‌مند شوید.</p>
        </div>
      </div>

      {/* فرم */}
      <div className="flex items-center justify-center p-5 sm:p-8 bg-[#f6f7fb]">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-5">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 grid place-items-center"><Baby className="h-6 w-6 text-[#14264a]" /></div>
            <span className="text-xl font-black text-[#14264a]">Mini<span className="text-pink-600">Moda</span></span>
          </div>
          <h1 className="text-2xl font-black text-[#14264a]">ورود به حساب کاربری</h1>
          <p className="mt-1 text-[12px] text-slate-500">هنوز عضو نیستید؟ <Link href="/register" className="font-bold text-pink-600 hover:underline">همین حالا ثبت‌نام کنید</Link></p>

          <form onSubmit={submit} className="mt-5 space-y-3">
            <label className="block">
              <span className="text-[11px] font-bold text-slate-500 mb-1 block">ایمیل</span>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input type="email" required dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full h-13 py-4 rounded-2xl border border-slate-200 bg-white pr-12 pl-4 text-[13px] outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition text-left" />
              </div>
            </label>
            <label className="block">
              <span className="text-[11px] font-bold text-slate-500 mb-1 block">رمز عبور</span>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input type={show ? "text" : "password"} required dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full h-13 py-4 rounded-2xl border border-slate-200 bg-white pr-12 pl-12 text-[13px] outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition text-left" />
                <button type="button" onClick={() => setShow((v) => !v)} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label="نمایش رمز">
                  {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </label>

            {error && <p className="rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-bold px-4 py-2.5">{error}</p>}

            <button type="submit" disabled={loading} className="w-full h-13 py-4 rounded-2xl bg-gradient-to-l from-pink-600 to-rose-600 text-white font-black shadow-lg shadow-pink-600/25 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowLeft className="h-5 w-5" />}
              ورود به حساب
            </button>
          </form>

          {/* حساب‌های آزمایشی */}
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-3">
            <p className="text-[10px] font-black text-slate-400 flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> ورود سریع با حساب‌های آزمایشی</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button onClick={() => quickLogin("admin")} disabled={quickLoading !== null} className="rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50 p-2 text-right transition group disabled:opacity-60">
                <span className="flex items-center gap-1 text-[10px] font-black text-[#14264a] group-hover:text-amber-700">{quickLoading === "admin" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserCheck className="h-3.5 w-3.5" />} مدیر فروشگاه ← ورود فوری</span>
                <span dir="ltr" className="block text-[9px] text-slate-400 mt-0.5 text-left">admin@minimoda.ir / admin123</span>
              </button>
              <button onClick={() => quickLogin("user")} disabled={quickLoading !== null} className="rounded-xl border border-slate-200 hover:border-pink-400 hover:bg-pink-50 p-2 text-right transition group disabled:opacity-60">
                <span className="flex items-center gap-1 text-[10px] font-black text-[#14264a] group-hover:text-pink-700">{quickLoading === "user" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserCheck className="h-3.5 w-3.5" />} سارا (مشتری) ← ورود فوری</span>
                <span dir="ltr" className="block text-[9px] text-slate-400 mt-0.5 text-left">sara@example.com / user123</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] grid place-items-center text-slate-400">در حال بارگذاری...</div>}>
      <LoginForm />
    </Suspense>
  );
}
