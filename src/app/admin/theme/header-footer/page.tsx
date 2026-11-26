import { PanelTop, PanelBottom, Megaphone, Phone } from "lucide-react";
import SettingsGroupForm from "@/components/theme/settings-group-form";
import { getThemeBundle } from "@/lib/theme";

export const dynamic = "force-dynamic";

export default async function HeaderFooterPage() {
  const { settings } = await getThemeBundle();
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><PanelTop className="h-6 w-6 text-pink-600" /> هدر و فوتر</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">همه متن‌ها، لینک‌ها و اطلاعات تماس هدر و فوتر سایت — اعمال آنی روی کل سایت</p>

      <div className="mt-4 grid lg:grid-cols-2 gap-4 items-start">
        <SettingsGroupForm
          title="نوار اطلاع‌رسانی و هدر" icon={<Megaphone className="h-4 w-4 text-amber-500" />} initial={settings}
          fields={[
            { key: "announcement.enabled", label: "نمایش نوار اطلاع‌رسانی بالای سایت", type: "switch" },
            { key: "announcement.text", label: "متن نوار اطلاع‌رسانی", type: "text", hint: "مثلاً: تخفیف ویژه تا ۷۰٪ در جشنواره تابستانی" },
            { key: "announcement.tone", label: "رنگ نوار", type: "select", options: [{ value: "gold", label: "طلایی" }, { value: "pink", label: "صورتی" }, { value: "navy", label: "سرمه‌ای" }] },
            { key: "store.name", label: "نام فروشگاه (لوگو)", type: "text" },
            { key: "store.tagline", label: "شعار زیر لوگو", type: "text" },
            { key: "header.phone", label: "تلفن پشتیبانی", type: "text", dir: "ltr" },
            { key: "header.hours", label: "ساعت پاسخگویی", type: "text" },
          ]}
          note="آیتم‌های منوی اصلی را از بخش «منوها و ابزارک‌ها» مدیریت کنید."
        />
        <SettingsGroupForm
          title="فوتر و اطلاعات تماس" icon={<PanelBottom className="h-4 w-4 text-sky-600" />} initial={settings}
          fields={[
            { key: "footer.about", label: "متن «درباره» فوتر", type: "textarea" },
            { key: "footer.address", label: "آدرس فروشگاه", type: "text" },
            { key: "footer.email", label: "ایمیل پشتیبانی", type: "text", dir: "ltr" },
            { key: "footer.instagram", label: "لینک اینستاگرام", type: "url" },
            { key: "footer.telegram", label: "لینک تلگرام", type: "url" },
            { key: "footer.copyright", label: "متن کپی‌رایت", type: "text" },
            { key: "footer.show_trust_badges", label: "نمایش نمادهای اعتماد (اینماد/ساماندهی)", type: "switch" },
          ]}
          note="لینک‌های ستون‌های «دسترسی سریع» و «خدمات مشتریان» از بخش منوها (مکان footer_quick و footer_service) قابل ویرایش‌اند."
        />
      </div>
    </div>
  );
}
