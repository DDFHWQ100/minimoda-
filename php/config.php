<?php
// ══════════════════════════════════════════════════════════════
//  MiniModa — تنظیمات دیتابیس
//  بعد از آپلود روی هاست، فقط همین مقادیر را از پنل هاست (cPanel/DirectAdmin)
//  جایگزین کنید. اطلاعات را می‌توانید در بخش «MySQL Databases» پیدا کنید.
// ══════════════════════════════════════════════════════════════

// هاست دیتابیس — در اکثر هاست‌های اشتراکی «localhost» است
define('DB_HOST', 'localhost');

// نام دیتابیسی که در phpMyAdmin ساختید (معمولاً با پیشوند نام کاربری، مثل: cpaneluser_minimoda)
define('DB_NAME', 'minimoda');

// نام کاربری دیتابیس (معمولاً مثل: cpaneluser_minimoda)
define('DB_USER', 'root');

// رمز عبور کاربر دیتابیس
define('DB_PASS', '');

define('DB_CHARSET', 'utf8mb4');

// آدرس کامل سایت بدون اسلش آخر، مثال: https://minimoda.ir
define('SITE_URL', 'http://localhost');

// ارسال رایگان بالای این مبلغ (تومان)
define('FREE_SHIPPING_AT', 2000000);

// هزینه ارسال سفارش‌های کوچکتر (تومان)
define('SHIPPING_COST', 45000);
