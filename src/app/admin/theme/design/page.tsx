import { SlidersHorizontal, Type, Box, Sparkles } from "lucide-react";
import SettingsGroupForm from "@/components/theme/settings-group-form";
import { getThemeBundle } from "@/lib/theme";

export const dynamic = "force-dynamic";

export default async function DesignPage() {
  const { settings } = await getThemeBundle();
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><SlidersHorizontal className="h-6 w-6 text-pink-600" /> تنظیمات ظاهری پیشرفته</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">تایپوگرافی، فاصله‌ها، عرض محتوا، سایه، پس‌زمینه و انیمیشن — همه به‌صورت Design Token روی کل سایت اعمال می‌شوند</p>

      <div className="mt-4 grid lg:grid-cols-3 gap-4 items-start">
        <SettingsGroupForm
          title="تایپوگرافی" icon={<Type className="h-4 w-4 text-sky-600" />} initial={settings}
          fields={[
            { key: "theme.font", label: "فونت فارسی", type: "select", options: [{ value: "Vazirmatn", label: "وزیرمتن" }, { value: "Estedad", label: "استعداد" }, { value: "Noto Kufi Arabic", label: "نوتو کوفی" }, { value: "Harmattan", label: "هارمتان" }, { value: "Lalezar", label: "لاله‌زار" }] },
            { key: "design.font_latin", label: "فونت لاتین", type: "select", options: [{ value: "Inter", label: "Inter" }, { value: "Poppins", label: "Poppins" }, { value: "Roboto", label: "Roboto" }, { value: "system-ui", label: "System" }] },
            { key: "design.font_size_base", label: "اندازه پایه فونت", type: "range", min: 12, max: 18, unit: "px" },
            { key: "design.font_weight_heading", label: "وزن تیترها", type: "select", options: [{ value: "700", label: "Bold (700)" }, { value: "800", label: "ExtraBold (800)" }, { value: "900", label: "Black (900)" }] },
          ]}
        />
        <SettingsGroupForm
          title="فاصله‌ها، ابعاد و سایه" icon={<Box className="h-4 w-4 text-amber-600" />} initial={settings}
          fields={[
            { key: "design.content_width", label: "عرض محتوای سایت", type: "range", min: 1024, max: 1536, step: 32, unit: "px" },
            { key: "design.section_gap", label: "فاصله بین بخش‌ها", type: "range", min: 8, max: 64, step: 4, unit: "px" },
            { key: "theme.radius", label: "گردی گوشه‌ها", type: "range", min: 0, max: 40, step: 2, unit: "px" },
            { key: "design.shadow", label: "شدت سایه کارت‌ها", type: "select", options: [{ value: "none", label: "بدون سایه" }, { value: "soft", label: "نرم (پیش‌فرض)" }, { value: "strong", label: "پررنگ" }] },
            { key: "design.bg_color", label: "رنگ پس‌زمینه سایت", type: "color" },
          ]}
        />
        <SettingsGroupForm
          title="انیمیشن و افکت‌ها" icon={<Sparkles className="h-4 w-4 text-pink-600" />} initial={settings}
          fields={[
            { key: "design.animations", label: "انیمیشن‌ها و افکت‌های انتقال فعال", type: "switch", hint: "خاموش‌کردن برای دستگاه‌های ضعیف یا کاربران حساس به حرکت" },
            { key: "design.transition_ms", label: "سرعت انتقال", type: "range", min: 0, max: 600, step: 50, unit: "ms" },
          ]}
          note="جهت راست‌چین (RTL) و زبان فارسی به‌صورت پیش‌فرض و سراسری فعال است. پشتیبانی چندزبانه نیازمند معماری i18n مسیرهاست (در چک‌لیست زیرساخت)."
        />
      </div>
    </div>
  );
}
