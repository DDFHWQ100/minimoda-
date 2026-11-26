<?php
require __DIR__ . '/bootstrap.php';
$pdo = db();

// ── ثبت نهایی سفارش ──────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrfCheck();
    $customerName = trim((string)($_POST['customer_name'] ?? ''));
    $phone = trim((string)($_POST['phone'] ?? ''));
    $address = trim((string)($_POST['address'] ?? ''));
    $note = trim((string)($_POST['note'] ?? ''));
    $payment = in_array($_POST['payment_method'] ?? '', ['online', 'onsite', 'card'], true) ? $_POST['payment_method'] : 'online';

    $totals = cartTotals(); // قیمت‌ها همیشه از دیتابیس خوانده می‌شوند
    $errors = [];
    if (mb_strlen($customerName) < 3) { $errors[] = 'نام گیرنده را کامل وارد کنید.'; }
    if (!preg_match('/^09\d{9}$/', $phone)) { $errors[] = 'شماره موبایل معتبر وارد کنید (مثال: 09121234567)'; }
    if (mb_strlen($address) < 10) { $errors[] = 'آدرس کامل پستی را وارد کنید.'; }
    if (!$totals['lines']) { $errors[] = 'سبد خرید خالی است.'; }

    if ($errors) {
        foreach ($errors as $err) { flash($err, 'error'); }
        redirect('checkout.php');
    }

    $user = currentUser();
    try {
        $pdo->beginTransaction();
        $st = $pdo->prepare('INSERT INTO orders (user_id, total, status, customer_name, phone, address, note, payment_method) VALUES (?,?,?,?,?,?,?,?)');
        $status = $payment === 'onsite' ? 'processing' : 'pending';
        $st->execute([$user['id'] ?? null, (int)$totals['total'], $status, $customerName, $phone, $address, $note, $payment]);
        $orderId = (int)$pdo->lastInsertId();

        $stItem = $pdo->prepare('INSERT INTO order_items (order_id, product_id, name, image, price, quantity, size, color) VALUES (?,?,?,?,?,?,?,?)');
        $stStock = $pdo->prepare('UPDATE products SET stock = GREATEST(stock - ?, 0), sales_count = sales_count + ? WHERE id = ?');
        foreach ($totals['lines'] as $line) {
            $p = $line['product'];
            $img = productImage($p);
            $stItem->execute([$orderId, (int)$p['id'], $p['name'], $img, (int)$line['eff'], (int)$line['qty'], $line['size'], $line['color']]);
            $stStock->execute([(int)$line['qty'], (int)$line['qty'], (int)$p['id']]);
        }
        $pdo->commit();
        unset($_SESSION['cart']);
        redirect('checkout.php?success=' . $orderId);
    } catch (Throwable $ex) {
        if ($pdo->inTransaction()) { $pdo->rollBack(); }
        flash('ثبت سفارش با خطا مواجه شد؛ دوباره تلاش کنید.', 'error');
        redirect('checkout.php');
    }
}

// ── صفحه موفقیت ───────────────────────────────────────────────
if (isset($_GET['success'])) {
    $orderId = (int)$_GET['success'];
    $pageTitle = 'سفارش شما ثبت شد | مینی‌مودا';
    include __DIR__ . '/partials/header.php';
    ?>
    <div class="wrap" style="max-width:560px;text-align:center;padding:48px 16px">
      <div style="width:96px;height:96px;border-radius:50%;background:#d1fae5;display:grid;place-items:center;margin:0 auto"><svg viewBox="0 0 24 24" width="52" height="52" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 10"/></svg></div>
      <h1 style="color:var(--navy);font-size:24px;margin:16px 0 6px">سفارش شما با موفقیت ثبت شد!</h1>
      <p style="color:#4b5563;line-height:2">سفارش شماره <b style="color:var(--pink)">#MM-<?= faDigits(str_pad((string)$orderId, 5, '0', STR_PAD_LEFT)) ?></b> در سیستم ثبت شد. کارشناسان مینی‌مودا طی ساعات اداری برای هماهنگی ارسال با شما تماس می‌گیرند.</p>
      <div style="display:flex;gap:10px;justify-content:center;margin-top:18px;flex-wrap:wrap">
        <a class="btn btn-navy" href="account.php?tab=orders" style="height:48px;padding:0 24px">پیگیری سفارش</a>
        <a class="btn btn-outline" href="products.php" style="height:48px;padding:0 24px">ادامه خرید</a>
      </div>
    </div>
    <?php
    include __DIR__ . '/partials/footer.php';
    exit;
}

// ── فرم تسویه ─────────────────────────────────────────────────
$totals = cartTotals();
$user = currentUser();
$pageTitle = 'تکمیل سفارش | مینی‌مودا';
include __DIR__ . '/partials/header.php';

if (!$totals['lines']): ?>
  <div class="wrap"><div class="empty"><h3>سبد خرید شما خالی است</h3><p>برای ثبت سفارش ابتدا محصولی به سبد اضافه کنید.</p><a class="btn btn-primary" href="products.php" style="height:46px;padding:0 28px;margin-top:12px">رفتن به فروشگاه</a></div></div>
  <?php include __DIR__ . '/partials/footer.php'; exit; ?>
<?php endif; ?>

