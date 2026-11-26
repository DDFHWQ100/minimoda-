<?php $secs = $pdo->query('SELECT * FROM theme_sections ORDER BY sort ASC')->fetchAll(); ?>
<h1 class="adm-h1">اجزای صفحه اصلی</h1>
<p class="adm-sub">هر بخش را روشن/خاموش کنید و با کشیدن (Drag & Drop) ترتیبشان را تغییر دهید</p>
<form method="post" class="adm-card">
  <?= csrfField() ?><input type="hidden" name="action" value="save_sections">
  <ul class="adm-list" id="secList">
    <?php foreach ($secs as $i => $s): ?>
      <li class="adm-sec-row">
        <span style="color:#cbd5e1;font-size:18px;cursor:grab">⋮⋮</span>
        <span class="sec-num" style="width:26px;height:26px;border-radius:8px;background:#f1f5f9;display:grid;place-items:center;font-size:10px;font-weight:900;color:#64748b"><?= $i + 1 ?></span>
        <input type="hidden" name="order[]" value="<?= e($s['id']) ?>">
        <span class="grow"><b><?= e($s['label']) ?></b><small style="direction:ltr"><?= e($s['id']) ?></small></span>
        <span class="adm-switch"><input type="checkbox" name="enabled[<?= e($s['id']) ?>]" value="1" <?= $s['enabled'] ? 'checked' : '' ?>><i></i></span>
      </li>
    <?php endforeach; ?>
  </ul>
  <div class="adm-row" style="margin-top:12px"><button class="adm-btn adm-btn-primary">ذخیره ترتیب و وضعیت</button><a class="adm-btn adm-btn-ghost" href="../index.php" target="_blank">مشاهده صفحه اصلی</a></div>
  <p class="adm-note" style="margin-top:8px">بخش‌های خاموش از صفحه اصلی حذف می‌شوند؛ ترتیب ذخیره‌شده همان ترتیب نمایش است.</p>
</form>
