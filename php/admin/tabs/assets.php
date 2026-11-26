<?php $files = themeAssets(); $q = trim((string) ($_GET['q'] ?? '')); $onlyUnused = !empty($_GET['unused']);
$list = array_filter($files, fn($f) => (!$q || stripos($f['name'], $q) !== false) && (!$onlyUnused || !$f['used']));
$total = array_sum(array_column($files, 'size')); $unused = count(array_filter($files, fn($f) => !$f['used'])); ?>
<h1 class="adm-h1">مدیریت فایل‌ها و دارایی‌ها</h1>
<p class="adm-sub"><?= faNum(count($files)) ?> فایل · <?= round($total / 1024) ?> KB · <?= faNum($unused) ?> فایل استفاده‌نشده</p>
<form method="post" enctype="multipart/form-data" class="adm-card adm-row"><?= csrfField() ?><input type="hidden" name="action" value="upload_asset"><input class="adm-input" type="file" name="files[]" multiple accept="image/*,.svg,.css,.js,.woff2,.woff,.ttf" style="flex:1;padding:8px;min-width:200px"><button class="adm-btn adm-btn-primary">بارگذاری گروهی</button><span class="adm-note">حداکثر ۵MB · تصویر، SVG، CSS، JS، فونت — فایل‌های دارای کد مخرب رد می‌شوند</span></form>
<div class="adm-row" style="margin:12px 0"><form method="get" class="adm-row" style="flex:1"><input type="hidden" name="tab" value="assets"><input class="adm-input" name="q" value="<?= e($q) ?>" placeholder="جستجوی نام فایل..." style="flex:1;min-width:160px"><button class="adm-btn adm-btn-navy adm-btn-sm">جستجو</button></form><a class="adm-btn adm-btn-sm <?= $onlyUnused ? 'adm-btn-primary' : 'adm-btn-ghost' ?>" href="index.php?tab=assets<?= $onlyUnused ? '' : '&unused=1' ?>">فقط استفاده‌نشده‌ها (<?= $unused ?>)</a></div>
<div class="adm-assets">
  <?php foreach ($list as $f): $img = in_array($f['type'], ['jpg','jpeg','png','webp','gif','svg'], true); ?>
    <div class="adm-asset">
      <div class="adm-asset-prev"><?php if ($img): ?><img src="../<?= e($f['path']) ?>" alt="" loading="lazy"><?php else: ?><span style="font-size:26px">📄</span><?php endif; ?><?php if (!$f['used']): ?><em>بدون استفاده</em><?php endif; ?></div>
      <small dir="ltr"><?= e($f['name']) ?></small><small><?= round($f['size'] / 1024, 1) ?> KB · <?= strtoupper($f['type']) ?></small>
      <div class="adm-row" style="gap:4px;margin-top:4px"><button type="button" class="adm-btn adm-btn-ghost adm-btn-sm" onclick="navigator.clipboard&&navigator.clipboard.writeText('<?= e($f['path']) ?>');this.textContent='کپی شد ✓'">کپی آدرس</button><?php if ($f['deletable']): ?><form method="post" onsubmit="return confirm('حذف شود؟')"><?= csrfField() ?><input type="hidden" name="action" value="delete_asset"><input type="hidden" name="path" value="<?= e($f['path']) ?>"><button class="adm-btn adm-btn-danger adm-btn-sm">حذف</button></form><?php endif; ?></div>
    </div>
  <?php endforeach; ?>
  <?php if (!$list): ?><p class="adm-note">فایلی یافت نشد.</p><?php endif; ?>
</div>
<p class="adm-note" style="margin-top:10px">فایل‌های اصلی قالب در assets/ فقط‌خواندنی‌اند؛ فایل‌های آپلودی شما در assets/uploads/ قابل حذف‌اند. نسخه‌بندی سطح فایل: زیرساخت.</p>
