<?php
// خروجی CSV سفارش‌ها — جدای از پنل، فقط مدیر
require dirname(__DIR__) . '/bootstrap.php';
require __DIR__ . '/shop-lib.php';
if (!currentUser() || !isAdmin()) { http_response_code(403); exit('دسترسی غیرمجاز'); }
$pdo = db();
$rows = $pdo->query('SELECT * FROM orders ORDER BY id DESC LIMIT 5000')->fetchAll();
$items = [];
foreach ($pdo->query('SELECT order_id, SUM(quantity) q FROM order_items GROUP BY order_id') as $r) { $items[(int)$r['order_id']] = (int)$r['q']; }
$paymentLabels = ['online' => 'آنلاین (زرین‌پال)', 'onsite' => 'درب منزل', 'card' => 'کارت به کارت'];
$statusLabels = ['pending' => 'در انتظار پرداخت', 'processing' => 'در حال آماده‌سازی', 'shipped' => 'ارسال شده', 'delivered' => 'تحویل داده شد', 'cancelled' => 'لغو شده'];
$esc = function ($v) { $s = (string)$v; return preg_match('/[",\n]/', $s) ? '"' . str_replace('"', '""', $s) . '"' : $s; };
$header = implode(',', ['شماره سفارش','تاریخ','مشتری','موبایل','آدرس','روش پرداخت','وضعیت','تعداد قلم','مبلغ (تومان)']);
$lines = [$header];
$fmt = new DateTimeZone('Asia/Tehran');
foreach ($rows as $o) {
    $lines[] = implode(',', array_map($esc, [
        'MM-' . str_pad((string)$o['id'], 5, '0', STR_PAD_LEFT),
        date('Y/m/d H:i', strtotime($o['created_at'])),
        $o['customer_name'], $o['phone'], $o['address'],
        $paymentLabels[$o['payment_method']] ?? $o['payment_method'],
        $statusLabels[$o['status']] ?? $o['status'],
        $items[(int)$o['id']] ?? 0,
        (int)$o['total'],
    ]));
}
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="minimoda-orders-' . date('Y-m-d') . '.csv"');
echo "\u{FEFF}" . implode("\r\n", $lines);
exit;
