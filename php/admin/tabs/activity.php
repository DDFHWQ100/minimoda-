<?php $q = trim((string) ($_GET['q'] ?? '')); $st = $pdo->prepare('SELECT * FROM theme_activity WHERE action LIKE ? OR detail LIKE ? OR actor LIKE ? ORDER BY id DESC LIMIT 150'); $st->execute(["%$q%", "%$q%", "%$q%"]); $logs = $st->fetchAll(); ?>
<h1 class="adm-h1">گزارش فعالیت‌ها</h1>
<p class="adm-sub">همه تغییرات قالب با نام انجام‌دهنده و زمان</p>
<div class="adm-row" style="margin-bottom:12px">
  <form method="get" class="adm-row" style="flex:1"><input type="hidden" name="tab" value="activity"><input class="adm-input" name="q" value="<?= e($q) ?>" placeholder="جستجو در اقدام، جزئیات یا کاربر..." style="flex:1;min-width:200px"><button class="adm-btn adm-btn-navy">جستجو</button></form>
  <form method="post" onsubmit="return confirm('گزارش‌های قدیمی‌تر از ۳۰ روز حذف شوند؟')"><?= csrfField() ?><input type="hidden" name="action" value="clear_activity"><button class="adm-btn adm-btn-danger">پاک‌سازی قدیمی‌ها</button></form>
</div>
<div class="adm-card" style="overflow:auto">
  <table class="adm-table"><thead><tr><th>اقدام</th><th>جزئیات</th><th>کاربر</th><th>زمان</th></tr></thead>
  <tbody><?php foreach ($logs as $l): ?><tr><td><b><?= e($l['action']) ?></b></td><td><?= e($l['detail']) ?></td><td><?= e($l['actor']) ?></td><td style="white-space:nowrap"><?= faDate($l['created_at']) ?></td></tr><?php endforeach; ?>
  <?php if (!$logs): ?><tr><td colspan="4" class="adm-note" style="text-align:center;padding:20px">فعالیتی یافت نشد.</td></tr><?php endif; ?></tbody></table>
</div>
