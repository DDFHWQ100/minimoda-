<h1 class="adm-h1">تنظیمات ظاهری پیشرفته</h1>
<p class="adm-sub">تایپوگرافی، فاصله‌ها، سایه و انیمیشن — به‌صورت Design Token روی کل سایت</p>
<form method="post" class="adm-grid-2">
  <?= csrfField() ?><input type="hidden" name="action" value="save_settings"><input type="hidden" name="switches" value="design.animations">
  <div class="adm-card">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">تایپوگرافی</h3>
    <label class="adm-field"><span>اندازه پایه فونت: <b id="fsv"><?= (int) themeGet('design.font_size_base','14') ?></b>px</span><input type="range" name="s[design.font_size_base]" min="12" max="18" value="<?= (int) themeGet('design.font_size_base','14') ?>" oninput="document.getElementById('fsv').textContent=this.value" style="width:100%;accent-color:var(--pink)"></label>
    <label class="adm-field"><span>وزن تیترها</span><select class="adm-select" name="s[design.font_weight_heading]"><?php foreach (['700'=>'Bold (700)','800'=>'ExtraBold (800)','900'=>'Black (900)'] as $v=>$l): ?><option value="<?= $v ?>" <?= themeGet('design.font_weight_heading','900')===$v?'selected':'' ?>><?= $l ?></option><?php endforeach; ?></select></label>
    <label class="adm-field"><span>فونت فارسی</span><select class="adm-select" name="s[theme.font]"><?php foreach (['Vazirmatn'=>'وزیرمتن','Estedad'=>'استعداد','Noto Kufi Arabic'=>'نوتو کوفی','Harmattan'=>'هارمتان','Lalezar'=>'لاله‌زار'] as $v=>$l): ?><option value="<?= $v ?>" <?= themeGet('theme.font','Vazirmatn')===$v?'selected':'' ?>><?= $l ?></option><?php endforeach; ?></select></label>
    <p class="adm-note">جهت راست‌چین (RTL) و زبان فارسی سراسری فعال است. چندزبانه: زیرساخت.</p>
  </div>
  <div class="adm-card">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">فاصله، سایه و افکت</h3>
    <label class="adm-field"><span>فاصله بین بخش‌ها: <b id="gv"><?= (int) themeGet('design.section_gap','24') ?></b>px</span><input type="range" name="s[design.section_gap]" min="8" max="64" step="4" value="<?= (int) themeGet('design.section_gap','24') ?>" oninput="document.getElementById('gv').textContent=this.value" style="width:100%;accent-color:var(--pink)"></label>
    <label class="adm-field"><span>عرض محتوای سایت (px)</span><input class="adm-input" type="number" name="s[design.content_width]" min="1024" max="1600" step="16" value="<?= (int) themeGet('design.content_width','1280') ?>" dir="ltr"></label>
    <label class="adm-field"><span>شدت سایه کارت‌ها</span><select class="adm-select" name="s[design.shadow]"><?php foreach (['none'=>'بدون سایه','soft'=>'نرم (پیش‌فرض)','strong'=>'پررنگ'] as $v=>$l): ?><option value="<?= $v ?>" <?= themeGet('design.shadow','soft')===$v?'selected':'' ?>><?= $l ?></option><?php endforeach; ?></select></label>
    <label class="adm-field"><span>سرعت انتقال: <b id="tv"><?= (int) themeGet('design.transition_ms','250') ?></b>ms</span><input type="range" name="s[design.transition_ms]" min="0" max="600" step="50" value="<?= (int) themeGet('design.transition_ms','250') ?>" oninput="document.getElementById('tv').textContent=this.value" style="width:100%;accent-color:var(--pink)"></label>
    <label class="adm-row" style="justify-content:space-between;border:1px solid #e6e8ee;border-radius:12px;padding:10px;margin-bottom:10px"><span style="font-size:11px;font-weight:700">انیمیشن‌ها و افکت‌های انتقال</span><span class="adm-switch"><input type="checkbox" name="s[design.animations]" value="1" <?= themeBool('design.animations', true) ? 'checked' : '' ?>><i></i></span></label>
    <button class="adm-btn adm-btn-primary" style="width:100%;height:46px">ذخیره و اعمال</button>
  </div>
</form>
