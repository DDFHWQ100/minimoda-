<?php $ns = $pdo->query('SELECT * FROM theme_notices ORDER BY is_read ASC, id DESC LIMIT 60')->fetchAll(); $tone = ['info'=>['#0369a1','#f0f9ff','ℹ️'],'success'=>['#065f46','#ecfdf5','✅'],'warning'=>['#92400e','#fffbeb','⚠️'],'security'=>['#9f1239','#fff1f2','🛡']]; ?>
<h1 class="adm-h1">اعلان‌ها و هشدارها</h1>
<p class="adm-sub">نسخه جدید قالب، هشدارهای سازگاری و امنیتی، پیام‌های سیستم</p>
<div class="adm-grid-2" style="grid-template-columns:1fr 1.6fr">
  <form method="post" class="adm-card"><?= csrfField() ?><input type="hidden" name="action" value="post_notice">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">انتشار اعلان مدیریتی</h3>
    <label class="adm-field"><span>نوع</span><select class="adm-select" name="level"><option value="info">اطلاع‌رسانی</option><option value="success">موفقیت</option><option value="warning">هشدار</option><option value="security">امنیتی</option></select></label>
    <label class="adm-field"><span>عنوان *</span><input class="adm-input" name="title" required></label>
    <label class="adm-field"><span>متن</span><textarea class="adm-textarea" name="body" style="min-height:80px"></textarea></label>
    <button class="adm-btn adm-btn-navy" style="width:100%">انتشار</button>
  </form>
  <div>
    <form method="post" style="margin-bottom:8px;text-align:left"><?= csrfField() ?><input type="hidden" name="action" value="read_all_notices"><button class="adm-btn adm-btn-ghost adm-btn-sm">علامت‌زدن همه به‌عنوان خوانده‌شده</button></form>
    <?php foreach ($ns as $n): [$c,$bg,$ic] = $tone[$n['level']] ?? $tone['info']; ?>
      <div class="adm-card" style="margin-bottom:8px;background:<?= $bg ?>;border-color:<?= $c ?>33;<?= $n['is_read'] ? 'opacity:.6' : '' ?>">
        <div class="adm-row" style="justify-content:space-between"><b style="color:<?= $c ?>;font-size:12px"><?= $ic ?> <?= e($n['title']) ?></b><small style="font-size:9px;color:#6b7280"><?= faDate($n['created_at']) ?></small></div>
        <p style="font-size:11px;line-height:1.9;margin:4px 0 6px;color:#374151"><?= e($n['body']) ?></p>
        <div class="adm-row" style="gap:4px"><?php if (!$n['is_read']): ?><form method="post"><?= csrfField() ?><input type="hidden" name="action" value="read_notice"><input type="hidden" name="id" value="<?= $n['id'] ?>"><button class="adm-btn adm-btn-ghost adm-btn-sm">خواندم</button></form><?php endif; ?><form method="post" onsubmit="return confirm('حذف شود؟')"><?= csrfField() ?><input type="hidden" name="action" value="delete_notice"><input type="hidden" name="id" value="<?= $n['id'] ?>"><button class="adm-btn adm-btn-danger adm-btn-sm">حذف</button></form></div>
      </div>
    <?php endforeach; if (!$ns): ?><p class="adm-note">اعلانی نیست.</p><?php endif; ?>
  </div>
</div>
