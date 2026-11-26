<?php
require __DIR__ . '/../shop-lib.php';
$pdo = db();
$products = $pdo->query('SELECT id, name, stock FROM products ORDER BY stock ASC, id ASC')->fetchAll();
$hasMovements = shopHasTable('stock_movements');
$movements = $hasMovements ? $pdo->query('SELECT m.*, p.name AS pname FROM stock_movements m LEFT JOIN products p ON p.id = m.product_id ORDER BY m.id DESC LIMIT 12')->fetchAll() : [];
?>
<h1 class="adm-h1">انبار و موجودی</h1>
<p class="adm-sub">اصلاح موجودی هر محصول + ثبت حرکت انبار + هشدار کالاهای رو به اتمام</p>

<div class="adm-grid-2">
  <div class="adm-card" style="overflow-x:auto">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">موجودی کالاها (<?= faNum(count($products)) ?>)</h3>
    <table class="adm-table">
      <thead><tr><th>محصول</th><th>موجودی</th><th>اصلاح</th></tr></thead>
      <tbody>
        <?php foreach ($products as $p): ?>
          <tr>
            <td><?= e($p['name']) ?></td>
            <td><b style="color:<?= $p['stock'] <= 10 ? '#dc2626' : '#059669' ?>"><?= faNum($p['stock']) ?></b></td>
            <td>
              <form method="post" class="adm-row" style="gap:6px"><?= csrfField() ?><input type="hidden" name="action" value="shop_set_stock"><input type="hidden" name="id" value="<?= (int)$p['id'] ?>">
                <input class="adm-input" type="number" name="stock" min="0" dir="ltr" value="<?= (int)$p['stock'] ?>" style="height:34px;width:80px;text-align:center">
                <button class="adm-btn adm-btn-primary adm-btn-sm">ثبت</button>
              </form>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>

  <div>
    <form method="post" class="adm-card" style="margin-bottom:12px">
      <?= csrfField() ?><input type="hidden" name="action" value="shop_adjust_stock">
      <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">ثبت ورود/خروج انبار</h3>
      <label class="adm-field"><span>محصول</span><select class="adm-select" name="product_id" required><?php foreach ($products as $p): ?><option value="<?= (int)$p['id'] ?>"><?= e($p['name']) ?></option><?php endforeach; ?></select></label>
      <div class="adm-row" style="gap:8px">
        <label class="adm-field" style="flex:1"><span>مقدار (+ ورود / − خروج)</span><input class="adm-input" type="number" name="delta" required dir="ltr" placeholder="مثال: 20 یا -5"></label>
        <label class="adm-field" style="flex:1"><span>علت</span><select class="adm-select" name="reason"><option>ورود از تأمین‌کننده</option><option>فروش</option><option>مرجوعی مشتری</option><option>اصلاح موجودی</option><option>کالای معیوب</option></select></label>
      </div>
      <label class="adm-field"><span>توضیحات</span><input class="adm-input" name="note" placeholder="شماره فاکتور، انباردار..."></label>
      <button class="adm-btn adm-btn-primary" style="width:100%">ثبت در دفتر انبار</button>
    </form>

    <div class="adm-card">
      <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">دفتر انبار (آخرین ۱۲ حرکت)</h3>
      <ul class="adm-list">
        <?php foreach ($movements as $m): $in = $m['delta'] >= 0; ?>
          <li><span style="color:<?= $in ? '#059669' : '#dc2626' ?>;font-weight:900;direction:ltr"><?= $in ? '+' : '' ?><?= faNum($m['delta']) ?></span><span class="grow"><b><?= e($m['reason']) ?></b><small><?= e($m['pname'] ?? 'کل انبار') ?> — <?= e($m['note']) ?></small></span><small><?= faDate($m['created_at']) ?></small></li>
        <?php endforeach; ?>
        <?php if (!$movements): ?><li class="adm-note">حرکتی ثبت نشده.</li><?php endif; ?>
      </ul>
    </div>
  </div>
</div>
