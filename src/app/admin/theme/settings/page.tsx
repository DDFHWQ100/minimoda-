import { Settings } from "lucide-react";
import SettingsForm from "@/components/theme/settings-form";
import { getThemeBundle } from "@/lib/theme";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { settings } = await getThemeBundle();
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><Settings className="h-6 w-6 text-pink-600" /> تنظیمات عمومی سایت</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">نام و هویت فروشگاه، نوار اطلاع‌رسانی، آستانه ارسال رایگان، حالت تعمیر و متادیتای اشتراک‌گذاری — همه واقعی و ذخیره‌شونده</p>
      <SettingsForm initial={{
        storeName: settings["store.name"] ?? "مینی‌مودا",
        tagline: settings["store.tagline"] ?? "",
        announcementEnabled: settings["announcement.enabled"] !== "false",
        announcementText: settings["announcement.text"] ?? "",
        announcementTone: settings["announcement.tone"] ?? "gold",
        freeShippingAt: settings["free_shipping_at"] ?? "2000000",
        maintenanceEnabled: settings["maintenance.enabled"] === "true",
        maintenanceMessage: settings["maintenance.message"] ?? "",
        seoSuffix: settings["seo.title_suffix"] ?? "| مینی‌مودا",
        ogImage: settings["seo.og_image"] ?? "/images/hero-royal-junior.jpg",
      }} />
    </div>
  );
}
