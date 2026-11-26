<?php
$cnt = fn(string $sql) => (int) $pdo->query($sql)->fetchColumn();
$active = $pdo->query('SELECT name, version FROM theme_themes WHERE is_active = 1 LIMIT 1')->fetch();
$stats = [
  ['قالب‌های نصب‌شده', faNum($cnt('SELECT COUNT(*) FROM theme_themes')), 'themes'],
  ['قالب فعال', $active ? e($active['name']) . ' <small style="color:#6b7280">v' . e($active['version']) . '</small>' : '—', 'themes'],
  ['اجزای فعال صفحه اصلی', faNum($cnt('SELECT COUNT(*) FROM theme_sections WHERE enabled=1')) . ' از ' . faNum($cnt('SELECT COUNT(*) FROM theme_sections')), 'sections'],
  ['بنرها', faNum($cnt('SELECT COUNT(*) FROM theme_banners WHERE active=1')) . ' فعال', 'banners'],
  ['آیتم‌های منو', faNum($cnt('SELECT COUNT(*) FROM theme_menu_items')), 'menus'],
  ['نسخه‌های پشتیبان', faNum($cnt('SELECT COUNT(*) FROM theme_revisions')), 'backup'],
  ['تاریخچه کد', faNum($cnt('SELECT COUNT(*) FROM theme_code_history')) . ' نسخه', 'code'],
  ['حالت تعمیر', themeBool('maintenance.enabled') ? '<span style="color:#dc2626">فعال ⚠</span>' : '<span style="color:#059669">خاموش</span>', 'settings'],
];
$recent = $pdo->query('SELECT * FROM theme_activity ORDER BY id DESC LIMIT 8')->fetchAll();
$issues = [];
if (themeBool('maintenance.enabled')) $issues[] = 'حالت تعمیر فعال است — بازدیدکنندگان سایت را نمی‌بینند.';
if ($cnt('SELECT COUNT(*) FROM theme_banners WHERE active=1') === 0) $issues[] = 'هیچ بنر فعالی وجود ندارد.';
if ($cnt('SELECT COUNT(*) FROM theme_revisions') === 0) $issues[] = 'هنوز پشتیبانی از قالب گرفته نشده — قبل از تغییرات بزرگ پشتیبان بگیرید.';
if (themeGet('custom.css') !== '' && themeValidateCss(themeGet('custom.css'))) $issues[] = 'CSS سفارشی خطای نحوی دارد.';
?>
<h1 class="adm-h1">نمای کلی قالب و پوسته</h1>
<p class="adm-sub">کنترل ظاهر، ساختار و اجزای سایت — بدون ویرایش کد</p>
<div class="adm-stats">
  <?php foreach ($stats as [$l, $v, $t]): ?><a class="adm-stat" href="index.php?tab=<?= $t ?>" style="text-decoration:none"><small><?= e($l) ?></small><b><?= $v ?></b></a><?php endforeach; ?>
</div>
<div class="adm-grid-2" style="margin-top:14px">
  <div class="adm-card">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">آخرین تغییرات</h3>
    <ul class="adm-list"><?php foreach ($recent as $r): ?><li><span class="grow"><b><?= e($r['action']) ?></b><small style="direction:rtl;text-align:right"><?= e($r['detail']) ?></small></span><span style="font-size:9px;color:#9ca3af;white-space:nowrap"><?= e($r['actor']) ?> · <?= faDate($r['created_at']) ?></span></li><?php endforeach; ?>
    <?php if (!$recent): ?><li class="adm-note">فعالیتی ثبت نشده.</li><?php endif; ?></ul>
  </div>
  <div class="adm-card">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">هشدارها و مشکلات احتمالی</h3>
    <?php if (!$issues): ?><p style="color:#059669;font-size:12px;font-weight:700">✓ مشکلی شناسایی نشد — قالب سالم است.</p><?php else: foreach ($issues as $i): ?><p style="background:#fffbeb;border:1px solid #fde68a;color:#92400e;border-radius:12px;padding:8px 12px;font-size:11px;font-weight:700">⚠ <?= e($i) ?></p><?php endforeach; endif; ?>
    <div class="adm-row" style="margin-top:10px"><a class="adm-btn adm-btn-navy adm-btn-sm" href="index.php?tab=backup">تهیه پشتیبان</a><a class="adm-btn adm-btn-ghost adm-btn-sm" href="index.php?tab=design">تغییر رنگ‌ها</a><a class="adm-btn adm-btn-ghost adm-btn-sm" href="../index.php" target="_blank">مشاهده سایت</a></div>
  </div>
</div>
<div class="adm-card" style="margin-top:14px">
  <div class="adm-row" style="justify-content:space-between;margin-bottom:8px">
    <h3 style="margin:0;font-size:13px;color:var(--navy)">پیش‌نمایش زنده سایت</h3>
    <span class="adm-row"><span class="adm-device"><button data-device="1280" class="is-active">دسکتاپ</button><button data-device="820">تبلت</button><button data-device="390">موبایل</button></span><button id="previewReload" class="adm-btn adm-btn-ghost adm-btn-sm" type="button">تازه‌سازی</button></span>
  </div>
  <div class="adm-preview-box"><div class="bar"><i style="background:#f87171"></i><i style="background:#fbbf24"></i><i style="background:#34d399"></i></div><iframe id="previewFrame" src="../index.php" title="پیش‌نمایش"></iframe></div>
</div>
