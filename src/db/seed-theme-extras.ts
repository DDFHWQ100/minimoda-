import "dotenv/config";
import { db } from "./index";
import { menuItems, widgets, themeSettings, layoutPresets, homepageSections } from "./schema";
import { sql } from "drizzle-orm";

async function upsertSetting(key: string, value: string, label: string, group: string) {
  await db.insert(themeSettings).values({ key, value, label, group, updatedBy: "seed" })
    .onConflictDoNothing();
}

async function main() {
  console.log("پاک‌سازی منوها / ابزارک‌ها / الگوها...");
  await db.delete(menuItems);
  await db.delete(widgets);
  await db.delete(layoutPresets);

  console.log("درج منوی اصلی و زیرمنوها...");
  const main = [
    { label: "خانه", href: "/", sort: 1, highlight: true },
    { label: "بچگانه", href: "/products?cat=kids", sort: 2 },
    { label: "کودکان", href: "/products?cat=boys", sort: 3 },
    { label: "نوزاد", href: "/products?cat=baby", sort: 4 },
    { label: "پسرانه", href: "/products?cat=boys", sort: 5 },
    { label: "دخترانه", href: "/products?cat=girls", sort: 6 },
    { label: "لباس مجلسی", href: "/products?cat=formal", sort: 7 },
    { label: "کفش", href: "/products?cat=shoes", sort: 8 },
    { label: "تماس با ما", href: "/help#contact", sort: 9 },
  ];
  const inserted = await db.insert(menuItems).values(main.map((m) => ({ ...m, location: "main", enabled: true }))).returning();
  const boys = inserted.find((m) => m.label === "پسرانه")!;
  const girls = inserted.find((m) => m.label === "دخترانه")!;
  await db.insert(menuItems).values([
    { location: "main", label: "کت و شلوار", href: "/products?cat=boys&q=کت", parentId: boys.id, sort: 1 },
    { location: "main", label: "تیشرت", href: "/products?cat=boys&q=تیشرت", parentId: boys.id, sort: 2 },
    { location: "main", label: "رسمی و مجلسی", href: "/products?cat=boys", parentId: boys.id, sort: 3 },
    { location: "main", label: "پیراهن مجلسی", href: "/products?cat=girls&q=پیراهن", parentId: girls.id, sort: 1 },
    { location: "main", label: "سارافون و ست", href: "/products?cat=formal", parentId: girls.id, sort: 2 },
    { location: "main", label: "لباس روزمره", href: "/products?cat=girls", parentId: girls.id, sort: 3 },
  ]);
  await db.insert(menuItems).values([
    { location: "footer_quick", label: "محصولات پرفروش", href: "/products?sort=sales", sort: 1 },
    { location: "footer_quick", label: "تخفیف‌های ویژه", href: "/products?offer=1", sort: 2 },
    { location: "footer_quick", label: "مجله مد", href: "/blog", sort: 3 },
    { location: "footer_quick", label: "لباس مجلسی", href: "/products?cat=formal", sort: 4 },
    { location: "footer_quick", label: "کفش و کتانی", href: "/products?cat=shoes", sort: 5 },
    { location: "footer_quick", label: "نوزاد", href: "/products?cat=baby", sort: 6 },
    { location: "footer_service", label: "راهنمای خرید", href: "/help#delivery", sort: 1 },
    { location: "footer_service", label: "شیوه‌های ارسال", href: "/help#delivery", sort: 2 },
    { location: "footer_service", label: "پیگیری سفارش", href: "/orders", sort: 3 },
    { location: "footer_service", label: "سوالات متداول", href: "/help#faq", sort: 4 },
    { location: "footer_service", label: "ضمانت بازگشت کالا", href: "/help#return", sort: 5 },
    { location: "footer_service", label: "تماس با ما", href: "/help#contact", sort: 6 },
  ]);

  console.log("درج ابزارک‌ها (پاپ‌آپ خوش‌آمد)...");
  await db.insert(widgets).values([
    {
      type: "popup", title: "پاپ‌آپ خوش‌آمدگویی", enabled: false, sort: 1,
      config: JSON.stringify({ heading: "به مینی‌مودا خوش آمدید 🎉", body: "با کد WELCOME10 اولین خرید خود را با ۱۰٪ تخفیف انجام دهید.", cta: "شروع خرید", href: "/products", delay: 4, showOnce: true }),
    },
  ]);

  console.log("درج تنظیمات طراحی پیشرفته...");
  const extras: [string, string, string, string][] = [
    ["design.font_size_base", "14", "اندازه پایه فونت (px)", "design"],
    ["design.font_weight_heading", "900", "وزن فونت تیترها", "design"],
    ["design.font_latin", "Inter", "فونت لاتین", "design"],
    ["design.content_width", "1280", "عرض محتوای سایت (px)", "design"],
    ["design.section_gap", "24", "فاصله بین بخش‌ها (px)", "design"],
    ["design.shadow", "soft", "شدت سایه (none | soft | strong)", "design"],
    ["design.bg_color", "#f3f4f8", "رنگ پس‌زمینه سایت", "design"],
    ["design.animations", "true", "انیمیشن‌ها و افکت‌های انتقال", "design"],
    ["design.transition_ms", "250", "سرعت انتقال (ms)", "design"],
    ["responsive.hide_banners_mobile", "false", "پنهان‌کردن بنرهای ۴تایی در موبایل", "responsive"],
    ["responsive.hide_trust_mobile", "false", "پنهان‌کردن نوار اعتماد در موبایل", "responsive"],
    ["responsive.hide_blog_mobile", "false", "پنهان‌کردن مجله در موبایل", "responsive"],
    ["responsive.hide_duo_tablet", "false", "پنهان‌کردن بنرهای دوگانه در تبلت", "responsive"],
    ["responsive.product_cols_mobile", "2", "تعداد ستون محصول در موبایل (1|2)", "responsive"],
    ["header.phone", "021-88766554", "تلفن پشتیبانی", "header"],
    ["header.hours", "شنبه تا پنجشنبه ۹ تا ۲۱", "ساعت کاری", "header"],
    ["footer.about", "فروشگاه اینترنتی پوشاک کودک و نوجوان — کیفیت و جدیدترین مدل‌ها با ضمانت اصالت کالا و ارسال سریع به سراسر ایران.", "متن درباره فوتر", "footer"],
    ["footer.address", "تهران، خیابان ولیعصر، بالاتر از پارک ملت، مجتمع نیایش، طبقه ۲", "آدرس", "footer"],
    ["footer.email", "support@minimoda.ir", "ایمیل پشتیبانی", "footer"],
    ["footer.instagram", "https://www.instagram.com/minimoda.ir", "لینک اینستاگرام", "footer"],
    ["footer.telegram", "https://t.me/minimoda_ir", "لینک تلگرام", "footer"],
    ["footer.copyright", "© ۱۴۰۴ مینی‌مودا — کلیه حقوق محفوظ است", "متن کپی‌رایت", "footer"],
    ["footer.show_trust_badges", "true", "نمایش نمادهای اعتماد", "footer"],
    ["seo.default_description", "خرید آنلاین لباس کودک و نوجوان با ضمانت اصالت کالا و ارسال سریع", "توضیحات متا پیش‌فرض", "seo"],
    ["seo.schema_org", "true", "درج داده‌های ساختاریافته Schema.org", "seo"],
    ["seo.lazy_images", "true", "بارگذاری تنبل تصاویر", "seo"],
    ["admin.dark_mode", "false", "حالت تاریک پنل مدیریت", "admin"],
  ];
  for (const [k, v, l, g] of extras) await upsertSetting(k, v, l, g);

  console.log("درج الگوهای چیدمان آماده...");
  const sections = await db.select().from(homepageSections);
  const cur = sections.map((s) => ({ id: s.id, enabled: s.enabled, sort: s.sort }));
  await db.insert(layoutPresets).values([
    { name: "فروشگاهی کامل (پیش‌فرض)", description: "همه بخش‌ها فعال — مناسب ویترین پر", createdBy: "system", snapshot: JSON.stringify({ sections: cur, tokens: { primary: "#1b3a6b", accent: "#e91e63", gold: "#ffc107", radius: "20" } }) },
    { name: "مینیمال سریع", description: "فقط هیرو، دسته‌ها و محصولات — بارگذاری سریع‌تر", createdBy: "system", snapshot: JSON.stringify({ sections: cur.map((s) => ({ ...s, enabled: ["hero", "categories", "products"].includes(s.id) })), tokens: { primary: "#334155", accent: "#0f766e", gold: "#a3e635", radius: "12" } }) },
    { name: "کمپین و حراج", description: "تمرکز روی بنرها و جشنواره", createdBy: "system", snapshot: JSON.stringify({ sections: cur.map((s) => ({ ...s, enabled: ["hero", "banners", "festival", "products", "duo"].includes(s.id) })), tokens: { primary: "#4a1042", accent: "#e11d48", gold: "#fbbf24", radius: "22" } }) },
  ]);

  console.log("تمام! داده‌های تکمیلی قالب درج شد.");
  process.exit(0);
}
main().catch((e) => { console.error("خطا:", e); process.exit(1); });
