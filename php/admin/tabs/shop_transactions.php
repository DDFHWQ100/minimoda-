<?php
require __DIR__ . '/../shop-lib.php';
$pdo = db();
$method = trim((string)($_GET['m'] ?? ''));
$validMethod = in_array($method, ['online','onsite','card'], true) ? $method : '';
$txs = $validMethod
    ? $pdo->prepare("SELECT * FROM orders WHERE payment_method = ? ORDER BY id DESC LIMIT 60")
    : null;
if ($txs) { $txs->execute([$validMethod]); $txs = $txs->fetchAll(); } else { $txs = $pdo->query('SELECT * FROM orders ORDER BY id DESC LIMIT 60')->fetchAll(); }
$gross = (float) $pdo->query("SELECT COALESCE(SUM(total),0) FROM orders WHERE status <> 'cancelled'")->fetchColumn();
$online = (float) $pdo->query("SELECT COALESCE(SUM(total),0) FROM orders WHERE status <> 'cancelled' AND payment_method = 'online'")->fetchColumn();
$onsite = (float) $pdo->query("SELECT COALESCE(SUM(total),0) FROM orders WHERE status <> 'cancelled' AND payment_method = 'onsite'")->fetchColumn();
$chip = function (string $label, string $value) use ($method) {
    $active = $method === $value || ($value === '' && $method === '');
    return '<a class="adm-btn ' . ($active ? 'adm-btn-navy' : 'adm-btn-ghost') . ' adm-btn-sm" href="index.php?tab=shop_transactions&m=' . $value . '">' . $label . '</a>';
};
$paymentLabels = ['online' => 'آنلاین', 'onsite' => 'درب منزل', 'card' => 'کارت به کارت'];
?>
<h1 class="adm-h1">امور مالی و تراکنش‌ها</h1>
<p class="adm-sub">خلاصه مالی فروشگاه + دفتر تراکنش‌ها (۶۰ تراکنش آخر)</p>
<div class="adm-stats" style="margin-top:12px">
  <?= shopStat('فروش ناخالص', faMoney($gross), 'green') ?>
  <?= shopStat('پرداخت آنلاین', faMoney($online)) ?>
  <?= shopStat('پرداخت درب منزل', faMoney($onsite)) ?>
</div>
<div class="adm-row" style="gap:6px;margin:12px 0"><?= $chip('همه', '') ?><?= $chip('آنلاین', 'online') ?><?= $chip('درب منزل', 'onsite') ?><?= $chip('کارت به کارت', 'card') ?></div>
<div class="adm-card" style="overflow-x:auto">
  <table class="adm-table">
    <thead><tr><th>سفارش</th><th>تاریخ</th><th>مشتری</th><th>روش</th><th>وضعیت</th><th>مبلغ</th></tr></thead>
    <tbody>
      <?php foreach ($txs as $o): ?>
        <tr><td><b>#MM-<?= faDigits(str_pad((string)$o['id'], 5, '0', STR_PAD_LEFT)) ?></b></td><td><?= faDate($o['created_at']) ?></td><td><?= e($o['customer_name']) ?></td><td><?= e($paymentLabels[$o['payment_method']] ?? $o['payment_method']) ?></td><td><?= e(shopOrderStatus($o['status'])) ?></td><td><b><?= faMoney($o['total']) ?></b></td></tr>
      <?php endforeach; ?>
      <?php if (!$txs): ?><tr><td colspan="6" style="text-align:center;color:#9ca3af;padding:30px">تراکنشی یافت نشد.</td></tr><?php endif; ?>
    </tbody>
  </table>
</div>
