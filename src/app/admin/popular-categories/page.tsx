import { LayoutGrid } from "lucide-react";
import PopularCategoriesManager from "@/components/popular-categories-manager";
import { getThemeSettings } from "@/lib/theme";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function PopularCategoriesPage() {
  const [settings, cats] = await Promise.all([
    getThemeSettings().catch(() => ({}) as Record<string, string>),
    db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.id)),
  ]);

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><LayoutGrid className="h-6 w-6 text-pink-600" /> دسته‌بندی‌های محبوب فروشگاه</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">کنترل کامل همان ردیف آیکن‌های گرد صفحه اصلی — بدون دست‌زدن به قالب سایت؛ فعال/غیرفعال‌سازی، ترتیب، افزودن، ویرایش و حذف</p>
      <PopularCategoriesManager
        categories={cats.map((c) => ({ id: c.id, name: c.name, slug: c.slug, icon: c.icon, description: c.description, sortOrder: c.sortOrder, showOnHome: c.showOnHome }))}
        enabled={settings["home.categories_enabled"] !== "false"}
        rows={Math.min(3, Math.max(1, Number(settings["home.categories_rows"] ?? "1") || 1))}
      />
    </div>
  );
}
