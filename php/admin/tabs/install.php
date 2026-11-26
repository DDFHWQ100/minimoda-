<?php $compat = themeCompatibility(); ?>
<h1 class="adm-h1">افزودن قالب</h1>
<p class="adm-sub">نصب قالب از فایل theme.json یا ساخت از روی قالب موجود — فقط توکن‌های طراحی پذیرفته می‌شود (بدون کد اجرایی)</p>
<div class="adm-grid-2">
  <form method="post" enctype="multipart/form-data" class="adm-card">
    <?= csrfField() ?><input type="hidden" name="action" value="install_theme">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">نصب از فایل</h3>
    <label class="adm-field"><span>فایل theme.json (از ZIP قالب استخراج کنید)</span><input class="adm-input" type="file" name="theme_file" accept=".json,application/json" style="padding:8px"></label>
    <label class="adm-field"><span>یا JSON را بچسبانید</span><textarea class="adm-textarea code" name="theme_json" style="min-height:150px" placeholder='{"name":"قالب من","slug":"my-theme","version":"1.0.0","author":"من","preview":"https://...","tokens":{"primary":"#1b3a6b","accent":"#e91e63","gold":"#ffc107","font":"Vazirmatn","radius":20}}'></textarea></label>
    <button class="adm-btn adm-btn-primary">نصب قالب</button>
    <p class="adm-note" style="margin-top:8px">پس از نصب، قالب در «مدیریت قالب‌ها» ظاهر می‌شود و می‌توانید پیش‌نمایش و فعال‌سازی کنید.</p>
  </form>
  <div class="adm-card">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">بررسی سازگاری با نسخه سیستم</h3>
    <p style="font-size:12px"><?= $compat['ok'] ? '<span style="color:#059669;font-weight:800">✅ همه جداول قالب نسخه ' . $compat['version'] . ' موجود است — سازگار</span>' : '<span style="color:#dc2626;font-weight:800">⚠ جداول ناقص: ' . e(implode(', ', $compat['missing'])) . ' — database.sql جدید را Import کنید</span>' ?></p>
    <h3 style="margin:14px 0 6px;font-size:13px;color:var(--navy)">نمونه theme.json برای دانلود</h3>
    <a class="adm-btn adm-btn-ghost" download="theme.json" href='data:application/json;charset=utf-8,<?= rawurlencode(json_encode(["name" => "قالب من", "slug" => "my-theme", "version" => "1.0.0", "author" => "نام شما", "description" => "توضیح کوتاه", "preview" => "https://images.pexels.com/photos/5088176/pexels-photo-5088176.jpeg", "tokens" => ["primary" => "#1b3a6b", "accent" => "#e91e63", "gold" => "#ffc107", "font" => "Vazirmatn", "radius" => 20]], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)) ?>'>⬇ دانلود نمونه</a>
    <p class="adm-note" style="margin-top:10px">ساختار: name, slug, version, author, description, preview, tokens{primary, accent, gold, font, radius}</p>
    <p class="adm-note">نصب قالب‌های شامل کد PHP/JS اجرایی به دلایل امنیتی پشتیبانی نمی‌شود (نیازمند sandbox — زیرساخت).</p>
  </div>
</div>
