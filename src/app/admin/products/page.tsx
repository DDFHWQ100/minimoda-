import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { PlusCircle } from "lucide-react";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import AdminProductsTable, { type AdminProductRow } from "@/components/admin-products-table";
import { parseJsonArray } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const rows = await db
    .select({ product: products, categoryName: categories.name })
    .from(products)
    .leftJoin(categories, eq(categories.id, products.categoryId))
    .orderBy(asc(products.id));

  const data: AdminProductRow[] = rows.map(({ product, categoryName }) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    discountPrice: product.discountPrice,
    stock: product.stock,
    salesCount: product.salesCount,
    image: parseJsonArray<string>(product.images)[0] ?? "/images/hero-royal-junior.jpg",
    isFeatured: product.isFeatured,
    isOffer: product.isOffer,
    isNew: product.isNew,
    categoryName: categoryName ?? "—",
  }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#14264a]">مدیریت محصولات</h1>
          <p className="text-[11px] text-slate-500 mt-0.5">{data.length} محصول در کاتالوگ فروشگاه</p>
        </div>
        <Link href="/admin/products/new" className="inline-flex items-center gap-1.5 rounded-2xl bg-pink-600 text-white px-4 sm:px-5 h-11 text-[12px] font-black hover:bg-pink-500 transition shadow-lg shadow-pink-600/20">
          <PlusCircle className="h-5 w-5" /> افزودن محصول جدید
        </Link>
      </div>
      <AdminProductsTable rows={data} />
    </div>
  );
}
