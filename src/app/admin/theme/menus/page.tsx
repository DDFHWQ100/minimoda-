import { ListTree } from "lucide-react";
import MenusManager from "@/components/theme/menus-manager";
import WidgetsManager from "@/components/theme/widgets-manager";
import { getThemeBundle } from "@/lib/theme";

export const dynamic = "force-dynamic";

export default async function MenusPage() {
  const { menus, widgets } = await getThemeBundle();
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><ListTree className="h-6 w-6 text-pink-600" /> منوها و ابزارک‌ها</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">منوی اصلی با زیرمنو، لینک‌های فوتر، و پاپ‌آپ‌های سایت — افزودن، ویرایش، مرتب‌سازی، فعال/غیرفعال</p>
      <MenusManager items={menus.map((m) => ({ id: m.id, location: m.location, label: m.label, href: m.href, parentId: m.parentId, sort: m.sort, enabled: m.enabled, highlight: m.highlight }))} />
      <WidgetsManager widgets={widgets.map((w) => ({ id: w.id, type: w.type, title: w.title, config: w.config, enabled: w.enabled }))} />
    </div>
  );
}
