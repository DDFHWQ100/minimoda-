import { FileText } from "lucide-react";
import PagesManager from "@/components/theme/pages-manager";
import { getThemeBundle } from "@/lib/theme";

export const dynamic = "force-dynamic";

export default async function PagesPage() {
  const { settings } = await getThemeBundle();
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><FileText className="h-6 w-6 text-pink-600" /> صفحات و الگوهای سایت</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">الگوی نمایش هر بخش از سایت را انتخاب کنید؛ رجیستری کامل الگوها همراه با وضعیت اتصال به سایت.</p>
      <PagesManager initial={{
        layoutProducts: settings["layout.products"] ?? "grid",
        heroCompact: settings["home.hero_compact"] === "true",
        catRowMobile: settings["responsive.cat_row_mobile"] !== "false",
      }} />
    </div>
  );
}
