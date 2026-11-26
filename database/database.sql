-- ══════════════════════════════════════════════════════════════
--  MiniModa — دیتابیس MySQL/MariaDB
--  اجرا: در phpMyAdmin این فایل را Import کنید یا:
--  mysql -u USER -p DBNAME < database.sql
-- ══════════════════════════════════════════════════════════════
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- اگر قبلاً ایمپورت شده، جداول قدیمی حذف می‌شوند تا ایمپورت مجدد خطای Duplicate ندهد
DROP TABLE IF EXISTS newsletter_subscribers;
DROP TABLE IF EXISTS blog_posts;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL DEFAULT '',
  password_hash VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  slug VARCHAR(60) NOT NULL UNIQUE,
  description VARCHAR(255) NOT NULL DEFAULT '',
  image VARCHAR(500) NOT NULL DEFAULT '',
  icon VARCHAR(40) NOT NULL DEFAULT 'Shirt',
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(190) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price INT UNSIGNED NOT NULL,
  discount_price INT UNSIGNED DEFAULT NULL,
  category_id INT UNSIGNED DEFAULT NULL,
  stock INT NOT NULL DEFAULT 0,
  sizes JSON NOT NULL,
  colors JSON NOT NULL,
  images JSON NOT NULL,
  rating FLOAT NOT NULL DEFAULT 4.5,
  review_count INT NOT NULL DEFAULT 0,
  sales_count INT NOT NULL DEFAULT 0,
  is_new TINYINT(1) NOT NULL DEFAULT 0,
  is_offer TINYINT(1) NOT NULL DEFAULT 0,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  KEY idx_products_category (category_id),
  KEY idx_products_sales (sales_count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED DEFAULT NULL,
  total INT UNSIGNED NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  customer_name VARCHAR(120) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  note TEXT NOT NULL,
  payment_method VARCHAR(20) NOT NULL DEFAULT 'online',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  KEY idx_orders_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id INT UNSIGNED NOT NULL,
  product_id INT UNSIGNED DEFAULT NULL,
  name VARCHAR(190) NOT NULL,
  image VARCHAR(500) NOT NULL DEFAULT '',
  price INT UNSIGNED NOT NULL,
  quantity INT NOT NULL,
  size VARCHAR(30) NOT NULL DEFAULT '',
  color VARCHAR(40) NOT NULL DEFAULT '',
  CONSTRAINT fk_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reviews (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED DEFAULT NULL,
  author_name VARCHAR(120) NOT NULL DEFAULT 'کاربر مهمان',
  rating TINYINT NOT NULL DEFAULT 5,
  comment TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blog_posts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(220) NOT NULL,
  slug VARCHAR(160) NOT NULL UNIQUE,
  excerpt VARCHAR(500) NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  image VARCHAR(500) NOT NULL DEFAULT '',
  tag VARCHAR(60) NOT NULL DEFAULT 'مد و پوشاک',
  views INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- کاربران نمونه (رمز: admin123 / user123)
-- ─────────────────────────────────────────────
INSERT INTO users (name, email, phone, password_hash, address, role) VALUES
('مدیر فروشگاه', 'admin@minimoda.ir', '02188766554', '$2y$12$Dk0ILl47Qk3hRAphwRXNLus/uZwU.MrLCVRllMvUqFERLhT40V/ei', 'تهران، خیابان ولیعصر، بالاتر از پارک ملت، پلاک ۱۲', 'admin'),
('سارا محمدی', 'sara@example.com', '09121234567', '$2y$12$STPcklZapPtfxARWcoi1xesFdxp7y3Qdp0Qp3etH/ne4an0OeWX9S', 'تهران، سعادت‌آباد، خیابان سرو شرقی، کوچه ۱۷، پلاک ۴', 'user');

-- ─────────────────────────────────────────────
-- دسته‌بندی‌ها
-- ─────────────────────────────────────────────
INSERT INTO categories (name, slug, icon, sort_order, description, image) VALUES
('دخترانه', 'girls', 'Crown', 1, 'پیراهن، سارافون و لباس‌های دخترانه', 'https://images.pexels.com/photos/12159459/pexels-photo-12159459.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'),
('پسرانه', 'boys', 'Shirt', 2, 'کت، شلوار و تیشرت‌های پسرانه', 'https://images.pexels.com/photos/30690920/pexels-photo-30690920.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'),
('بچگانه', 'kids', 'Sparkles', 3, 'کاپشن و لباس‌های روزمره بچگانه', 'https://images.pexels.com/photos/29224161/pexels-photo-29224161.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'),
('نوزاد', 'baby', 'Baby', 4, 'سرهمی و لباس‌های نرم نوزاد', 'https://images.pexels.com/photos/36508024/pexels-photo-36508024.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'),
('لباس مجلسی', 'formal', 'Gem', 5, 'لباس‌های رسمی و مجلسی کودک', 'https://images.pexels.com/photos/36374320/pexels-photo-36374320.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'),
('کفش', 'shoes', 'Footprints', 6, 'کتانی، کفش اسپرت و مجلسی کودک', 'https://images.pexels.com/photos/9537104/pexels-photo-9537104.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'),
('اکسسوری', 'accessories', 'ShoppingBag', 7, 'کلاه، کیف و اکسسوری‌های کودک', 'https://images.pexels.com/photos/2271522/pexels-photo-2271522.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940');

-- ─────────────────────────────────────────────
-- محصولات (۱۸ کالا با تصاویر واقعی)
-- ─────────────────────────────────────────────
INSERT INTO products (name, slug, description, price, discount_price, category_id, stock, sizes, colors, images, rating, review_count, sales_count, is_new, is_offer, is_featured) VALUES
('پیراهن مجلسی سلطنتی صورتی آرگونا', 'royal-pink-gown', 'پیراهن مجلسی دخترانه از پارچه ابریشم و تور فرانسوی با گلدوزی دستی؛ آستر لطیف و سازگار با پوست حساس کودک دارد.', 4850000, 3890000, 5, 32, '["4-5","6-7","8-9","10-11"]', '[{"name":"صورتی","hex":"#f2a7c3"},{"name":"بژ","hex":"#e6d3b8"}]', '["https://images.pexels.com/photos/36374320/pexels-photo-36374320.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]', 4.9, 128, 542, 1, 1, 1),
('سارافون گلدار وینتاج رزالی', 'vintage-floral-pinafore', 'سارافون گلدار با الگوی کلاسیک وینتاج، دوخت فرانسوی با بندهای قابل تنظیم؛ همراه با پیراهن سفید حریر هدیه‌ای.', 3200000, NULL, 5, 41, '["3-4","5-6","7-8","9-10"]', '[{"name":"گلدار کرمی","hex":"#d9c6a5"}]', '["https://images.pexels.com/photos/29668588/pexels-photo-29668588.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]', 4.8, 96, 388, 1, 0, 1),
('پیراهن سفید مهمانی ملکه بالن‌ها', 'balloon-queen-white-dress', 'پیراهن سفید کوتاه آستین‌بالنی با دامن پفی لایه‌لایه؛ انتخابی رویایی برای مهمانی‌ها. تل و تاج هدیه داخل بسته ارسال می‌شود.', 5600000, 4480000, 5, 25, '["3-4","5-6","7-8"]', '[{"name":"سفید","hex":"#ffffff"}]', '["https://images.pexels.com/photos/33939726/pexels-photo-33939726.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]', 5.0, 74, 260, 0, 1, 1),
('کت و شلوار رسمی مشکی پسرانه آرش', 'arash-black-suit', 'کت و شلوار دو دکمه از پارچه فاستونی ایتالیایی با پنج‌جیب دوزی اصیل؛ مناسب مراسم عقد، تولد و عکاسی رسمی.', 6150000, NULL, 2, 28, '["5-6","7-8","9-10","11-12"]', '[{"name":"مشکی","hex":"#1c1c1e"}]', '["https://images.pexels.com/photos/30690921/pexels-photo-30690921.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]', 4.9, 152, 471, 0, 0, 1),
('کت تک سرمه‌ای پسرانه با اسلش جین', 'navy-blazer-boy', 'کت تک اسپرت سرمه‌ای با یقه آرگونا و دکمه‌های طلایی؛ قابل ست شدن با جین و کتان. آستر نخی ضد حساسیت.', 3890000, NULL, 2, 36, '["4-5","6-7","8-9","10-11"]', '[{"name":"سرمه‌ای","hex":"#22344f"}]', '["https://images.pexels.com/photos/30690920/pexels-photo-30690920.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]', 4.7, 88, 342, 0, 0, 0),
('ست کت و شلوار پاپیون‌دار پسرانه بارون', 'baron-bowtie-suit', 'ست سه تیکه کت، شلوار و پاپیون قرمز طرح چهارخانه؛ طراحی اروپایی با دوختی لطیف برای مهمانی‌های رسمی.', 5280000, 4590000, 2, 22, '["4-5","6-7","8-9"]', '[{"name":"مشکی","hex":"#1c1c1e"}]', '["https://images.pexels.com/photos/36909815/pexels-photo-36909815.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]', 4.8, 64, 215, 1, 1, 0),
('تیشرت اسپرت پسرانه طرح رِد وال', 'redwall-sport-tee', 'تیشرت پنبه‌ای ۱۰۰٪ با چاپ مقاوم و دوردوزی شده؛ خنک، لطیف و مناسب استفاده روزمره و ورزش.', 890000, 690000, 2, 120, '["4-5","6-7","8-9","10-11","12-13"]', '[{"name":"زرشکی","hex":"#a93226"},{"name":"آبی","hex":"#2e6da4"}]', '["https://images.pexels.com/photos/28644436/pexels-photo-28644436.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]', 4.6, 210, 830, 1, 1, 0),
('کاپشن صورتی کلاسیک بچگانه هاوانا', 'havana-pink-coat', 'کاپشن زمستانی با عایق پر طبیعی، ضد آب و ضد باد؛ داخل با پشم مرینو آستر شده است.', 2750000, NULL, 3, 47, '["3-4","5-6","7-8","9-10"]', '[{"name":"صورتی","hex":"#f4a7b9"},{"name":"قرمز","hex":"#d94f4f"}]', '["https://images.pexels.com/photos/29224161/pexels-photo-29224161.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]', 4.9, 167, 689, 0, 0, 1),
('کاپشن قرمز ورزشی دخترانه پیک', 'red-parka-girl', 'کاپشن اسپرت قرمز با کلاه خزدار جداشونده؛ سبک و گرم با زیپ فلزی ضدزنگ. مناسب بازی در فضای باز و برف.', 2350000, 1980000, 3, 58, '["2-3","4-5","6-7","8-9"]', '[{"name":"قرمز","hex":"#d43a3a"}]', '["https://images.pexels.com/photos/11111822/pexels-photo-11111822.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]', 4.7, 134, 512, 1, 1, 1),
('کاپشن نارنجی ماجراجو بچگانه اکسپلورر', 'explorer-orange-jacket', 'کاپشن فلوئورسنت نارنجی با رفلکتور ایمنی در تاریکی؛ انتخابی عالی برای کودکان پرانرژی. جیب‌های زیپ‌دار ضد آب.', 2600000, NULL, 3, 64, '["2-3","4-5","6-7","8-9"]', '[{"name":"نارنجی","hex":"#e2703a"}]', '["https://images.pexels.com/photos/30003587/pexels-photo-30003587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]', 4.5, 91, 296, 0, 0, 0),
('پالتو صورتی نوزاد زمستانی بیبی‌رز', 'baby-rose-winter-coat', 'پالتو پشمی نوزاد با کلاه گوش‌دار و دستکش دو دکمه؛ از پارچه نرم ضدحساسیت با آستر فلانل. مناسب ۰ تا ۲۴ ماه.', 1980000, NULL, 4, 73, '["0-6m","6-12m","12-24m"]', '[{"name":"صورتی","hex":"#f7c6d0"}]', '["https://images.pexels.com/photos/36508024/pexels-photo-36508024.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]', 4.9, 143, 604, 1, 0, 1),
('پیراهن آبی استودیو دخترانه آرمیتا', 'armita-blue-dress', 'پیراهن آبی کاربنی با پایه‌ی ویسکوز لطیف و کمر کشی؛ مناسب مهمانی و عکاسی. دوخت دقیق و رنگ ثابت در شستشو.', 1450000, NULL, 1, 85, '["3-4","5-6","7-8","9-10"]', '[{"name":"آبی","hex":"#4a6fa5"}]', '["https://images.pexels.com/photos/12159459/pexels-photo-12159459.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]', 4.6, 112, 458, 1, 0, 0),
('پیراهن سفید تور و پاپیون دخترانه رها', 'raha-tulle-dress', 'پیراهن مجلسی لایه‌ای با تور فرانسوی و پاپیون مخملی؛ با پاپیون یدکی اضافه. مناسب مراسم رسمی و عکاسی تولد.', 4950000, 3960000, 1, 29, '["4-5","6-7","8-9"]', '[{"name":"سفید","hex":"#ffffff"},{"name":"زرشکی","hex":"#8e2a3c"}]', '["https://images.pexels.com/photos/14897706/pexels-photo-14897706.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]', 4.8, 79, 238, 0, 1, 0),
('کفش ورزشی خاکستری سامیکس رانر', 'samix-gray-runner', 'کفش ورزشی با زیره EVA سبک و انعطاف‌پذیر؛ تهویه عالی و پنجه پهن مناسب رشد طبیعی پا.', 1740000, NULL, 6, 95, '["28","30","32","34","36"]', '[{"name":"خاکستری","hex":"#8a8d91"}]', '["https://images.pexels.com/photos/9537104/pexels-photo-9537104.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]', 4.7, 189, 720, 0, 0, 0),
('کتانی قرمز نوزاد پاپی‌فیت', 'papy-fit-red-sneaker', 'کتانی نوزادی با زیره نرم ابری و چسبک قابل تنظیم؛ اولین کفش ایده‌آل برای نوزادان در حال راه‌افتادن.', 950000, 790000, 6, 110, '["17","18","19","20"]', '[{"name":"قرمز","hex":"#c0392b"}]', '["https://images.pexels.com/photos/2271522/pexels-photo-2271522.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]', 4.8, 156, 815, 0, 1, 0),
('کتانی سفید مینی رانر استار', 'mini-star-white-sneaker', 'کتانی سفید تمام‌چرم با دوخت دودوزی و زیره لاستیکی ضد لغزش؛ مناسب مدرسه و روزمره. همراه با بند اضافه.', 1290000, NULL, 6, 78, '["25","27","29","31","33"]', '[{"name":"سفید","hex":"#ffffff"}]', '["https://images.pexels.com/photos/5275386/pexels-photo-5275386.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]', 4.5, 121, 540, 1, 0, 1),
('ست نامیکی دو تیکه بچگانه مارین', 'marine-nautical-set', 'ست دو تیکه بلوز راه‌راه ملوانی و شلوارک کتان؛ پارچه خنک تابستانی با دوخت تقویت‌شده. مناسب ست دونفره.', 1680000, NULL, 3, 88, '["4-5","6-7","8-9","10-11"]', '[{"name":"سرمه‌ای-سفید","hex":"#22344f"}]', '["https://images.pexels.com/photos/1620759/pexels-photo-1620759.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]', 4.8, 148, 633, 0, 0, 1),
('پیراهن تور عاجی نوزاد پرنسس آوا', 'ava-ivory-tulle', 'پیراهن بلند تور عاجی با سنگ‌دوزی ظریف و تل پاپیون هدیه؛ انتخابی رویایی برای عکاسی و جشن‌های نوزادی.', 3350000, 2680000, 4, 34, '["6-12m","12-24m"]', '[{"name":"عاجی","hex":"#efe6d8"}]', '["https://images.pexels.com/photos/29610395/pexels-photo-29610395.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"]', 4.9, 87, 265, 1, 1, 0);

-- ─────────────────────────────────────────────
-- نظرات نمونه
-- ─────────────────────────────────────────────
INSERT INTO reviews (product_id, user_id, author_name, rating, comment) VALUES
(1, 2, 'سارا محمدی', 5, 'پارچه و دوخت فوق‌العاده بود، دخترم عاشق پیراهن شد. بسته‌بندی هم عالی بود.'),
(1, NULL, 'مریم کاظمی', 5, 'دقیقاً مثل عکس‌هاست؛ گلدوزی‌ها خیلی تمیز کار شده.'),
(4, 2, 'سارا محمدی', 5, 'برای عکاسی رسمی پسرم گرفتم؛ همه از شدت خوش‌تیپی تعجب کردند!'),
(4, NULL, 'رضا توکلی', 4, 'کیفیت خوب، فقط کمی دم‌پا بلند بود که خیاط کوتاه کرد.'),
(8, NULL, 'لیلا احمدی', 5, 'خیلی گرم و سبک است، برای برف کاملاً مناسبه.'),
(15, NULL, 'الهه نوری', 5, 'اولین کفش پسرم؛ زیره‌اش واقعاً نرمه و پای بچه رو اذیت نمی‌کنه.');

-- ─────────────────────────────────────────────
-- سفارش نمونه برای سارا
-- ─────────────────────────────────────────────
INSERT INTO orders (user_id, total, status, customer_name, phone, address, note, payment_method) VALUES
(2, 4280000, 'delivered', 'سارا محمدی', '09121234567', 'تهران، سعادت‌آباد، خیابان سرو شرقی، کوچه ۱۷، پلاک ۴', 'لطفاً قبل از ارسال هماهنگ کنید.', 'online');
SET @oid = LAST_INSERT_ID();
INSERT INTO order_items (order_id, product_id, name, image, price, quantity, size, color) VALUES
(@oid, 1, 'پیراهن مجلسی سلطنتی صورتی آرگونا', 'https://images.pexels.com/photos/36374320/pexels-photo-36374320.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 3890000, 1, '6-7', 'صورتی'),
(@oid, 7, 'تیشرت اسپرت پسرانه طرح رِد وال', 'https://images.pexels.com/photos/28644436/pexels-photo-28644436.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 390000, 1, '6-7', 'زرشکی');

-- ─────────────────────────────────────────────
-- مطالب وبلاگ
-- ─────────────────────────────────────────────
INSERT INTO blog_posts (title, slug, excerpt, content, image, tag, views) VALUES
('اصول انتخاب لباس مجلسی مناسب کودک برای مراسم رسمی', 'kids-formal-dress-guide', 'از انتخاب پارچه تا سایزبندی درست؛ هر آنچه قبل از خرید لباس مجلسی کودک باید بدانید.', 'انتخاب لباس مجلسی برای کودکان فقط مسئله ظاهر نیست؛ راحتی، جنس پارچه و دوخت تمیز اهمیت اصلی را دارد. پارچه‌های ویسکوز و پنبه مخلوط برای مهمانی‌های طولانی گزینه‌های بهتری هستند چون تنفس‌پذیرند و حساسیت ایجاد نمی‌کنند.\n\nهنگام خرید، یک سایز بالاتر انتخاب کنید چون کودکان به سرعت رشد می‌کنند. همچنین از یقه‌های سفت و دوخت‌های زبر که پوست گردن را می‌خراشد پرهیز کنید.\n\nدر پایان، حتماً رنگ و فرم را با موقعیت مراسم هماهنگ کنید؛ برای عصرها رنگ‌های تیره و برای روز رنگ‌های روشن و شاد مناسب‌ترند.', 'https://images.pexels.com/photos/33939726/pexels-photo-33939726.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'راهنمای خرید', 3421),
('چطور کفش استاندارد برای رشد پای کودک انتخاب کنیم؟', 'right-shoes-for-kids', 'پنج نکته طلایی برای انتخاب کفش سالم که قدم‌های اول را برای فرزندتان خاطره‌انگیز می‌کند.', 'پای کودک تا ۱۲ سالگی در حال رشد است و پاافزار نامناسب می‌تواند باعث مشکلات اسکلتی شود. پنجه کفش باید حداقل یک سانتی‌متر فضا داشته باشد و پاشنه بیش از دو سانتی‌متر نباشد.\n\nزیره EVA با انعطاف مناسب بهترین انتخاب است. کفشی که خم نمی‌شود، پای کودک را خسته می‌کند.\n\nخرید کفش ارتوپدی برای کودکان سالم ضروری نیست، اما در ناهنجاری‌های کف پا حتماً با پزشک ارتوپد مشورت کنید.', 'https://images.pexels.com/photos/30395128/pexels-photo-30395128.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'سلامت کودک', 2874),
('ترندهای پاییز و زمستان مد کودک در سال ۲۰۲۶', 'fall-winter-2026-trends', 'از پالت رنگ‌های خاکی تا پارچه‌های بازیافتی؛ مهم‌ترین ترندهای امسال را بشناسید.', 'پالت رنگ فصل جاری بر پایه خاکی، کاراملی و سبز زیتونی با تأکید بر صورتی گردویی استوار است. برندهای مطرح دنیا به سمت پارچه‌های ارگانیک و بازیافتی رفته‌اند.\n\nکاپشن‌های اورسایز با جزئیات رفلکتور ایمنی و کت تک‌های اسپرت دوطرفه از پرفروش‌ترین آیتم‌های فصل هستند.\n\nدر ایران نیز استقبال از ست‌های خانوادگی و رنگ‌های خنثی با اکسسوری‌های رنگی چشمگیر افزایش یافته است.', 'https://images.pexels.com/photos/35607631/pexels-photo-35607631.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'ترند مد', 4102),
('لباس زمستانی گرم و ایمن؛ راهنمای مادران باهوش', 'winter-clothes-guide', 'لایه‌لایه بپوشانید، هوشمند خرید کنید؛ نکات ایمنی کاپشن و پالتو کودک.', 'قانون سه لایه بهترین راه برای گرم نگه‌داشتن کودک است: لایه اول حرارتی پنبه‌ای، لایه میانی پشمی یا فلانل و لایه بیرونی ضدآب و ضدباد.\n\nاز کلاه‌های بنددار بلند که خطر گره خوردن دارند پرهیز کنید و زیپ‌ها را با محافظ پارچه‌ای بپوشانید.\n\nکاپشن خیلی بزرگ هم به اندازه کاپشن تنگ خطرناک است؛ اندازه بهتر، یک سایز بزرگ‌تر با کمرکشی است.', 'https://images.pexels.com/photos/19579097/pexels-photo-19579097.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'سبک زندگی', 1953);

SET FOREIGN_KEY_CHECKS = 1;
