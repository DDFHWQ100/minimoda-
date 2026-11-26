<?php
// ══════════════════════════════════════════════════════════════
//  MiniModa — بوت‌استرپ مشترک: اتصال DB، سشن، احراز هویت، سبد خرید
// ══════════════════════════════════════════════════════════════
declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// ── مدیریت خطای سراسری: به‌جای صفحه سفید، جزئیات خطا نمایش داده شود ──
set_exception_handler(function (Throwable $ex) {
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: text/html; charset=utf-8');
    }
    $msg = htmlspecialchars($ex->getMessage(), ENT_QUOTES, 'UTF-8');
    $loc = htmlspecialchars(basename($ex->getFile()) . ' — خط ' . $ex->getLine(), ENT_QUOTES, 'UTF-8');
    echo '<div dir="rtl" style="font-family:Tahoma;max-width:560px;margin:60px auto;padding:22px;border:1px solid #fecdd3;background:#fff1f2;border-radius:16px;color:#9f1239;line-height:2">'
        . '<h2 style="margin:0 0 8px;font-size:18px">مشکلی در اجرای فروشگاه پیش آمد</h2>'
        . '<p style="font-size:12px;margin:6px 0">پیام خطا: <b>' . $msg . '</b></p>'
        . '<p style="font-size:11px;color:#be123d;margin:6px 0">محل: ' . $loc . '</p>'
        . '<p style="font-size:11px;margin:10px 0 0;border-top:1px dashed #fecdd3;padding-top:10px">راه‌حل: پوشه php را <b>تازه و کامل</b> (بدون تغییر نام فایل‌ها و بدون ویرایش دستی) دوباره در htdocs کپی کنید و اگر مشکل تکرار شد همین پیام را برای پشتیبانی بفرستید.</p>'
        . '</div>';
    exit;
});

/** خواندن امن یک ورودی رشته‌ای (آرایه‌ها و مقادیر غیرمعمول را رد می‌کند) */
function inputString(array $src, string $key, string $default = ''): string {
    if (!isset($src[$key]) || !is_scalar($src[$key])) { return $default; }
    return trim((string) $src[$key]);
}

require __DIR__ . '/config.php';

// ── اتصال PDO به MySQL ───────────────────────────────────────
function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $ex) {
            http_response_code(500);
            die('<div dir="rtl" style="font-family:Tahoma;max-width:520px;margin:80px auto;padding:24px;border:1px solid #f3c2c2;background:#fef2f2;border-radius:16px;color:#991b1b;text-align:center">'
                . '<h2>خطا در اتصال به دیتابیس</h2>'
                . '<p>لطفاً مقادیر DB_HOST / DB_NAME / DB_USER / DB_PASS را در فایل config.php بررسی کنید.</p>'
                . '<p style="direction:ltr;font-size:12px;color:#b91c1c">جزئیات: ' . htmlspecialchars($ex->getMessage(), ENT_QUOTES, 'UTF-8') . '</p>'
                . '</div>');
        }
    }
    return $pdo;
}

// ── ابزارهای عمومی ───────────────────────────────────────────
function e(mixed $s): string {
    return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8');
}

function faDigits(mixed $s): string {
    $fa = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    $en = ['0','1','2','3','4','5','6','7','8','9'];
    return str_replace($en, $fa, (string) $s);
}

function faMoney(mixed $n): string {
    return faDigits(number_format((float) $n)) . ' تومان';
}

function faNum(mixed $n): string {
    return faDigits(number_format((float) $n));
}

function faDate(?string $datetime): string {
    if (!$datetime) { return '—'; }
    $ts = strtotime($datetime);
    if ($ts === false) { return e($datetime); }
    if (class_exists('IntlDateFormatter')) {
        $fmt = @new IntlDateFormatter('fa_IR', IntlDateFormatter::SHORT, IntlDateFormatter::SHORT);
        $out = $fmt ? $fmt->format($ts) : false;
        if ($out !== false && $out !== null) { return $out; }
    }
    return faDigits(date('Y/m/d H:i', $ts));
}

function redirect(string $url): void {
    header('Location: ' . $url);
    exit;
}

/** اعتبارسنجی مسیر بازگشت nội — جلوگیری از Open Redirect */
function safeNext(mixed $v, string $default = 'index.php'): string {
    $v = (string) $v;
    if ($v === '') { return $default; }
    if (strpos($v, '//') === 0) { return $default; } // protocol-relative
    if ($v[0] === '/') { return $v; }
    if (preg_match('#^[a-z0-9_./-]+\.php(\?.*)?$#i', $v)) { return $v; }
    return $default;
}

