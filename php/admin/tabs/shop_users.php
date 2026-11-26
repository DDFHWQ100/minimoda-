<?php
require __DIR__ . '/../shop-lib.php';
$pdo = db();
$users = $pdo->query('SELECT u.*, (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) AS orders_count FROM users u ORDER BY u.created_at DESC')->fetchAll();
$me = currentUser();
$admins = count(array_filter($users, fn($u) => $u['role'] === 'admin'));
?>
<h1 class="adm-h1">کاربران و سطح دسترسی</h1>
<p class="adm-sub"><?= faNum(count($users)) ?> کاربر — <?= faNum($admins) ?> مدیر · ارتقا/تنزل نقش با یک کلیک</p>
<div class="adm-card" style="overflow-x:auto">
  <table class="adm-table">
    <thead><tr><th>کاربر</th><th>ایمیل</th><th>سفارش‌ها</th><th>نقش</th><th>تغییر نقش</th></tr></thead>
    <tbody>
      <?php foreach ($users as $u): $isAdmin = $u['role'] === 'admin'; $isSelf = (int) $me['id'] === (int) $u['id']; ?>
        <tr>
          <td><div class="adm-row" style="gap:8px"><span style="width:34px;height:34px;border-radius:50%;background:#eef1f6;display:grid;place-items:center;font-weight:900;color:var(--navy)"><?= e(mb_substr(trim($u['name']), 0, 1)) ?></span><span><b><?= e($u['name']) ?></b><?php if ($isSelf): ?> <small style="color:#059669">(شما)</small><?php endif; ?></span></div></td>
          <td dir="ltr" style="color:#6b7280"><?= e($u['email']) ?></td>
          <td><?= faNum($u['orders_count']) ?></td>
          <td><?php if ($isAdmin): ?><span style="font-size:9px;font-weight:900;background:#fef3c7;color:#92400e;border:1px solid #fde68a;border-radius:99px;padding:2px 10px">مدیر</span><?php else: ?>مشتری<?php endif; ?></td>
          <td><?php if ($isSelf): ?><small style="color:#9ca3af">نقش خودتان قابل تغییر نیست</small><?php else: ?><form method="post" onsubmit="return confirm('نقش <?= e($u['name']) ?> تغییر کند؟')"><?= csrfField() ?><input type="hidden" name="action" value="shop_set_role"><input type="hidden" name="user_id" value="<?= (int)$u['id'] ?>"><input type="hidden" name="role" value="<?= $isAdmin ? 'user' : 'admin' ?>"><button class="adm-btn <?= $isAdmin ? 'adm-btn-danger' : 'adm-btn-primary' ?> adm-btn-sm"><?= $isAdmin ? 'تنزل به مشتری' : 'ارتقا به مدیر' ?></button></form><?php endif; ?></td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</div>
