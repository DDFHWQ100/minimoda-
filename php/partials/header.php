<?php
// partials/header.php — سربرگ قالب مرجع MiniModa (طراحی رفرنس)
if (!isset($pageTitle) || $pageTitle === '') { $pageTitle = 'مینی‌مودا | فروشگاه آنلاین مد و پوشاک کودک و نوزاد'; }
$currentUser = currentUser();
$cartN = cartCount();
$cartTotalsCache = $cartN > 0 ? cartTotals() : ['total' => 0];
$nav = [
    ['label' => 'خانه', 'href' => 'index.php', 'icon' => 'home'],
    ['label' => 'بچگانه', 'href' => 'products.php?cat=kids'],
    ['label' => 'کودکان', 'href' => 'products.php?cat=boys'],
    ['label' => 'نوزاد', 'href' => 'products.php?cat=baby'],
    ['label' => 'پسرانه', 'href' => 'products.php?cat=boys', 'sub' => [
        ['label' => 'کت و شلوار', 'href' => 'products.php?cat=boys&q=' . urlencode('کت')],
        ['label' => 'تیشرت', 'href' => 'products.php?cat=boys&q=' . urlencode('تیشرت')],
        ['label' => 'رسمی و مجلسی', 'href' => 'products.php?cat=boys'],
    ]],
    ['label' => 'دخترانه', 'href' => 'products.php?cat=girls', 'sub' => [
        ['label' => 'پیراهن مجلسی', 'href' => 'products.php?cat=girls&q=' . urlencode('پیراهن')],
        ['label' => 'سارافون و ست', 'href' => 'products.php?cat=formal'],
        ['label' => 'لباس روزمره', 'href' => 'products.php?cat=girls'],
    ]],
    ['label' => 'لباس مجلسی', 'href' => 'products.php?cat=formal'],
    ['label' => 'تماس با ما', 'href' => 'help.php#contact'],
];
$activeCat = $_GET['cat'] ?? '';
function navIcon(string $name): string {
    if ($name === 'home') { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'; }
    return '';
}
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#1b3a6b">
<title><?= e($pageTitle) ?></title>
<meta name="description" content="خرید آنلاین جدیدترین لباس کودک و نوجوان با ارسال رایگان و ضمانت بازگشت کالا">
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2222%22 fill=%22%231b3a6b%22/><text x=%2250%22 y=%2272%22 font-size=%2252%22 text-anchor=%22middle%22 fill=%22%23ffc107%22 font-family=%22Tahoma%22 font-weight=%22bold%22>M</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/style.css">
</head>
<body>

<!-- نوار اطلاع‌رسانی سرمه‌ای -->
<div class="topbar">
  <div class="wrap topbar-in">
    <span class="topbar-highlight">تخفیف ویژه تا ۷۰٪ در جشنواره تابستانی</span>
    <span class="topbar-side"><a href="help.php#contact">پشتیبانی مشتریان</a><span class="sep">|</span><a href="help.php#faq">سوالات متداول</a><span class="sep">|</span><a href="help.php#contact">تماس با ما</a></span>
  </div>
</div>

<!-- سربرگ اصلی -->
<header class="site-header" id="siteHeader">
  <div class="wrap header-in">
    <button class="burger" id="navToggle" aria-label="باز کردن منو"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg></button>

    <a class="logo" href="index.php">
      <span class="logo-mark"><svg viewBox="0 0 24 24" fill="none" stroke="#1b3a6b" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5L12 4l9 6.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5z"/><path d="M9 21v-6h6v6"/></svg></span>
      <span class="logo-text"><b>Mini<em>Moda</em></b><small>Kids &amp; Teens Fashion</small></span>
    </a>

    <form class="search" action="products.php" method="get" role="search">
      <input type="search" name="q" placeholder="جستجوی محصول، برند یا دسته‌بندی..." value="<?= e($_GET['q'] ?? '') ?>" aria-label="جستجو">
      <button type="submit" aria-label="جستجو"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg></button>
    </form>

    <nav class="header-actions">
      <a class="hicon" href="wishlist.php" title="علاقه‌مندی‌ها"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg><em><?= faNum(wishlistCount()) ?></em><small>علاقه‌مندی</small></a>
      <a class="cart-chip" href="cart.php"><span class="cart-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg><b><?= faNum($cartN) ?></b></span><span class="cart-meta"><small>سبد خرید</small><strong><?= faMoney($cartTotalsCache['total'] ?? 0) ?></strong></span></a>
      <?php if ($currentUser): ?>
        <a class="hicon" href="account.php" title="حساب من"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg><small>حساب من</small></a>
      <?php else: ?>
        <a class="hicon" href="auth.php?action=login" title="ورود"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg><small>ورود</small></a>
      <?php endif; ?>
    </nav>
  </div>

  <!-- منوی کپسولی -->
  <nav class="mainnav" id="mainnav">
    <div class="wrap mainnav-in">
      <?php foreach ($nav as $item): ?>
        <?php $isActive = $item['href'] === 'index.php'; ?>
        <?php if (($item['href'] === $_SERVER['REQUEST_URI']) || ($item['href'] === 'index.php' && basename($_SERVER['PHP_SELF']) === 'index.php')) { $isActive = true; } ?>
        <div class="nav-item<?= $isActive ? ' active' : '' ?>">
          <a href="<?= e($item['href']) ?>"><?= navIcon($item['icon'] ?? '') ?><?= e($item['label']) ?><?php if (!empty($item['sub'])): ?><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg><?php endif; ?></a>
          <?php if (!empty($item['sub'])): ?>
            <div class="dropdown"><?php foreach ($item['sub'] as $sub): ?><a href="<?= e($sub['href']) ?>"><?= e($sub['label']) ?></a><?php endforeach; ?></div>
          <?php endif; ?>
        </div>
      <?php endforeach; ?>
      <a class="nav-hot" href="products.php?offer=1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg> حراج ویژه</a>
      <?php if ($currentUser && $currentUser['role'] === 'admin'): ?><a class="nav-admin" href="admin.php">پنل مدیریت</a><?php endif; ?>
    </div>
  </nav>
</header>
