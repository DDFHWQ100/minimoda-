import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { asc, eq } from "drizzle-orm";
import { ChevronRight } from "lucide-react";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import ProductForm from "@/components/product-form";
import { initialFromProduct } from "@/lib/product-form-initial";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "ویرایش محصول" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isFinite(productId)) notFound();

  const rows = await db.select().from(products).where(eq(products.id, productId)).limit(1);
  const product = rows[0];
  if (!product) notFound();

  const cats = await db.select({ id: categories.id, name: categories.name }).from(categories).orderBy(asc(categories.sortOrder));

  return (
    <div>
      <nav className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500">
        <Link href="/admin/products" className="hover:text-pink-600">مدیریت محصولات</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-pink-700 font-bold">ویرایش: {product.name}</span>
      </nav>
      <h1 className="mt-1 text-xl sm:text-2xl font-black text-[#14264a]">ویرایش محصول و گالری تصاویر</h1>
      <p className="text-[11px] text-slate-500 mt-0.5">تا ۱۰ تصویر برای این محصول؛ ترتیب و تصویر اصلی دلخواه شما.</p>
      <ProductForm categories={cats} initial={initialFromProduct(product)} />
    </div>
  );
}
