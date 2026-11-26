<?php
$loc = in_array($_GET['loc'] ?? '', ['main', 'footer_quick', 'footer_service'], true) ? $_GET['loc'] : 'main';
$locs = ['main' => 'منوی اصلی (هدر)', 'footer_quick' => 'فوتر — دسترسی سریع', 'footer_service' => 'فوتر — خدمات مشتریان'];
$st = $pdo->prepare('SELECT * FROM theme_menu_items WHERE location = ? ORDER BY sort ASC, id ASC'); $st->execute([$loc]); $items = $st->fetchAll();
$roots = array_values(array_filter($items, fn($m) => empty($m['parent_id'])));
$edit = null; if (!empty($_GET['edit'])) foreach ($items as $m) if ((int) $m['id'] === (int) $_GET['edit']) $edit = $m;
?>
<h1 class="adm-h1">منوها</h1>
<p class="adm-sub">منوی اصلی با زیرمنو و لینک‌های فوتر — تغییرات بلافاصله در سایت</p>
<div class="adm-row" style="margin-bottom:12px"><?php foreach ($locs as $k => $l): ?><a class="adm-btn adm-btn-sm <?= $loc === $k ? 'adm-btn-navy' : 'adm-btn-ghost' ?>" href="index.php?tab=menus&loc=<?= $k ?>"><?= $l ?></a><?php endforeach; ?></div>
<div class="adm-grid-2">
  <div class="adm-card">
    <ul class="adm-list">
      <?php $render = function (array $m, int $depth) use ($roots) { ?>
        <li style="padding-right:<?= 4 + $depth * 22 ?>px;<?= $m['enabled'] ? '' : 'opacity:.5' ?>">
          <?php if ($depth): ?><span style="color:#cbd5e1">↳</span><?php endif; ?>
          <span class="grow"><b><?= e($m['label']) ?><?= $m['highlight'] ? ' ⭐' : '' ?></b><small><?= e($m['href']) ?></small></span>
          <span class="adm-row" style="gap:4px">
            <form method="post"><?= csrfField() ?><input type="hidden" name="action" value="move_menu"><input type="hidden" name="id" value="<?= $m['id'] ?>"><input type="hidden" name="dir" value="up"><button class="adm-btn adm-btn-ghost adm-btn-sm">↑</button></form>
            <form method="post"><?= csrfField() ?><input type="hidden" name="action" value="move_menu"><input type="hidden" name="id" value="<?= $m['id'] ?>"><input type="hidden" name="dir" value="down"><button class="adm-btn adm-btn-ghost adm-btn-sm">↓</button></form>
            <form method="post"><?= csrfField() ?><input type="hidden" name="action" value="toggle_menu"><input type="hidden" name="id" value="<?= $m['id'] ?>"><button class="adm-btn adm-btn-ghost adm-btn-sm"><?= $m['enabled'] ? 'فعال' : 'خاموش' ?></button></form>
            <a class="adm-btn adm-btn-ghost adm-btn-sm" href="index.php?tab=menus&loc=<?= $loc ?>&edit=<?= $m['id'] ?>">ویرایش</a>
            <form method="post" onsubmit="return confirm('حذف شود؟ زیرمنوها هم حذف می‌شوند.')"><?= csrfField() ?><input type="hidden" name="action" value="delete_menu"><input type="hidden" name="id" value="<?= $m['id'] ?>"><button class="adm-btn adm-btn-danger adm-btn-sm">حذف</button></form>
          </span>
        </li>
      <?php };
      foreach ($roots as $r) { $render($r, 0); foreach ($items as $c) if ((int) ($c['parent_id'] ?? 0) === (int) $r['id']) $render($c, 1); }
      if (!$roots): ?><li class="adm-note">آیتمی در این منو نیست.</li><?php endif; ?>
    </ul>
  </div>
  <form method="post" class="adm-card">
    <?= csrfField() ?><input type="hidden" name="action" value="save_menu"><input type="hidden" name="id" value="<?= (int) ($edit['id'] ?? 0) ?>"><input type="hidden" name="location" value="<?= $loc ?>">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)"><?= $edit ? 'ویرایش آیتم' : 'افزودن آیتم' ?> — <?= $locs[$loc] ?></h3>
    <label class="adm-field"><span>عنوان *</span><input class="adm-input" name="label" required value="<?= e($edit['label'] ?? '') ?>"></label>
    <label class="adm-field"><span>لینک *</span><input class="adm-input" name="href" dir="ltr" required value="<?= e($edit['href'] ?? 'products.php') ?>" placeholder="products.php?cat=girls"></label>
    <?php if ($loc === 'main'): ?>
      <label class="adm-field"><span>والد (برای زیرمنو)</span><select class="adm-select" name="parent_id"><option value="0">سطح اول (بدون والد)</option><?php foreach ($roots as $r): if ((int) $r['id'] === (int) ($edit['id'] ?? 0)) continue; ?><option value="<?= $r['id'] ?>" <?= (int) ($edit['parent_id'] ?? 0) === (int) $r['id'] ? 'selected' : '' ?>>زیرمنوی «<?= e($r['label']) ?>»</option><?php endforeach; ?></select></label>
      <label class="adm-row" style="font-size:11px;font-weight:700;margin-bottom:10px"><input type="checkbox" name="highlight" value="1" <?= !empty($edit['highlight']) ? 'checked' : '' ?>> نمایش برجسته (پس‌زمینه صورتی مثل «خانه»)</label>
    <?php endif; ?>
    <div class="adm-row"><button class="adm-btn adm-btn-primary"><?= $edit ? 'ذخیره' : 'افزودن' ?></button><?php if ($edit): ?><a class="adm-btn adm-btn-ghost" href="index.php?tab=menus&loc=<?= $loc ?>">انصراف</a><?php endif; ?></div>
  </form>
</div>
