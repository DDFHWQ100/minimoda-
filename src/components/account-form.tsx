"use client";

import { useState } from "react";
import { Save, Loader2, CheckCircle2 } from "lucide-react";

export default function AccountForm({ name: initialName, phone: initialPhone, address: initialAddress }: { name: string; phone: string; address: string }) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [address, setAddress] = useState(initialAddress);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setDone(false);
    try {
      const res = await fetch("/api/account", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, phone, address }) });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "ذخیره ناموفق بود.");
      else { setDone(true); setTimeout(() => setDone(false), 3000); }
    } catch { setError("ارتباط با سرور برقرار نشد."); } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="mt-2 grid sm:grid-cols-2 gap-3">
      <label className="block">
        <span className="text-[10px] font-bold text-slate-500">نام و نام خانوادگی</span>
        <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full h-11 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-pink-400 outline-none px-4 text-[13px] transition" />
      </label>
      <label className="block">
        <span className="text-[10px] font-bold text-slate-500">شماره موبایل</span>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" placeholder="09121234567" className="mt-1 w-full h-11 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-pink-400 outline-none px-4 text-[13px] transition text-left" />
      </label>
      <label className="block sm:col-span-2">
        <span className="text-[10px] font-bold text-slate-500">آدرس پیش‌فرض ارسال</span>
        <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-pink-400 outline-none p-4 text-[12px] leading-6 transition resize-none" />
      </label>
      {error && <p className="sm:col-span-2 text-[10px] font-bold text-rose-600">{error}</p>}
      <div className="sm:col-span-2 flex items-center gap-3">
        <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-2xl bg-[#14264a] text-white px-6 h-11 text-[12px] font-bold hover:bg-[#1d3a63] transition disabled:opacity-60">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          ذخیره تغییرات
        </button>
        {done && <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600"><CheckCircle2 className="h-4 w-4" /> ذخیره شد</span>}
      </div>
    </form>
  );
}
