<?php
require __DIR__ . '/../shop-lib.php';
$pdo = db();
$has = shopHasTable('shipping_methods');
$methods = $has ? $pdo->query('SELECT * FROM shipping_methods ORDER BY sort ASC, id ASC')->fetchAll() : [];
?>
<h1 class="adm-h1">ارسال و حمل‌ونقل</h1>
<p class="adm-sub">روش‌های ارسال فعال فروشگاه — هزینه، زمان تحویل و فعال/غیرفعال</p>
<?php if (!$has): ?><div class="adm-flash is-error">جدول shipping_methods وجود ندارد؛ فایل database.sql جدید را ایمپورت کنید.</div><?php else: ?>
<div class="adm-grid-2">
  <div class="adm-card">
    <ul class="adm-list">
      <?php foreach ($methods as $m): ?>
        <li style="<?= $m['active'] ? '' : 'opacity:.5' ?>"><span class="grow"><b><?= e($m['name']) ?></b><small>هزینه: <?= $m['cost'] == 0 ? 'رایگان' : faMoney($m['cost']) ?> · تحویل <?= faNum($m['eta_days']) ?> روز · رایگان بالای <?= $m['free_over'] > 0 ? faMoney($m['free_over']) : '—' ?></small></span>
          <span class="adm-row" style="gap:4px">
            <form method="post" style="display:inline"><?= csrfField() ?><input type="hidden" name="action" value="shop_toggle"><input type="hidden" name="table" value="shipping_methods"><input type="hidden" name="field" value="active"><input type="hidden" name="id" value="<?= (int)$m['id'] ?>"><button class="adm-btn adm-btn-ghost adm-btn-sm"><?= $m['active'] ? 'فعال' : 'خاموش' ?></button></form>
            <form method="post" onsubmit="return confirm('روش «<?= e($m['name']) ?>» حذف شود؟')"><?= csrfField() ?><input type="hidden" name="action" value="shop_delete"><input type="hidden" name="table" value="shipping_methods"><input type="hidden" name="id" value="<?= (int)$m['id'] ?>"><button class="adm-btn adm-btn-danger adm-btn-sm">حذف</button></form>
          </span></li>
      <?php endforeach; ?>
      <?php if (!$methods): ?><li class="adm-note">روشی ثبت نشده.</li><?php endif; ?>
    </ul>
  </div>
  <form method="post" class="adm-card">
    <?= csrfField() ?><input type="hidden" name="action" value="shop_create_shipping">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">افزودن روش ارسال</h3>
    <label class="adm-field"><span>نام *</span><input class="adm-input" name="name" required placeholder="مثلاً: پیک اختصاصی جوادیه"></label>
    <div class="adm-row" style="gap:8px">
      <label class="adm-field" style="flex:1"><span>هزینه (تومان)</span><input class="adm-input" type="number" name="cost" required min="0" dir="ltr" value="45000"></label>
      <label class="adm-field" style="flex:1"><span>تحویل (روز)</span><input class="adm-input" type="number" name="eta_days" required min="1" dir="ltr" value="2"></label>
    </div>
    <label class="adm-field"><span>رایگان برای خرید بالای (تومان — صفر = بدون شرط)</span><input class="adm-input" type="number" name="free_over" min="0" dir="ltr" value="2000000"></label>
    <button class="adm-btn adm-btn-primary" style="width:100%">ثبت روش ارسال</button>
  </form>
</div>
<?php endif; ?>
