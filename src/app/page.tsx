import Link from "next/link";
import Image from "next/image";
import { desc, eq, isNotNull, gt } from "drizzle-orm";
import {
  Crown, Shirt, Sparkles, Baby, Gem, Footprints, ShoppingBag,
  Truck, ShieldCheck, BadgeCheck, RotateCcw, Headphones, Gift,
  ChevronLeft, Zap, Eye, CalendarDays, Newspaper, Star, Heart, LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import { db } from "@/db";
import { categories, products, blogPosts } from "@/db/schema";
import { getThemeBundle, settingBool } from "@/lib/theme";
import HeroCarousel from "@/components/hero-carousel";
import ProductTabs from "@/components/product-tabs";
import ProductCard, { type ProductCardData } from "@/components/product-card";
import { formatPrice, toFaDigits, parseJsonArray, faDay, type ColorOption } from "@/lib/format";

export const dynamic = "force-dynamic";

const catIcons: Record<string, LucideIcon> = {
  Crown, Shirt, Sparkles, Baby, Gem, Footprints, ShoppingBag,
};
const circleGradients = [
  "from-pink-400 to-rose-500",
  "from-sky-400 to-blue-600",
  "from-amber-300 to-orange-500",
  "from-violet-400 to-purple-600",
  "from-emerald-400 to-teal-600",
  "from-cyan-400 to-sky-600",
  "from-fuchsia-400 to-pink-600",
];

type P = typeof products.$inferSelect;
const toCard = (p: P): ProductCardData => ({
  id: p.id, name: p.name, slug: p.slug, price: p.price, discountPrice: p.discountPrice,
  images: p.images, colors: p.colors, rating: p.rating, reviewCount: p.reviewCount,
  isNew: p.isNew, isOffer: p.isOffer,
});

const PX = (id: string, w = 900, h = 700) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=${h}&w=${w}`;

export default async function HomePage() {
  const bundle = await getThemeBundle().catch(() => null);
  const settings = bundle?.settings ?? {};
  const sectionMap = Object.fromEntries((bundle?.sections ?? []).map((s) => [s.id, s.enabled]));
  const show = (id: string) => sectionMap[id] !== false;
  const heroCompact = settings["home.hero_compact"] === "true";
  const catRowMobile = settingBool(settings, "responsive.cat_row_mobile", true);
  const popularEnabled = settings["home.categories_enabled"] !== "false";
  const popularRowsSetting = Math.min(3, Math.max(1, Number(settings["home.categories_rows"] ?? "1") || 1));
  const dbBanners = (bundle?.banners ?? []).filter((b) => b.active);

  const [cats, bestsellers, discounted, fresh, weekly, latestPosts] = await Promise.all([
    db.select().from(categories).orderBy(categories.sortOrder),
    db.select().from(products).orderBy(desc(products.salesCount)).limit(6),
    db.select().from(products).where(isNotNull(products.discountPrice)).orderBy(desc(products.salesCount)).limit(6),
    db.select().from(products).where(eq(products.isNew, true)).orderBy(desc(products.createdAt)).limit(6),
    db.select().from(products).orderBy(desc(products.salesCount)).limit(4),
    db.select().from(blogPosts).orderBy(desc(blogPosts.views)).limit(4),
  ]);

  const popularVisible = cats.filter((c) => c.showOnHome).slice(0, popularRowsSetting * 10);
  const popRows: typeof cats[] = [];
  for (let i = 0; i < popularVisible.length; i += 10) popRows.push(popularVisible.slice(i, i + 10));

  const cardBest = bestsellers.map(toCard);
  const cardOffers = discounted.map(toCard);
  const cardFresh = fresh.map(toCard);

  const promoBanners = dbBanners.length > 0
    ? dbBanners.map((b) => ({ img: b.image, tag: b.subtitle, title: b.title, href: b.href, accent: b.tone }))
    : [
        { img: PX("29224161"), tag: "تا ۳۰٪ تخفیف", title: "کاپشن‌های زمستانی", href: "/products?cat=kids&q=کاپشن", accent: "from-rose-900/80" },
        { img: PX("33939726"), tag: "کالکشن سلطنتی", title: "پیراهن‌های مجلسی", href: "/products?cat=formal", accent: "from-purple-900/80" },
        { img: PX("9537104"), tag: "ضد لغزش و سبک", title: "کتانی‌های ورزشی", href: "/products?cat=shoes", accent: "from-sky-900/80" },
        { img: PX("30690921"), tag: "ست کامل رسمی", title: "کت و شلوار پسرانه", href: "/products?cat=boys&q=کت", accent: "from-slate-900/85" },
      ];

  return (
    <div className="pb-2">
      {/* ═══ هیرو ═══ */}
      {show("hero") && (
        <div className="mx-auto max-w-7xl px-3 sm:px-4 pt-3 sm:pt-5">
          <HeroCarousel compact={heroCompact} />
        </div>
      )}

      {/* ═══ دسته‌بندی‌های گرد (قابل مدیریت از پنل — دسته‌بندی‌های محبوب) ═══ */}
      {show("categories") && popularEnabled && popRows.length > 0 && (
      <div className="mx-auto max-w-7xl px-3 sm:px-4 mt-5">
        {popRows.map((row, rowIdx) => (
        <div key={rowIdx} className={`flex items-stretch justify-between gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1 ${catRowMobile ? "" : "max-sm:hidden"} ${rowIdx > 0 ? "border-t border-slate-200/70 mt-1" : ""}`}>
          {row.map((c, i) => {
            const Icon = catIcons[c.icon] ?? Shirt;
            const globalIdx = rowIdx * 10 + i;
            return (
              <Link
                key={c.id}
                href={`/products?cat=${c.slug}`}
                className="group flex flex-col items-center gap-1.5 sm:gap-2 w-[72px] sm:w-24 shrink-0"
              >
                <div className={`h-14 w-14 sm:h-[76px] sm:w-[76px] rounded-full bg-gradient-to-br ${circleGradients[globalIdx % circleGradients.length]} p-[2.5px] shadow-md shadow-slate-300/50 group-hover:scale-110 group-hover:shadow-xl transition-transform duration-300`}>
                  <div className="h-full w-full rounded-full bg-white grid place-items-center">
                    <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-[#1b3a6b] group-hover:text-pink-600 transition-colors" strokeWidth={1.7} />
                  </div>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-600 group-hover:text-pink-700 transition-colors text-center leading-4">
                  {c.name}
                </span>
              </Link>
            );
          })}
        </div>
        ))}
      </div>
      )}

      {/* ═══ بنرهای تبلیغاتی ۴ تایی (از دیتابیس — قابل مدیریت در پنل قالب) ═══ */}
      {show("banners") && (
      <div className="mx-auto max-w-7xl px-3 sm:px-4 mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {promoBanners.map((b) => (
          <Link
            key={b.title}
            href={b.href}
            className="relative h-36 sm:h-44 lg:h-48 rounded-[20px] overflow-hidden group shadow-sm hover:shadow-xl hover:shadow-slate-300/60 transition-shadow"
          >
            <Image src={b.img} alt={b.title} fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover object-[50%_15%] group-hover:scale-110 transition-transform duration-700" />
            <div className={`absolute inset-0 bg-gradient-to-t ${b.accent} via-black/15 to-transparent`} />
            <div className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-end">
              <span className="w-max rounded-md bg-amber-400 text-[#1b3a6b] text-[9px] sm:text-[10px] font-black px-2 py-0.5 mb-1">{b.tag}</span>
              <h3 className="text-white text-[13px] sm:text-lg font-black leading-5 sm:leading-6 drop-shadow">{b.title}</h3>
              <span className="mt-1 flex items-center gap-1 text-[9px] sm:text-[11px] font-bold text-white/85 group-hover:gap-2.5 transition-all">خرید کنید <ChevronLeft className="h-3.5 w-3.5" /></span>
            </div>
          </Link>
        ))}
      </div>
      )}

      {/* ═══ محبوب‌ترین‌ها ═══ */}
      {show("products") && (
      <section className="mx-auto max-w-7xl px-3 sm:px-4 mt-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg sm:text-2xl font-black text-[#1b3a6b]">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 fill-pink-600 text-pink-600" />
              محبوب‌ترین‌ها
            </h2>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">پرطرفدارترین محصولات فروشگاه</p>
          </div>
          <Link href="/products?sort=sales" className="flex items-center gap-0.5 text-[11px] sm:text-[12px] font-bold text-pink-600 hover:text-pink-700">همه <ChevronLeft className="h-4 w-4" /></Link>
        </div>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {cardBest.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
      )}

      {/* ═══ سه بنر کالکشن ═══ */}
      <div className="mx-auto max-w-7xl px-3 sm:px-4 mt-6 grid md:grid-cols-3 gap-3">
        <Link href="/products?cat=kids" className="relative h-44 sm:h-52 rounded-[24px] overflow-hidden group shadow-md">
          <Image src={PX("29224161", 900, 650)} alt="New Arrivals" fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover object-[50%_20%] group-hover:scale-105 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#1b3a6b]/80 via-[#1b3a6b]/30 to-transparent" />
          <div className="absolute inset-0 p-5 flex flex-col justify-center max-w-[60%]">
            <p className="text-[10px] sm:text-[11px] font-black text-amber-300 tracking-widest" dir="ltr">New Arrivals</p>
            <h3 className="mt-1 text-lg sm:text-xl font-black text-white leading-7">جدیدترین محصولات</h3>
            <span className="mt-2 inline-flex w-max items-center gap-1 rounded-full bg-white text-[#1b3a6b] px-4 h-9 text-[10px] font-black group-hover:gap-2.5 transition-all">مشاهده کنید <ChevronLeft className="h-4 w-4" /></span>
          </div>
        </Link>
        <Link href="/products?cat=formal" className="relative h-44 sm:h-52 rounded-[24px] overflow-hidden group shadow-md">
          <Image src={PX("1620759", 900, 650)} alt="Workwear Reimagined" fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover object-[50%_18%] group-hover:scale-105 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#3b0a2a]/80 via-[#3b0a2a]/30 to-transparent" />
          <div className="absolute inset-0 p-5 flex flex-col justify-center max-w-[60%]">
            <p className="text-[10px] sm:text-[11px] font-black text-pink-300 tracking-widest" dir="ltr">Workwear Reimagined</p>
            <h3 className="mt-1 text-lg sm:text-xl font-black text-white leading-7">استایل رسمی و مدرسه‌ای</h3>
            <span className="mt-2 inline-flex w-max items-center gap-1 rounded-full bg-white text-[#1b3a6b] px-4 h-9 text-[10px] font-black group-hover:gap-2.5 transition-all">مشاهده مجموعه <ChevronLeft className="h-4 w-4" /></span>
          </div>
        </Link>
        <Link href="/products?cat=kids" className="relative h-44 sm:h-52 rounded-[24px] overflow-hidden group shadow-md">
          <Image src={PX("1620760", 900, 650)} alt="Weekend Looks" fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover object-[50%_18%] group-hover:scale-105 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#0e2a47]/80 via-[#0e2a47]/30 to-transparent" />
          <div className="absolute inset-0 p-5 flex flex-col justify-center max-w-[60%]">
            <p className="text-[10px] sm:text-[11px] font-black text-cyan-300 tracking-widest" dir="ltr">Weekend Looks</p>
            <h3 className="mt-1 text-lg sm:text-xl font-black text-white leading-7">استایل آخر هفته</h3>
            <span className="mt-2 inline-flex w-max items-center gap-1 rounded-full bg-white text-[#1b3a6b] px-4 h-9 text-[10px] font-black group-hover:gap-2.5 transition-all">مشاهده مجموعه <ChevronLeft className="h-4 w-4" /></span>
          </div>
        </Link>
      </div>

      {/* ═══ نوار اعتماد ═══ */}
      {show("trust") && (
      <div className="mx-auto max-w-7xl px-3 sm:px-4 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 rounded-[20px] border border-slate-200/80 bg-white p-2 sm:p-3 shadow-sm">
          {[
            { icon: Headphones, t: "پشتیبانی سریع", d: "پاسخگویی ۲۴ ساعته" },
            { icon: RotateCcw, t: "ضمانت بازگشت", d: "تا ۷ روز" },
            { icon: Gift, t: "بسته‌بندی شیک", d: "و هدیه جذاب" },
            { icon: ShieldCheck, t: "پرداخت امن", d: "با تمامی کارت‌ها" },
            { icon: Truck, t: "ارسال سریع", d: "به سراسر کشور" },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="flex items-center gap-2 sm:gap-3 rounded-2xl px-2 py-2 hover:bg-pink-50 transition-colors">
              <div className="h-9 w-9 sm:h-11 sm:w-11 shrink-0 rounded-full grid place-items-center" style={{ background: "var(--brand-accent)" }}>
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" strokeWidth={1.8} />
              </div>
              <div className="leading-tight">
                <p className="text-[10px] sm:text-[11px] font-black text-[#1b3a6b]">{t}</p>
                <p className="text-[8px] sm:text-[9px] text-slate-400 mt-0.5">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* ═══ مجله + بنر میانی + ست‌های پیشنهادی ═══ */}
      {show("blog") && (
      <div className="mx-auto max-w-7xl px-3 sm:px-4 mt-8 grid lg:grid-cols-3 gap-4">
        {/* آخرین مقالات مجله */}
        <section className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[13px] sm:text-sm font-black text-[#1b3a6b]"><Newspaper className="h-4 w-4 text-pink-600" /> آخرین مقالات مجله</h2>
            <Link href="/blog" className="text-[10px] font-bold text-pink-600 hover:text-pink-700 flex items-center gap-0.5">همه <ChevronLeft className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="mt-2 divide-y divide-slate-100">
            {latestPosts.slice(0, 3).map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="flex items-center gap-2.5 py-2.5 group">
                <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-xl overflow-hidden bg-[#f6f4ef]">
                  <Image src={post.image} alt={post.title} fill sizes="70px" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-[11px] font-bold text-slate-700 leading-5 line-clamp-2 group-hover:text-pink-700 transition-colors">{post.title}</p>
                  <p className="mt-0.5 text-[8px] text-slate-400">{faDay(post.createdAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* بنر میانی مجله */}
        <Link href="/blog" className="relative h-56 sm:h-64 lg:h-auto lg:min-h-[300px] rounded-[24px] overflow-hidden group shadow-md">
          <Image src={PX("5088176", 1000, 800)} alt="ایده بگیر و استایل بساز با MiniModa" fill sizes="(max-width:1024px) 100vw, 33vw" className="object-cover object-[50%_15%] group-hover:scale-105 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#1b3a6b]/85 via-[#1b3a6b]/30 to-transparent" />
          <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-center max-w-[62%]">
            <p className="text-[9px] sm:text-[10px] font-black text-amber-300 tracking-widest">مجله مینی‌مودا</p>
            <h3 className="mt-1 text-lg sm:text-2xl font-black text-white leading-8">ایده بگیر و<br />استایل بساز<br />با MiniModa</h3>
            <span className="mt-3 inline-flex w-max items-center gap-1 rounded-full px-4 h-9 text-[10px] font-black text-white group-hover:gap-2.5 transition-all" style={{ background: "var(--brand-accent)" }}>مشاهده مقالات <ChevronLeft className="h-4 w-4" /></span>
          </div>
        </Link>

        {/* ست‌های پیشنهادی */}
        <section className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] sm:text-sm font-black text-[#1b3a6b]">ست‌های پیشنهادی</h2>
            <Link href="/products" className="text-[10px] font-bold text-pink-600 hover:text-pink-700 flex items-center gap-0.5">همه <ChevronLeft className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 flex-1">
            {[PX("28506036", 300, 400), PX("9537104", 300, 400), PX("30690921", 300, 400)].map((img, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden bg-[#f6f4ef] aspect-[3/4]">
                <Image src={img} alt={`ست پیشنهادی ${i + 1}`} fill sizes="120px" className="object-cover object-top" />
              </div>
            ))}
          </div>
          <Link href="/products" className="mt-3 flex items-center justify-center gap-2 rounded-2xl h-11 text-[11px] font-black text-white hover:brightness-110 transition" style={{ background: "var(--brand-accent)" }}>
            <Heart className="h-4 w-4 fill-white" /> ست کامل با قیمت ویژه
          </Link>
        </section>
      </div>
      )}

      {/* ═══ جدیدترین اخبار مد و پوشاک ═══ */}
      <section className="mx-auto max-w-7xl px-3 sm:px-4 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg sm:text-2xl font-black text-[#1b3a6b]">
            <Newspaper className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600" />
            جدیدترین اخبار مد و پوشاک
          </h2>
          <Link href="/blog" className="flex items-center gap-0.5 text-[11px] sm:text-[12px] font-bold text-pink-600 hover:text-pink-700">همه مقالات <ChevronLeft className="h-4 w-4" /></Link>
        </div>
        <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {latestPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="rounded-[20px] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all overflow-hidden group">
              <div className="relative h-28 sm:h-32 overflow-hidden">
                <Image src={post.image} alt={post.title} fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <span className="absolute top-2 right-2 rounded-md bg-[#1b3a6b]/85 backdrop-blur px-2 py-0.5 text-[8px] font-bold text-amber-300">{post.tag}</span>
              </div>
              <div className="p-3">
                <h3 className="text-[10px] sm:text-[11px] font-bold text-[#1b3a6b] leading-5 line-clamp-2 min-h-10 group-hover:text-pink-700 transition-colors">{post.title}</h3>
                <div className="mt-1.5 flex items-center justify-between text-[8px] text-slate-400">
                  <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{faDay(post.createdAt)}</span>
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{toFaDigits(post.views.toLocaleString("fa-IR"))}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ بنرهای دوگانه پایین ═══ */}
      {show("duo") && (
      <div className="mx-auto max-w-7xl px-3 sm:px-4 mt-8 grid md:grid-cols-2 gap-3">
        <Link href="/products?cat=kids" className="relative h-44 sm:h-56 rounded-[24px] overflow-hidden group shadow-md">
          <Image src={PX("28246503", 1000, 650)} alt="Breezy Styles Bright Days" fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover object-[50%_20%] group-hover:scale-105 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#0e2a47]/85 via-[#0e2a47]/35 to-transparent" />
          <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-center max-w-[58%]">
            <p className="text-[9px] sm:text-[10px] font-black text-cyan-300 tracking-widest" dir="ltr">Breezy Styles Bright Days</p>
            <h3 className="mt-1 text-lg sm:text-2xl font-black text-white leading-7 sm:leading-9">روزهای روشن،<br />خاطره‌های سفید</h3>
            <span className="mt-2 sm:mt-3 inline-flex w-max items-center gap-1 rounded-full bg-white/15 backdrop-blur border border-white/30 text-white px-3 sm:px-4 h-8 sm:h-9 text-[10px] sm:text-[11px] font-bold group-hover:bg-white group-hover:text-[#1b3a6b] transition-colors">مشاهده کالکشن <ChevronLeft className="h-4 w-4" /></span>
          </div>
        </Link>
        <Link href="/products?offer=1" className="relative h-44 sm:h-56 rounded-[24px] overflow-hidden group shadow-md">
          <Image src={PX("14211426", 1000, 650)} alt="تخفیف ویژه تا ۵۰٪" fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover object-[50%_18%] group-hover:scale-105 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#3b0a2a]/85 via-[#3b0a2a]/35 to-transparent" />
          <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-center max-w-[58%]">
            <p className="text-[9px] sm:text-[10px] font-black text-pink-300 tracking-widest">تخفیف ویژه</p>
            <h3 className="mt-1 text-lg sm:text-2xl font-black text-white leading-7 sm:leading-9">تا ۵۰٪ تخفیف<br />روی منتخبات</h3>
            <span className="mt-2 sm:mt-3 inline-flex w-max items-center gap-1 rounded-full text-white px-3 sm:px-4 h-8 sm:h-9 text-[10px] sm:text-[11px] font-black group-hover:brightness-110 transition" style={{ background: "var(--brand-accent)" }}>همین حالا خرید کنید <ChevronLeft className="h-4 w-4" /></span>
          </div>
        </Link>
      </div>
      )}

      {/* ═══ تب محصولات (پرفروش / تخفیف‌دار / تازه) ═══ */}
      {show("products") && <ProductTabs tabs={{ bestsellers: cardBest, offers: cardOffers, fresh: cardFresh }} />}
    </div>
  );
}
