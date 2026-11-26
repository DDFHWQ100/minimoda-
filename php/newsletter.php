<?php
require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect('index.php');
}
csrfCheck();
$email = strtolower(trim((string)($_POST['email'] ?? '')));
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    flash('ایمیل واردشده نامعتبر است.', 'error');
} else {
    try {
        $st = db()->prepare('INSERT IGNORE INTO newsletter_subscribers (email) VALUES (?)');
        $st->execute([$email]);
        flash('عضویت شما در خبرنامه ثبت شد ✓');
    } catch (Throwable $ex) {
        flash('ثبت عضویت با خطا مواجه شد.', 'error');
    }
}
$back = (string)($_SERVER['HTTP_REFERER'] ?? 'index.php');
// فقط مسیرهای داخلی مجاز هستند (جلوگیری از open redirect)
$host = $_SERVER['HTTP_HOST'] ?? '';
if ($back === '' || (stripos($back, 'http') === 0 && $host !== '' && stripos($back, '://' . $host) === false && stripos($back, '://' . preg_replace('/:\d+$/', '', $host)) === false)) {
    $back = 'index.php';
}
if (stripos($back, 'subscribed=') === false) {
    $back .= (strpos($back, '?') !== false ? '&' : '?') . 'subscribed=1';
}
redirect($back);
