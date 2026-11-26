import { asc } from "drizzle-orm";
import type { Metadata } from "next";
import { db } from "@/db";
import { categories } from "@/db/schema";
import ProductForm from "@/components/product-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "افزودن محصول" };

export default async function NewProductPage() {
  const cats = await db.select({ id: categories.id, name: categories.name }).from(categories).orderBy(asc(categories.sortOrder));
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-black text-[#14264a]">افزودن محصول جدید</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">پس از ذخیره، محصول بلافاصله در فروشگاه و صفحه اصلی قابل مشاهده است.</p>
      <ProductForm categories={cats} />
    </div>
  );
}
