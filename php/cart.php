<?php
require __DIR__ . '/bootstrap.php';

// ── اکشن‌ها (قبل از خروجی) ───────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrfCheck();
    $action = (string)($_POST['action'] ?? '');

    if ($action === 'add') {
        $id = (int)($_POST['id'] ?? 0);
        $qty = (int)($_POST['qty'] ?? 1);
        $size = (string)($_POST['size'] ?? '');
        $color = (string)($_POST['color'] ?? '');
        if ($id > 0) {
            cartAdd($id, $qty, $size, $color);
            flash('به سبد خرید اضافه شد');
        }
        redirect(safeNext($_POST['redirect'] ?? 'cart.php', 'cart.php'));
    }

    if ($action === 'update') {
        $key = (string)($_POST['key'] ?? '');
        $qty = isset($_POST['set_qty']) ? (int)$_POST['set_qty'] : (int)($_POST['qty'] ?? 1);
        $qty = max(0, min(99, $qty));
        if (isset($_SESSION['cart'][$key])) {
            if ($qty === 0) { unset($_SESSION['cart'][$key]); } else { $_SESSION['cart'][$key]['qty'] = $qty; }
        }
        redirect('cart.php');
    }

    if ($action === 'remove') {
        unset($_SESSION['cart'][(string)($_POST['key'] ?? '')]);
        flash('از سبد حذف شد');
        redirect('cart.php');
    }

    if ($action === 'clear') {
        unset($_SESSION['cart']);
        redirect('cart.php');
    }
}

$pageTitle = 'سبد خرید | مینی‌مودا';
$totals = cartTotals();
$lines = $totals['lines'];
$FREE = FREE_SHIPPING_AT;
include __DIR__ . '/partials/header.php';
?>
<div class="wrap">
  <div class="sec-head" style="margin-top:14px">
    <h1 class="sec-title">سبد خرید شما<?php if ($totals['count']): ?> <span class="muted" style="font-size:12px">(<?= faNum($totals['count']) ?> کالا)</span><?php endif; ?></h1>
    <?php if ($lines): ?><form method="post" action="cart.php"><?= csrfField() ?><input type="hidden" name="action" value="clear"><button class="sec-link" type="submit" style="background:none;border:0;cursor:pointer;font-family:inherit">خالی کردن سبد</button></form><?php endif; ?>
  </div>

  <?php if (!$lines): ?>
    <div class="empty">
      <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
      <h3>سبد خرید شما خالی است</h3>
      <p>کالکشن جدید مینی‌مودا منتظر شماست!</p>
      <a class="btn btn-primary" href="products.php" style="height:46px;padding:0 28px;margin-top:12px">شروع خرید</a>
    </div>
  <?php else: ?>

    <?php $remaining = $FREE - $totals['subtotal']; ?>
    <div class="free-note">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 8h4l4 4v5a1 1 0 0 1-1 1h-2"/><circle cx="7.5" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/></svg>
      <span><?php if ($remaining > 0): ?>فقط <b><?= faMoney($remaining) ?></b> دیگر تا <b>ارسال رایگان</b> فاصله دارید!<?php else: ?>تبریک! ارسال سفارش شما <b>رایگان</b> خواهد بود.<?php endif; ?></span>
    </div>
    <div class="progress" role="presentation"><i style="width:<?= (int)min(100, $FREE > 0 ? ($totals['subtotal'] / $FREE) * 100 : 100) ?>%"></i></div>

    <div class="cart-layout">
      <div class="panel">
        <?php foreach ($lines as $line): $p = $line['product']; $img = productImage($p); $base = (float)$p['price']; ?>
          <div class="cart-line">
            <a href="product.php?slug=<?= e($p['slug']) ?>"><img src="<?= e($img) ?>" alt="<?= e($p['name']) ?>"></a>
            <div style="flex:1;min-width:0">
              <a class="cart-line-title" href="product.php?slug=<?= e($p['slug']) ?>"><?= e($p['name']) ?></a>
              <p class="muted" style="margin:3px 0;font-size:10px">سایز: <?= faDigits($line['size']) ?> · رنگ: <?= e($line['color']) ?></p>
              <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-top:8px">
                <span>
                  <?php if ($line['eff'] < $base): ?><s class="muted" style="font-size:9px;display:block"><?= faMoney($base) ?></s><?php endif; ?>
                  <strong style="color:var(--navy);font-size:13px"><?= faMoney($line['eff']) ?></strong>
                </span>
                <div style="display:flex;gap:8px;align-items:center">
                  <form method="post" action="cart.php" class="qty" aria-label="تعداد">
                    <?= csrfField() ?>
                    <input type="hidden" name="action" value="update">
                    <input type="hidden" name="key" value="<?= e($line['key']) ?>">
                    <button type="submit" name="set_qty" value="<?= (int)$line['qty'] - 1 ?>" aria-label="کاهش">−</button>
                    <input type="text" name="qty" value="<?= faDigits($line['qty']) ?>" dir="ltr" inputmode="numeric" aria-label="تعداد" readonly>
                    <button type="submit" name="set_qty" value="<?= (int)$line['qty'] + 1 ?>" aria-label="افزایش">+</button>
                  </form>
                  <form method="post" action="cart.php"><?= csrfField() ?><input type="hidden" name="action" value="remove"><input type="hidden" name="key" value="<?= e($line['key']) ?>"><button type="submit" class="icon-btn" style="background:#fff1f2;color:#e11d48;width:36px;height:36px" aria-label="حذف"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button></form>
                </div>
              </div>
            </div>
          </div>
        <?php endforeach; ?>
        <a href="products.php" style="display:inline-flex;align-items:center;gap:6px;margin-top:12px;font-size:12px;font-weight:800;color:var(--muted);text-decoration:none">← ادامه خرید از فروشگاه</a>
      </div>

      <!-- خلاصه -->
      <aside class="panel" style="align-self:start;position:sticky;top:90px">
        <h2 style="margin:0 0 10px;font-size:15px;color:var(--navy)">خلاصه سفارش</h2>
        <div class="summary-row"><span>جمع کل کالاها</span><b><?= faMoney($totals['subtotal'] + $totals['savings']) ?></b></div>
        <?php if ($totals['savings'] > 0): ?><div class="summary-row" style="color:#059669"><span>تخفیف محصولات</span><b>− <?= faMoney($totals['savings']) ?></b></div><?php endif; ?>
        <div class="summary-row"><span>هزینه ارسال</span><b><?= $totals['shipping'] === 0 ? '<span style="color:#059669">رایگان</span>' : faMoney($totals['shipping']) ?></b></div>
        <div class="summary-row total"><span>مبلغ قابل پرداخت</span><span><?= faMoney($totals['total']) ?></span></div>
        <a class="btn btn-primary btn-block" href="checkout.php" style="height:52px;margin-top:12px;font-size:14px">ادامه فرآیند خرید</a>
        <p class="help-text" style="margin-top:10px;text-align:center">پرداخت امن با درگاه بانکی معتبر · امکان پرداخت درب منزل در تهران و کرج</p>
      </aside>
    </div>
  <?php endif; ?>
</div>
<?php include __DIR__ . '/partials/footer.php'; ?>
