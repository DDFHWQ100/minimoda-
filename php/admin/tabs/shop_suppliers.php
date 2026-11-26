<?php
require __DIR__ . '/../shop-lib.php';
$pdo = db();
$has = shopHasTable('suppliers');
$all = $has ? $pdo->query('SELECT * FROM suppliers ORDER BY id ASC')->fetchAll() : [];
?>
<h1 class="adm-h1">تأمین‌کنندگان</h1>
<p class="adm-sub"><?= faNum(count($all)) ?> تأمین‌کننده ثبت‌شده — پارچه، پوشاک و کفش</p>
<?php if (!$has): ?><div class="adm-flash is-error">جدول suppliers وجود ندارد؛ فایل database.sql جدید را ایمپورت کنید.</div><?php else: ?>
<div class="adm-grid-2">
  <div class="adm-grid-3">
    <?php foreach ($all as $s): ?>
      <div class="adm-card">
        <div class="adm-row" style="justify-content:space-between"><b style="font-size:12px;color:var(--navy)"><?= e($s['name']) ?></b>
          <form method="post" onsubmit="return confirm('تأمین‌کننده «<?= e($s['name']) ?>» حذف شود؟')"><?= csrfField() ?><input type="hidden" name="action" value="shop_delete"><input type="hidden" name="table" value="suppliers"><input type="hidden" name="id" value="<?= (int)$s['id'] ?>"><button class="adm-btn adm-btn-danger adm-btn-sm">حذف</button></form></div>
        <p style="font-size:10px;color:#6b7280;margin:6px 0"><?= e($s['contact_person']) ?><?php if ($s['phone']): ?><br><span dir="ltr"><?= e($s['phone']) ?></span><?php endif; ?></p>
        <p style="font-size:10px;color:#6b7280"><?= e($s['address']) ?></p>
        <?php if ($s['notes']): ?><p style="font-size:9px;color:#9ca3af;border-top:1px dashed var(--line);padding-top:6px"><?= e($s['notes']) ?></p><?php endif; ?>
      </div>
    <?php endforeach; ?>
    <?php if (!$all): ?><p class="adm-note">تأمین‌کننده‌ای ثبت نشده.</p><?php endif; ?>
  </div>
  <form method="post" class="adm-card">
    <?= csrfField() ?><input type="hidden" name="action" value="shop_create_supplier">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">افزودن تأمین‌کننده</h3>
    <label class="adm-field"><span>نام شرکت / کارگاه *</span><input class="adm-input" name="name" required placeholder="مثلاً: نساجی پارینه یزد"></label>
    <label class="adm-field"><span>رابط</span><input class="adm-input" name="contact_person" placeholder="مهندس شریفی"></label>
    <label class="adm-field"><span>تلفن</span><input class="adm-input" name="phone" dir="ltr" placeholder="09132567890"></label>
    <label class="adm-field"><span>آدرس</span><input class="adm-input" name="address" placeholder="شهر، شهرک صنعتی..."></label>
    <label class="adm-field"><span>یادداشت (شرایط پرداخت، MOQ...)</span><textarea class="adm-textarea" name="notes" placeholder="۱۵ روز تسویه — MOQ هر سایز ۱۰۰ عدد"></textarea></label>
    <button class="adm-btn adm-btn-primary" style="width:100%">ثبت تأمین‌کننده</button>
  </form>
</div>
<?php endif; ?>
