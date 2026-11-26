<?php
/**
 * MiniModa — بررسی خودکار نصب روی سرور/زامپ
 * این فایل را یک‌بار در مرورگر باز کنید: http://localhost/check.php
 * (یا http://localhost/minimoda/check.php اگر در زیرپوشه نصب کردید)
 * بعد از نصب موفق، این فایل را از سرور حذف کنید.
 */
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>بررسی نصب مینی‌مودا</title>
<link rel="stylesheet" href="assets/style.css">
<style>
  body { background: #f3f4f8; padding: 24px 12px; }
  .check-wrap { max-width: 720px; margin: 0 auto; }
  .check-card { background: #fff; border: 1px solid #e6e8ee; border-radius: 18px; padding: 16px 18px; margin-bottom: 12px; box-shadow: 0 4px 14px -8px rgba(20,38,74,.3); }
  .check-row { display: flex; justify-content: space-between; gap: 12px; padding: 8px 4px; border-bottom: 1px dashed #eef0f5; font-size: 12px; }
  .check-row:last-child { border-bottom: 0; }
  .ok { color: #059669; font-weight: 900; }
  .bad { color: #dc2626; font-weight: 900; }
  h1 { color: #14264a; font-size: 20px; }
  pre { background: #0e1c36; color: #fcd34d; padding: 12px; border-radius: 12px; direction: ltr; text-align: left; font-size: 11px; overflow: auto; }
</style>
</head>
<body>
<div class="check-wrap">
  <h1>بررسی خودکار نصب مینی‌مودا</h1>

<?php
$rows = [];
$ok = function (bool $cond, string $label, string $failAdvice = '') use (&$rows) {
    $rows[] = [$cond, $label, $failAdvice];
};

// ۱) نسخه پی‌اچ‌پی
$ok(version_compare(PHP_VERSION, '7.4.0', '>='), 'نسخه PHP مناسب است (' . PHP_VERSION . ')', 'PHP 7.4 یا بالاتر نصب کنید. در XAMPP آخرین نسخه را از apachefriends.org بگیرید.');

// ۲) افزونه‌ها
foreach (['pdo_mysql' => 'اتصال به MySQL', 'mbstring' => 'متن فارسی', 'json' => 'JSON', 'session' => 'سبد خرید و ورود'] as $ext => $label) {
    $ok(extension_loaded($ext), 'افزونه ' . $ext . ' — ' . $label, 'در php.ini (XAMPP: C:\\xampp\\php\\php.ini) خط ; را از ابتدای extension=' . $ext . ' بردارید و Apache را Restart کنید.');
}

// ۳) اتصال دیتابیس
$dbOk = false;
$dbError = '';
try {
    require __DIR__ . '/config.php';
    $pdo = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4', DB_USER, DB_PASS, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $dbOk = true;
} catch (Throwable $ex) {
    $dbError = $ex->getMessage();
}
$ok($dbOk, 'اتصال به دیتابیس برقرار شد', 'خطا: ' . $dbError . "\n→ اطلاعات DB_HOST / DB_NAME / DB_USER / DB_PASS در فایل config.php را چک کنید. در XAMPP معمولاً: localhost / root / بدون رمز / نام دیتابیسی که ساختید.");

// ۴) جداول و داده‌ها
$tableCounts = [];
if ($dbOk) {
    foreach (['users', 'categories', 'products', 'orders', 'order_items', 'reviews', 'blog_posts', 'newsletter_subscribers'] as $t) {
        try {
            $count = (int) $pdo->query('SELECT COUNT(*) FROM `' . $t . '`')->fetchColumn();
            $tableCounts[$t] = $count;
        } catch (Throwable $ex) {
            $tableCounts[$t] = null;
        }
    }
    $allTables = array_filter($tableCounts, fn($v) => $v !== null);
    $ok(count($allTables) === 8, 'هر ۸ جدول دیتابیس وجود دارد', 'جداول ناقص‌اند؛ فایل database.sql را دوباره در phpMyAdmin ایمپورت کنید.');
    $ok(($tableCounts['products'] ?? 0) >= 18, 'محصولات نمونه ایمپورت شده‌اند (' . faNumSafe($tableCounts['products'] ?? 0) . ' کالا)', 'جدول products خالی است؛ database.sql را دوباره ایمپورت کنید.');
    $ok(($tableCounts['users'] ?? 0) >= 1, 'کاربر مدیر ساخته شده است', 'database.sql را دوباره ایمپورت کنید.');
}

function faNumSafe(mixed $n): string { return (string) $n; }
?>

<div class="check-card">
  <?php $allOk = true; foreach ($rows as [$cond, $label, $advice]): $allOk = $allOk && $cond; ?>
    <div class="check-row">
      <span><?= htmlspecialchars($label, ENT_QUOTES, 'UTF-8') ?></span>
      <span class="<?= $cond ? 'ok' : 'bad' ?>"><?= $cond ? '✓ اوکی' : '✗ مشکل دارد' ?></span>
    </div>
  <?php endforeach; ?>
</div>

<?php foreach ($rows as [$cond, $label, $advice]): if (!$cond && $advice): ?>
  <div class="check-card"><pre><?= htmlspecialchars($advice, ENT_QUOTES, 'UTF-8') ?></pre></div>
<?php endif; endforeach; ?>

<?php if ($dbOk && $tableCounts): ?>
  <div class="check-card">
    <strong style="color:#14264a">وضعیت داده‌ها:</strong>
    <?php foreach ($tableCounts as $t => $c): ?>
      <div class="check-row"><span dir="ltr"><?= htmlspecialchars($t, ENT_QUOTES, 'UTF-8') ?></span><span class="<?= $c === null ? 'bad' : 'ok' ?>"><?= $c === null ? 'وجود ندارد' : $c . ' ردیف' ?></span></div>
    <?php endforeach; ?>
  </div>
<?php endif; ?>

<div class="check-card" style="text-align:center">
  <?php if ($allOk): ?>
    <h2 style="color:#059669;margin:6px 0">همه‌چیز درست است!</h2>
    <p><a href="index.php" style="display:inline-block;background:#14264a;color:#fcd34d;padding:12px 28px;border-radius:14px;text-decoration:none;font-weight:900">ورود به فروشگاه ←</a></p>
    <p class="muted" style="font-size:10px">حساب مدیر: admin@minimoda.ir — رمز admin123</p>
    <p style="color:#dc2626;font-size:11px;font-weight:700">بعد از نصب موفق، این فایل (check.php) را از روی سرور حذف کنید.</p>
  <?php else: ?>
    <h2 style="color:#dc2626;margin:6px 0">هنوز کامل نشده — موارد قرمز بالا را برطرف کنید</h2>
    <p style="font-size:11px;color:#4b5563">اگر نمی‌دانید کدام مرحله را اشتباه انجام داده‌اید، خروجی این صفحه را برای پشتیبانی بفرستید.</p>
  <?php endif; ?>
</div>

</div>
</body>
</html>
