<?php $ps = $pdo->query('SELECT * FROM theme_presets ORDER BY id DESC')->fetchAll(); $lbl = ['hero'=>'هیرو','categories'=>'دسته‌ها','banners'=>'بنرها','popular'=>'محبوب‌ها','trio'=>'۳ بنر','trust'=>'اعتماد','magazine'=>'مجله','news'=>'اخبار','duo'=>'دوگانه','tabs'=>'تب‌ها']; ?>
<h1 class="adm-h1">الگوهای آماده چیدمان</h1>
<p class="adm-sub">چیدمان فعلی (بخش‌ها + رنگ‌ها + واکنش‌گرا) را ذخیره کنید و با یک کلیک بین الگوها جابه‌جا شوید</p>
<form method="post" class="adm-card adm-row"><?= csrfField() ?><input type="hidden" name="action" value="save_preset"><input class="adm-input" name="name" placeholder="نام الگو (مثلاً: چیدمان نوروز)" required style="flex:1;min-width:180px"><input class="adm-input" name="description" placeholder="توضیح (اختیاری)" style="flex:1;min-width:180px"><button class="adm-btn adm-btn-primary">ذخیره چیدمان فعلی</button></form>
<div class="adm-grid-3" style="margin-top:12px">
  <?php foreach ($ps as $p): $d = json_decode($p['snapshot'], true) ?: []; $t = $d['tokens'] ?? []; ?>
    <article class="adm-theme">
      <div class="adm-theme-prev" style="height:70px;background:linear-gradient(135deg,<?= e($t['theme.primary'] ?? '#1b3a6b') ?>,<?= e($t['theme.accent'] ?? '#e91e63') ?>)"></div>
      <div class="adm-theme-body">
        <h3><?= e($p['name']) ?></h3><p><?= e($p['description'] ?: '—') ?></p>
        <div class="adm-row" style="gap:3px;margin-bottom:8px"><?php foreach ($d['sections'] ?? [] as $id => $on): ?><span style="font-size:8px;font-weight:800;border-radius:6px;padding:2px 6px;<?= $on ? 'background:#ecfdf5;color:#065f46' : 'background:#f1f5f9;color:#94a3b8;text-decoration:line-through' ?>"><?= $lbl[$id] ?? $id ?></span><?php endforeach; ?></div>
        <small style="font-size:9px;color:#9ca3af"><?= e($p['created_by']) ?> · <?= faDate($p['created_at']) ?></small>
        <div class="adm-row" style="margin-top:8px">
          <form method="post" onsubmit="return confirm('الگوی «<?= e($p['name']) ?>» اعمال شود؟ (پشتیبان خودکار گرفته می‌شود)')"><?= csrfField() ?><input type="hidden" name="action" value="apply_preset"><input type="hidden" name="id" value="<?= $p['id'] ?>"><button class="adm-btn adm-btn-navy adm-btn-sm">اعمال</button></form>
          <form method="post" onsubmit="return confirm('حذف شود؟')"><?= csrfField() ?><input type="hidden" name="action" value="delete_preset"><input type="hidden" name="id" value="<?= $p['id'] ?>"><button class="adm-btn adm-btn-danger adm-btn-sm">حذف</button></form>
        </div>
      </div>
    </article>
  <?php endforeach; ?>
</div>
