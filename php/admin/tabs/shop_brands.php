<?php
require __DIR__ . '/../shop-lib.php';
$pdo = db();
$has = shopHasTable('brands');
$all = $has ? $pdo->query('SELECT * FROM brands ORDER BY id ASC')->fetchAll() : [];
?>
<h1 class="adm-h1">برندهای فروشگاه</h1>
<p class="adm-sub"><?= faNum(count($all)) ?> برند ثبت‌شده — هویت تولیدکنندگان پوشاک</p>
<?php if (!$has): ?><div class="adm-flash is-error">جدول brands وجود ندارد؛ فایل database.sql جدید را ایمپورت کنید.</div><?php else: ?>
<div class="adm-grid-2">
  <div class="adm-grid-3">
    <?php foreach ($all as $b): ?>
      <div class="adm-card">
        <div class="adm-row" style="justify-content:space-between"><div class="adm-row" style="gap:10px"><span style="width:44px;height:44px;border-radius:12px;background:#fef3c7;display:grid;place-items:center;font-weight:900;color:#92400e;font-size:17px"><?= e(mb_substr(trim($b['name']), 0, 1)) ?></span><b style="color:var(--navy);font-size:12px"><?= e($b['name']) ?></b></div>
          <form method="post" onsubmit="return confirm('برند «<?= e($b['name']) ?>» حذف شود؟')"><?= csrfField() ?><input type="hidden" name="action" value="shop_delete"><input type="hidden" name="table" value="brands"><input type="hidden" name="id" value="<?= (int)$b['id'] ?>"><button class="adm-btn adm-btn-danger adm-btn-sm">حذف</button></form></div>
        <small style="color:#9ca3af;display:block;margin-top:6px">/<?= e($b['slug']) ?></small>
      </div>
    <?php endforeach; ?>
    <?php if (!$all): ?><p class="adm-note">برندی ثبت نشده.</p><?php endif; ?>
  </div>
  <form method="post" class="adm-card">
    <?= csrfField() ?><input type="hidden" name="action" value="shop_create_brand">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">افزودن برند</h3>
    <label class="adm-field"><span>نام *</span><input class="adm-input" name="name" required placeholder="آروشا"></label>
    <label class="adm-field"><span>اسلاگ (انگلیسی)</span><input class="adm-input" name="slug" dir="ltr" placeholder="arusha"></label>
    <label class="adm-field"><span>لوگو (URL — اختیاری)</span><input class="adm-input" name="logo" dir="ltr" placeholder="https://..."></label>
    <button class="adm-btn adm-btn-primary" style="width:100%">ثبت برند</button>
  </form>
</div>
<?php endif; ?>
