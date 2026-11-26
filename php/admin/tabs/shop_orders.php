<?php
require __DIR__ . '/../shop-lib.php';
$pdo = db();
$PER_PAGE = 30;
$page = max(1, (int)($_GET['page'] ?? 1));
$q = mb_substr(trim((string)($_GET['q'] ?? '')), 0, 60);
$status = trim((string)($_GET['status'] ?? ''));
$validStatus = in_array($status, ['pending','processing','shipped','delivered','cancelled'], true) ? $status : '';

$where = []; $params = [];
if ($validStatus) { $where[] = 'status = ?'; $params[] = $validStatus; }
if ($q !== '') {
    $where[] = '(customer_name LIKE ? OR phone LIKE ? OR address LIKE ? OR CAST(id AS CHAR) LIKE ?)';
    $like = '%' . $q . '%';
    $params = array_merge($params, [$like, $like, $like, $like]);
}
$whereSql = $where ? 'WHERE ' . implode(' AND ', $where) : '';
$stC = $pdo->prepare("SELECT COUNT(*) FROM orders $whereSql");
$stC->execute($params);
$total = (int) $stC->fetchColumn();
$totalPages = max(1, (int) ceil($total / $PER_PAGE));
$page = min($page, $totalPages);
$offset = ($page - 1) * $PER_PAGE;
$st = $pdo->prepare("SELECT * FROM orders $whereSql ORDER BY created_at DESC LIMIT $PER_PAGE OFFSET $offset");
$st->execute($params);
$orders = $st->fetchAll();
$itemsByOrder = [];
if ($orders) {
    $ids = array_map('intval', array_column($orders, 'id'));
    $in = implode(',', $ids);
    foreach ($pdo->query("SELECT * FROM order_items WHERE order_id IN ($in)") as $item) {
        $itemsByOrder[(int)$item['order_id']][] = $item;
    }
}
$statusLabels = ['pending' => 'در انتظار پرداخت', 'processing' => 'آماده‌سازی', 'shipped' => 'ارسال شده', 'delivered' => 'تحویل شده', 'cancelled' => 'لغو شده'];
$from = $total === 0 ? 0 : $offset + 1;
$to = $offset + count($orders);
?>
<h1 class="adm-h1">مدیریت سفارش‌ها</h1>
<p class="adm-sub">نمایش <b><?= faNum($from) ?> تا <?= faNum($to) ?></b> از <b><?= faNum($total) ?></b> سفارش — ۳۰ سفارش در هر صفحه</p>

<form method="get" class="adm-row" style="margin-bottom:12px;gap:8px;flex-wrap:wrap">
  <input type="hidden" name="tab" value="shop_orders">
  <input class="adm-input" type="text" name="q" value="<?= e($q) ?>" placeholder="جستجو: نام، موبایل، آدرس یا شماره سفارش..." style="flex:1;min-width:220px;height:40px">
  <select class="adm-select" name="status" style="width:auto;height:40px" onchange="this.form.submit()">
    <option value="">همه وضعیت‌ها</option>
    <?php foreach ($statusLabels as $k => $l): ?><option value="<?= e($k) ?>" <?= $validStatus === $k ? 'selected' : '' ?>><?= e($l) ?></option><?php endforeach; ?>
  </select>
  <button class="adm-btn adm-btn-primary" type="submit">جستجو</button>
  <?php if ($q || $validStatus): ?><a class="adm-btn adm-btn-ghost" href="index.php?tab=shop_orders">حذف فیلتر</a><?php endif; ?>
</form>

<?php if (!$orders): ?><div class="adm-card" style="text-align:center;color:#9ca3af;padding:40px">سفارشی با این مشخصات یافت نشد.</div><?php endif; ?>

<?php foreach ($orders as $o): $its = $itemsByOrder[(int)$o['id']] ?? []; ?>
  <article class="adm-card" style="padding:0;overflow:hidden;margin-bottom:10px">
    <header class="adm-row" style="justify-content:space-between;padding:8px 14px;background:#f8f9fc;border-bottom:1px solid var(--line);font-size:10px;flex-wrap:wrap;gap:6px">
      <span><b>#MM-<?= faDigits(str_pad((string)$o['id'], 5, '0', STR_PAD_LEFT)) ?></b> · <?= faDate($o['created_at']) ?> · <?= e(shopPaymentLabel($o['payment_method'])) ?></span>
      <form method="post" class="adm-row" style="gap:6px"><?= csrfField() ?><input type="hidden" name="action" value="shop_set_status"><input type="hidden" name="entity" value="orders"><input type="hidden" name="id" value="<?= (int)$o['id'] ?>">
        <select class="adm-select" name="status" onchange="this.form.submit()" style="height:32px;width:auto;font-size:10px">
          <?php foreach ($statusLabels as $k => $l): ?><option value="<?= e($k) ?>" <?= $o['status'] === $k ? 'selected' : '' ?>><?= e($l) ?></option><?php endforeach; ?>
        </select>
      </form>
    </header>
    <div class="adm-row" style="padding:10px 14px;gap:12px;align-items:center">
      <div class="adm-row" style="flex:1;overflow:auto;gap:6px">
        <?php foreach ($its as $item): ?>
          <img src="<?= e($item['image'] ?: '../assets/images/ref-hero.jpg') ?>" alt="<?= e($item['name']) ?>" title="<?= e($item['name']) ?> ×<?= (int)$item['quantity'] ?>" style="width:52px;height:64px;object-fit:cover;border-radius:10px;background:#f6f4ef">
        <?php endforeach; ?>
        <?php if (!$its): ?><span style="color:#9ca3af;font-size:10px">قلمی ثبت نشده</span><?php endif; ?>
      </div>
      <div style="font-size:10px;min-width:170px">
        <b style="color:var(--navy);font-size:11px"><?= e($o['customer_name']) ?></b><br>
        <span dir="ltr" style="color:#6b7280"><?= e($o['phone']) ?></span><br>
        <span style="color:#6b7280"><?= e(mb_substr($o['address'], 0, 55)) ?><?= mb_strlen($o['address']) > 55 ? '…' : '' ?></span><br>
        <b style="color:var(--navy);font-size:12px"><?= faMoney($o['total']) ?></b>
      </div>
    </div>
  </article>
<?php endforeach; ?>

<?php
if ($totalPages > 1) {
    echo shopPagination('shop_orders', $page, $totalPages, ['q' => $q, 'status' => $validStatus]);
}
