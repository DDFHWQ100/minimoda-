<?php
require __DIR__ . '/../shop-lib.php';
$pdo = db();
$has = shopHasTable('campaigns');
$codes = $has && shopHasTable('discount_codes') ? $pdo->query('SELECT id, code FROM discount_codes ORDER BY id DESC')->fetchAll() : [];
$all = $has ? $pdo->query('SELECT * FROM campaigns ORDER BY id DESC')->fetchAll() : [];
?>
<h1 class="adm-h1">بازاریابی و کمپین‌ها</h1>
<p class="adm-sub"><?= faNum(count($all)) ?> کمپین — بازه زمانی، بنر و کد تخفیف مرتبط</p>
<?php if (!$has): ?><div class="adm-flash is-error">جدول campaigns وجود ندارد؛ فایل database.sql جدید را ایمپورت کنید.</div><?php else: ?>
<div class="adm-grid-2">
  <div class="adm-card">
    <ul class="adm-list">
      <?php foreach ($all as $c): $live = $c['active'] && (!$c['start_at'] || $c['start_at'] <= date('Y-m-d H:i:s')) && (!$c['end_at'] || $c['end_at'] >= date('Y-m-d H:i:s')); ?>
        <li style="<?= $c['active'] ? '' : 'opacity:.5' ?>">
          <?php if ($c['banner_image']): ?><img src="<?= e($c['banner_image']) ?>" alt="" style="width:88px;height:56px;object-fit:cover;border-radius:10px"><?php endif; ?>
          <span class="grow"><b><?= e($c['title']) ?></b><small><?= e(mb_substr($c['description'], 0, 70)) ?></small><?php if ($live): ?><small style="color:#059669;font-weight:900">● در حال اجرا</small><?php endif; ?></span>
          <span class="adm-row" style="gap:4px">
            <form method="post" style="display:inline"><?= csrfField() ?><input type="hidden" name="action" value="shop_toggle"><input type="hidden" name="table" value="campaigns"><input type="hidden" name="field" value="active"><input type="hidden" name="id" value="<?= (int)$c['id'] ?>"><button class="adm-btn adm-btn-ghost adm-btn-sm"><?= $c['active'] ? 'فعال' : 'خاموش' ?></button></form>
            <form method="post" onsubmit="return confirm('کمپین «<?= e($c['title']) ?>» حذف شود؟')"><?= csrfField() ?><input type="hidden" name="action" value="shop_delete"><input type="hidden" name="table" value="campaigns"><input type="hidden" name="id" value="<?= (int)$c['id'] ?>"><button class="adm-btn adm-btn-danger adm-btn-sm">حذف</button></form>
          </span>
        </li>
      <?php endforeach; ?>
      <?php if (!$all): ?><li class="adm-note">کمپینی ثبت نشده.</li><?php endif; ?>
    </ul>
  </div>
  <form method="post" class="adm-card">
    <?= csrfField() ?><input type="hidden" name="action" value="shop_create_campaign">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">ایجاد کمپین</h3>
    <label class="adm-field"><span>عنوان کمپین *</span><input class="adm-input" name="title" required placeholder="مثلاً: جشنواره تابستانی"></label>
    <label class="adm-field"><span>توضیحات</span><textarea class="adm-textarea" name="description" placeholder="شرح کمپین..."></textarea></label>
    <label class="adm-field"><span>آدرس بنر (URL)</span><input class="adm-input" name="banner_image" dir="ltr" placeholder="https://..."></label>
    <div class="adm-row" style="gap:8px">
      <label class="adm-field" style="flex:1"><span>شروع</span><input class="adm-input" type="date" name="start_at" dir="ltr"></label>
      <label class="adm-field" style="flex:1"><span>پایان</span><input class="adm-input" type="date" name="end_at" dir="ltr"></label>
    </div>
    <label class="adm-field"><span>کد تخفیف مرتبط</span><select class="adm-select" name="discount_code_id"><option value="0">بدون کد</option><?php foreach ($codes as $c): ?><option value="<?= (int)$c['id'] ?>"><?= e($c['code']) ?></option><?php endforeach; ?></select></label>
    <button class="adm-btn adm-btn-primary" style="width:100%">ثبت کمپین</button>
  </form>
</div>
<?php endif; ?>
