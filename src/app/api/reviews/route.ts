import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { reviews, products } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    const body = await req.json();
    const productId = Number(body.productId);
    const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));
    const comment = String(body.comment ?? "").trim();
    const authorName = session?.name ?? (String(body.name ?? "").trim() || "کاربر مهمان");

    if (!Number.isFinite(productId) || productId <= 0) return NextResponse.json({ error: "محصول نامعتبر است." }, { status: 400 });
    if (comment.length < 5) return NextResponse.json({ error: "نظر شما باید حداقل ۵ کاراکتر باشد." }, { status: 400 });

    const exists = await db.select({ id: products.id }).from(products).where(eq(products.id, productId)).limit(1);
    if (exists.length === 0) return NextResponse.json({ error: "محصول یافت نشد." }, { status: 404 });

    await db.insert(reviews).values({ productId, userId: session?.id ?? null, authorName, rating, comment });

    await db
      .update(products)
      .set({
        rating: sql`(select coalesce(avg(rating), 0) from reviews where product_id = ${productId})`,
        reviewCount: sql`(select count(*) from reviews where product_id = ${productId})`,
      })
      .where(eq(products.id, productId));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("review error", err);
    return NextResponse.json({ error: "ثبت نظر با خطا مواجه شد." }, { status: 500 });
  }
}
