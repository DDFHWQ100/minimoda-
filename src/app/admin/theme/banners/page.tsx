import { ImageIcon } from "lucide-react";
import BannersManager from "@/components/theme/banners-manager";
import { getThemeBundle } from "@/lib/theme";

export const dynamic = "force-dynamic";

export default async function BannersPage() {
  const { banners } = await getThemeBundle();
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><ImageIcon className="h-6 w-6 text-pink-600" /> بنرها و اسلایدر تبلیغاتی</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">چهار بنر اصلی صفحه اصلی را همین‌جا مدیریت کنید؛ عنوان، زیرعنوان، تصویر، لینک و ترتیب نمایش.</p>
      <BannersManager banners={banners.map((b) => ({ id: b.id, title: b.title, subtitle: b.subtitle, cta: b.cta, href: b.href, image: b.image, tone: b.tone, sort: b.sort, active: b.active }))} />
    </div>
  );
}
