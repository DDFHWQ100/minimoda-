import { LayoutList } from "lucide-react";
import SectionsManager from "@/components/theme/sections-manager";
import { getThemeBundle } from "@/lib/theme";

export const dynamic = "force-dynamic";

export default async function SectionsPage() {
  const { sections } = await getThemeBundle();
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><LayoutList className="h-6 w-6 text-pink-600" /> مدیریت اجزای صفحه اصلی</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">هر بخش را روشن/خاموش کنید یا با فلش‌ها ترتیبش را در صفحه اصلی جابه‌جا کنید — اعمال بلافاصله روی سایت انجام می‌شود.</p>
      <SectionsManager sections={sections.map((s) => ({ id: s.id, label: s.label, enabled: s.enabled, sort: s.sort }))} />
    </div>
  );
}
