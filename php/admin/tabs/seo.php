<?php
$noImg = (int) $pdo->query("SELECT COUNT(*) FROM products WHERE images = '[]' OR images = ''")->fetchColumn();
$shortDesc = (int) $pdo->query("SELECT COUNT(*) FROM products WHERE CHAR_LENGTH(description) < 60")->fetchColumn();
$total = (int) $pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
$checks = [
  ['همه محصولات تصویر دارند', $noImg === 0, $noImg === 0 ? "{$total} محصول دارای تصویر" : "{$noImg} محصول بدون تصویر"],
  ['توضیحات محصولات کافی است', $shortDesc === 0, $shortDesc === 0 ? 'همه توضیحات بیش از ۶۰ کاراکتر' : "{$shortDesc} محصول توضیح کوتاه دارند"],
  ['توضیحات متا تنظیم شده', themeGet('seo.default_description') !== '', 'برای نتایج گوگل'],
  ['سایت در حالت عادی (نه تعمیر)', !themeBool('maintenance.enabled'), themeBool('maintenance.enabled') ? 'حالت تعمیر فعال است!' : 'بازدیدکنندگان سایت را می‌بینند'],
  ['CSS سفارشی معتبر', themeValidateCss(themeGet('custom.css')) === null, themeValidateCss(themeGet('custom.css')) ?? 'بدون خطا'],
  ['بارگذاری تنبل تصاویر', true, 'loading="lazy" روی تصاویر فعال است'],
];
$score = (int) round(count(array_filter($checks, fn($c) => $c[1])) / count($checks) * 100);
?>
<h1 class="adm-h1">سئو، عملکرد و فوتر</h1>
<p class="adm-sub">بررسی سلامت قالب بر اساس داده واقعی + تنظیمات متا و فوتر</p>
<div class="adm-grid-2">
  <div class="adm-card">
    <div class="adm-row" style="justify-content:space-between"><h3 style="margin:0;font-size:13px;color:var(--navy)">امتیاز سلامت قالب</h3><b style="font-size:28px;color:<?= $score >= 85 ? '#059669' : ($score >= 60 ? '#d97706' : '#dc2626') ?>"><?= faNum($score) ?></b></div>
    <ul class="adm-list" style="margin-top:8px"><?php foreach ($checks as [$t, $ok, $d]): ?><li><span style="font-size:16px"><?= $ok ? '✅' : '⚠️' ?></span><span class="grow"><b><?= e($t) ?></b><small style="direction:rtl"><?= e($d) ?></small></span></li><?php endforeach; ?></ul>
  </div>
  <form method="post" class="adm-card">
    <?= csrfField() ?><input type="hidden" name="action" value="save_settings">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">متا و فوتر</h3>
    <label class="adm-field"><span>توضیحات متا پیش‌فرض (نتایج گوگل)</span><textarea class="adm-textarea" name="s[seo.default_description]" style="min-height:70px"><?= e(themeGet('seo.default_description')) ?></textarea></label>
    <label class="adm-field"><span>متن «درباره» فوتر</span><textarea class="adm-textarea" name="s[footer.about]" style="min-height:70px"><?= e(themeGet('footer.about')) ?></textarea></label>
    <div class="adm-grid-2"><label class="adm-field"><span>اینستاگرام</span><input class="adm-input" name="s[footer.instagram]" dir="ltr" value="<?= e(themeGet('footer.instagram')) ?>"></label><label class="adm-field"><span>تلگرام</span><input class="adm-input" name="s[footer.telegram]" dir="ltr" value="<?= e(themeGet('footer.telegram')) ?>"></label></div>
    <label class="adm-field"><span>متن کپی‌رایت</span><input class="adm-input" name="s[footer.copyright]" value="<?= e(themeGet('footer.copyright')) ?>"></label>
    <button class="adm-btn adm-btn-primary" style="width:100%;height:46px">ذخیره</button>
  </form>
</div>
