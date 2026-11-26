<?php $revs = $pdo->query('SELECT id, label, created_by, created_at, CHAR_LENGTH(snapshot) AS size FROM theme_revisions ORDER BY id DESC LIMIT 40')->fetchAll(); ?>
<h1 class="adm-h1">پشتیبان‌گیری و نسخه‌ها</h1>
<p class="adm-sub">تصویر لحظه‌ای کل قالب (رنگ‌ها، منوها، بنرها، اجزا) — دانلود، بازیابی، حذف</p>
<form method="post" class="adm-card adm-row">
  <?= csrfField() ?><input type="hidden" name="action" value="create_backup">
  <input class="adm-input" name="label" placeholder="برچسب پشتیبان (مثلاً: قبل از کمپین نوروز)" style="flex:1;min-width:200px">
  <button class="adm-btn adm-btn-primary">تهیه پشتیبان جدید</button>
</form>
<div class="adm-card" style="margin-top:12px;overflow:auto">
  <table class="adm-table">
    <thead><tr><th>#</th><th>برچسب</th><th>تاریخ</th><th>ثبت‌کننده</th><th>حجم</th><th>عملیات</th></tr></thead>
    <tbody>
      <?php foreach ($revs as $r): ?>
        <tr><td><b><?= $r['id'] ?></b></td><td><?= e($r['label']) ?></td><td><?= faDate($r['created_at']) ?></td><td><?= e($r['created_by']) ?></td><td><?= round($r['size'] / 1024, 1) ?> KB</td>
          <td class="adm-row" style="gap:4px">
            <a class="adm-btn adm-btn-ghost adm-btn-sm" href="index.php?tab=backup&download_backup=<?= $r['id'] ?>">دانلود</a>
            <form method="post" onsubmit="return confirm('قالب به این نسخه بازگردانده شود؟ تغییرات فعلی از دست می‌رود.')"><?= csrfField() ?><input type="hidden" name="action" value="restore_backup"><input type="hidden" name="id" value="<?= $r['id'] ?>"><button class="adm-btn adm-btn-sm" style="background:#fffbeb;border:1px solid #fde68a;color:#92400e">بازیابی</button></form>
            <form method="post" onsubmit="return confirm('حذف شود؟')"><?= csrfField() ?><input type="hidden" name="action" value="delete_backup"><input type="hidden" name="id" value="<?= $r['id'] ?>"><button class="adm-btn adm-btn-danger adm-btn-sm">حذف</button></form>
          </td></tr>
      <?php endforeach; ?>
      <?php if (!$revs): ?><tr><td colspan="6" class="adm-note" style="text-align:center;padding:20px">هنوز پشتیبانی گرفته نشده.</td></tr><?php endif; ?>
    </tbody>
  </table>
</div>
