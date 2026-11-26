<h1 class="adm-h1">هیرو و هدر</h1>
<p class="adm-sub">متن و تصویر اسلاید اصلی، نوار اطلاع‌رسانی و اطلاعات هدر</p>
<form method="post" class="adm-grid-2">
  <?= csrfField() ?><input type="hidden" name="action" value="save_settings"><input type="hidden" name="switches" value="announcement.enabled">
  <div class="adm-card">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">اسلاید اصلی (هیرو)</h3>
    <label class="adm-field"><span>تیتر (برای شکستن خط از &lt;br&gt; استفاده کنید)</span><input class="adm-input" name="s[hero.title]" value="<?= e(themeGet('hero.title')) ?>"></label>
    <label class="adm-field"><span>زیرتیتر</span><input class="adm-input" name="s[hero.sub]" value="<?= e(themeGet('hero.sub')) ?>"></label>
    <div class="adm-grid-2"><label class="adm-field"><span>متن دکمه</span><input class="adm-input" name="s[hero.cta]" value="<?= e(themeGet('hero.cta')) ?>"></label><label class="adm-field"><span>لینک دکمه</span><input class="adm-input" name="s[hero.href]" value="<?= e(themeGet('hero.href')) ?>" dir="ltr"></label></div>
    <div class="adm-grid-2"><label class="adm-field"><span>نشان گرد (مثلاً ۷۰٪)</span><input class="adm-input" name="s[hero.badge]" value="<?= e(themeGet('hero.badge')) ?>"></label><label class="adm-field"><span>آدرس تصویر هیرو</span><input class="adm-input" name="s[hero.image]" value="<?= e(themeGet('hero.image')) ?>" dir="ltr"></label></div>
    <?php if (themeGet('hero.image')): ?><img src="../<?= e(themeGet('hero.image')) ?>" alt="" style="width:100%;height:140px;object-fit:cover;border-radius:12px;border:1px solid #e6e8ee" onerror="this.src='<?= e(themeGet('hero.image')) ?>'"><?php endif; ?>
  </div>
  <div class="adm-card">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">نوار اطلاع‌رسانی و هدر</h3>
    <label class="adm-row" style="justify-content:space-between;border:1px solid #e6e8ee;border-radius:12px;padding:10px;margin-bottom:10px"><span style="font-size:11px;font-weight:700">نمایش نوار اطلاع‌رسانی بالای سایت</span><span class="adm-switch"><input type="checkbox" name="s[announcement.enabled]" value="1" <?= themeBool('announcement.enabled', true) ? 'checked' : '' ?>><i></i></span></label>
    <label class="adm-field"><span>متن نوار اطلاع‌رسانی</span><input class="adm-input" name="s[announcement.text]" value="<?= e(themeGet('announcement.text')) ?>"></label>
    <label class="adm-field"><span>نام فروشگاه (لوگو)</span><input class="adm-input" name="s[store.name]" value="<?= e(themeGet('store.name','مینی‌مودا')) ?>"></label>
    <label class="adm-field"><span>شعار زیر لوگو</span><input class="adm-input" name="s[store.tagline]" value="<?= e(themeGet('store.tagline')) ?>"></label>
    <label class="adm-field"><span>تلفن پشتیبانی</span><input class="adm-input" name="s[header.phone]" value="<?= e(themeGet('header.phone')) ?>" dir="ltr"></label>
    <button class="adm-btn adm-btn-primary" style="width:100%;height:46px">ذخیره و اعمال</button>
    <p class="adm-note" style="margin-top:8px">آیتم‌های منوی هدر در بخش «منوها» مدیریت می‌شوند.</p>
  </div>
</form>
