import { MonitorSmartphone } from "lucide-react";
import SettingsGroupForm from "@/components/theme/settings-group-form";
import DevicePreview from "@/components/theme/device-preview";
import { getThemeBundle } from "@/lib/theme";

export const dynamic = "force-dynamic";

export default async function ResponsivePage() {
  const { settings } = await getThemeBundle();
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><MonitorSmartphone className="h-6 w-6 text-pink-600" /> تنظیمات واکنش‌گرا و حالت‌های نمایش</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">نمایش/عدم‌نمایش اجزا در موبایل، تبلت و دسکتاپ + پیش‌نمایش زنده سایت در هر اندازه</p>

      <div className="mt-4 grid xl:grid-cols-3 gap-4 items-start">
        <SettingsGroupForm
          title="اجزا در دستگاه‌های مختلف" initial={settings}
          fields={[
            { key: "responsive.cat_row_mobile", label: "نمایش آیکن‌های دسته‌بندی در موبایل", type: "switch" },
            { key: "responsive.hide_banners_mobile", label: "پنهان‌کردن بنرهای ۴تایی در موبایل", type: "switch", hint: "موبایل سریع‌تر و خلوت‌تر" },
            { key: "responsive.hide_trust_mobile", label: "پنهان‌کردن نوار اعتماد در موبایل", type: "switch" },
            { key: "responsive.hide_blog_mobile", label: "پنهان‌کردن بخش مجله در موبایل", type: "switch" },
            { key: "responsive.hide_duo_tablet", label: "پنهان‌کردن بنرهای دوگانه در تبلت", type: "switch" },
            { key: "responsive.product_cols_mobile", label: "ستون‌های محصول در موبایل", type: "select", options: [{ value: "2", label: "۲ ستون (پیش‌فرض)" }, { value: "1", label: "۱ ستون (کارت بزرگ)" }] },
            { key: "home.hero_compact", label: "اسلایدر فشرده (کوتاه‌تر) در همه دستگاه‌ها", type: "switch" },
          ]}
          note="تغییرات با CSS media query روی سایت اعمال می‌شود؛ پس از ذخیره، پیش‌نمایش را «تازه‌سازی» کنید."
        />
        <div className="xl:col-span-2">
          <DevicePreview path="/" />
        </div>
      </div>
    </div>
  );
}
