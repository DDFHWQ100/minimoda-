<h1 class="adm-h1">تنظیمات واکنش‌گرا و حالت‌های نمایش</h1>
<p class="adm-sub">نمایش/عدم‌نمایش اجزا در موبایل و تبلت + پیش‌نمایش زنده سه‌دستگاهی</p>
<div class="adm-grid-2" style="grid-template-columns:1fr 2fr">
  <form method="post" class="adm-card">
    <?= csrfField() ?><input type="hidden" name="action" value="save_settings"><input type="hidden" name="switches" value="responsive.hide_cats_mobile,responsive.hide_banners_mobile,responsive.hide_trust_mobile,responsive.hide_magazine_mobile,responsive.hide_duo_tablet">
    <?php foreach ([['responsive.hide_cats_mobile','پنهان‌کردن دسته‌بندی‌ها در موبایل'],['responsive.hide_banners_mobile','پنهان‌کردن بنرهای ۴تایی در موبایل'],['responsive.hide_trust_mobile','پنهان‌کردن نوار اعتماد در موبایل'],['responsive.hide_magazine_mobile','پنهان‌کردن بخش مجله در موبایل'],['responsive.hide_duo_tablet','پنهان‌کردن بنرهای دوگانه در تبلت']] as [$k,$l]): ?>
      <label class="adm-row" style="justify-content:space-between;border:1px solid #e6e8ee;border-radius:12px;padding:10px;margin-bottom:8px"><span style="font-size:11px;font-weight:700"><?= $l ?></span><span class="adm-switch"><input type="checkbox" name="s[<?= $k ?>]" value="1" <?= themeBool($k) ? 'checked' : '' ?>><i></i></span></label>
    <?php endforeach; ?>
    <label class="adm-field"><span>ستون‌های محصول در موبایل</span><select class="adm-select" name="s[responsive.product_cols_mobile]"><option value="2" <?= themeGet('responsive.product_cols_mobile','2')==='2'?'selected':'' ?>>۲ ستون (پیش‌فرض)</option><option value="1" <?= themeGet('responsive.product_cols_mobile')==='1'?'selected':'' ?>>۱ ستون (کارت بزرگ)</option></select></label>
    <button class="adm-btn adm-btn-primary" style="width:100%">ذخیره و اعمال</button>
    <p class="adm-note" style="margin-top:8px">با CSS media query اعمال می‌شود؛ بعد از ذخیره «تازه‌سازی» را بزنید.</p>
  </form>
  <div class="adm-card">
    <div class="adm-row" style="justify-content:space-between;margin-bottom:8px"><span class="adm-device"><button data-device="1280" class="is-active">دسکتاپ 1280</button><button data-device="820">تبلت 820</button><button data-device="390">موبایل 390</button></span><button id="previewReload" class="adm-btn adm-btn-ghost adm-btn-sm" type="button">تازه‌سازی</button></div>
    <div class="adm-preview-box"><div class="bar"><i style="background:#f87171"></i><i style="background:#fbbf24"></i><i style="background:#34d399"></i></div><iframe id="previewFrame" src="../index.php" title="پیش‌نمایش"></iframe></div>
  </div>
</div>
