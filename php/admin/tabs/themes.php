<?php $q = trim((string) ($_GET['q'] ?? '')); $f = (string) ($_GET['f'] ?? 'all');
$all = array_values(array_filter($pdo->query('SELECT * FROM theme_themes ORDER BY id ASC')->fetchAll(), fn($t) => (!$q || mb_stripos($t['name'] . $t['author'] . $t['slug'], $q) !== false) && ($f === 'all' || ($f === 'active' && $t['is_active']) || ($f === 'child' && !empty($t['parent_slug']))))); ?>
<h1 class="adm-h1">مدیریت قالب‌ها</h1>
<p class="adm-sub"><?= faNum(count($all)) ?> قالب نصب‌شده — فعال‌سازی، تکثیر، حذف و نصب از فایل</p>
<form method="get" class="adm-row" style="margin-bottom:12px"><input type="hidden" name="tab" value="themes"><input class="adm-input" name="q" value="<?= e($q) ?>" placeholder="جستجوی نام، سازنده..." style="flex:1;min-width:160px"><button class="adm-btn adm-btn-navy adm-btn-sm">جستجو</button><a class="adm-btn adm-btn-sm <?= $f==='all'?'adm-btn-primary':'adm-btn-ghost' ?>" href="index.php?tab=themes">همه</a><a class="adm-btn adm-btn-sm <?= $f==='active'?'adm-btn-primary':'adm-btn-ghost' ?>" href="index.php?tab=themes&f=active">فعال</a><a class="adm-btn adm-btn-sm <?= $f==='child'?'adm-btn-primary':'adm-btn-ghost' ?>" href="index.php?tab=themes&f=child">فرزندها</a></form>
<div class="adm-grid-3">
  <?php foreach ($all as $t): $tok = json_decode($t['tokens'], true) ?: []; ?>
    <article class="adm-theme <?= $t['is_active'] ? 'is-active' : '' ?>">
      <div class="adm-theme-prev"><?php if ($t['preview']): ?><img src="<?= e($t['preview']) ?>" alt="" loading="lazy"><?php else: ?><div style="height:100%;background:linear-gradient(135deg,<?= e($tok['primary'] ?? '#1b3a6b') ?>,<?= e($tok['accent'] ?? '#e91e63') ?>)"></div><?php endif; ?><?php if ($t['is_active']): ?><span class="tag">فعال</span><?php endif; ?></div>
      <div class="adm-theme-body">
        <h3><?= e($t['name']) ?></h3>
        <small style="font-size:9px;color:#9ca3af;direction:ltr;display:block;text-align:right">v<?= e($t['version']) ?> · <?= e($t['author']) ?> · نصب <?= faDate($t['installed_at']) ?> · به‌روزرسانی <?= faDate($t['updated_at']) ?><?= !empty($t['parent_slug']) ? ' · 🌿 فرزند ' . e($t['parent_slug']) : '' ?> · ✅ سازگار</small>
        <p><?= e($t['description']) ?></p>
        <span class="adm-sw"><?php foreach (['primary','accent','gold'] as $c): if (!empty($tok[$c])): ?><i style="background:<?= e($tok[$c]) ?>"></i><?php endif; endforeach; ?></span>
        <div class="adm-row" style="margin-top:10px">
          <?php if ($t['is_active']): ?><span class="adm-btn adm-btn-sm" style="background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0">در حال استفاده</span>
          <?php else: ?><form method="post" onsubmit="return confirm('قالب «<?= e($t['name']) ?>» فعال شود؟ رنگ‌ها و فونت کل سایت تغییر می‌کند.')"><?= csrfField() ?><input type="hidden" name="action" value="activate_theme"><input type="hidden" name="slug" value="<?= e($t['slug']) ?>"><button class="adm-btn adm-btn-navy adm-btn-sm">فعال‌سازی</button></form><?php endif; ?>
          <form method="post" onsubmit="var n=prompt('نام رونوشت:','<?= e($t['name']) ?> (رونوشت)'); if(n===null) return false; this.name.value=n;"><?= csrfField() ?><input type="hidden" name="action" value="duplicate_theme"><input type="hidden" name="slug" value="<?= e($t['slug']) ?>"><input type="hidden" name="name" value=""><button class="adm-btn adm-btn-ghost adm-btn-sm">تکثیر</button></form>
          <form method="post" onsubmit="var n=prompt('نام قالب فرزند:','<?= e($t['name']) ?> — فرزند'); if(n===null) return false; this.name.value=n;"><?= csrfField() ?><input type="hidden" name="action" value="child_theme"><input type="hidden" name="slug" value="<?= e($t['slug']) ?>"><input type="hidden" name="name" value=""><button class="adm-btn adm-btn-ghost adm-btn-sm" style="color:#0369a1;border-color:#bae6fd">قالب فرزند</button></form>
          <form method="post" onsubmit="return confirm('توکن‌های این قالب به آخرین پشتیبان بازگردد؟')"><?= csrfField() ?><input type="hidden" name="action" value="rollback_theme"><input type="hidden" name="slug" value="<?= e($t['slug']) ?>"><button class="adm-btn adm-btn-sm" style="background:#fffbeb;border:1px solid #fde68a;color:#92400e">بازگشت نسخه</button></form>
          <?php if (!$t['is_active']): ?><a class="adm-btn adm-btn-ghost adm-btn-sm" href="index.php?tab=design&preview=<?= e($t['slug']) ?>">پیش‌نمایش</a><form method="post" onsubmit="return confirm('قالب حذف شود؟')"><?= csrfField() ?><input type="hidden" name="action" value="delete_theme"><input type="hidden" name="slug" value="<?= e($t['slug']) ?>"><button class="adm-btn adm-btn-danger adm-btn-sm">حذف</button></form><?php endif; ?>
        </div>
      </div>
    </article>
  <?php endforeach; ?>
</div>
<div class="adm-card" style="margin-top:14px">
  <h3 style="margin:0 0 4px;font-size:13px;color:var(--navy)">نصب قالب جدید از فایل theme.json</h3>
  <p class="adm-note">فقط توکن‌های طراحی (رنگ، فونت، گردی) خوانده می‌شود — هیچ کد اجرایی وارد سایت نمی‌شود (ایمن).</p>
  <form method="post" enctype="multipart/form-data" class="adm-grid-2" style="margin-top:8px">
    <?= csrfField() ?><input type="hidden" name="action" value="install_theme">
    <label class="adm-field"><span>انتخاب فایل theme.json</span><input class="adm-input" type="file" name="theme_file" accept=".json,application/json" style="padding:8px"></label>
    <label class="adm-field"><span>یا محتوای JSON را اینجا بچسبانید</span><textarea class="adm-textarea code" name="theme_json" style="min-height:110px" placeholder='{"name":"قالب من","version":"1.0.0","author":"من","tokens":{"primary":"#1b3a6b","accent":"#e91e63","gold":"#ffc107","font":"Vazirmatn","radius":20}}'></textarea></label>
    <div><button class="adm-btn adm-btn-primary">نصب قالب</button></div>
  </form>
</div>
