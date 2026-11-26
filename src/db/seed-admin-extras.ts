import "dotenv/config";
import { db } from "./index";
import { discountCodes, productVariants, suppliers, contactMessages, returnsRequests, stockMovements, shippingMethods, products, orders } from "./schema";
import { eq } from "drizzle-orm";

const rnd = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randInt = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;

async function main() {
  console.log("پاک‌سازی داده‌های بخش‌های جدید...");
  await db.delete(stockMovements);
  await db.delete(returnsRequests);
  await db.delete(contactMessages);
  await db.delete(productVariants);
  await db.delete(suppliers);
  await db.delete(discountCodes);
  await db.delete(shippingMethods);

  console.log("درج کدهای تخفیف...");
  await db.insert(discountCodes).values([
    { code: "WELCOME10", type: "percent", value: 10, minOrder: 0, maxUses: 500, usedCount: 128, expiresAt: new Date(Date.now() + 90 * 86400000), active: true },
    { code: "NOROOZ25", type: "percent", value: 25, minOrder: 3000000, maxUses: 200, usedCount: 74, expiresAt: new Date(Date.now() + 30 * 86400000), active: true },
    { code: "SHIPFREE", type: "fixed", value: 45000, minOrder: 0, maxUses: 1000, usedCount: 342, expiresAt: null, active: true },
    { code: "KIDS20", type: "percent", value: 20, minOrder: 1500000, maxUses: 150, usedCount: 150, expiresAt: new Date(Date.now() - 5 * 86400000), active: false },
  ]);

  console.log("درج تأمین‌کنندگان...");
  await db.insert(suppliers).values([
    { name: "نساجی پارینه یزد", contactPerson: "مهندس شریفی", phone: "09132567890", address: "یزد، شهرک صنعتی جهان‌آباد", notes: "پارچه‌های پنبه‌ای و فلانل — تحویل هفتگی" },
    { name: "پوشاک کودک آروشا", contactPerson: "خانم رحیمی", phone: "02144556677", address: "تهران، شهرک صنعتی شمس‌آباد", notes: "کالکشن‌های مجلسی؛ ۱۵ روز تسویه" },
    { name: "کفش پاپی‌فیت", contactPerson: "آقا توکلی", phone: "03133445566", address: "اصفهان، خیابان شیخ بهایی", notes: "زیره EVA اختصاصی — MOQ هر سایز ۱۰۰ جفت" },
  ]);

  console.log("درج روش‌های ارسال...");
  await db.insert(shippingMethods).values([
    { name: "پیک اختصاصی (تهران و کرج)", cost: 35000, freeOver: 2000000, etaDays: 1, active: true, sort: 1 },
    { name: "تیپاکس", cost: 45000, freeOver: 2000000, etaDays: 2, active: true, sort: 2 },
    { name: "پست پیشتاز", cost: 38000, freeOver: 2000000, etaDays: 3, active: true, sort: 3 },
    { name: "باربری (سفارش‌های عمده)", cost: 250000, freeOver: 0, etaDays: 4, active: true, sort: 4 },
  ]);

  console.log("درج پیام‌های مشتریان...");
  await db.insert(contactMessages).values([
    { name: "مریم رضایی", contact: "09121234567", subject: "سوال درباره سایز", body: "قد دخترم ۱۱۰ سانته؛ برای خرید کاپشن سایز ۶-۷ مناسب است یا ۸-۹؟", read: false },
    { name: "علی حسینی", contact: "ali@example.com", subject: "پیگیری سفارش", body: "سفارش MM-00031 هنوز به دستم نرسیده ولی وضعیتش ارسال‌شده ثبت شده؛ لطفاً پیگیری کنید.", read: false },
    { name: "زهرا کاظمی", contact: "09351112233", subject: "درخواست تعویض سایز", body: "یک ست ملوانی سایز ۸-۹ سفارش دادم ولی کوچک بود؛ امکان تعویض با سایز ۱۰-۱۱ هست؟", read: true },
    { name: "الهام نوری", contact: "09195556677", subject: "پیشنهاد همکاری", body: "برای فروشگاه اینستاگرامی‌ام برای تأمین عمده ست‌های نوزادی قیمت عمده دارید؟", read: true },
    { name: "رضا توکلی", contact: "reza.t@example.com", subject: "فاکتور خرید", body: "برای خرید شرکت‌مان فاکتور رسمی با کد اقتصادی نیاز داریم؛ چطور اقدام کنیم؟", read: false },
  ]);

  console.log("ایجاد تنوع‌های سایز و موجودی برای همه محصولات...");
  const allProducts = await db.select().from(products);
  let variantCount = 0;
  for (const p of allProducts) {
    let sizes: string[] = [];
    try { sizes = JSON.parse(p.sizes); } catch { sizes = ["استاندارد"]; }
    for (const size of sizes) {
      await db.insert(productVariants).values({
        productId: p.id,
        size: String(size),
        stock: Math.max(0, Math.floor((p.stock * randInt(10, 30)) / 100)),
        sku: `MM-${p.id}-${String(size).replace(/[^A-Za-z0-9]/g, "")}`,
      });
      variantCount++;
    }
  }
  console.log(`  ${variantCount} تنوع ساخته شد`);

  console.log("ثبت ورود و خروج انبار نمونه...");
  const sampleMoves = [
    { productId: allProducts[0]?.id, delta: 50, reason: "ورود از تأمین‌کننده", note: "محموله نساجی پارینه یزد — فاکتور پ-1405-021" },
    { productId: allProducts[3]?.id, delta: 30, reason: "ورود از تأمین‌کننده", note: "محموله آروشا — ست رسمی پسرانه" },
    { productId: allProducts[6]?.id, delta: -12, reason: "فروش", note: "خروج خودکار از سفارش‌های وب" },
    { productId: allProducts[7]?.id, delta: -5, reason: "مرجوعی مشتری", note: "مرجوع شد — سالم؛ بازگشت به انبار" },
    { productId: allProducts[1]?.id, delta: 20, reason: "اصلاح موجودی", note: "شمارش دوره‌ای انبار — مغایرت +۲۰" },
    { productId: null as number | null, delta: 0, reason: "شمارش دوره‌ای", note: "انبارگردانی فصلی با دقت ۹۸٪ انجام شد" },
  ];
  await db.insert(stockMovements).values(sampleMoves);

  console.log("درج مرجوعی‌های نمونه...");
  const [anyOrder] = await db.select().from(orders).orderBy(orders.id).limit(1);
  const delivered = await db.select().from(orders).where(eq(orders.status, "delivered")).limit(2);
  if (delivered[0]) {
    await db.insert(returnsRequests).values([
      { orderId: delivered[0].id, type: "exchange", reason: "سایز کوچک بود", status: "requested", note: "تعویض با سایز بالاتر" },
      ...(delivered[1] ? [{ orderId: delivered[1].id, type: "refund" as const, reason: "مغایرت رنگ", status: "approved" as const, note: "بازپرداخت پس از تأیید انبار" }] : []),
    ]);
  } else if (anyOrder) {
    await db.insert(returnsRequests).values({ orderId: anyOrder.id, type: "refund", reason: "تست", status: "requested", note: "" });
  }

  console.log("تمام! داده‌های بخش‌های جدید درج شد.");
  process.exit(0);
}
main().catch((e) => { console.error("خطا:", e); process.exit(1); });
