<?php
require __DIR__ . '/bootstrap.php';
$pdo = db();

// ── ثبت نظر ──────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'review') {
    csrfCheck();
    $productId = (int)($_POST['product_id'] ?? 0);
    $rating = max(1, min(5, (int)($_POST['rating'] ?? 5)));
    $comment = trim((string)($_POST['comment'] ?? ''));
    $slug = (string)($_POST['slug'] ?? '');
    $user = currentUser();
    $author = $user ? $user['name'] : (trim((string)($_POST['name'] ?? '')) ?: 'کاربر مهمان');
    if ($productId > 0 && mb_strlen($comment) >= 5) {
        $st = $pdo->prepare('INSERT INTO reviews (product_id, user_id, author_name, rating, comment) VALUES (?,?,?,?,?)');
        $st->execute([$productId, $user['id'] ?? null, $author, $rating, $comment]);
        $pdo->prepare('UPDATE products SET rating = (SELECT AVG(rating) FROM reviews WHERE product_id = ?), review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = ?) WHERE id = ?')
            ->execute([$productId, $productId, $productId]);
        flash('نظر شما با موفقیت ثبت شد؛ سپاسگزاریم!');
    } else {
        flash('نظر شما باید حداقل ۵ کاراکتر باشد.', 'error');
    }
    redirect('product.php?slug=' . urlencode($slug) . '#reviews');
}

$slug = trim((string)($_GET['slug'] ?? ''));
$st = $pdo->prepare('SELECT p.*, c.name AS category_name, c.slug AS category_slug FROM products p LEFT JOIN categories c ON c.id = p.category_id WHERE p.slug = ? LIMIT 1');
$st->execute([$slug]);
$product = $st->fetch();

if (!$product) {
    http_response_code(404);
    $pageTitle = 'محصول یافت نشد';
    include __DIR__ . '/partials/header.php';
    echo '<div class="wrap"><div class="empty"><h3>محصول یافت نشد</h3><p>ممکن است این کالا حذف یا ناموجود شده باشد.</p><a class="btn btn-primary" href="products.php" style="height:44px;padding:0 24px;margin-top:10px">بازگشت به فروشگاه</a></div></div>';
    include __DIR__ . '/partials/footer.php';
    exit;
}

$images = jsonArray($product['images']);
$sizes  = jsonArray($product['sizes']);
$colors = jsonArray($product['colors']);
$price  = (float)$product['price'];
$disc   = isset($product['discount_price']) ? (float)$product['discount_price'] : null;
$hasDisc = $disc !== null && $disc < $price;
$final  = $hasDisc ? $disc : $price;
$pct    = discountPercent($price, $disc);
$stock  = (int)$product['stock'];

$stR = $pdo->prepare('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC LIMIT 20');
$stR->execute([(int)$product['id']]);
$reviews = $stR->fetchAll();

$stRel = $pdo->prepare('SELECT * FROM products WHERE category_id <=> ? AND id <> ? ORDER BY sales_count DESC LIMIT 6');
$stRel->execute([$product['category_id'], (int)$product['id']]);
$related = $stRel->fetchAll();

