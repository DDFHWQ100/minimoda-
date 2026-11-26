import "dotenv/config";
import { randomBytes, scryptSync } from "crypto";
import { db } from "./index";
import {
  users,
  categories,
  products,
  orders,
  orderItems,
  reviews,
  blogPosts,
} from "./schema";

const P = (id: string) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`;

function hashPassword(pw: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(pw, salt, 64).toString("hex")}`;
}

const JSON_S = (v: unknown) => JSON.stringify(v);

async function main() {
  console.log("پاک‌سازی داده‌های قبلی...");
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(reviews);
  await db.delete(blogPosts);
  await db.delete(products);
  await db.delete(categories);
  await db.delete(users);

  console.log("ایجاد کاربران...");
  const [admin] = await db
    .insert(users)
    .values({
      name: "مدیر فروشگاه",
      email: "admin@minimoda.ir",
      phone: "02188766554",
      passwordHash: hashPassword("admin123"),
      role: "admin",
      address: "تهران، خیابان ولیعصر، بالاتر از پارک ملت، پلاک ۱۲",
    })
    .returning();

  const [sara] = await db
    .insert(users)
    .values({
      name: "سارا محمدی",
      email: "sara@example.com",
      phone: "09121234567",
      passwordHash: hashPassword("user123"),
      role: "user",
      address: "تهران، سعادت‌آباد، خیابان سرو شرقی، کوچه ۱۷، پلاک ۴",
    })
    .returning();

  console.log("ایجاد دسته‌بندی‌ها...");
  const catValues = [
    { name: "دخترانه", slug: "girls", icon: "Crown", sortOrder: 1, description: "پیراهن، سارافون و لباس‌های دخترانه", image: P("12159459") },
    { name: "پسرانه", slug: "boys", icon: "Shirt", sortOrder: 2, description: "کت، شلوار و تیشرت‌های پسرانه", image: P("30690920") },
    { name: "بچگانه", slug: "kids", icon: "Sparkles", sortOrder: 3, description: "کاپشن و لباس‌های روزمره بچگانه", image: P("29224161") },
    { name: "نوزاد", slug: "baby", icon: "Baby", sortOrder: 4, description: "سرهمی و لباس‌های نرم نوزاد", image: P("36508024") },
    { name: "لباس مجلسی", slug: "formal", icon: "Gem", sortOrder: 5, description: "لباس‌های رسمی و مجلسی کودک", image: P("36374320") },
    { name: "کفش", slug: "shoes", icon: "Footprints", sortOrder: 6, description: "کتانی، کفش اسپرت و مجلسی کودک", image: P("9537104") },
    { name: "اکسسوری", slug: "accessories", icon: "ShoppingBag", sortOrder: 7, description: "کلاه، کیف و اکسسوری‌های کودک", image: P("2271522") },
  ];
  const insertedCats = await db.insert(categories).values(catValues).returning();
  const catId = (slug: string) => insertedCats.find((c) => c.slug === slug)!.id;

  console.log("ایجاد محصولات...");
  const productValues = [
    {
      name: "پیراهن مجلسی سلطنتی صورتی آرگونا", slug: "royal-pink-gown",
      description: "پیراهن مجلسی دخترانه از پارچه ابریشم و تور فرانسوی با گلدوزی دستی، مناسب مراسم رسمی و تولد. آستر لطیف و سازگار با پوست حساس کودک دارد.",
      price: 4850000, discountPrice: 3890000, categoryId: catId("formal"),
      stock: 32, sizes: JSON_S(["4-5", "6-7", "8-9", "10-11"]),
      colors: JSON_S([{ name: "صورتی", hex: "#f2a7c3" }, { name: "بژ", hex: "#e6d3b8" }]),
      images: JSON_S([P("36374320")]),
      rating: 4.9, reviewCount: 128, salesCount: 542, isNew: true, isFeatured: true, isOffer: true,
    },
    {
      name: "سارافون گلدار وینتاج رزالی", slug: "vintage-floral-pinafore",
      description: "سارافون گلدار با الگوی کلاسیک وینتاج، دوخت فرانسوی با پشت بندهای قابل تنظیم؛ همراه با پیراهن سفید حریر هدیه‌ای.",
      price: 3200000, discountPrice: null, categoryId: catId("formal"),
      stock: 41, sizes: JSON_S(["3-4", "5-6", "7-8", "9-10"]),
      colors: JSON_S([{ name: "گلدار کرمی", hex: "#d9c6a5" }]),
      images: JSON_S([P("29668588")]),
      rating: 4.8, reviewCount: 96, salesCount: 388, isNew: true, isFeatured: true, isOffer: false,
    },
    {
      name: "پیراهن سفید مهمانی ملکه بالن‌ها", slug: "balloon-queen-white-dress",
      description: "پیراهن سفید کوتاه آستین‌بالنی با دامن پفی لایه‌لایه؛ انتخابی رویایی برای مهمانی‌ها. زیور کفش و تل رایگان داخل بسته ارسال می‌شود.",
      price: 5600000, discountPrice: 4480000, categoryId: catId("formal"),
      stock: 25, sizes: JSON_S(["3-4", "5-6", "7-8"]),
      colors: JSON_S([{ name: "سفید", hex: "#ffffff" }]),
      images: JSON_S([P("33939726")]),
      rating: 5.0, reviewCount: 74, salesCount: 260, isNew: false, isFeatured: true, isOffer: true,
    },
    {
      name: "کت و شلوار رسمی مشکی پسرانه آرش", slug: "arash-black-suit",
      description: "کت و شلوار دو دکمه از پارچه فاستونی ایتالیایی با پنج‌جیب دوزی اصیل، کراوات هدیه؛ مناسب مراسم عقد، تولد و عکاسی رسمی.",
      price: 6150000, discountPrice: null, categoryId: catId("boys"),
      stock: 28, sizes: JSON_S(["5-6", "7-8", "9-10", "11-12"]),
      colors: JSON_S([{ name: "مشکی", hex: "#1c1c1e" }]),
      images: JSON_S([P("30690921")]),
      rating: 4.9, reviewCount: 152, salesCount: 471, isNew: false, isFeatured: true, isOffer: false,
    },
    {
      name: "کت تک سرمه‌ای پسرانه با اسلش جین", slug: "navy-blazer-boy",
      description: "کت تک اسپرت سرمه‌ای با یقه آرگونا و دکمه‌های طلایی؛ قابل ست شدن با جین و کتان. داخل آستر نخی ضد حساسیت دارد.",
      price: 3890000, discountPrice: null, categoryId: catId("boys"),
      stock: 36, sizes: JSON_S(["4-5", "6-7", "8-9", "10-11"]),
      colors: JSON_S([{ name: "سرمه‌ای", hex: "#22344f" }]),
      images: JSON_S([P("30690920")]),
      rating: 4.7, reviewCount: 88, salesCount: 342, isNew: false, isFeatured: false, isOffer: false,
    },
    {
      name: "ست کت و شلوار پاپیون‌دار پسرانه بارون", slug: "baron-bowtie-suit",
      description: "ست سه تیکه کت، شلوار و پاپیون قرمز طرح چهارخانه؛ طراحی اروپایی با دوختی لطیف برای مهمانی‌های رسمی کودک.",
      price: 5280000, discountPrice: 4590000, categoryId: catId("boys"),
      stock: 22, sizes: JSON_S(["4-5", "6-7", "8-9"]),
      colors: JSON_S([{ name: "مشکی", hex: "#1c1c1e" }]),
      images: JSON_S([P("36909815")]),
      rating: 4.8, reviewCount: 64, salesCount: 215, isNew: true, isFeatured: false, isOffer: true,
    },
    {
      name: "تیشرت اسپرت پسرانه طرح رِد وال", slug: "redwall-sport-tee",
      description: "تیشرت پنبه‌ای ۱۰۰٪ با چاپ مقاوم و دوردوزی شده؛ خنک، لطیف و مناسب استفاده روزمره و ورزش.",
      price: 890000, discountPrice: 690000, categoryId: catId("boys"),
      stock: 120, sizes: JSON_S(["4-5", "6-7", "8-9", "10-11", "12-13"]),
      colors: JSON_S([{ name: "زرشکی", hex: "#a93226" }, { name: "آبی", hex: "#2e6da4" }]),
      images: JSON_S([P("28644436")]),
      rating: 4.6, reviewCount: 210, salesCount: 830, isNew: true, isFeatured: false, isOffer: true,
    },
    {
      name: "کاپشن صورتی کلاسیک بچگانه هاوانا", slug: "havana-pink-coat",
      description: "کاپشن زمستانی با عایق پر طبیعی، ضد آب و ضد باد؛ مناسب روزهای سرد پاییز و زمستان. داخل با پشم مرینو آستر شده است.",
      price: 2750000, discountPrice: null, categoryId: catId("kids"),
      stock: 47, sizes: JSON_S(["3-4", "5-6", "7-8", "9-10"]),
      colors: JSON_S([{ name: "صورتی", hex: "#f4a7b9" }, { name: "قرمز", hex: "#d94f4f" }]),
      images: JSON_S([P("29224161")]),
      rating: 4.9, reviewCount: 167, salesCount: 689, isNew: false, isFeatured: true, isOffer: false,
    },
    {
      name: "کاپشن قرمز ورزشی دخترانه پیک", slug: "red-parka-girl",
      description: "کاپشن اسپرت قرمز با کلاه خزدار جداشونده؛ سبک و گرم با زیپ فلزی ضدزنگ. مناسب بازی در فضای باز و برف.",
      price: 2350000, discountPrice: 1980000, categoryId: catId("kids"),
      stock: 58, sizes: JSON_S(["2-3", "4-5", "6-7", "8-9"]),
      colors: JSON_S([{ name: "قرمز", hex: "#d43a3a" }]),
      images: JSON_S([P("11111822")]),
      rating: 4.7, reviewCount: 134, salesCount: 512, isNew: true, isFeatured: true, isOffer: true,
    },
    {
      name: "کاپشن نارنجی ماجراجو بچگانه اکسپلورر", slug: "explorer-orange-jacket",
      description: "کاپشن فلوئورسنت نارنجی با رفلکتور ایمنی در تاریکی؛ انتخابی عالی برای کودکان پرانرژی. جیب‌های زیپ‌دار و ضد آب.",
      price: 2600000, discountPrice: null, categoryId: catId("kids"),
      stock: 64, sizes: JSON_S(["2-3", "4-5", "6-7", "8-9"]),
      colors: JSON_S([{ name: "نارنجی", hex: "#e2703a" }]),
      images: JSON_S([P("30003587")]),
      rating: 4.5, reviewCount: 91, salesCount: 296, isNew: false, isFeatured: false, isOffer: false,
    },
    {
      name: "پالتو صورتی نوزاد زمستانی بیبی‌رز", slug: "baby-rose-winter-coat",
      description: "پالتو پشمی نوزاد با کلاه گوش‌دار و دستکش دو دکمه؛ از پارچه نرم ضدحساسیت با آستر فلانل. مناسب ۰ تا ۲۴ ماه.",
      price: 1980000, discountPrice: null, categoryId: catId("baby"),
      stock: 73, sizes: JSON_S(["0-6m", "6-12m", "12-24m"]),
      colors: JSON_S([{ name: "صورتی", hex: "#f7c6d0" }]),
      images: JSON_S([P("36508024")]),
      rating: 4.9, reviewCount: 143, salesCount: 604, isNew: true, isFeatured: true, isOffer: false,
    },
    {
      name: "پیراهن آبی استودیو دخترانه آرمیتا", slug: "armita-blue-dress",
      description: "پیراهن آبی کاربنی با پایه‌ی ویسکوز لطیف و کمر کشی؛ مناسب مهمانی و عکاسی. دوخت دقیق و رنگ ثابت در شستشو.",
      price: 1450000, discountPrice: null, categoryId: catId("girls"),
      stock: 85, sizes: JSON_S(["3-4", "5-6", "7-8", "9-10"]),
      colors: JSON_S([{ name: "آبی", hex: "#4a6fa5" }]),
      images: JSON_S([P("12159459")]),
      rating: 4.6, reviewCount: 112, salesCount: 458, isNew: true, isFeatured: false, isOffer: false,
    },
    {
      name: "پیراهن سفید تور و پاپیون دخترانه رها", slug: "raha-tulle-dress",
      description: "پیراهن مجلسی لایه‌ای با تور فرانسوی و پاپیون مخملی؛ با پاپیون یدکی اضافه. مناسب مراسم رسمی و عکاسی تولد.",
      price: 4950000, discountPrice: 3960000, categoryId: catId("girls"),
      stock: 29, sizes: JSON_S(["4-5", "6-7", "8-9"]),
      colors: JSON_S([{ name: "سفید", hex: "#ffffff" }, { name: "زرشکی", hex: "#8e2a3c" }]),
      images: JSON_S([P("14897706")]),
      rating: 4.8, reviewCount: 79, salesCount: 238, isNew: false, isFeatured: false, isOffer: true,
    },
    {
      name: "کفش ورزشی خاکستری سامیکس رانر", slug: "samix-gray-runner",
      description: "کفش ورزشی با زیره EVA سبک و انعطاف‌پذیر؛ تهویه عالی و پنجه پهن مناسب رشد طبیعی پا. در سه سایز رنگ‌بندی.",
      price: 1740000, discountPrice: null, categoryId: catId("shoes"),
      stock: 95, sizes: JSON_S(["28", "30", "32", "34", "36"]),
      colors: JSON_S([{ name: "خاکستری", hex: "#8a8d91" }]),
      images: JSON_S([P("9537104")]),
      rating: 4.7, reviewCount: 189, salesCount: 720, isNew: false, isFeatured: false, isOffer: false,
    },
    {
      name: "کتانی قرمز نوزاد پاپی‌فیت", slug: "papy-fit-red-sneaker",
      description: "کتانی نوزادی با زیره نرم ابری و چسبک قابل تنظیم؛ اولین کفش ایده‌آل برای نوزادان در حال راه‌افتادن.",
      price: 950000, discountPrice: 790000, categoryId: catId("shoes"),
      stock: 110, sizes: JSON_S(["17", "18", "19", "20"]),
      colors: JSON_S([{ name: "قرمز", hex: "#c0392b" }]),
      images: JSON_S([P("2271522")]),
      rating: 4.8, reviewCount: 156, salesCount: 815, isNew: false, isFeatured: false, isOffer: true,
    },
    {
      name: "کتانی سفید مینی رانر سفید استار", slug: "mini-star-white-sneaker",
      description: "کتانی سفید تمام‌چرم با دوخت دودوزی و زیره لاستیکی ضد لغزش؛ مناسب مدرسه و روزمره. همراه با بند اضافه هدیه.",
      price: 1290000, discountPrice: null, categoryId: catId("shoes"),
      stock: 78, sizes: JSON_S(["25", "27", "29", "31", "33"]),
      colors: JSON_S([{ name: "سفید", hex: "#ffffff" }]),
      images: JSON_S([P("5275386")]),
      rating: 4.5, reviewCount: 121, salesCount: 540, isNew: true, isFeatured: true, isOffer: false,
    },
    {
      name: "ست نامیکی دو تیکه بچگانه مارین", slug: "marine-nautical-set",
      description: "ست دو تیکه بلوز راه‌راه ملوانی و شلوارک کتان؛ پارچه خنک تابستانی با دوخت تقویت‌شده. مناسب ست دونفره.",
      price: 1680000, discountPrice: null, categoryId: catId("kids"),
      stock: 88, sizes: JSON_S(["4-5", "6-7", "8-9", "10-11"]),
      colors: JSON_S([{ name: "سرمه‌ای-سفید", hex: "#22344f" }]),
      images: JSON_S([P("1620759")]),
      rating: 4.8, reviewCount: 148, salesCount: 633, isNew: false, isFeatured: true, isOffer: false,
    },
    {
      name: "پیراهن تور عاجی نوزاد پرنسس آوا", slug: "ava-ivory-tulle",
      description: "پیراهن بلند تور عاجی با سنگ‌دوزی ظریف و تل پاپیون هدیه؛ انتخابی رویایی برای عکاسی و جشن‌های نوزادی.",
      price: 3350000, discountPrice: 2680000, categoryId: catId("baby"),
      stock: 34, sizes: JSON_S(["6-12m", "12-24m"]),
      colors: JSON_S([{ name: "عاجی", hex: "#efe6d8" }]),
      images: JSON_S([P("29610395")]),
      rating: 4.9, reviewCount: 87, salesCount: 265, isNew: true, isFeatured: false, isOffer: true,
    },
  ];
  const insertedProducts = await db.insert(products).values(productValues).returning();
  const prodId = (slug: string) => insertedProducts.find((p) => p.slug === slug)!.id;

  console.log("ایجاد نظرات...");
  await db.insert(reviews).values([
    { productId: prodId("royal-pink-gown"), userId: sara.id, authorName: "سارا محمدی", rating: 5, comment: "پارچه و دوخت فوق‌العاده بود، دخترم عاشق پیراهن شد. بسته‌بندی هم عالی بود." },
    { productId: prodId("royal-pink-gown"), userId: null, authorName: "مریم کاظمی", rating: 5, comment: "دقیقاً مثل عکس‌هاست؛ گلدوزی‌ها خیلی تمیز کار شده." },
    { productId: prodId("arash-black-suit"), userId: sara.id, authorName: "سارا محمدی", rating: 5, comment: "برای عکاسی رسمی پسرم گرفتم؛ همه از شدت خوش‌تیپی تعجب کردند!" },
    { productId: prodId("arash-black-suit"), userId: null, authorName: "رضا توکلی", rating: 4, comment: "کیفیت خوب، فقط کمی دم‌پا بلند بود که خیاط کوتاه کرد." },
    { productId: prodId("havana-pink-coat"), userId: null, authorName: "لیلا احمدی", rating: 5, comment: "خیلی گرم و سبک است، برای برف کاملاً مناسبه." },
    { productId: prodId("papy-fit-red-sneaker"), userId: null, authorName: "الهه نوری", rating: 5, comment: "اولین کفش پسرم؛ زیره‌اش واقعاً نرمه و پای بچه رو اذیت نمی‌کنه." },
  ]);

  console.log("ایجاد سفارش نمونه...");
  const [order1] = await db
    .insert(orders)
    .values({
      userId: sara.id,
      total: 4280000,
      status: "delivered",
      customerName: "سارا محمدی",
      phone: "09121234567",
      address: "تهران، سعادت‌آباد، خیابان سرو شرقی، کوچه ۱۷، پلاک ۴",
      paymentMethod: "online",
      note: "لطفاً قبل از ارسال هماهنگ کنید.",
    })
    .returning();
  await db.insert(orderItems).values([
    { orderId: order1.id, productId: prodId("royal-pink-gown"), name: "پیراهن مجلسی سلطنتی صورتی آرگونا", image: P("36374320"), price: 3890000, quantity: 1, size: "6-7", color: "صورتی" },
    { orderId: order1.id, productId: prodId("redwall-sport-tee"), name: "تیشرت اسپرت پسرانه طرح رِد وال", image: P("28644436"), price: 390000, quantity: 1, size: "6-7", color: "زرشکی" },
  ]);

  console.log("ایجاد مطالب بلاگ...");
  await db.insert(blogPosts).values([
    {
      title: "اصول انتخاب لباس مجلسی مناسب کودک برای مراسم رسمی",
      slug: "kids-formal-dress-guide",
      excerpt: "از انتخاب پارچه تا سایزبندی درست؛ هر آنچه قبل از خرید لباس مجلسی کودک باید بدانید.",
      content: "انتخاب لباس مجلسی برای کودکان فقط مسئله ظاهر نیست؛ راحتی، جنس پارچه و دوخت تمیز اهمیت اصلی را دارد. پارچه‌های ویسکوز و پنبه مخلوط برای مهمانی‌های طولانی گزینه‌های بهتری هستند چون تنفس‌پذیرند و حساسیت ایجاد نمی‌کنند.\n\nهنگام خرید، یک سایز بالاتر انتخاب کنید چون کودکان به سرعت رشد می‌کنند و لباس نباید تنگ باشد. همچنین از یقه‌های سفت و دوخت‌های زبر که پوست گردن را می‌خراشد پرهیز کنید.\n\nدر پایان، حتماً رنگ و فرم را با موقعیت مراسم هماهنگ کنید؛ برای عصرها رنگ‌های تیره و برای روز رنگ‌های روشن و شاد مناسب‌ترند.",
      image: P("33939726"), tag: "راهنمای خرید", views: 3421,
    },
    {
      title: "چطور کفش استاندارد برای رشد پای کودک انتخاب کنیم؟",
      slug: "right-shoes-for-kids",
      excerpt: "پنج نکته طلایی برای انتخاب کفش سالم که قدم‌های اول را برای فرزندتان خاطره‌انگیز می‌کند.",
      content: "پای کودک تا ۱۲ سالگی در حال رشد است و پای افزار نامناسب می‌تواند باعث مشکلات اسکلتی شود. پنجه کفش باید حداقل یک سانتی‌متر فضا داشته باشد و پاشنه بیش از دو سانتی‌متر نباشد.\n\nزیره EVA و EVA-Ruبری با انعطاف مناسب بهترین انتخاب است. کفشی که خم نمی‌شود، پای کودک را خسته می‌کند.\n\nخرید کفش ارتوپدی برای کودکان سالم ضروری نیست، اما در ناهنجاری‌های کف پا حتماً با پزشک ارتوپد مشورت کنید.",
      image: P("30395128"), tag: "سلامت کودک", views: 2874,
    },
    {
      title: "ترندهای پاییز و زمستان مد کودک در سال ۲۰۲۶",
      slug: "fall-winter-2026-trends",
      excerpt: "از پالت رنگ‌های خاکی تا پارچه‌های بازیافتی؛ مهم‌ترین ترندهای امسال را بشناسید.",
      content: "پالت رنگ فصل جاری بر پایه خاکی، کاراملی و سبز زیتونی با تأکید بر صورتی گردویی استوار است. برندهای مطرح دنیا به سمت پارچه‌های ارگانیک و بازیافتی رفته‌اند.\n\nکاپشن‌های اورسایز با جزئیات رفلکتور ایمنی و کت تک‌های اسپرت دوطرفه از پرفروش‌ترین آیتم‌های فصل هستند.\n\nدر ایران نیز استقبال از ست‌های خانوادگی و رنگ‌های خنثی با اکسسوری‌های رنگی چشمگیر افزایش یافته است.",
      image: P("35607631"), tag: "ترند مد", views: 4102,
    },
    {
      title: "لباس زمستانی گرم و ایمن؛ راهنمای مادران باهوش",
      slug: "winter-clothes-guide",
      excerpt: "لایه‌لایه بپوشانید، هوشمند خرید کنید؛ نکات ایمنی کاپشن و پالتو کودک.",
      content: "قانون سه لایه بهترین راه برای گرم نگه‌داشتن کودک است: لایه اول حرارتی پنبه‌ای، لایه میانی پشمی یا فلانل و لایه بیرونی ضدآب و ضدباد.\n\nاز کلاه‌های بنددار بلند که خطر گره خوردن دارند پرهیز کنید و زیپ‌ها را با محافظ پارچه‌ای بپوشانید تا چانه کودک آسیب نبیند.\n\nکاپشن خیلی بزرگ هم به اندازه کاپشن تنگ خطرناک است؛ باد از زیر وارد می‌شود و کودک سردش می‌شود. اندازه بهتر، یک سایز بزرگ‌تر با کمرکشی است.",
      image: P("19579097"), tag: "سبک زندگی", views: 1953,
    },
  ]);

  console.log("تمام شد! دیتابیس با موفقیت پر شد.");
  process.exit(0);
}

main().catch((err) => {
  console.error("خطا در seed:", err);
  process.exit(1);
});
