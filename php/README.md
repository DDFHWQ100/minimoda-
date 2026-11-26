# مینی‌مودا (MiniModa) — نسخه PHP + MySQL

فروشگاه کامل آنلاین لباس کودک با **PHP خام + MySQL**؛ مناسب XAMPP (ویندوز)، هاست‌های اشتراکی و سرور لینوکس.

اگر بعد از نصب «Not Found» دیدید → بخش **«رفع خطای Not Found»** را در همین فایل بخوانید.
اگر می‌خواهید همه‌چیز خودکار بررسی شود → فایل **check.php** را در مرورگر باز کنید؛ هر مشکلی باشد دقیق می‌گوید کدام مرحله است.

---

## 🚀 راه‌اندازی روی XAMPP ویندوز (راهنمای تصویری مرحله‌به‌مرحله)

### قدم ۱ — نصب XAMPP
از [apachefriends.org](https://www.apachefriends.org) نسخه آخر XAMPP را نصب کنید (مسیر پیش‌فرض: `C:\xampp`).
XAMPP Control Panel را باز کنید و دکمه‌های **Start** را برای **Apache** و **MySQL** بزنید (باید سبز شوند).

### قدم ۲ — کپی کردن فایل‌های فروشگاه در htdocs
فایل‌های پوشه `php/` را در مسیر htdocs کپی کنید. **دو حالت معتبر:**

**حالت A — فروشگاه در ریشه (آدرس: http://localhost/)**
```
C:\xampp\htdocs\index.php     ← همین‌جا باید باشد
C:\xampp\htdocs\config.php
C:\xampp\htdocs\cart.php
C:\xampp\htdocs\assets\...
...
```

**حالت B — فروشگاه در زیرپوشه (آدرس: http://localhost/minimoda/)**
```
C:\xampp\htdocs\minimoda\index.php
C:\xampp\htdocs\minimoda\config.php
...
```

⚠️ **اشتباه رایج:** کپی کردن خود پوشه `php` بدون تغییر نام داخل `htdocs` و بعد باز کردن `http://localhost/` → باعث **Not Found** می‌شود، چون فایل اصلی `index.php` در ریشه وجود ندارد.

### قدم ۳ — ساخت دیتابیس
1. مرورگر را باز کنید: **http://localhost/phpmyadmin**
2. از ستون چپ روی **New** کلیک کنید.
3. نام دیتابیس: `minimoda` — Collation: `utf8mb4_unicode_ci` → **Create**.
4. دیتابیس `minimoda` را از ستون چپ انتخاب کنید.
5. تب **Import** → روی **Choose File** بزنید → فایل `database.sql` را انتخاب کنید → **Go**.
6. باید ببینید: ۸ جدول ساخته و ۱۸ محصول + کاربران ایمپورت شد.

### قدم ۴ — ویرایش config.php
فایل `config.php` را با Notepad باز کنید. برای XAMPP معمولاً **هیچ تغییری لازم نیست** چون پیش‌فرض همین است:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'minimoda');
define('DB_USER', 'root');
define('DB_PASS', '');        // رمز root در XAMPP خالی است
```

فقط اگر نام دیتابیس را چیز دیگری گذاشتید، `DB_NAME` را همان کنید. اگر اتصال با `localhost` خطا داد، `DB_HOST` را `127.0.0.1` بگذارید.
حتماً فایل را با **Encoding: UTF-8** ذخیره کنید.

### قدم ۵ — تست
آدرس فروشگاه را باز کنید:
- حالت A: **http://localhost/**
- حالت B: **http://localhost/minimoda/**

اگر چیزی ندیدید یا خطا گرفتید: **http://localhost/check.php** را باز کنید — همه چیز را مرحله‌به‌مرحله چک می‌کند.

حساب‌های ورود:
- مدیر: `admin@minimoda.ir` — رمز `admin123` (صفحه مدیریت: **admin.php**)
- مشتری: `sara@example.com` — رمز `user123`

---

## 🧯 رفع خطای «Not Found — The requested URL was not found»

این خطا یعنی Apache فایل را در آن آدرس پیدا نمی‌کند. چک‌لیست:

1. **آدرس را درست بنویسید:** اگر فایل‌ها در `C:\xampp\htdocs\minimoda\` هستند، باید `http://localhost/minimoda/` بنویسید، نه `http://localhost/`.
2. **وجود index.php را بررسی کنید:** در File Explorer بروید به `C:\xampp\htdocs\` — آیا واقعاً `index.php` هست؟ اگر همه فایل‌ها داخل یک پوشه اضافه مثل `C:\xampp\htdocs\php-main\php\` هستند، آدرس باید همان مسیر کامل باشد.
3. **Apache و MySQL را در XAMPP Control Panel روشن کنید** (هر دو سبز).
4. **PHPMyAdmin را چک کنید:** اگر خود http://localhost/phpmyadmin هم Not Found می‌دهد، یعنی کل پوشه htdocs مشکل دارد (مثلاً اشتباهی حذف/جابه‌جا شده) → XAMPP را پاک و دوباره نصب کنید.
5. **کش مرورگر/تبلیغات‌گیر:** یک بار با Ctrl+F5 رفرش کنید یا آدرس را در پنجره ناشناس باز کنید.
6. **پورت تغییر کرده؟** اگر در تنظیمات XAMPP پورت Apache را به 8080 تغییر داده‌اید، آدرس می‌شود `http://localhost:8080/`.
7. بعد از هر جابه‌جایی فایل، **Apache را Stop و دوباره Start کنید.**

اگر همه اینها را چک کردید و باز نشد، خروجی صفحه **check.php** را بفرستید.

## دیگر خطاهای رایج

| خطا | علت / راه‌حل |
|---|---|
| «خطا در اتصال به دیتابیس» | DB_NAME یا DB_USER یا DB_PASS در config.php اشتباه است؛ در XAMPP: `localhost / minimoda / root / (خالی)` |
| صفحه سفید | در php.ini (فهرست `C:\xampp\php\php.ini`) گزینه `display_errors = On` کنید، Apache را ری‌استارت کنید و خطا را ببینید |
| متن‌ها فارسی نیستند / علامت سوال | ایمپورت database.sql با utf8mb4 انجام نشده؛ دیتابیس را پاک و دوباره Import کنید |
| Fatal error: Call to undefined function | افزونه‌ای از PHP فعال نیست؛ در XAMPP مسیر php.ini را باز کنید و `;` را از ابتدای `extension=pdo_mysql` و `extension=mbstring` بردارید |
| فرم‌ها 403 می‌دهند | کوکی سشن بلاک شده؛ از آی‌پی یا دامنه معتبر استفاده کنید، نه دسترسی مستقیم به فایل |

## نصب روی هاست اشتراکی (cPanel/DirectAdmin)

1. در **MySQL Databases**: یک دیتابیس + کاربر بسازید و Add کنید.
2. در **phpMyAdmin**: دیتابیس را انتخاب → Import → `database.sql`.
3. `config.php` را با اطلاعات همان دیتابیس ویرایش کنید (DB_HOST معمولاً `localhost` است).
4. **محتویات** پوشه `php/` را در `public_html` آپلود کنید.
5. سایت را باز کنید → `check.php` → اگر همه ✓ بود، موفق است.

## نکات امنیتی

1. رمز مدیر را بعد از اولین ورود عوض کنید.
2. فایل `check.php` را بعد از نصب **حذف کنید**.
3. فایلها با فلگ‌های `.htaccess` فایل‌های `.sql` و `.md` را از دانلود مستقیم می‌بندند.
4. رمز `root`ی برای MySQL در XAMPP نگذارید اگر فقط روی کامپیوتر خودتان کار می‌کنید؛ برای سرور واقعی حتماً رمز بگذارید و در config.php وارد کنید.

## ساختار پوشه‌ها

```
php/
├── index.php          صفحه اصلی
├── products.php       کاتالوگ + فیلترها
├── product.php        جزئیات محصول + نظرات
├── cart.php           سبد خرید
├── checkout.php       تسویه حساب
├── auth.php           ورود / ثبت‌نام / خروج
├── account.php        پروفایل + سفارش‌ها
├── wishlist.php       علاقه‌مندی‌ها
├── blog.php           وبلاگ
├── help.php           FAQ
├── check.php          بررسی خودکار نصب (بعد از نصب حذف کنید)
├── admin.php          پنل مدیریت (admin.php)
├── config.php         ⟵ تنظیمات دیتابیس
├── bootstrap.php      توابع مشترک
├── database.sql       ساختار + داده نمونه
├── partials/          header.php و footer.php
└── assets/            style.css ، app.js ، تصاویر
```
