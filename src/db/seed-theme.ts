import "dotenv/config";
import { db } from "./index";
import {
  themeSettings,
  themes,
  banners,
  homepageSections,
  activityLogs,
  notices,
} from "./schema";

const IMG = (id: string, w = 1000, h = 700) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=${h}&w=${w}`;

async function main() {
  console.log("پاک‌سازی داده‌های قالب...");
  await db.delete(notices);
  await db.delete(activityLogs);
  await db.delete(homepageSections);
  await db.delete(banners);
  await db.delete(themes);
  await db.delete(themeSettings);

  console.log("درج تنظیمات پیش‌فرض...");
  const settings: [string, string, string, string][] = [
    // key, value, label, group
    ["store.name", "مینی‌مودا", "نام فروشگاه", "general"],
    ["store.tagline", "مد و پوشاک کودک و نوزاد", "شعار/توضیح کوتاه", "general"],
    ["announcement.enabled", "true", "نوار اطلاع‌رسانی فعال باشد", "announcement"],
    ["announcement.text", "تخفیف ویژه تا ۷۰٪ در جشنواره تابستانی", "متن نوار اطلاع‌رسانی", "announcement"],
    ["announcement.tone", "gold", "رنگ نوار (gold | pink | navy)", "announcement"],
    ["free_shipping_at", "2000000", "آستانه ارسال رایگان (تومان)", "commerce"],
    ["maintenance.enabled", "false", "حالت تعمیر (فقط مدیران وارد شوند)", "commerce"],
    ["maintenance.message", "سایت به‌طور موقت در حال به‌روزرسانی است؛ تا لحظاتی دیگر بازمی‌گردیم.", "پیام حالت تعمیر", "commerce"],
    ["layout.products", "grid", "چیدمان لیست محصولات (grid | list)", "layout"],
    ["home.hero_compact", "false", "هیرو فشرده در صفحه اصلی", "layout"],
    ["responsive.cat_row_mobile", "true", "نمایش آیکن‌های دسته‌بندی در موبایل", "layout"],
    ["home.categories_enabled", "true", "نمایش بخش دسته‌بندی‌های محبوب در سایت", "home"],
    ["home.categories_rows", "1", "تعداد ردیف‌های نمایش دسته‌بندی‌های محبوب (۱ تا ۳)", "home"],
    ["theme.primary", "#1b3a6b", "رنگ اصلی قالب", "design"],
    ["theme.accent", "#e91e63", "رنگ تأکیدی (دکمه‌ها)", "design"],
    ["theme.gold", "#ffc107", "رنگ طلایی (هایلایت)", "design"],
    ["theme.font", "Vazirmatn", "فونت بدنه", "design"],
    ["theme.radius", "20", "گردی گوشه‌ها (px)", "design"],
    ["custom.css", "", "CSS سفارشی (تزریق در کل سایت)", "code"],
    ["custom.js", "", "JavaScript سفارشی (تزریق در body)", "code"],
    ["custom.head", "", "کدهای <head> (متا تگ‌ها و وریفیکیشن)", "code"],
    ["seo.title_suffix", "| مینی‌مودا", "پسوند عنوان صفحات", "seo"],
    ["seo.og_image", "/images/hero-royal-junior.jpg", "تصویر پیش‌فرض اشتراک‌گذاری", "seo"],
  ];
  await db.insert(themeSettings).values(
    settings.map(([key, value, label, group]) => ({ key, value, label, group, updatedBy: "seed" }))
  );

  console.log("درج قالب‌ها...");
  await db.insert(themes).values([
    {
      name: "مینی‌مودا کلاسیک", slug: "minimoda-classic",
      description: "قالب رسمی فروشگاه — سرمه‌ای سلطنتی با طلایی و صورتی پررنگ؛ بهینه برای فروش و هویت برند.",
      author: "MiniModa Studio", version: "1.4.0",
      preview: IMG("36374320", 800, 500),
      isActive: true, isDefault: true,
      tokens: JSON.stringify({ primary: "#1b3a6b", accent: "#e91e63", gold: "#ffc107", font: "Vazirmatn", radius: "20" }),
    },
    {
      name: "رویال جونیور", slug: "royal-junior-theme",
      description: "پوسته مجلسی و لوکس با بنفش ارغوانی و رز گلد؛ مناسب کالکشن‌های مجلسی و عکاسی.",
      author: "MiniModa Studio", version: "2.0.0",
      preview: IMG("29668588", 800, 500),
      isActive: false, isDefault: false,
      tokens: JSON.stringify({ primary: "#4a1042", accent: "#e11d48", gold: "#fbbf24", font: "Estedad", radius: "22" }),
    },
    {
      name: "مینیمال مدرن", slug: "minimal-modern",
      description: "پوسته خلوت و امروزی با خاکستری اسلیت و سبز زمردی؛ مناسب تجربه خرید سریع و مینیمال.",
      author: "MiniModa Lab", version: "1.1.0",
      preview: IMG("12159459", 800, 500),
      isActive: false, isDefault: false,
      tokens: JSON.stringify({ primary: "#334155", accent: "#0f766e", gold: "#a3e635", font: "Noto Kufi Arabic", radius: "12" }),
    },
  ]);

  console.log("درج بنرهای صفحه اصلی...");
  await db.insert(banners).values([
    { title: "کاپشن‌های زمستانی", subtitle: "تا ۳۰٪ تخفیف", cta: "خرید کنید", href: "/products?cat=kids&q=کاپشن", image: IMG("29224161"), tone: "from-rose-900/80", sort: 1, active: true },
    { title: "پیراهن‌های مجلسی", subtitle: "کالکشن سلطنتی", cta: "خرید کنید", href: "/products?cat=formal", image: IMG("33939726"), tone: "from-purple-900/80", sort: 2, active: true },
    { title: "کتانی‌های ورزشی", subtitle: "ضد لغزش و سبک", cta: "خرید کنید", href: "/products?cat=shoes", image: IMG("9537104"), tone: "from-sky-900/80", sort: 3, active: true },
    { title: "کت و شلوار پسرانه", subtitle: "ست کامل رسمی", cta: "خرید کنید", href: "/products?cat=boys&q=کت", image: IMG("30690921"), tone: "from-slate-900/85", sort: 4, active: true },
  ]);

  console.log("درج اجزای صفحه اصلی...");
  await db.insert(homepageSections).values([
    { id: "hero", label: "اسلایدر اصلی (هیرو)", enabled: true, sort: 1 },
    { id: "categories", label: "ردیف دسته‌بندی‌های گرد", enabled: true, sort: 2 },
    { id: "banners", label: "بنرهای تبلیغاتی ۴ تایی", enabled: true, sort: 3 },
    { id: "trust", label: "نوار اعتماد (ارسال/پرداخت/ضمانت)", enabled: true, sort: 4 },
    { id: "festival", label: "بنر جشنواره + پرفروش‌های هفته", enabled: true, sort: 5 },
    { id: "blog", label: "پربیننده‌ترین اخبار مد", enabled: true, sort: 6 },
    { id: "products", label: "دیدنی‌ترین‌های مینی‌مودا (تب‌ها)", enabled: true, sort: 7 },
    { id: "duo", label: "بنرهای دوگانه انتهایی", enabled: true, sort: 8 },
  ]);

  console.log("درج اعلان‌ها...");
  await db.insert(notices).values([
    { level: "success", title: "به پنل مدیریت قالب خوش آمدید", body: "از این پس می‌توانید رنگ‌ها، فونت، بنرها و اجزای صفحه اصلی را از همین‌جا مدیریت کنید.", read: false },
    { level: "warning", title: "نسخه جدید قالب در دسترس است", body: "نسخه 1.5.0 قالب «مینی‌مودا کلاسیک» با بهبود سرعت لود و پشتیبانی از فونت نستعلیق منتشر شد. برای به‌روزرسانی به تب «مدیریت قالب‌ها» بروید.", read: false },
    { level: "security", title: "توصیه امنیتی", body: "رمز مدیر را به‌صورت دوره‌ای تغییر دهید و نشست‌های قدیمی را از بخش «امنیت و نشست‌ها» باطل کنید.", read: false },
  ]);

  console.log("درج گزارش فعالیت اولیه...");
  await db.insert(activityLogs).values([
    { actor: "سیستم", action: "نصب قالب", detail: "قالب «مینی‌مودا کلاسیک» v1.4.0 به‌عنوان قالب پیش‌فرض فعال شد" },
    { actor: "سیستم", action: "بارگذاری اولیه", detail: "مهاجرت خودکار تنظیمات پوسته از نسخه قبلی انجام شد" },
    { actor: "مدیر فروشگاه", action: "ویرایش تنظیمات", detail: "آستانه ارسال رایگان روی ۲,۰۰۰,۰۰۰ تومان تنظیم شد" },
  ]);

  console.log("تمام! داده‌های قالب با موفقیت درج شدند.");
  process.exit(0);
}
main().catch((e) => { console.error("خطا در seed قالب:", e); process.exit(1); });