<div class="wrap">
  <h1 class="sec-title" style="margin-top:14px">تکمیل سفارش</h1>
  <p class="muted" style="font-size:11px;margin:4px 0 0"><?= $user ? 'سفارش با حساب کاربری شما ثبت می‌شود.' : 'می‌توانید مهمان خرید کنید؛ ثبت‌نام سفارش‌ها را قابل پیگیری می‌کند.' ?></p>

  <form method="post" action="checkout.php" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;margin-top:14px;align-items:start">
    <?= csrfField() ?>

    <div class="panel">
      <h2 style="margin:0 0 10px;font-size:15px;color:var(--navy)">اطلاعات گیرنده</h2>
      <div class="form">
        <div><label class="label" for="customer_name">نام و نام خانوادگی *</label><input class="input" id="customer_name" name="customer_name" required value="<?= e($user['name'] ?? '') ?>" placeholder="مثلاً سارا محمدی"></div>
        <div><label class="label" for="phone">شماره موبایل *</label><input class="input" id="phone" name="phone" required dir="ltr" inputmode="numeric" pattern="09[0-9]{9}" value="<?= e($user['phone'] ?? '') ?>" placeholder="09121234567"></div>
        <div><label class="label" for="address">آدرس کامل پستی *</label><textarea class="textarea" id="address" name="address" required placeholder="استان، شهر، خیابان، کوچه، پلاک، واحد، کد پستی"><?= e($user['address'] ?? '') ?></textarea></div>
        <div><label class="label" for="note">توضیحات سفارش (اختیاری)</label><input class="input" id="note" name="note" placeholder="مثلاً: لطفاً قبل از ارسال هماهنگ کنید"></div>
      </div>

      <h2 style="margin:16px 0 10px;font-size:15px;color:var(--navy)">روش پرداخت</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px">
        <?php foreach ([
          ['online', 'پرداخت آنلاین', 'زرین‌پال — همه کارت‌ها', true],
          ['onsite', 'پرداخت درب منزل', 'تهران و کرج — نقد/کارت', false],
          ['card',   'کارت به کارت', 'شماره کارت پس از ثبت', false],
        ] as [$id, $t, $d, $checked]): ?>
          <label style="cursor:pointer">
            <input type="radio" name="payment_method" value="<?= e($id) ?>" <?= $checked ? 'checked' : '' ?> style="position:absolute;opacity:0">
            <span class="pay-card"><b><?= e($t) ?></b><small><?= e($d) ?></small></span>
          </label>
        <?php endforeach; ?>
      </div>
    </div>

    <aside class="panel" style="position:sticky;top:90px">
      <h2 style="margin:0 0 8px;font-size:15px;color:var(--navy)">اقلام سفارش (<?= faNum(count($totals['lines'])) ?>)</h2>
      <ul style="list-style:none;margin:0;padding:0;max-height:280px;overflow:auto">
        <?php foreach ($totals['lines'] as $line): $p = $line['product']; $img = productImage($p); ?>
          <li style="display:flex;gap:8px;align-items:center;padding:7px 0;border-bottom:1px solid #f1f2f6">
            <img src="<?= e($img) ?>" alt="<?= e($p['name']) ?>" style="width:46px;height:58px;object-fit:cover;border-radius:9px;background:#f6f4ef">
            <span style="flex:1;min-width:0"><span style="font-size:10px;font-weight:700;color:#374151;display:block;line-height:1.7"><?= e($p['name']) ?></span><small class="muted" style="font-size:9px">سایز <?= faDigits($line['size']) ?> · <?= faDigits($line['qty']) ?> عدد</small></span>
            <b style="font-size:10px;color:var(--navy);white-space:nowrap"><?= faMoney($line['eff'] * $line['qty']) ?></b>
          </li>
        <?php endforeach; ?>
      </ul>
      <div class="summary-row" style="margin-top:10px"><span>جمع کالاها</span><b><?= faMoney($totals['subtotal']) ?></b></div>
      <div class="summary-row"><span>ارسال</span><b><?= $totals['shipping'] === 0 ? '<span style="color:#059669">رایگان</span>' : faMoney($totals['shipping']) ?></b></div>
      <div class="summary-row total"><span>مبلغ نهایی</span><span><?= faMoney($totals['total']) ?></span></div>
      <button class="btn btn-primary btn-block" type="submit" style="height:54px;font-size:15px;margin-top:12px;background:linear-gradient(135deg,#059669,#0d9488);box-shadow:0 10px 22px -8px rgba(5,150,105,.5)">ثبت نهایی سفارش</button>
      <p class="help-text" style="text-align:center;margin-top:10px">با ثبت سفارش، قوانین و مقررات مینی‌مودا را می‌پذیرید.</p>
    </aside>
  </form>
</div>
<style>
.pay-card { display:block;border:1.5px solid var(--line);border-radius:14px;padding:10px;text-align:center;transition:.15s;background:#fff; }
.pay-card b { font-size:11px;color:var(--navy);display:block; }
.pay-card small { font-size:8px;color:var(--muted); }
input:checked + .pay-card { border-color: var(--pink); background: #fdf2f8; box-shadow: 0 0 0 3px rgba(219,39,119,.12); }
</style>
<?php include __DIR__ . '/partials/footer.php'; ?>
