<?php
require __DIR__ . '/../shop-lib.php';
$pdo = db();
$rev = (float) $pdo->query("SELECT COALESCE(SUM(total),0) FROM orders WHERE status <> 'cancelled'")->fetchColumn();
$cnt = (int) $pdo->query("SELECT COUNT(*) FROM orders WHERE status <> 'cancelled'")->fetchColumn();
$avgBasket = $cnt > 0 ? (int) ($rev / $cnt) : 0;
$customers = (int) $pdo->query('SELECT COUNT(DISTINCT phone) FROM orders')->fetchColumn();
$daily = $pdo->query("SELECT DATE(created_at) AS d, COALESCE(SUM(total),0) AS t, COUNT(*) AS c FROM orders WHERE status <> 'cancelled' AND created_at > DATE_SUB(NOW(), INTERVAL 14 DAY) GROUP BY DATE(created_at) ORDER BY d ASC")->fetchAll();
$maxDay = 1; foreach ($daily as $d) { $maxDay = max($maxDay, (int) $d['t']); }
$topProducts = $pdo->query('SELECT name, sales_count FROM products ORDER BY sales_count DESC LIMIT 5')->fetchAll();
$maxSales = 1; foreach ($topProducts as $p) { $maxSales = max($maxSales, (int) $p['sales_count']); }
$topCats = $pdo->query("SELECT c.name, COALESCE(SUM(oi.price * oi.quantity),0) AS rev FROM order_items oi JOIN products p ON p.id = oi.product_id JOIN categories c ON c.id = p.category_id GROUP BY c.name ORDER BY rev DESC LIMIT 6")->fetchAll();
$maxCat = 1; foreach ($topCats as $c) { $maxCat = max($maxCat, (int) $c['rev']); }
?>
<div class="adm-row" style="justify-content:space-between;flex-wrap:wrap;gap:8px">
  <div><h1 class="adm-h1">گزارش‌ها و تحلیل فروش</h1><p class="adm-sub">۱۴ روز اخیر — داده واقعی + خروجی CSV</p></div>
  <a class="adm-btn adm-btn-navy" href="shop_export.php">خروجی CSV (Excel)</a>
</div>
<div class="adm-stats" style="margin-top:12px">
  <?= shopStat('فروش ۱۴ روز اخیر', faMoney($rev)) ?>
  <?= shopStat('تعداد سفارش‌ها', faNum($cnt)) ?>
  <?= shopStat('میانگین سبد خرید', faMoney($avgBasket)) ?>
  <?= shopStat('مشتریان یکتا', faNum($customers)) ?>
</div>
<div class="adm-grid-2" style="margin-top:14px">
  <div class="adm-card">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">روند فروش روزانه</h3>
    <div style="display:flex;align-items:flex-end;gap:4px;height:140px;border-bottom:1px solid var(--line);padding-bottom:4px;overflow-x:auto">
      <?php foreach ($daily as $d): $h = (int)(((int)$d['t'] / $maxDay) * 120); ?>
        <div title="<?= e($d['d']) ?> — <?= faMoney($d['t']) ?> (<?= faNum($d['c']) ?> سفارش)" style="flex:1;min-width:14px;height:<?= max(2,$h) ?>px;background:linear-gradient(180deg,#f472b6,#e91e63);border-radius:4px 4px 0 0"></div>
      <?php endforeach; ?>
      <?php if (!$daily): ?><p style="color:#9ca3af;font-size:11px;margin:auto">در این بازه فروشی ثبت نشده.</p><?php endif; ?>
    </div>
    <small style="color:#9ca3af;display:block;margin-top:4px">هر ستون = یک روز (هاور کنید برای مبلغ دقیق)</small>
  </div>
  <div class="adm-card">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">پرفروش‌ترین محصولات</h3>
    <?php foreach ($topProducts as $p): $w = (int)(((int)$p['sales_count'] / $maxSales) * 100); ?>
      <div style="margin-bottom:8px;font-size:10px"><div class="adm-row" style="justify-content:space-between"><b><?= e($p['name']) ?></b><b><?= faNum($p['sales_count']) ?> فروش</b></div><div style="height:8px;background:#eef0f5;border-radius:99px;overflow:hidden"><div style="width:<?= $w ?>%;height:100%;background:linear-gradient(90deg,#fbbf24,#f59e0b)"></div></div></div>
    <?php endforeach; ?>
  </div>
</div>
<div class="adm-card" style="margin-top:12px">
  <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">سهم دسته‌بندی‌ها از درآمد</h3>
  <?php foreach ($topCats as $c): $w = (int)(((int)$c['rev'] / $maxCat) * 100); ?>
    <div style="margin-bottom:8px;font-size:10px"><div class="adm-row" style="justify-content:space-between"><b><?= e($c['name']) ?></b><b><?= faMoney($c['rev']) ?></b></div><div style="height:8px;background:#eef0f5;border-radius:99px;overflow:hidden"><div style="width:<?= $w ?>%;height:100%;background:linear-gradient(90deg,#34d399,#0d9488)"></div></div></div>
  <?php endforeach; ?>
  <?php if (!$topCats): ?><p style="color:#9ca3af">داده‌ای ثبت نشده.</p><?php endif; ?>
</div>
