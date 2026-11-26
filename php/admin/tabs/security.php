<?php $users = $pdo->query('SELECT id, name, email, role, created_at FROM users ORDER BY id ASC')->fetchAll(); ?>
<h1 class="adm-h1">امنیت و دسترسی‌ها</h1>
<p class="adm-sub">سطح دسترسی کاربران، وضعیت محافظت‌ها و ثبت فعالیت</p>
<div class="adm-grid-2">
  <div class="adm-card" style="overflow:auto">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">کاربران و نقش‌ها</h3>
    <table class="adm-table"><thead><tr><th>کاربر</th><th>ایمیل</th><th>نقش</th><th>تغییر</th></tr></thead><tbody>
    <?php foreach ($users as $u): $isMe = (int) $u['id'] === (int) $me['id']; ?>
      <tr><td><b><?= e($u['name']) ?></b><?= $isMe ? ' <small style="color:#059669">(شما)</small>' : '' ?></td><td dir="ltr" style="text-align:right;font-size:10px"><?= e($u['email']) ?></td><td><?= $u['role'] === 'admin' ? '<span style="background:#fef3c7;color:#92400e;border-radius:99px;padding:2px 8px;font-size:9px;font-weight:900">مدیر</span>' : '<span style="font-size:10px;color:#6b7280">مشتری</span>' ?></td>
      <td><?php if ($isMe): ?><small class="adm-note">—</small><?php else: ?><form method="post" onsubmit="return confirm('نقش تغییر کند؟')"><?= csrfField() ?><input type="hidden" name="action" value="set_role"><input type="hidden" name="user_id" value="<?= $u['id'] ?>"><input type="hidden" name="role" value="<?= $u['role'] === 'admin' ? 'user' : 'admin' ?>"><button class="adm-btn adm-btn-sm <?= $u['role'] === 'admin' ? 'adm-btn-danger' : 'adm-btn-ghost' ?>"><?= $u['role'] === 'admin' ? 'تنزل به مشتری' : 'ارتقا به مدیر' ?></button></form><?php endif; ?></td></tr>
    <?php endforeach; ?></tbody></table>
  </div>
  <div class="adm-card">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">وضعیت محافظت‌ها</h3>
    <ul class="adm-list" style="font-size:11px">
      <?php foreach ([['✅','کنترل دسترسی سمت سرور','فقط نقش admin به این پنل'],['✅','CSRF روی همه فرم‌ها','توکن نشست'],['✅','Prepared Statements','همه کوئری‌ها پارامتری'],['✅','اعتبارسنجی فایل‌های آپلودی','پسوند، حجم، اسکن کد مخرب'],['✅','جلوگیری از اجرای کد در ابزارک/قالب','فیلتر <script>، فقط توکن طراحی'],['✅','حذف فقط از پوشه uploads','فایل‌های اصلی قالب محافظت‌شده'],['✅','Audit Log','همه تغییرات با نام کاربر'],['✅','تأیید قبل از عملیات حساس','confirm روی حذف/بازیابی/فعال‌سازی'],['ℹ️','تأیید دومرحله‌ای (2FA)','نیازمند درگاه OTP پیامکی — زیرساخت']] as [$i,$t,$d]): ?>
        <li><span><?= $i ?></span><span class="grow"><b><?= $t ?></b><small style="direction:rtl"><?= $d ?></small></span></li>
      <?php endforeach; ?>
    </ul>
    <p class="adm-note">توصیه: رمز مدیر را دوره‌ای تغییر دهید و فایل check.php را بعد از نصب حذف کنید.</p>
  </div>
</div>
