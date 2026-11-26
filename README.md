# 👑 مینی‌مودا (MiniModa) — فروشگاه آنلاین پوشاک کودک و نوجوان

فروشگاه اینترنتی کامل مد و پوشاک کودک با **پنل مدیریت ۲۳ بخشی** و **سیستم مدیریت قالب و پوسته** — در دو نسخه:

| نسخه | تکنولوژی | مناسب برای |
|---|---|---|
| **کامل** (پوشه اصلی) | Next.js 16 + PostgreSQL + Drizzle ORM | سرور VPS / Vercel / هر هاست Node.js |
| **PHP** (پوشه `php/`) | PHP 7.4+ + MySQL | هاست اشتراکی، cPanel، XAMPP |

## ⬇️ دانلود سریع
- **کل پروژه:** دکمه سبز **Code → Download ZIP** در بالای همین صفحه
- **فقط نسخه PHP:** [`public/downloads/minimoda-php.zip`](public/downloads/minimoda-php.zip)
- **نسخه کامل فشرده:** [`public/downloads/minimoda-full.zip`](public/downloads/minimoda-full.zip)

---

## 🚀 نصب نسخه کامل (Next.js + PostgreSQL)

### پیش‌نیازها
- Node.js 18 یا بالاتر
- PostgreSQL 14 یا بالاتر

### مراحل
```bash
# ۱) نصب وابستگی‌ها
npm install

# ۲) تنظیم دیتابیس
cp .env.example .env
# DATABASE_URL را با اطلاعات دیتابیس خودتان جایگزین کنید:
# DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/minimoda

# ۳) ساخت جداول
npx drizzle-kit push

# ۴) درج داده‌های نمونه
npx tsx src/db/seed.ts
npx tsx src/db/seed-theme.ts
npx tsx src/db/seed-admin-extras.ts
npx tsx src/db/seed-completion.ts

# ۵) اجرا
npm run dev                  # توسعه — http://localhost:3000
npm run build && npm start   # تولید
```

### حساب‌های آزمایشی
| نقش | ایمیل | رمز |
|---|---|---|
| مدیر | `admin@minimoda.ir` | `admin123` |
| مشتری | `sara@example.com` | `user123` |

⚠️ **بعد از نصب روی سرور واقعی حتماً رمز مدیر را عوض کنید** و در `.env` مقدار `ADMIN_DEMO_OPEN=false` باشد.

---

## 🐘 نصب نسخه PHP (هاست اشتراکی / XAMPP)

راهنمای کامل در [`php/README.md`](php/README.md). خلاصه:

1. محتویات پوشه `php/` را در `public_html` (یا `htdocs/minimoda`) کپی کنید
2. در phpMyAdmin یک دیتابیس بسازید و `database/database.sql` را Import کنید
3. `php/config.php` را با اطلاعات دیتابیس ویرایش کنید
4. `check.php` را در مرورگر باز کنید تا نصب خودکار بررسی شود

---

## ✨ امکانات

### ویترین فروشگاه
- طراحی کاملاً فارسی و راست‌چین (RTL) با فونت وزیرمتن
- اسلایدر هیرو، دسته‌بندی‌های گرد، بنرهای تبلیغاتی، کارت محصول با تخفیف و امتیاز
- کاتالوگ با فیلتر و صفحه‌بندی · صفحه محصول با گالری تا ۱۰ تصویر
- سبد خرید، تسویه حساب، حساب کاربری، وبلاگ، صفحات محتوا، FAQ، خبرنامه

### پنل مدیریت (`/admin`) — ۲۳ بخش
داشبورد · گزارش‌ها (+ CSV) · سفارش‌ها · تخفیف‌ها · کمپین‌ها · ارسال · مرجوعی · امور مالی · محصولات · انبار و موجودی تنوع‌ها · دسته‌بندی‌های محبوب · جدول سایزبندی · برندها · تأمین‌کنندگان · مشتریان · نظرات · پیام‌ها · بلاگ · صفحات محتوا · کاربران و دسترسی · امنیت · اعلان‌ها · تنظیمات

### مدیریت قالب و پوسته (`/admin/theme`)
تغییر زنده رنگ/فونت/گردی · ۳ قالب آماده · بنرها و اجزای صفحه اصلی · ویرایشگر CSS/JS · مدیریت فایل‌ها · سئو · پشتیبان‌گیری · گزارش فعالیت · حالت تعمیر

---

## 🗂 ساختار پروژه
```
├── src/app/          صفحات و API (admin/ و api/)
├── src/components/   کامپوننت‌های UI
├── src/db/           schema + seed scripts
├── src/lib/          auth, theme engine, helpers
├── php/              نسخه PHP مستقل
├── database/         database.sql برای MySQL
└── public/           تصاویر و فایل‌های دانلود
```

## 🔒 امنیت
رمزها هش‌شده (scrypt/bcrypt) · CSRF · اعتبارسنجی سمت سرور · Prepared Statements · کنترل دسترسی مدیر · Audit Log · اسکن فایل‌های آپلودی

## آپدیت: نصب با دیتابیس کامل (یسان با پیش‌نمایش زنده)

فایل `database/full-backup.sql` نسخهٔ کامل دیتابیس فعلی است (اسکیما + تمام داده‌ها + تنظیمات قالب مثل رنگ‌ها `#1b3a6b/#e91e63/#ffc107`، نوار اطلاع‌رسان و ردیف‌های دسته‌بندی). برای این‌که نصب شما دقیقاً مثل پیش‌نمایش دیده شود:

```bash
psql postgresql://USER:PASS@localhost:5432/minimoda < database/full-backup.sql
```

(یا در pgAdmin / phpMyAdmin به‌عنوان فایل SQL import کنید.)
