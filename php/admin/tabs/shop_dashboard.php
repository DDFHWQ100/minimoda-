<?php
require __DIR__ . '/../shop-lib.php';
$pdo = db();
$rev = (int) $pdo->query("SELECT COALESCE(SUM(total),0) FROM orders WHERE status <> 'cancelled'")->fetchColumn();
$cnt = (int) $pdo->query("SELECT COUNT(*) FROM orders WHERE status <> 'cancelled'")->fetchColumn();
$avg = $cnt > 0 ? (int) ($rev / $cnt) : 0;
$prodCnt = (int) $pdo->query('SELECT COUNT(*) FROM products')->fetchColumn();
$userCnt = (int) $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
$lowStock = (int) $pdo->query('SELECT COUNT(*) FROM products WHERE stock <= 10')->fetchColumn();
$todayRev = (int) $pdo->query("SELECT COALESCE(SUM(total),0) FROM orders WHERE status <> 'cancelled' AND DATE(created_at) = CURDATE()")->fetchColumn();
$newOrders = (int) $pdo->query("SELECT COUNT(*) FROM orders WHERE status = 'processing'")->fetchColumn();
$recent = $pdo->query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 6')->fetchAll();
$top = $pdo->query('SELECT name, sales_count, price FROM products ORDER BY sales_count DESC LIMIT 5')->fetchAll();
$statusLabels = ['pending' => 'در انتظار پرداخت', 'processing' => 'آماده‌سازی', 'shipped' => 'ارسال شده', 'delivered' => 'تحویل شد', 'cancelled' => 'لغو شده'];
?>
<h1 class="adm-h1">داشبورد اصلی فروشگاه</h1>
<p class="adm-sub">نمای کلی از فروش، سفارش‌ها و کالاها — همه اعداد واقعی و زنده از دیتابیس</p>
<div class="adm-stats">
  <?= shopStat('فروش کل', faMoney($rev)) ?>
  <?= shopStat('فروش امروز', faMoney($todayRev), 'green') ?>
  <?= shopStat('تعداد سفارش‌ها', faNum($cnt)) ?>
  <?= shopStat('میانگین سبد خرید', faMoney($avg)) ?>
  <?= shopStat('سفارش‌های در حال آماده‌سازی', faNum($newOrders), 'red') ?>
  <?= shopStat('محصولات', faNum($prodCnt)) ?>
  <?= shopStat('کاربران', faNum($userCnt)) ?>
  <?= shopStat('کالاهای کم‌موجودی', faNum($lowStock), 'red') ?>
</div>

<div class="adm-grid-2" style="margin-top:14px">
  <div class="adm-card">
    <div class="adm-row" style="justify-content:space-between;margin-bottom:8px"><h3 style="margin:0;font-size:13px;color:var(--navy)">سفارش‌های اخیر</h3><a class="adm-btn adm-btn-ghost adm-btn-sm" href="index.php?tab=shop_orders">مدیریت سفارش‌ها ←</a></div>
    <table class="adm-table">
      <thead><tr><th>شماره</th><th>مشتری</th><th>تاریخ</th><th>وضعیت</th><th>مبلغ</th></tr></thead>
      <tbody>
        <?php foreach ($recent as $o): ?>
          <tr><td><b>#MM-<?= faDigits(str_pad((string)$o['id'], 5, '0', STR_PAD_LEFT)) ?></b></td><td><?= e($o['customer_name']) ?></td><td><?= faDate($o['created_at']) ?></td><td><?= e($statusLabels[$o['status']] ?? $o['status']) ?></td><td><?= faMoney($o['total']) ?></td></tr>
        <?php endforeach; ?>
        <?php if (!$recent): ?><tr><td colspan="5" style="text-align:center;color:#9ca3af">سفارشی ثبت نشده است.</td></tr><?php endif; ?>
      </tbody>
    </table>
  </div>
  <div class="adm-card">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">پرفروش‌ترین محصولات</h3>
    <ul class="adm-list">
      <?php foreach ($top as $p): ?>
        <li><span class="grow"><b><?= e($p['name']) ?></b><small><?= faNum($p['sales_count']) ?> فروش · <?= faMoney($p['price']) ?></small></span></li>
      <?php endforeach; ?>
      <?php if (!$top): ?><li class="adm-note">هنوز فروشی ثبت نشده.</li><?php endif; ?>
    </ul>
  </div>
</div>
