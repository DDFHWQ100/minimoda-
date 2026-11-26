<?php
require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrfCheck();
    $id = (int)($_POST['id'] ?? 0);
    $action = (string)($_POST['action'] ?? 'toggle');
    if ($id > 0) {
        if ($action === 'toggle') { wishlistToggle($id); }
        elseif ($action === 'remove') {
            $_SESSION['wishlist'] = array_values(array_diff(wishlistIds(), [$id]));
        }
    }
    $back = safeNext($_POST['redirect'] ?? ($_GET['redirect'] ?? 'wishlist.php'), 'wishlist.php');
    redirect($back);
}

$pageTitle = 'علاقه‌مندی‌های من | مینی‌مودا';
$ids = wishlistIds();
$items = [];
if ($ids) {
    $in = implode(',', array_map('intval', $ids));
    $items = db()->query("SELECT * FROM products WHERE id IN ($in) ORDER BY FIELD(id, $in)")->fetchAll();
}
include __DIR__ . '/partials/header.php';
?>
<div class="wrap">
  <div class="sec-head" style="margin-top:14px">
    <h1 class="sec-title">علاقه‌مندی‌های من <span class="muted" style="font-size:12px">(<?= faNum(count($items)) ?> محصول)</span></h1>
    <a class="sec-link" href="products.php">بازگشت به فروشگاه ←</a>
  </div>

  <?php if (!$items): ?>
    <div class="empty">
      <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
      <h3>لیست علاقه‌مندی‌های شما خالی است</h3>
      <p>روی آیکون قلب روی هر محصول بزنید تا اینجا ذخیره شود.</p>
      <a class="btn btn-primary" href="products.php" style="height:46px;padding:0 28px;margin-top:12px">کشف محصولات</a>
    </div>
  <?php else: ?>
    <div class="grid-products-4" style="display:grid"><?php foreach ($items as $p) renderProductCard($p); ?></div>
  <?php endif; ?>
</div>
<?php include __DIR__ . '/partials/footer.php'; ?>
