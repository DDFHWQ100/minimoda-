<?php
require __DIR__ . '/../shop-lib.php';
$pdo = db();
$has = shopHasTable('content_pages');
$pages = $has ? $pdo->query('SELECT * FROM content_pages ORDER BY updated_at DESC')->fetchAll() : [];
?>
<h1 class="adm-h1">صفحات محتوا</h1>
<p class="adm-sub"><?= faNum(count($pages)) ?> صفحه ثابت — درباره ما، قوانین، حریم خصوصی و...</p>
<?php if (!$has): ?><div class="adm-flash is-error">جدول content_pages وجود ندارد؛ فایل database.sql جدید را ایمپورت کنید.</div><?php else: ?>
<div class="adm-grid-2">
  <div class="adm-card">
    <ul class="adm-list">
      <?php foreach ($pages as $p): ?>
        <li><span class="grow"><b><?= e($p['title']) ?></b><small dir="ltr">/pages/<?= e($p['slug']) ?></small></span>
          <span class="adm-row" style="gap:4px">
            <a class="adm-btn adm-btn-ghost adm-btn-sm" href="../pages/<?= e($p['slug']) ?>" target="_blank">مشاهده</a>
            <form method="post" onsubmit="return confirm('صفحه «<?= e($p['title']) ?>» حذف شود؟')"><?= csrfField() ?><input type="hidden" name="action" value="shop_delete"><input type="hidden" name="table" value="content_pages"><input type="hidden" name="id" value="<?= (int)$p['id'] ?>"><button class="adm-btn adm-btn-danger adm-btn-sm">حذف</button></form>
          </span></li>
      <?php endforeach; ?>
      <?php if (!$pages): ?><li class="adm-note">صفحه‌ای ثبت نشده.</li><?php endif; ?>
    </ul>
  </div>
  <form method="post" class="adm-card">
    <?= csrfField() ?><input type="hidden" name="action" value="shop_create_page">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">ساخت صفحه جدید</h3>
    <label class="adm-field"><span>عنوان *</span><input class="adm-input" name="title" required placeholder="درباره مینی‌مودا"></label>
    <label class="adm-field"><span>اسلاگ (انگلیسی) *</span><input class="adm-input" name="slug" dir="ltr" required placeholder="about"></label>
    <label class="adm-field"><span>متن صفحه *</span><textarea class="adm-textarea" name="body" required rows="9" placeholder="متن کامل صفحه..."></textarea></label>
    <button class="adm-btn adm-btn-primary" style="width:100%">انتشار صفحه</button>
  </form>
</div>
<?php endif; ?>
