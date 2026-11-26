<?php $bs = $pdo->query('SELECT * FROM theme_banners ORDER BY sort ASC, id ASC')->fetchAll(); $edit = null; if (!empty($_GET['edit'])) foreach ($bs as $b) if ((int) $b['id'] === (int) $_GET['edit']) $edit = $b; ?>
<h1 class="adm-h1">بنرهای تبلیغاتی</h1>
<p class="adm-sub">چهار بنر زیر دسته‌بندی‌ها در صفحه اصلی — افزودن، ویرایش، ترتیب و فعال/غیرفعال</p>
<div class="adm-grid-2">
  <div class="adm-card">
    <ul class="adm-list">
      <?php foreach ($bs as $i => $b): ?>
        <li style="<?= $b['active'] ? '' : 'opacity:.5' ?>">
          <img src="<?= e($b['image']) ?>" alt="" style="width:72px;height:48px;object-fit:cover;border-radius:10px;background:#eee">
          <span class="grow"><b><?= e($b['title']) ?></b><small style="direction:rtl"><?= e($b['subtitle']) ?> — <span dir="ltr"><?= e($b['href']) ?></span></small></span>
          <span class="adm-row" style="gap:4px">
            <form method="post"><?= csrfField() ?><input type="hidden" name="action" value="move_banner"><input type="hidden" name="id" value="<?= $b['id'] ?>"><input type="hidden" name="dir" value="up"><button class="adm-btn adm-btn-ghost adm-btn-sm" <?= $i === 0 ? 'disabled' : '' ?>>↑</button></form>
            <form method="post"><?= csrfField() ?><input type="hidden" name="action" value="move_banner"><input type="hidden" name="id" value="<?= $b['id'] ?>"><input type="hidden" name="dir" value="down"><button class="adm-btn adm-btn-ghost adm-btn-sm" <?= $i === count($bs) - 1 ? 'disabled' : '' ?>>↓</button></form>
            <form method="post"><?= csrfField() ?><input type="hidden" name="action" value="toggle_banner"><input type="hidden" name="id" value="<?= $b['id'] ?>"><button class="adm-btn adm-btn-ghost adm-btn-sm"><?= $b['active'] ? 'فعال' : 'خاموش' ?></button></form>
            <a class="adm-btn adm-btn-ghost adm-btn-sm" href="index.php?tab=banners&edit=<?= $b['id'] ?>">ویرایش</a>
            <form method="post" onsubmit="return confirm('بنر حذف شود؟')"><?= csrfField() ?><input type="hidden" name="action" value="delete_banner"><input type="hidden" name="id" value="<?= $b['id'] ?>"><button class="adm-btn adm-btn-danger adm-btn-sm">حذف</button></form>
          </span>
        </li>
      <?php endforeach; ?>
      <?php if (!$bs): ?><li class="adm-note">بنری ثبت نشده.</li><?php endif; ?>
    </ul>
  </div>
  <form method="post" class="adm-card">
    <?= csrfField() ?><input type="hidden" name="action" value="save_banner"><input type="hidden" name="id" value="<?= (int) ($edit['id'] ?? 0) ?>">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)"><?= $edit ? 'ویرایش بنر' : 'افزودن بنر جدید' ?></h3>
    <label class="adm-field"><span>عنوان *</span><input class="adm-input" name="title" required value="<?= e($edit['title'] ?? '') ?>"></label>
    <label class="adm-field"><span>زیرعنوان / برچسب تخفیف</span><input class="adm-input" name="subtitle" value="<?= e($edit['subtitle'] ?? '') ?>"></label>
    <label class="adm-field"><span>لینک مقصد</span><input class="adm-input" name="href" dir="ltr" value="<?= e($edit['href'] ?? 'products.php') ?>"></label>
    <label class="adm-field"><span>آدرس تصویر * (http… یا assets/…)</span><input class="adm-input" name="image" dir="ltr" required value="<?= e($edit['image'] ?? '') ?>"></label>
    <label class="adm-field"><span>رنگ پس‌زمینه متن (rgba)</span><input class="adm-input" name="tone" dir="ltr" value="<?= e($edit['tone'] ?? 'rgba(15,23,42,.8)') ?>"></label>
    <div class="adm-row"><button class="adm-btn adm-btn-primary"><?= $edit ? 'ذخیره تغییرات' : 'افزودن بنر' ?></button><?php if ($edit): ?><a class="adm-btn adm-btn-ghost" href="index.php?tab=banners">انصراف</a><?php endif; ?></div>
  </form>
</div>
