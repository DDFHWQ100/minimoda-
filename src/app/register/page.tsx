"use client";

import { useState } from "react";
import Link from "next/link";
import { Baby, User, Mail, Phone, Lock, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "ثبت‌نام ناموفق بود.");
      else { window.location.assign("/"); return; }
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-5 bg-[#f6f7fb]">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 grid place-items-center"><Baby className="h-6 w-6 text-[#14264a]" /></div>
          <span className="text-xl font-black text-[#14264a]">Mini<span className="text-pink-600">Moda</span></span>
        </div>
        <h1 className="text-2xl font-black text-[#14264a]">ساخت حساب کاربری</h1>
        <p className="mt-1 text-[12px] text-slate-500">عضو خانواده مینی‌مودا شوید؛ تخفیف‌های اختصاصی و پیگیری سفارش در انتظار شماست.</p>

        <form onSubmit={submit} className="mt-5 space-y-3">
          {[
            { k: "name" as const, label: "نام و نام خانوادگی", type: "text", icon: User, placeholder: "مثلاً سارا محمدی", dir: "rtl" as const },
            { k: "email" as const, label: "ایمیل", type: "email", icon: Mail, placeholder: "you@example.com", dir: "ltr" as const },
            { k: "phone" as const, label: "شماره موبایل", type: "tel", icon: Phone, placeholder: "09121234567", dir: "ltr" as const },
            { k: "password" as const, label: "رمز عبور (حداقل ۶ کاراکتر)", type: "password", icon: Lock, placeholder: "••••••••", dir: "ltr" as const },
          ].map(({ k, label, type, icon: Icon, placeholder, dir }) => (
            <label key={k} className="block">
              <span className="text-[11px] font-bold text-slate-500 mb-1 block">{label}</span>
              <div className="relative">
                <Icon className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input type={type} required dir={dir} value={form[k]} onChange={set(k)} placeholder={placeholder} className="w-full h-13 py-4 rounded-2xl border border-slate-200 bg-white pr-12 pl-4 text-[13px] outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition" />
              </div>
            </label>
          ))}

          {error && <p className="rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-bold px-4 py-2.5">{error}</p>}

          <button type="submit" disabled={loading} className="w-full h-13 py-4 rounded-2xl bg-[#14264a] text-amber-300 font-black hover:bg-[#1d3a63] transition disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
            ثبت‌نام و ورود
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-slate-500">
          قبلاً ثبت‌نام کرده‌اید؟ <Link href="/login" className="font-bold text-pink-600 hover:underline inline-flex items-center gap-1">ورود به حساب <ArrowLeft className="h-3.5 w-3.5" /></Link>
        </p>
      </div>
    </div>
  );
}
