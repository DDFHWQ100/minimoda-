<?php
require __DIR__ . '/../shop-lib.php';
$pdo = db();
$has = shopHasTable('discount_codes');
$codes = $has ? $pdo->query('SELECT * FROM discount_codes ORDER BY id DESC')->fetchAll() : [];
?>
<h1 class="adm-h1">کدهای تخفیف</h1>
<p class="adm-sub"><?= faNum(count($codes)) ?> کد — فعال/غیرفعال، حذف و ثبت کد جدید</p>
<?php if (!$has): ?><div class="adm-flash is-error">جدول discount_codes وجود ندارد؛ فایل database.sql جدید را ایمپورت کنید.</div><?php else: ?>
<div class="adm-grid-2">
  <div class="adm-card" style="overflow-x:auto">
    <table class="adm-table">
      <thead><tr><th>کد</th><th>مقدار</th><th>حداقل خرید</th><th>استفاده</th><th>وضعیت</th><th>حذف</th></tr></thead>
      <tbody>
        <?php foreach ($codes as $c): ?>
          <tr>
            <td><code dir="ltr" style="font-weight:900;background:#f1f5f9;border-radius:8px;padding:2px 8px"><?= e($c['code']) ?></code></td>
            <td><?= $c['type'] === 'percent' ? faNum($c['value']) . '٪' : faMoney($c['value']) ?></td>
            <td><?= $c['min_order'] > 0 ? faMoney($c['min_order']) : '—' ?></td>
            <td><?= faNum($c['used_count']) ?> / <?= faNum($c['max_uses']) ?></td>
            <td><form method="post" style="display:inline"><?= csrfField() ?><input type="hidden" name="action" value="shop_toggle"><input type="hidden" name="table" value="discount_codes"><input type="hidden" name="field" value="active"><input type="hidden" name="id" value="<?= (int)$c['id'] ?>"><button class="adm-btn adm-btn-ghost adm-btn-sm"><?= $c['active'] ? 'فعال' : 'خاموش' ?></button></form></td>
            <td><form method="post" onsubmit="return confirm('کد <?= e($c['code']) ?> حذف شود؟')"><?= csrfField() ?><input type="hidden" name="action" value="shop_delete"><input type="hidden" name="table" value="discount_codes"><input type="hidden" name="id" value="<?= (int)$c['id'] ?>"><button class="adm-btn adm-btn-danger adm-btn-sm">حذف</button></form></td>
          </tr>
        <?php endforeach; ?>
        <?php if (!$codes): ?><tr><td colspan="6" style="text-align:center;color:#9ca3af;padding:30px">کدی ثبت نشده.</td></tr><?php endif; ?>
      </tbody>
    </table>
  </div>
  <form method="post" class="adm-card">
    <?= csrfField() ?><input type="hidden" name="action" value="shop_create_discount">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">ایجاد کد تخفیف جدید</h3>
    <label class="adm-field"><span>کد (انگلیسی) *</span><input class="adm-input" name="code" dir="ltr" required placeholder="SAVE20"></label>
    <div class="adm-row" style="gap:8px">
      <label class="adm-field" style="flex:1"><span>نوع</span><select class="adm-select" name="type"><option value="percent">درصدی</option><option value="fixed">مبلغ ثابت (تومان)</option></select></label>
      <label class="adm-field" style="flex:1"><span>مقدار</span><input class="adm-input" type="number" name="value" required min="1" dir="ltr" placeholder="20"></label>
    </div>
    <div class="adm-row" style="gap:8px">
      <label class="adm-field" style="flex:1"><span>حداقل خرید (تومان)</span><input class="adm-input" type="number" name="min_order" min="0" dir="ltr" value="0"></label>
      <label class="adm-field" style="flex:1"><span>حداکثر استفاده</span><input class="adm-input" type="number" name="max_uses" min="1" dir="ltr" value="100"></label>
    </div>
    <label class="adm-field"><span>انقضا (خالی = بدون تاریخ)</span><input class="adm-input" type="date" name="expires_at" dir="ltr"></label>
    <button class="adm-btn adm-btn-primary" style="width:100%">ثبت کد</button>
  </form>
</div>
<?php endif; ?>
