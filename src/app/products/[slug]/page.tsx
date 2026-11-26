import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronLeft, Star, Share2, ShieldCheck } from "lucide-react";
import { eq, ne, desc } from "drizzle-orm";
import { db } from "@/db";
import { products, categories, reviews } from "@/db/schema";
import ProductGallery from "@/components/product-gallery";
import PurchasePanel from "@/components/purchase-panel";
import ProductDetailTabs from "@/components/product-detail-tabs";
import ProductCard from "@/components/product-card";
import { parseJsonArray, toFaDigits } from "@/lib/format";

export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  const rows = await db
    .select({ product: products, categoryName: categories.name, categorySlug: categories.slug })
    .from(products)
    .leftJoin(categories, eq(categories.id, products.categoryId))
    .where(eq(products.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const found = await getProduct(slug);
  return found ? { title: found.product.name, description: found.product.description.slice(0, 160) } : { title: "محصول یافت نشد" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = await getProduct(slug);
  if (!found) notFound();
  const { product, categoryName } = found;

  const [reviewRows, related] = await Promise.all([
    db.select().from(reviews).where(eq(reviews.productId, product.id)).orderBy(desc(reviews.createdAt)),
    db.select().from(products)
      .where(product.categoryId ? eq(products.categoryId, product.categoryId) : undefined)
      .orderBy(desc(products.salesCount))
      .limit(7),
  ]);
  const relatedFiltered = related.filter((p) => p.id !== product.id).slice(0, 6);

  const images = parseJsonArray<string>(product.images);
  const image = images[0] ?? "/images/hero-royal-junior.jpg";

  return (
    <div className="pb-4">
      {/* مسیر صفحه */}
      <nav className="mx-auto max-w-7xl px-3 sm:px-4 pt-3 flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 overflow-x-auto no-scrollbar whitespace-nowrap">
        <Link href="/" className="hover:text-pink-600">خانه</Link>
        <ChevronLeft className="h-3.5 w-3.5 shrink-0" />
        <Link href="/products" className="hover:text-pink-600">محصولات</Link>
        {categoryName && (<><ChevronLeft className="h-3.5 w-3.5 shrink-0" /><Link href={`/products?cat=${found.categorySlug}`} className="hover:text-pink-600">{categoryName}</Link></>)}
        <ChevronLeft className="h-3.5 w-3.5 shrink-0" />
        <span className="text-pink-700 font-bold">{product.name}</span>
      </nav>

      {/* ═══ بالای صفحه محصول ═══ */}
      <div className="mx-auto max-w-7xl px-3 sm:px-4 mt-3 grid lg:grid-cols-2 gap-4 lg:gap-8">
        <ProductGallery images={images} name={product.name} />

        <div className="flex flex-col">
          <div className="flex items-center gap-2 flex-wrap">
            {product.isNew && <span className="rounded-md bg-emerald-500 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5">تازه وارد</span>}
            {product.isOffer && <span className="rounded-md bg-pink-600 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5">پیشنهاد ویژه</span>}
            <span className="flex items-center gap-1 text-[9px] text-slate-400"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> کالای اصل با ضمانت مینی‌مودا</span>
          </div>

          <h1 className="mt-1.5 text-lg sm:text-2xl font-black text-[#14264a] leading-7 sm:leading-9">{product.name}</h1>

          <div className="mt-1.5 flex items-center gap-3 text-[10px] sm:text-[11px] text-slate-500 flex-wrap">
            <span className="flex items-center gap-1 font-bold"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /><span className="text-slate-800">{toFaDigits(product.rating.toFixed(1))}</span> امتیاز</span>
            <span>({toFaDigits(product.reviewCount)} نظر)</span>
            <span className="text-slate-300">|</span>
            <span>{toFaDigits(product.salesCount)} بار خریداری شده</span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-400">کد محصول: <b className="text-slate-600">MM-{toFaDigits(String(product.id).padStart(4, "0"))}</b></span>
            <button className="mr-auto flex items-center gap-1 text-slate-400 hover:text-pink-600 transition" aria-label="اشتراک‌گذاری">
              <Share2 className="h-4 w-4" />
              <span className="hidden xs:inline">اشتراک‌گذاری</span>
            </button>
          </div>

          <div className="mt-3">
            <PurchasePanel
              id={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              discountPrice={product.discountPrice}
              stock={product.stock}
              sizes={product.sizes}
              colors={product.colors}
              image={image}
              categoryName={categoryName}
            />
          </div>
        </div>
      </div>

      {/* ═══ تب‌ها ═══ */}
      <ProductDetailTabs
        productId={product.id}
        description={product.description}
        specs={[
          { label: "برند", value: "مینی‌مودا (MiniModa)" },
          { label: "کشور سازنده", value: "ترکیه" },
          { label: "دسته‌بندی", value: categoryName ?? "—" },
          { label: "جنس", value: "پنبه و فاستونی ضدحساسیت" },
          { label: "فصل استفاده", value: "چهار فصل" },
          { label: "ضمانت", value: "اصالت و سلامت فیزیکی کالا" },
          { label: "روش ارسال", value: "تیپاکس، پست پیشتاز و باربری" },
          { label: "شرایط مرجوعی", value: "۷ روز با فاکتور خرید" },
        ]}
        reviews={reviewRows.map((r) => ({
          id: r.id, authorName: r.authorName, rating: r.rating, comment: r.comment,
          createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
        }))}
      />

      {/* ═══ محصولات مشابه ═══ */}
      {relatedFiltered.length > 0 && (
        <section className="mx-auto max-w-7xl px-3 sm:px-4 mt-8">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg sm:text-2xl font-black text-[#14264a]">
              <span className="h-7 w-1.5 rounded-full bg-amber-400 inline-block" />
              شاید این‌ها هم بپسندید
            </h2>
            {categoryName && (
              <Link href={`/products?cat=${found.categorySlug}`} className="flex items-center gap-0.5 text-[11px] sm:text-[12px] font-bold text-pink-600 hover:text-pink-700">همه {categoryName}ها <ChevronLeft className="h-4 w-4" /></Link>
            )}
          </div>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {relatedFiltered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
