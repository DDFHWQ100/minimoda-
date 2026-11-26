import type { Metadata } from "next";
import { PlusCircle } from "lucide-react";
import NewThemeForm from "@/components/theme/new-theme-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "افزودن قالب جدید" };

export default function NewThemePage() {
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><PlusCircle className="h-6 w-6 text-pink-600" /> افزودن قالب جدید</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">نصب قالب با توکن‌های طراحی اختصاصی — بعد از نصب، از «مدیریت قالب‌ها» فعال‌سازی می‌شود.</p>
      <NewThemeForm />
    </div>
  );
}
