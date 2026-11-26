<?php
require __DIR__ . '/bootstrap.php';
$pdo = db();
requireLogin();
$user = currentUser();

// ── ذخیره ویرایش پروفایل ─────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'update') {
    csrfCheck();
    $name = trim((string)($_POST['name'] ?? ''));
    $phone = trim((string)($_POST['phone'] ?? ''));
    $address = trim((string)($_POST['address'] ?? ''));
    if (mb_strlen($name) >= 3 && ($phone === '' || preg_match('/^09\d{9}$/', $phone))) {
        $st = $pdo->prepare('UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?');
        $st->execute([$name, $phone, $address, (int)$user['id']]);
        flash('اطلاعات حساب ذخیره شد');
    } else {
        flash('اطلاعات واردشده معتبر نیست.', 'error');
    }
    redirect('account.php');
}

$st = $pdo->prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC');
$st->execute([(int)$user['id']]);
$orders = $st->fetchAll();
$itemsByOrder = [];
if ($orders) {
    $ids = implode(',', array_map('intval', array_column($orders, 'id')));
    foreach ($pdo->query("SELECT * FROM order_items WHERE order_id IN ($ids)") as $item) {
        $itemsByOrder[(int)$item['order_id']][] = $item;
    }
}

$statuses = [
    'pending'    => ['در انتظار پرداخت', 'st-pending'],
    'processing' => ['در حال آماده‌سازی', 'st-processing'],
    'shipped'    => ['ارسال شده', 'st-shipped'],
    'delivered'  => ['تحویل داده شد', 'st-delivered'],
    'cancelled'  => ['لغو شده', 'st-cancelled'],
];
$paymentLabels = ['online' => 'درگاه آنلاین (زرین‌پال)', 'onsite' => 'پرداخت درب منزل', 'card' => 'کارت به کارت'];
$initials = mb_substr(trim($user['name']), 0, 1);

$pageTitle = 'حساب کاربری من | مینی‌مودا';
include __DIR__ . '/partials/header.php';
?>
<div class="wrap" style="max-width:1000px">

  <!-- سربرگ حساب -->
  <div style="display:flex;align-items:center;gap:16px;background:linear-gradient(135deg,#14264a,#1d3a63);border-radius:var(--radius);padding:18px 22px;color:#fff;margin-top:14px;flex-wrap:wrap">
    <div style="width:74px;height:74px;border-radius:20px;background:linear-gradient(135deg,#fcd34d,#f59e0b);display:grid;place-items:center;font-size:28px;font-weight:900;color:#14264a"><?= e($initials) ?></div>
    <div style="flex:1;min-width:180px">
      <small style="color:var(--gold);font-size:9px;font-weight:800"><?= $user['role'] === 'admin' ? 'مدیر فروشگاه' : 'عضو ویژه مینی‌مودا' ?></small>
      <h1 style="margin:2px 0;font-size:19px"><?= e($user['name']) ?></h1>
      <small style="color:rgba(255,255,255,.7);font-size:10px"><span dir="ltr"><?= e($user['email']) ?></span> · <span dir="ltr"><?= e($user['phone']) ?></span></small>
    </div>
    <form method="post" action="auth.php">
      <?= csrfField() ?>
      <input type="hidden" name="action" value="logout">
      <button class="btn" type="submit" style="background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.25);height:42px;padding:0 18px;font-size:11px">خروج از حساب</button>
    </form>
  </div>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;margin-top:14px;align-items:start">

    <!-- ویرایش پروفایل -->
    <div class="panel">
      <h2 style="margin:0 0 8px;font-size:14px;color:var(--navy)">ویرایش اطلاعات حساب</h2>
      <form method="post" action="account.php" class="form">
        <?= csrfField() ?>
        <input type="hidden" name="action" value="update">
        <div><label class="label" for="name">نام و نام خانوادگی</label><input class="input" id="name" name="name" required value="<?= e($user['name']) ?>"></div>
        <div><label class="label" for="phone">شماره موبایل</label><input class="input" id="phone" name="phone" dir="ltr" value="<?= e($user['phone']) ?>" placeholder="09121234567"></div>
        <div><label class="label" for="address">آدرس پیش‌فرض ارسال</label><textarea class="textarea" id="address" name="address" placeholder="آدرس کامل..."><?= e($user['address']) ?></textarea></div>
        <button class="btn btn-navy btn-block" type="submit" style="height:46px;font-size:12px">ذخیره تغییرات</button>
      </form>
      <?php if ($user['role'] === 'admin'): ?>
        <a class="btn btn-gold btn-block" href="admin.php" style="height:46px;font-size:12px;margin-top:10px">ورود به پنل مدیریت</a>
      <?php endif; ?>
      <a class="btn btn-outline btn-block" href="wishlist.php" style="height:44px;font-size:11px;margin-top:8px">علاقه‌مندی‌های من (<?= faNum(wishlistCount()) ?>)</a>
    </div>

    <!-- سفارش‌ها -->
    <div id="orders" class="panel" style="grid-column: span 1">
      <h2 style="margin:0 0 10px;font-size:14px;color:var(--navy)">سفارش‌های من (<?= faNum(count($orders)) ?>)</h2>
      <?php if (!$orders): ?>
        <div class="empty" style="padding:30px 16px"><h3 style="font-size:14px">هنوز سفارشی ثبت نکرده‌اید</h3><a class="btn btn-primary" href="products.php" style="height:44px;padding:0 26px;margin-top:10px;font-size:12px">شروع خرید</a></div>
      <?php else: foreach ($orders as $order): [$label, $cls] = $statuses[$order['status']] ?? $statuses['pending']; $oItems = $itemsByOrder[(int)$order['id']] ?? []; ?>
        <article style="border:1px solid #eef0f5;border-radius:14px;margin-bottom:10px;overflow:hidden">
          <header style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;background:#f8f9fc;padding:8px 12px;font-size:10px;border-bottom:1px solid #eef0f5">
            <b style="color:var(--navy)">#MM-<?= faDigits(str_pad((string)$order['id'], 5, '0', STR_PAD_LEFT)) ?></b>
            <span class="muted"><?= faDate($order['created_at']) ?></span>
            <span class="st <?= e($cls) ?>"><?= e($label) ?></span>
            <span class="muted" style="margin-inline-start:auto"><?= e($paymentLabels[$order['payment_method']] ?? '') ?></span>
          </header>
          <div style="padding:10px 12px;display:flex;gap:12px;align-items:center;flex-wrap:wrap">
            <div style="display:flex;gap:6px;overflow:auto;flex:1">
              <?php foreach ($oItems as $item): ?>
                <div style="text-align:center">
                  <img src="<?= e($item['image']) ?>" alt="<?= e($item['name']) ?>" style="width:52px;height:64px;object-fit:cover;border-radius:8px;background:#f6f4ef">
                  <small class="muted" style="font-size:9px">×<?= faDigits($item['quantity']) ?></small>
                </div>
              <?php endforeach; ?>
            </div>
            <div style="text-align:left">
              <strong style="color:var(--navy);font-size:13px"><?= faMoney($order['total']) ?></strong>
              <small class="muted" style="display:block;font-size:9px"><?= faDigits(count($oItems)) ?> قلم · <?= e($order['phone']) ?></small>
            </div>
          </div>
        </article>
      <?php endforeach; endif; ?>
    </div>
  </div>
</div>
<?php include __DIR__ . '/partials/footer.php'; ?>
