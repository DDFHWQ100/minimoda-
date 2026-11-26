<?php
require __DIR__ . '/../shop-lib.php';
$pdo = db();
$has = shopHasTable('size_charts');
$charts = $has ? $pdo->query('SELECT * FROM size_charts ORDER BY id ASC')->fetchAll() : [];
?>
<h1 class="adm-h1">جدول‌های سایزبندی</h1>
<p class="adm-sub"><?= faNum(count($charts)) ?> جدول — مرجع اندازه‌گیری سایزهای پوشاک کودک و نوزاد</p>
<?php if (!$has): ?><div class="adm-flash is-error">جدول size_charts وجود ندارد؛ فایل database.sql جدید را ایمپورت کنید.</div><?php else: ?>
<div class="adm-grid-2">
  <div style="display:grid;gap:12px;align-content:start">
    <?php foreach ($charts as $c): $rows = json_decode($c['rows_json'], true) ?: []; ?>
      <div class="adm-card" style="padding:0;overflow:hidden;<?= $c['active'] ? '' : 'opacity:.55' ?>">
        <div class="adm-row" style="justify-content:space-between;padding:10px 14px;background:#f8f9fc;border-bottom:1px solid var(--line)"><b style="color:var(--navy)"><?= e($c['name']) ?></b>
          <span class="adm-row" style="gap:4px">
            <form method="post" style="display:inline"><?= csrfField() ?><input type="hidden" name="action" value="shop_toggle"><input type="hidden" name="table" value="size_charts"><input type="hidden" name="field" value="active"><input type="hidden" name="id" value="<?= (int)$c['id'] ?>"><button class="adm-btn adm-btn-ghost adm-btn-sm"><?= $c['active'] ? 'فعال' : 'خاموش' ?></button></form>
            <form method="post" onsubmit="return confirm('جدول «<?= e($c['name']) ?>» حذف شود؟')"><?= csrfField() ?><input type="hidden" name="action" value="shop_delete"><input type="hidden" name="table" value="size_charts"><input type="hidden" name="id" value="<?= (int)$c['id'] ?>"><button class="adm-btn adm-btn-danger adm-btn-sm">حذف</button></form>
          </span>
        </div>
        <table class="adm-table"><thead><tr><th>سایز</th><th>قد</th><th>دور سینه</th><th>دور کمر</th></tr></thead><tbody>
          <?php foreach ($rows as $r): ?><tr><td><b><?= e($r['size'] ?? '') ?></b></td><td><?= e($r['height'] ?? '') ?></td><td><?= e($r['chest'] ?? '') ?></td><td><?= e($r['waist'] ?? '') ?></td></tr><?php endforeach; ?>
        </tbody></table>
      </div>
    <?php endforeach; ?>
    <?php if (!$charts): ?><p class="adm-note">جدولی ثبت نشده.</p><?php endif; ?>
  </div>
  <form method="post" class="adm-card">
    <?= csrfField() ?><input type="hidden" name="action" value="shop_create_sizechart">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">ایجاد جدول سایزبندی</h3>
    <label class="adm-field"><span>نام *</span><input class="adm-input" name="name" required placeholder="مثلاً: جدول سایزبندی کودک"></label>
    <label class="adm-field"><span>ردیف‌ها (JSON) *</span><textarea class="adm-textarea code" name="rows_json" required rows="10" placeholder='[{"size":"4-5","height":"104-110","chest":"60-62","waist":"54-56"}]'></textarea></label>
    <button class="adm-btn adm-btn-primary" style="width:100%">ثبت جدول</button>
  </form>
</div>
<?php endif; ?>
