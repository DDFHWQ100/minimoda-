<?php $hist = $pdo->query('SELECT * FROM theme_code_history ORDER BY id DESC LIMIT 20')->fetchAll(); $labels = ['custom.css' => 'CSS سفارشی', 'custom.js' => 'JavaScript سفارشی', 'custom.head' => 'کدهای Head']; ?>
<h1 class="adm-h1">کدهای سفارشی</h1>
<p class="adm-sub">CSS / JavaScript / کدهای &lt;head&gt; — اعتبارسنجی، تاریخچه و بازگردانی. در کل سایت تزریق می‌شود.</p>
<form method="post" class="adm-grid-2">
  <?= csrfField() ?><input type="hidden" name="action" value="save_settings">
  <div class="adm-card" style="grid-column:1/-1">
    <label class="adm-field"><span>CSS سفارشی (آکولادها باید متعادل باشند)</span><textarea class="adm-textarea code" name="s[custom.css]" placeholder=".rounded-3xl { border-radius: 26px !important; }"><?= e(themeGet('custom.css')) ?></textarea></label>
    <div class="adm-grid-2">
      <label class="adm-field"><span>JavaScript سفارشی (انتهای body)</span><textarea class="adm-textarea code" name="s[custom.js]" style="min-height:140px" placeholder="console.log('سلام مینی‌مودا');"><?= e(themeGet('custom.js')) ?></textarea></label>
      <label class="adm-field"><span>کدهای Head (متاتگ، وریفیکیشن)</span><textarea class="adm-textarea code" name="s[custom.head]" style="min-height:140px" placeholder='<meta name="google-site-verification" content="...">'><?= e(themeGet('custom.head')) ?></textarea></label>
    </div>
    <button class="adm-btn adm-btn-primary">ذخیره و اعمال</button>
    <p class="adm-note" style="margin-top:8px">قبل از هر ذخیره، نسخه قبلی به‌صورت خودکار در تاریخچه نگه داشته می‌شود.</p>
  </div>
</form>
<div class="adm-card" style="margin-top:14px">
  <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">تاریخچه تغییرات کد</h3>
  <ul class="adm-list">
    <?php foreach ($hist as $h): $cur = themeGet($h['key']); $a = array_diff(explode("\n", $cur), explode("\n", $h['content'])); $d = array_diff(explode("\n", $h['content']), explode("\n", $cur)); ?>
      <li style="align-items:flex-start;flex-direction:column">
        <div class="adm-row" style="width:100%;justify-content:space-between"><span><b style="font-size:11px;color:var(--navy)"><?= $labels[$h['key']] ?? e($h['key']) ?></b> <small style="font-size:9px;color:#9ca3af">نسخه #<?= $h['id'] ?> · <?= e($h['created_by']) ?> · <?= faDate($h['created_at']) ?> · <span style="color:#059669">+<?= count($a) ?></span> <span style="color:#dc2626">−<?= count($d) ?></span></small></span>
          <form method="post" onsubmit="return confirm('کد فعلی با این نسخه جایگزین شود؟')"><?= csrfField() ?><input type="hidden" name="action" value="restore_code"><input type="hidden" name="id" value="<?= $h['id'] ?>"><button class="adm-btn adm-btn-ghost adm-btn-sm">بازگردانی</button></form></div>
        <?php if ($a || $d): ?><details style="width:100%"><summary style="font-size:10px;color:#6b7280;cursor:pointer">مشاهده تفاوت</summary><div class="adm-diff"><?php foreach ($d as $l): ?><div class="del">− <?= e($l) ?></div><?php endforeach; foreach ($a as $l): ?><div class="add">+ <?= e($l) ?></div><?php endforeach; ?></div></details><?php endif; ?>
      </li>
    <?php endforeach; ?>
    <?php if (!$hist): ?><li class="adm-note">تاریخچه‌ای ثبت نشده.</li><?php endif; ?>
  </ul>
</div>
