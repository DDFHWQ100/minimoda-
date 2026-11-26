<?php
require __DIR__ . '/../shop-lib.php';
$pdo = db();
$has = shopHasTable('returns_requests');
$rows = $has ? $pdo->query('SELECT r.*, o.customer_name, o.total FROM returns_requests r JOIN orders o ON o.id = r.order_id ORDER BY r.id DESC')->fetchAll() : [];
?>
<h1 class="adm-h1">مرجوعی و تعویض کالا</h1>
<p class="adm-sub"><?= faNum(count($rows)) ?> درخواست — تغییر وضعیت از «در انتظار» تا «انجام شد»</p>
<?php if (!$has): ?><div class="adm-flash is-error">جدول returns_requests وجود ندارد؛ فایل database.sql جدید را ایمپورت کنید.</div><?php else: ?>
<div class="adm-card" style="overflow-x:auto">
  <table class="adm-table">
    <thead><tr><th>سفارش</th><th>نوع</th><th>دلیل</th><th>مبلغ سفارش</th><th>وضعیت</th></tr></thead>
    <tbody>
      <?php foreach ($rows as $r): ?>
        <tr>
          <td><b>#MM-<?= faDigits(str_pad((string)$r['order_id'], 5, '0', STR_PAD_LEFT)) ?></b><br><small><?= e($r['customer_name']) ?></small></td>
          <td><?= $r['type'] === 'refund' ? 'بازپرداخت' : 'تعویض' ?></td>
          <td><?= e($r['reason']) ?><?= $r['note'] ? '<br><small style="color:#6b7280">' . e($r['note']) . '</small>' : '' ?></td>
          <td><?= faMoney($r['total']) ?></td>
          <td><form method="post"><?= csrfField() ?><input type="hidden" name="action" value="shop_set_status"><input type="hidden" name="entity" value="returns_requests"><input type="hidden" name="id" value="<?= (int)$r['id'] ?>">
            <select class="adm-select" name="status" onchange="this.form.submit()" style="height:32px;width:auto;font-size:10px">
              <?php foreach (['requested' => 'در انتظار بررسی', 'approved' => 'تأیید شده', 'rejected' => 'رد شده', 'done' => 'انجام شد'] as $k => $l): ?><option value="<?= e($k) ?>" <?= $r['status'] === $k ? 'selected' : '' ?>><?= e($l) ?></option><?php endforeach; ?>
            </select>
          </form></td>
        </tr>
      <?php endforeach; ?>
      <?php if (!$rows): ?><tr><td colspan="5" style="text-align:center;color:#9ca3af;padding:30px">درخواستی ثبت نشده.</td></tr><?php endif; ?>
    </tbody>
  </table>
</div>
<?php endif; ?>