function jsonArray(?string $s): array {
    $v = json_decode((string) $s, true);
    return is_array($v) ? $v : [];
}

function discountPercent(float $price, ?float $disc): int {
    if ($disc === null || $disc >= $price || $price <= 0) { return 0; }
    return (int) round(($price - $disc) / $price * 100);
}

function effectivePrice(array $p): float {
    $disc = isset($p['discount_price']) ? (float) $p['discount_price'] : null;
    return ($disc !== null && $disc < (float) $p['price']) ? $disc : (float) $p['price'];
}

function productImage(array $p): string {
    $imgs = jsonArray($p['images'] ?? '[]');
    return $imgs[0] ?? 'assets/images/hero-royal-junior.jpg';
}

// ── CSRF ساده ───────────────────────────────────────────────
function csrfToken(): string {
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(16));
    }
    return $_SESSION['csrf'];
}

function csrfField(): string {
    return '<input type="hidden" name="csrf" value="' . e(csrfToken()) . '">';
}

function csrfCheck(): void {
    $ok = !empty($_POST['csrf']) && !empty($_SESSION['csrf']) && hash_equals($_SESSION['csrf'], (string) $_POST['csrf']);
    if (!$ok) {
        http_response_code(403);
        die('<div dir="rtl" style="font-family:Tahoma;max-width:480px;margin:80px auto;text-align:center"><h2>درخواست نامعتبر (CSRF)</h2><p><a href="index.php">بازگشت به فروشگاه</a></p></div>');
    }
}

// ── فلش مسیج (Toast) ─────────────────────────────────────────
function flash(string $msg, string $type = 'ok'): void {
    $_SESSION['flash'][] = ['msg' => $msg, 'type' => $type];
}

function getFlashes(): array {
    $f = $_SESSION['flash'] ?? [];
    unset($_SESSION['flash']);
    return is_array($f) ? $f : [];
}

// ── احراز هویت ──────────────────────────────────────────────
function currentUser(): ?array {
    if (empty($_SESSION['user_id'])) { return null; }
    static $user = null;
    if ($user === null) {
        $st = db()->prepare('SELECT id, name, email, phone, address, role FROM users WHERE id = ? LIMIT 1');
        $st->execute([(int) $_SESSION['user_id']]);
        $user = $st->fetch() ?: false;
    }
    return $user ?: null;
}

function isAdmin(): bool {
    $u = currentUser();
    return $u !== null && $u['role'] === 'admin';
}

function requireLogin(string $next = ''): void {
    if (!currentUser()) {
        redirect('auth.php?action=login&next=' . urlencode($next !== '' ? $next : $_SERVER['REQUEST_URI']));
    }
}

// ── سبد خرید (سشن‌محور) ──────────────────────────────────────
function cartItems(): array {
    return $_SESSION['cart'] ?? []; // [lineKey => ['id','qty','size','color']]
}

function cartCount(): int {
    $n = 0;
    foreach (cartItems() as $item) { $n += (int) $item['qty']; }
    return $n;
}

/** محاسبه کامل سبد با قیمت‌های دیتابیس (هرگز به قیمت کلاینت اعتماد نمی‌کند) */
function cartTotals(): array {
    $items = cartItems();
    if (!$items) {
        return ['lines' => [], 'subtotal' => 0, 'savings' => 0, 'shipping' => 0, 'total' => 0, 'count' => 0];
    }
    $ids = [];
    foreach ($items as $item) { $ids[(int) $item['id']] = true; }
    $in  = implode(',', array_map('intval', array_keys($ids)));
    $rows = db()->query("SELECT * FROM products WHERE id IN ($in)")->fetchAll();
    $byId = [];
    foreach ($rows as $r) { $byId[(int) $r['id']] = $r; }

    $lines = [];
    $subtotal = 0.0;
    $savings  = 0.0;
    $count    = 0;

    foreach ($items as $key => $item) {
        $p = $byId[(int) $item['id']] ?? null;
        if (!$p) { continue; }
        $base = (float) $p['price'];
        $eff  = effectivePrice($p);
        $qty  = max(1, (int) $item['qty']);
        $subtotal += $eff * $qty;
        $savings  += ($base - $eff) * $qty;
        $count    += $qty;
        $lines[] = ['key' => $key, 'product' => $p, 'qty' => $qty, 'size' => $item['size'] ?? '', 'color' => $item['color'] ?? '', 'eff' => $eff];
    }
    $shipping = ($subtotal >= FREE_SHIPPING_AT || $subtotal <= 0) ? 0 : SHIPPING_COST;
    return ['lines' => $lines, 'subtotal' => $subtotal, 'savings' => $savings, 'shipping' => $shipping, 'total' => $subtotal + $shipping, 'count' => $count];
}

