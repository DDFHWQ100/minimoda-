<?php
$pv = null; if (!empty($_GET['preview'])) { $st = $pdo->prepare('SELECT * FROM theme_themes WHERE slug=?'); $st->execute([(string) $_GET['preview']]); $pv = $st->fetch(); }
$ptok = $pv ? (json_decode($pv['tokens'], true) ?: []) : [];
$g = fn(string $k, string $d) => $pv ? (string) ($ptok[substr($k, 6)] ?? $d) : themeGet($k, $d);
$fonts = ['Vazirmatn' => 'وزیرمتن', 'Estedad' => 'استعداد', 'Noto Kufi Arabic' => 'نوتو کوفی', 'Harmattan' => 'هارمتان', 'Lalezar' => 'لاله‌زار'];
?>
<h1 class="adm-h1">رنگ‌ها، فونت و ظاهر</h1>
<?php if ($pv): ?><div class="adm-flash" style="background:#f0f9ff;border-color:#bae6fd;color:#0369a1">👁 حالت پیش‌نمایش قالب «<?= e($pv['name']) ?>» — این رنگ‌ها هنوز فعال نشده‌اند. با «ذخیره» روی سایت اعمال می‌شوند یا از «مدیریت قالب‌ها» فعال‌سازی کنید. <a href="index.php?tab=design">خروج از پیش‌نمایش</a></div><?php endif; ?>
<p class="adm-sub">تغییرات در پیش‌نمایش زیر زنده دیده می‌شود؛ با «ذخیره» روی کل سایت اعمال می‌گردد</p>
<form method="post" class="adm-grid-2">
  <?= csrfField() ?><input type="hidden" name="action" value="save_settings"><input type="hidden" name="switches" value="design.animations">
  <div class="adm-card">
    <label class="adm-field"><span>رنگ اصلی (سرمه‌ای هدر/فوتر)</span><span class="adm-row"><input type="color" name="s[theme.primary]" value="<?= e($g('theme.primary','#1b3a6b')) ?>" data-live="--navy" style="width:56px;height:42px;border:1px solid #e2e4ea;border-radius:12px;padding:3px"><input class="adm-input" value="<?= e($g('theme.primary','#1b3a6b')) ?>" readonly dir="ltr" style="flex:1"></span></label>
    <label class="adm-field"><span>رنگ تأکیدی (دکمه‌ها — صورتی)</span><span class="adm-row"><input type="color" name="s[theme.accent]" value="<?= e($g('theme.accent','#e91e63')) ?>" data-live="--pink" style="width:56px;height:42px;border:1px solid #e2e4ea;border-radius:12px;padding:3px"><input class="adm-input" value="<?= e($g('theme.accent','#e91e63')) ?>" readonly dir="ltr" style="flex:1"></span></label>
    <label class="adm-field"><span>رنگ طلایی (هایلایت)</span><span class="adm-row"><input type="color" name="s[theme.gold]" value="<?= e($g('theme.gold','#ffc107')) ?>" data-live="--gold" style="width:56px;height:42px;border:1px solid #e2e4ea;border-radius:12px;padding:3px"><input class="adm-input" value="<?= e($g('theme.gold','#ffc107')) ?>" readonly dir="ltr" style="flex:1"></span></label>
    <label class="adm-field"><span>رنگ پس‌زمینه سایت</span><input type="color" name="s[design.bg_color]" value="<?= e(themeGet('design.bg_color','#f3f4f8')) ?>" style="width:56px;height:42px;border:1px solid #e2e4ea;border-radius:12px;padding:3px"></label>
    <label class="adm-field"><span>فونت فارسی</span><select class="adm-select" name="s[theme.font]"><?php foreach ($fonts as $v => $l): ?><option value="<?= $v ?>" <?= $g('theme.font','Vazirmatn') === $v ? 'selected' : '' ?>><?= $l ?></option><?php endforeach; ?></select></label>
    <label class="adm-field"><span>گردی گوشه‌ها: <b id="rv"><?= (int) $g('theme.radius','20') ?></b>px</span><input type="range" name="s[theme.radius]" min="0" max="40" step="2" value="<?= (int) $g('theme.radius','20') ?>" data-live="--radius" data-unit="px" oninput="document.getElementById('rv').textContent=this.value" style="width:100%;accent-color:var(--pink)"></label>
    <label class="adm-field"><span>عرض محتوای سایت (px)</span><input class="adm-input" type="number" name="s[design.content_width]" min="1024" max="1600" step="16" value="<?= (int) themeGet('design.content_width','1280') ?>" dir="ltr"></label>
    <label class="adm-row" style="justify-content:space-between;border:1px solid #e6e8ee;border-radius:12px;padding:10px"><span style="font-size:11px;font-weight:700">انیمیشن‌ها و افکت‌های انتقال</span><span class="adm-switch"><input type="checkbox" name="s[design.animations]" value="1" <?= themeBool('design.animations', true) ? 'checked' : '' ?>><i></i></span></label>
    <button class="adm-btn adm-btn-primary" style="width:100%;height:46px;margin-top:6px">ذخیره و اعمال روی سایت</button>
  </div>
  <div class="adm-card" id="livePreview" style="--navy:<?= e($g('theme.primary','#1b3a6b')) ?>;--pink:<?= e($g('theme.accent','#e91e63')) ?>;--gold:<?= e($g('theme.gold','#ffc107')) ?>;--radius:<?= (int) $g('theme.radius','20') ?>px">
    <h3 style="margin:0 0 8px;font-size:12px;color:#6b7280">پیش‌نمایش زنده</h3>
    <div style="border-radius:var(--radius);overflow:hidden;border:1px solid #e6e8ee">
      <div style="background:var(--navy);color:#fff;font-size:10px;padding:6px 12px">تخفیف ویژه تا ۷۰٪ در جشنواره تابستانی</div>
      <div style="background:#fff;padding:10px 12px;display:flex;justify-content:space-between;align-items:center"><b style="color:var(--navy)">Mini<span style="color:var(--pink)">Moda</span></b><span style="background:var(--navy);width:34px;height:34px;border-radius:10px;display:grid;place-items:center;color:var(--gold)">🛒</span></div>
      <div style="padding:12px;background:#fff">
        <div style="background:linear-gradient(135deg,var(--navy),var(--pink));border-radius:var(--radius);padding:18px;color:#fff"><small style="color:var(--gold);font-weight:800">کالکشن جدید</small><p style="margin:4px 0;font-size:18px;font-weight:900">استایل خاص<br>برای نسل خاص!</p><span style="display:inline-block;background:var(--pink);border-radius:99px;padding:6px 14px;font-size:10px;font-weight:900">مشاهده مجموعه</span></div>
        <div style="margin-top:10px;display:flex;justify-content:space-between;align-items:center;border:1px solid #eef0f5;border-radius:var(--radius);padding:8px"><span style="font-size:10px;color:var(--gold)">★★★★★</span><span style="background:var(--pink);color:#fff;border-radius:99px;padding:6px 12px;font-size:9px;font-weight:900">افزودن به سبد خرید</span></div>
      </div>
    </div>
  </div>
</form>
