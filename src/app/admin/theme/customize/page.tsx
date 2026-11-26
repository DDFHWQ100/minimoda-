import { Palette } from "lucide-react";
import CustomizeForm from "@/components/theme/customize-form";
import { getThemeBundle } from "@/lib/theme";

export const dynamic = "force-dynamic";

export default async function CustomizePage() {
  const { settings } = await getThemeBundle();
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><Palette className="h-6 w-6 text-pink-600" /> رنگ‌ها، فونت و گردی گوشه‌ها</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">تغییرات بلافاصله در پیش‌نمایش پایین صفحه دیده می‌شود؛ با «ذخیره و اعمال» روی کل سایت منتشر می‌گردد.</p>
      <CustomizeForm
        initial={{
          primary: settings["theme.primary"] ?? "#14264a",
          accent: settings["theme.accent"] ?? "#db2777",
          gold: settings["theme.gold"] ?? "#f2b33d",
          font: settings["theme.font"] ?? "Vazirmatn",
          radius: settings["theme.radius"] ?? "18",
        }}
      />
    </div>
  );
}
