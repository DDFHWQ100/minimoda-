<?php
require __DIR__ . '/../shop-lib.php';
$pdo = db();
$has = shopHasTable('contact_messages');
$messages = $has ? $pdo->query('SELECT * FROM contact_messages ORDER BY is_read ASC, id DESC')->fetchAll() : [];
$unread = array_filter($messages, fn($m) => !$m['is_read']);
?>
<h1 class="adm-h1">پیام‌ها و پشتیبانی</h1>
<p class="adm-sub"><?= faNum(count($unread)) ?> خوانده‌نشده از <?= faNum(count($messages)) ?> پیام مشتریان</p>
<?php if (!$has): ?><div class="adm-flash is-error">جدول contact_messages وجود ندارد؛ فایل database.sql جدید را ایمپورت کنید.</div><?php else: ?>
<div class="adm-card" style="display:grid;gap:10px;max-width:920px">
  <?php foreach ($messages as $m): ?>
    <div style="border:1px solid <?= $m['is_read'] ? '#eef0f5' : '#f9a8d4' ?>;border-radius:14px;padding:12px;background:<?= $m['is_read'] ? '#fff' : '#fdf2f8' ?>">
      <div class="adm-row" style="justify-content:space-between;flex-wrap:wrap;gap:6px">
        <div><b style="color:var(--navy);font-size:11px"><?= e($m['name']) ?></b> <small style="color:#6b7280">· <?= e($m['contact']) ?></small><br><b style="font-size:12px"><?= e($m['subject']) ?></b></div>
        <small style="color:#9ca3af"><?= faDate($m['created_at']) ?></small>
      </div>
      <p style="font-size:11px;line-height:1.9;color:#374151;margin:8px 0"><?= e($m['body']) ?></p>
      <div class="adm-row" style="justify-content:space-between;flex-wrap:wrap;gap:6px">
        <?php if (str_contains($m['contact'], '@')): ?><a class="adm-btn adm-btn-ghost adm-btn-sm" href="mailto:<?= e($m['contact']) ?>?subject=پاسخ به «<?= e($m['subject']) ?>»">پاسخ با ایمیل</a>
        <?php else: ?><a class="adm-btn adm-btn-ghost adm-btn-sm" dir="ltr" href="tel:<?= e(preg_replace('/\D/', '', $m['contact'])) ?>">تماس: <?= e($m['contact']) ?></a><?php endif; ?>
        <span class="adm-row" style="gap:4px">
          <form method="post" style="display:inline"><?= csrfField() ?><input type="hidden" name="action" value="shop_toggle"><input type="hidden" name="table" value="contact_messages"><input type="hidden" name="field" value="is_read"><input type="hidden" name="id" value="<?= (int)$m['id'] ?>"><button class="adm-btn adm-btn-ghost adm-btn-sm"><?= $m['is_read'] ? 'علامت نخوانده' : 'علامت خوانده‌شده' ?></button></form>
          <form method="post" onsubmit="return confirm('این پیام حذف شود؟')"><?= csrfField() ?><input type="hidden" name="action" value="shop_delete"><input type="hidden" name="table" value="contact_messages"><input type="hidden" name="id" value="<?= (int)$m['id'] ?>"><button class="adm-btn adm-btn-danger adm-btn-sm">حذف</button></form>
        </span>
      </div>
    </div>
  <?php endforeach; ?>
  <?php if (!$messages): ?><div class="adm-note" style="text-align:center;padding:30px">صندوق پیام‌ها خالی است.</div><?php endif; ?>
</div>
<?php endif; ?>