function cartAdd(int $productId, int $qty, string $size, string $color): void {
    $qty = max(1, min(99, $qty));
    $size = trim($size) !== '' ? trim($size) : 'استاندارد';
    $color = trim($color) !== '' ? trim($color) : '—';
    $key = $productId . '|' . $size . '|' . $color;
    $_SESSION['cart'] ??= [];
    if (isset($_SESSION['cart'][$key])) {
        $_SESSION['cart'][$key]['qty'] = min(99, $_SESSION['cart'][$key]['qty'] + $qty);
    } else {
        $_SESSION['cart'][$key] = ['id' => $productId, 'qty' => $qty, 'size' => $size, 'color' => $color];
    }
}

// ── علاقه‌مندی‌ها (سشن‌محور) ──────────────────────────────────
function wishlistIds(): array {
    return array_map('intval', $_SESSION['wishlist'] ?? []);
}

function wishlistCount(): int {
    return count(wishlistIds());
}

function wishlistToggle(int $id): bool {
    $_SESSION['wishlist'] ??= [];
    $idx = array_search($id, $_SESSION['wishlist'], true);
    if ($idx !== false) {
        unset($_SESSION['wishlist'][$idx]);
        $_SESSION['wishlist'] = array_values($_SESSION['wishlist']);
        return false;
    }
    $_SESSION['wishlist'][] = $id;
    return true;
}

// ── کارت محصول مشترک ─────────────────────────────────────────
function renderProductCard(array $p): void {
    $slug     = $p['slug'];
    $url      = 'product.php?slug=' . urlencode($slug);
    $price    = (float) $p['price'];
    $disc     = isset($p['discount_price']) ? (float) $p['discount_price'] : null;
    $hasDisc  = $disc !== null && $disc < $price;
    $final    = $hasDisc ? $disc : $price;
    $pct      = discountPercent($price, $disc);
    $img      = productImage($p);
    $colors   = jsonArray($p['colors'] ?? '[]');
    $wishlist = in_array((int) $p['id'], wishlistIds(), true);
    ?>
<div class="card">
  <a class="card-media" href="<?= e($url) ?>">
    <img src="<?= e($img) ?>" alt="<?= e($p['name']) ?>" loading="lazy">
    <span class="card-badges">
      <?php if ($pct > 0): ?><span class="badge badge-sale"><?= faDigits($pct) ?>٪-</span><?php endif; ?>
      <?php if (!empty($p['is_new'])): ?><span class="badge badge-new">تازه</span><?php endif; ?>
    </span>
    <span class="wish-btn<?= $wishlist ? ' is-active' : '' ?>" data-wishlist="<?= (int) $p['id'] ?>" role="button" aria-label="علاقه‌مندی">
      <svg viewBox="0 0 24 24" fill="<?= $wishlist ? 'currentColor' : 'none' ?>" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
    </span>
  </a>
  <div class="card-body">
    <a class="card-title" href="<?= e($url) ?>"><?= e($p['name']) ?></a>
    <div class="card-meta">
      <span class="stars">★ <?= faDigits(number_format((float) $p['rating'], 1)) ?></span>
      <span class="muted">(<?= faNum($p['review_count']) ?> نظر)</span>
      <?php if ($colors): ?><span class="dots"><?php foreach (array_slice($colors, 0, 3) as $c): ?><i style="background:<?= e($c['hex'] ?? '#ccc') ?>"></i><?php endforeach; ?></span><?php endif; ?>
    </div>
    <div class="card-foot">
      <span class="price-col">
        <?php if ($hasDisc): ?><s><?= faMoney($price) ?></s><?php endif; ?>
        <strong><?= faMoney($final) ?></strong>
      </span>
      <form method="post" action="cart.php" class="inline-form">
        <?= csrfField() ?>
        <input type="hidden" name="action" value="add">
        <input type="hidden" name="id" value="<?= (int) $p['id'] ?>">
        <input type="hidden" name="qty" value="1">
        <button type="submit" class="icon-btn" aria-label="افزودن به سبد خرید">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          افزودن به سبد خرید
        </button>
      </form>
    </div>
  </div>
</div>
<?php
}