$pageTitle = $product['name'] . ' | مینی‌مودا';
include __DIR__ . '/partials/header.php';
?>
<div class="wrap">
  <nav class="breadcrumb"><a href="index.php">خانه</a><span>‹</span><a href="products.php">محصولات</a><?php if ($product['category_name']): ?><span>‹</span><a href="products.php?cat=<?= e($product['category_slug']) ?>"><?= e($product['category_name']) ?></a><?php endif; ?></nav>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:22px;align-items:start">
    <!-- گالری -->
    <div>
      <div style="position:relative;aspect-ratio:4/5;max-height:520px;border-radius:var(--radius);overflow:hidden;background:#f6f4ef;border:1px solid var(--line)">
        <img src="<?= e($images[0] ?? '') ?>" alt="<?= e($product['name']) ?>" style="width:100%;height:100%;object-fit:cover;object-position:top center">
        <?php if ($pct > 0): ?><span class="badge badge-sale" style="position:absolute;top:12px;right:12px;font-size:11px;padding:6px 10px"><?= faDigits($pct) ?>٪ تخفیف</span><?php endif; ?>
      </div>
    </div>

    <!-- پنل خرید -->
    <div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <?php if ($product['is_new']): ?><span class="badge badge-new" style="font-size:10px;padding:5px 10px">تازه وارد</span><?php endif; ?>
        <?php if ($product['is_offer']): ?><span class="badge badge-sale" style="font-size:10px;padding:5px 10px">پیشنهاد ویژه</span><?php endif; ?>
        <span style="font-size:10px;color:#10b981;font-weight:800">ضمانت اصالت کالا</span>
      </div>
      <h1 style="font-size:20px;font-weight:900;color:var(--navy);line-height:1.7;margin:8px 0 4px"><?= e($product['name']) ?></h1>
      <div class="card-meta" style="margin-bottom:12px">
        <span class="stars">★ <?= faDigits(number_format((float)$product['rating'], 1)) ?></span>
        <span class="muted">(<?= faNum($product['review_count']) ?> نظر)</span>
        <span class="muted">| <?= faNum($product['sales_count']) ?> بار خریداری شده</span>
      </div>

      <div style="background:#f8f9fc;border:1px solid var(--line);border-radius:var(--radius);padding:16px">
        <?php if ($hasDisc): ?>
          <div style="display:flex;gap:10px;align-items:center"><s class="muted" style="font-size:12px"><?= faMoney($price) ?></s><span class="badge badge-sale"><?= faDigits($pct) ?>٪-</span></div>
        <?php endif; ?>
        <div style="display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap;margin-top:2px">
          <strong style="font-size:26px;color:var(--navy);font-weight:900"><?= faMoney($final) ?></strong>
          <?php if ($hasDisc): ?><span style="font-size:10px;font-weight:800;color:#047857;background:#d1fae5;border:1px solid #a7f3d0;border-radius:8px;padding:3px 8px;margin-bottom:5px">سود شما: <?= faMoney($price - $final) ?></span><?php endif; ?>
        </div>
        <p style="margin:8px 0 0;font-size:11px;font-weight:800">
          <?php if ($stock > 10): ?><span style="color:#059669">● موجود در انبار مینی‌مودا</span>
          <?php elseif ($stock > 0): ?><span style="color:#d97706">● فقط <?= faDigits($stock) ?> عدد باقی مانده!</span>
          <?php else: ?><span style="color:#dc2626">● ناموجود</span><?php endif; ?>
        </p>
      </div>

      <form method="post" action="cart.php" style="margin-top:14px">
        <?= csrfField() ?>
        <input type="hidden" name="action" value="add">
        <input type="hidden" name="id" value="<?= (int)$product['id'] ?>">
        <input type="hidden" name="redirect" value="product.php?slug=<?= e($product['slug']) ?>">

        <?php if ($sizes): ?>
          <span class="label">سایز:</span>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
            <?php foreach ($sizes as $i => $size): ?>
              <label style="cursor:pointer"><input type="radio" name="size" value="<?= e($size) ?>" <?= $i === 0 ? 'checked' : '' ?> style="position:absolute;opacity:0"><span class="size-chip"><?= faDigits($size) ?></span></label>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>

        <?php if ($colors): ?>
          <span class="label">رنگ:</span>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
            <?php foreach ($colors as $i => $color): ?>
              <label style="cursor:pointer" title="<?= e($color['name'] ?? '') ?>"><input type="radio" name="color" value="<?= e($color['name'] ?? '') ?>" <?= $i === 0 ? 'checked' : '' ?> style="position:absolute;opacity:0"><span class="color-chip" style="background:<?= e($color['hex'] ?? '#ccc') ?>"></span></label>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>

        <div style="display:flex;gap:10px;align-items:stretch">
          <input class="input" type="number" name="qty" min="1" max="99" value="1" dir="ltr" style="width:70px;text-align:center" aria-label="تعداد">
          <button class="btn btn-primary btn-block" type="submit" <?= $stock <= 0 ? 'disabled' : '' ?> style="height:52px;font-size:14px;opacity:<?= $stock <= 0 ? '.5' : '1' ?>">افزودن به سبد خرید</button>
          <button class="btn btn-outline" type="submit" formaction="wishlist.php" name="id" value="<?= (int)$product['id'] ?>" style="width:52px" aria-label="علاقه‌مندی"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></button>
        </div>
      </form>

      <div class="trust-row" style="grid-template-columns:repeat(3,1fr);margin-top:12px">
        <div class="trust-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 8h4l4 4v5a1 1 0 0 1-1 1h-2"/><circle cx="7.5" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/></svg><span><b>ارسال ۲ تا ۴ روز</b><small>تیپاکس و پست</small></span></div>
        <div class="trust-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg><span><b>ضمانت بازگشت</b><small>۷ روز مهلت تست</small></span></div>
        <div class="trust-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span><b>پرداخت امن</b><small>آنلاین / درب منزل</small></span></div>
      </div>
    </div>
  </div>

  <!-- توضیحات و مشخصات -->
  <div class="panel" style="margin-top:18px">
    <h2 style="margin:0 0 8px;font-size:16px;color:var(--navy)">درباره این محصول</h2>
    <p style="line-height:2.2;font-size:13px;color:#374151;margin:0;white-space:pre-line"><?= e($product['description']) ?></p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin-top:14px;font-size:11px">
      <?php foreach (['برند|مینی‌مودا (MiniModa)', 'کشور سازنده|ترکیه', 'جنس|پنبه و فاستونی ضدحساسیت', 'ضمانت|اصالت و سلامت فیزیکی کالا', 'روش ارسال|تیپاکس، پست پیشتاز و باربری', 'مرجوعی|۷ روز با فاکتور'] as $row): [$k, $v] = explode('|', $row, 2); ?>
        <div style="border:1px dashed var(--line);border-radius:12px;padding:10px"><span class="muted" style="display:block;font-size:9px"><?= e($k) ?></span><b style="color:var(--navy)"><?= e($v) ?></b></div>
      <?php endforeach; ?>
    </div>
  </div>

  <!-- نظرات -->
  <div id="reviews" class="panel" style="margin-top:12px">
    <h2 style="margin:0 0 10px;font-size:16px;color:var(--navy)">نظرات کاربران (<?= faNum(count($reviews)) ?>)</h2>
    <?php if (!$reviews): ?>
      <p class="muted" style="font-size:12px">هنوز نظری ثبت نشده؛ اولین نظر را شما بنویسید!</p>
    <?php else: foreach ($reviews as $r): ?>
      <article style="border:1px solid #eef0f5;border-radius:14px;padding:12px;margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><b style="font-size:12px;color:var(--navy)"><?= e($r['author_name']) ?></b><span style="color:#f59e0b;font-size:12px"><?= str_repeat('★', (int)$r['rating']) . str_repeat('☆', 5 - (int)$r['rating']) ?></span></div>
        <p style="margin:6px 0 0;font-size:12px;line-height:2;color:#374151"><?= e($r['comment']) ?></p>
        <small class="muted" style="font-size:9px"><?= faDate($r['created_at']) ?></small>
      </article>
    <?php endforeach; endif; ?>

    <form method="post" action="product.php?slug=<?= e($product['slug']) ?>" style="border-top:1px dashed var(--line);padding-top:12px;margin-top:6px;display:grid;gap:8px">
      <?= csrfField() ?>
      <input type="hidden" name="action" value="review">
      <input type="hidden" name="product_id" value="<?= (int)$product['id'] ?>">
      <input type="hidden" name="slug" value="<?= e($product['slug']) ?>">
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <span class="label" style="margin:0">امتیاز شما:</span>
        <select class="select" name="rating" style="width:110px;height:38px"><option value="5">۵ ★ عالی</option><option value="4">۴ ★ خوب</option><option value="3">۳ ★ متوسط</option><option value="2">۲ ★ ضعیف</option><option value="1">۱ ★ بد</option></select>
        <?php if (!currentUser()): ?><input class="input" type="text" name="name" placeholder="نام شما (اختیاری)" style="width:180px;height:38px"><?php endif; ?>
      </div>
      <textarea class="textarea" name="comment" required minlength="5" placeholder="تجربه شما از کیفیت، دوخت و سایزبندی..."></textarea>
      <button class="btn btn-navy" type="submit" style="height:44px;width:max-content;padding:0 30px;font-size:12px">ثبت نظر</button>
    </form>
  </div>

  <!-- محصولات مشابه -->
  <?php if ($related): ?>
    <div class="sec-head"><h2 class="sec-title">شاید این‌ها هم بپسندید</h2><a class="sec-link" href="products.php?cat=<?= e($product['category_slug']) ?>">همه <?= e($product['category_name']) ?>ها ←</a></div>
    <div class="grid-products-4" style="display:grid"><?php foreach ($related as $p) renderProductCard($p); ?></div>
  <?php endif; ?>
</div>

<style>
.size-chip { display:inline-grid;place-items:center;min-width:44px;height:38px;padding:0 10px;border:1.5px solid var(--line);border-radius:11px;font-weight:800;font-size:12px;color:#4b5563;transition:.15s;background:#fff; }
input:checked + .size-chip { background: var(--navy); border-color: var(--navy); color: var(--gold); }
.color-chip { display:block;width:34px;height:34px;border-radius:50%;border:2px solid #e5e7eb;transition:.15s; }
input:checked + .color-chip { border-color: var(--pink); transform: scale(1.18); box-shadow: 0 0 0 3px rgba(219,39,119,.2); }
</style>
<?php include __DIR__ . '/partials/footer.php'; ?>
