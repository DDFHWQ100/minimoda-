import "dotenv/config";
import { db } from "./index";
import { campaigns, sizeCharts, contentPages, brands, discountCodes } from "./schema";
import { eq } from "drizzle-orm";

const IMG = (id: string) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1200`;

async function main() {
  console.log("پاک‌سازی داده‌های تکمیلی...");
  await db.delete(campaigns);
  await db.delete(sizeCharts);
  await db.delete(contentPages);
  await db.delete(brands);

  const codes = await db.select().from(discountCodes);
  const welcome = codes.find((c) => c.code === "WELCOME10");
  const noroz = codes.find((c) => c.code === "NOROOZ25");

  console.log("درج کمپین‌ها...");
  await db.insert(campaigns).values([
    {
      title: "جشنواره بهاره مینی‌مودا",
      slug: "spring-festival",
      description: "تا ۶۰٪ تخفیف روی کالکشن جدید بهاره؛ پیراهن‌های مجلسی، کاپشن‌های سبک و ست‌های ملوانی.",
      bannerImage: IMG("1620759"),
      startAt: new Date(Date.now() - 10 * 86400000),
      endAt: new Date(Date.now() + 20 * 86400000),
      discountCodeId: noroz?.id ?? null,
      active: true,
    },
    {
      title: "شروع سال تحصیلی",
      slug: "back-to-school",
      description: "کتانی و ست‌های مدرسه با کد تخفیف خوش‌آمد؛ آماده‌سازی برای بازگشت به کلاس.",
      bannerImage: IMG("9537104"),
      startAt: new Date(Date.now() + 5 * 86400000),
      endAt: new Date(Date.now() + 45 * 86400000),
      discountCodeId: welcome?.id ?? null,
      active: true,
    },
  ]);

  console.log("درج جدول‌های سایزبندی...");
  await db.insert(sizeCharts).values([
    {
      name: "جدول سایزبندی کودک (۲ تا ۱۱ سال)",
      rows: JSON.stringify([
        { size: "2-3", height: "92-98", chest: "56-58", waist: "50-52" },
        { size: "4-5", height: "104-110", chest: "60-62", waist: "54-56" },
        { size: "6-7", height: "116-122", chest: "64-66", waist: "58-60" },
        { size: "8-9", height: "128-134", chest: "68-70", waist: "62-64" },
        { size: "10-11", height: "140-146", chest: "72-74", waist: "66-68" },
      ]),
      active: true,
    },
    {
      name: "جدول سایزبندی نوزاد (۰ تا ۲۴ ماه)",
      rows: JSON.stringify([
        { size: "0-6m", height: "62-68", chest: "44-46", waist: "42-44" },
        { size: "6-12m", height: "74-80", chest: "48-50", waist: "46-48" },
        { size: "12-24m", height: "86-92", chest: "52-54", waist: "50-52" },
      ]),
      active: true,
    },
  ]);

  console.log("درج صفحات محتوا...");
  await db.insert(contentPages).values([
    {
      title: "درباره مینی‌مودا",
      slug: "about",
      body: "مینی‌مودا فروشگاه آنلاین تخصصی مد و پوشاک کودک و نوزاد است که از سال ۱۳۹۸ با هدف ارائه لباس‌های باکیفیت، اصل و خوش‌قیمت به خانواده‌های ایرانی آغاز به کار کرده است.\n\nما معتقدیم کودکان سزاوار بهترین‌ها هستند؛ به همین دلیل تمام محصولاتمان را از برندهای معتبر و کارگاه‌های باسابقه تهیه می‌کنیم، پیش از عرضه کیفیت هر کالا را بررسی می‌کنیم و با ضمانت اصالت و سلامت فیزیکی کالا به دست شما می‌رسانیم.\n\nتیم مینی‌مودا در تهران مستقر است و با پشتیبانی پاسخگو در تمام روزهای هفته همراه شماست.",
    },
    {
      title: "قوانین و مقررات",
      slug: "terms",
      body: "۱) تمامی محصولات مینی‌مودا دارای ضمانت اصالت کالا هستند.\n۲) سفارش‌های بالای ۲ میلیون تومان شامل ارسال رایگان می‌شوند.\n۳) تا ۷ روز پس از تحویل، امکان بازگشت کالا با ارائه فاکتور و برچسب سلامت وجود دارد.\n۴) در صورت مغایرت یا ایراد کالا، هزینه ارسال برگشت با فروشگاه است.\n۵) پرداخت آنلاین از طریق درگاه رسمی بانکی انجام می‌شود و هیچ اطلاعات کارتی ذخیره نمی‌گردد.",
    },
    {
      title: "حریم خصوصی",
      slug: "privacy",
      body: "اطلاعات شخصی شما (نام، موبایل، آدرس) صرفاً برای انجام سفارش و هماهنگی ارسال استفاده می‌شود و هرگز با اشخاص ثالث به اشتراک گذاشته نمی‌شود.\n\nرمز عبور حساب کاربری شما با الگوریتم‌های امن رمزنگاری می‌شود و هیچ‌کس — حتی مدیران فروشگاه — به آن دسترسی ندارد.\n\nدر صورت نیاز به تغییر یا حذف اطلاعات حساب، کافی است با پشتیبانی تماس بگیرید.",
    },
  ]);

  console.log("درج برندها...");
  await db.insert(brands).values([
    { name: "مینی‌مودا (برند اختصاصی)", slug: "minimoda", logo: "" },
    { name: "آروشا", slug: "arusha", logo: "" },
    { name: "پاپی‌فیت", slug: "papyfit", logo: "" },
    { name: "نساجی پارینه", slug: "parineh", logo: "" },
  ]);

  console.log("تمام! داده‌های تکمیلی درج شد.");
  process.exit(0);
}
main().catch((e) => { console.error("خطا:", e); process.exit(1); });
