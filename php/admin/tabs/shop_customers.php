<?php
require __DIR__ . '/../shop-lib.php';
$pdo = db();
$q = mb_substr(trim((string)($_GET['q'] ?? '')), 0, 60);
$like = $q !== '' ? '%' . $q . '%' : '';
$sql = "SELECT phone, MIN(customer_name) AS name, COUNT(*) AS orders_count,
               COALESCE(SUM(total),0) AS total_spent, MAX(created_at) AS last_order, MIN(created_at) AS first_order
        FROM orders " . ($q !== '' ? "WHERE phone LIKE ? OR customer_name LIKE ?" : "") . "
        GROUP BY phone ORDER BY SUM(total) DESC LIMIT 100";
$st = $pdo->prepare($sql);
$st->execute($q !== '' ? [$like, $like] : []);
$customers = $st->fetchAll();
$registered = (int) $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
?>
<h1 class="adm-h1">مدیریت مشتریان</h1>
<p class="adm-sub"><?= faNum(count($customers)) ?> مشتری یکتا (بر اساس موبایل) · <?= faNum($registered) ?> کاربر ثبت‌نامی</p>
<form method="get" class="adm-row" style="margin-bottom:12px;gap:8px">
  <input type="hidden" name="tab" value="shop_customers">
  <input class="adm-input" type="text" name="q" value="<?= e($q) ?>" placeholder="جستجوی نام یا موبایل..." style="flex:1;min-width:220px;height:40px">
  <button class="adm-btn adm-btn-primary" type="submit">جستجو</button>
  <?php if ($q): ?><a class="adm-btn adm-btn-ghost" href="index.php?tab=shop_customers">حذف فیلتر</a><?php endif; ?>
</form>
<div class="adm-card" style="overflow-x:auto">
  <table class="adm-table">
    <thead><tr><th>مشتری</th><th>موبایل</th><th>سفارش‌ها</th><th>مجموع خرید</th><th>آخرین سفارش</th></tr></thead>
    <tbody>
      <?php foreach ($customers as $c): $vip = (float)$c['total_spent'] >= 8000000; ?>
        <tr>
          <td><div class="adm-row" style="gap:8px"><span style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#fce7f3,#fed7aa);display:grid;place-items:center;font-weight:900;color:#be185d"><?= e(mb_substr(trim((string)$c['name']), 0, 1)) ?></span><span><b><?= e($c['name']) ?></b><?= $vip ? ' <span title="مشتری VIP" style="color:#f59e0b">★</span>' : '' ?></span></div></td>
          <td dir="ltr"><?= e($c['phone']) ?></td>
          <td><?= faNum($c['orders_count']) ?></td>
          <td><b style="color:#059669"><?= faMoney($c['total_spent']) ?></b></td>
          <td><?= faDate($c['last_order']) ?></td>
        </tr>
      <?php endforeach; ?>
      <?php if (!$customers): ?><tr><td colspan="5" style="text-align:center;color:#9ca3af;padding:30px">مشتری‌ای یافت نشد.</td></tr><?php endif; ?>
    </tbody>
  </table>
</div>
