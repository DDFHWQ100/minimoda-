<?php
require __DIR__ . '/bootstrap.php';
$pageTitle = 'مینی‌مودا | فروشگاه آنلاین مد و پوشاک کودک و نوزاد';
$pdo = db();
$cats        = $pdo->query('SELECT * FROM categories ORDER BY sort_order ASC')->fetchAll();
$bestsellers = $pdo->query('SELECT * FROM products ORDER BY sales_count DESC LIMIT 6')->fetchAll();
$offers      = $pdo->query('SELECT * FROM products WHERE discount_price IS NOT NULL AND discount_price < price ORDER BY sales_count DESC LIMIT 6')->fetchAll();
$fresh       = $pdo->query('SELECT * FROM products WHERE is_new = 1 ORDER BY created_at DESC LIMIT 6')->fetchAll();
$weekly      = $pdo->query('SELECT * FROM products ORDER BY sales_count DESC LIMIT 4')->fetchAll();
$posts       = $pdo->query('SELECT * FROM blog_posts ORDER BY views DESC LIMIT 4')->fetchAll();

$catIcons = [
    'Crown'      => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 8l4.5 4L12 4l4.5 8L21 8l-1.8 11H4.8L3 8z"/></svg>',
    'Shirt'      => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M20.4 3.5 16 2a4 4 0 0 1-8 0l-4.4 1.5a2 2 0 0 0-1.3 2.3l.6 3.4a1 1 0 0 0 1 .9H6a2 2 0 0 1 2 2v8.9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-8.9a2 2 0 0 1 2-2h1.1a1 1 0 0 0 1-.9l.6-3.4a2 2 0 0 0-1.3-2.3z"/></svg>',
    'Sparkles'   => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3l1.9 5.7L19.6 10l-5.7 1.9L12 17.6l-1.9-5.7L4.4 10l5.7-1.3L12 3z"/></svg>',
    'Baby'       => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="6.5" r="3"/><path d="M9 21v-2.5a3 3 0 0 1 6 0V21"/><path d="M5 12h2M17 12h2"/></svg>',
    'Gem'        => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M6 3h12l4 6-10 12L2 9l4-6z"/><path d="M2 9h20"/></svg>',
    'Footprints' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><ellipse cx="7.5" cy="8" rx="2.4" ry="4"/><ellipse cx="16.5" cy="15" rx="2.4" ry="4"/></svg>',
    'ShoppingBag'=> '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l1.5 13a2 2 0 0 1-2 1.7H6.5a2 2 0 0 1-2-1.7L6 7z"/><path d="M9 11V6a3 3 0 0 1 6 0v5"/></svg>',
];
include __DIR__ . '/partials/header.php';
?>

<div class="wrap">

  <!-- ═══ هیرو ═══ -->
  <section class="hero" id="hero" aria-label="پیشنهادهای ویژه">
    <div class="hero-slide is-active">
      <img src="assets/images/hero-royal-junior.jpg" alt="کالکشن ROYAL JUNIOR" fetchpriority="high">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <span class="hero-eyebrow">کالکشن جدید ۲۰۲۶</span>
        <h1 class="hero-title">ROYAL<br>JUNIOR</h1>
        <p class="hero-latin">More Than Fashion… A Royal Childhood</p>
        <p class="hero-sub">لباس خاص برای خاص‌ها!</p>
        <div class="hero-cta-row">
          <a class="btn btn-gold" href="products.php?cat=formal" style="height:42px;padding:0 22px;font-size:12px">مشاهده کالکشن سلطنتی</a>
          <a class="btn btn-outline" href="products.php" style="height:42px;padding:0 18px;font-size:12px;background:rgba(255,255,255,.15);border-color:rgba(255,255,255,.4);color:#fff">همه محصولات</a>
        </div>
      </div>
      <span class="hero-badge"><b>V.2</b><small>مجموعه جدید</small></span>
    </div>
    <div class="hero-slide">
      <img src="https://images.pexels.com/photos/1620759/pexels-photo-1620759.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1600" alt="ست ملوانی مارین">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <span class="hero-eyebrow" style="color:#7dd3fc">کالکشن ملوانی</span>
        <h1 class="hero-title">MARINE<br>SPIRIT</h1>
        <p class="hero-latin">Timeless stripes &amp; sailor whites</p>
        <p class="hero-sub">ست‌های ملوانی دونفره؛ روح دریانوردی در هر مهمانی</p>
        <div class="hero-cta-row"><a class="btn btn-gold" href="products.php?cat=kids" style="height:42px;padding:0 22px;font-size:12px">خرید ست‌های ملوانی</a></div>
      </div>
      <span class="hero-badge" style="background:radial-gradient(circle at 35% 35%, #38bdf8, #0369a1)"><b>جدید</b><small>تابستانه ۲۰۲۶</small></span>
    </div>
    <div class="hero-slide">
      <img src="https://images.pexels.com/photos/29224161/pexels-photo-29224161.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1600" alt="کاپشن زمستانی">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <span class="hero-eyebrow" style="color:#fda4af">کالکشن زمستانی</span>
        <h1 class="hero-title">WINTER<br>COZY</h1>
        <p class="hero-latin">Warm layers, joyful winters — up to 30% off</p>
        <p class="hero-sub">کاپشن و پالتوهای پشمی؛ گرم‌ترین زمستان فرزندتان</p>
        <div class="hero-cta-row"><a class="btn btn-primary" href="products.php?cat=kids&amp;q=<?= urlencode('کاپشن') ?>" style="height:42px;padding:0 22px;font-size:12px">خرید کاپشن‌های زمستانی</a></div>
      </div>
      <span class="hero-badge" style="background:radial-gradient(circle at 35% 35%, #fb7185, #be123d)"><b>٪۳۰-</b><small>تخفیف زمستانی</small></span>
    </div>
    <button class="hero-arrow prev" data-hero-prev aria-label="اسلاید قبلی"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg></button>
    <button class="hero-arrow next" data-hero-next aria-label="اسلاید بعدی"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg></button>
    <div class="hero-dots">
      <button class="hero-dot is-active" aria-label="اسلاید ۱"></button>
      <button class="hero-dot" aria-label="اسلاید ۲"></button>
      <button class="hero-dot" aria-label="اسلاید ۳"></button>
    </div>
  </section>

  <!-- ═══ دسته‌بندی‌های گرد ═══ -->
  <div class="cat-row">
    <?php foreach ($cats as $c): $icon = $catIcons[$c['icon']] ?? $catIcons['Shirt']; ?>
      <a class="cat-item" href="products.php?cat=<?= e($c['slug']) ?>">
        <span class="cat-icon"><div><?= $icon // SVG امن داخلی ?></div></span>
        <span><?= e($c['name']) ?></span>
      </a>
    <?php endforeach; ?>
  </div>

  <!-- ═══ بنرهای تبلیغاتی ═══ -->
  <div class="promo-grid">
    <a class="promo-card" href="products.php?cat=kids&amp;q=<?= urlencode('کاپشن') ?>">
      <img src="https://images.pexels.com/photos/29224161/pexels-photo-29224161.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000" alt="کاپشن زمستانی" loading="lazy">
      <div class="promo-overlay"></div>
      <div class="promo-body"><span class="promo-tag">تا ۳۰٪ تخفیف</span><h3>کاپشن‌های زمستانی</h3></div>
    </a>
    <a class="promo-card" href="products.php?cat=formal">
      <img src="https://images.pexels.com/photos/33939726/pexels-photo-33939726.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000" alt="پیراهن مجلسی" loading="lazy">
      <div class="promo-overlay"></div>
      <div class="promo-body"><span class="promo-tag">کالکشن سلطنتی</span><h3>پیراهن‌های مجلسی</h3></div>
    </a>
    <a class="promo-card" href="products.php?cat=shoes">
      <img src="https://images.pexels.com/photos/9537104/pexels-photo-9537104.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000" alt="کفش ورزشی" loading="lazy">
      <div class="promo-overlay"></div>
      <div class="promo-body"><span class="promo-tag">ضد لغزش و سبک</span><h3>کتانی‌های ورزشی</h3></div>
    </a>
    <a class="promo-card" href="products.php?cat=boys&amp;q=<?= urlencode('کت') ?>">
      <img src="https://images.pexels.com/photos/30690921/pexels-photo-30690921.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000" alt="کت و شلوار پسرانه" loading="lazy">
      <div class="promo-overlay"></div>
      <div class="promo-body"><span class="promo-tag">ست کامل رسمی</span><h3>کت و شلوار پسرانه</h3></div>
    </a>
  </div>

  <!-- ═══ نوار اعتماد ═══ -->
  <div class="trust-row">
    <?php foreach ([
      ['ارسال سریع', 'تحویل ۲ تا ۴ روز کاری', '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 8h4l4 4v5a1 1 0 0 1-1 1h-2"/><circle cx="7.5" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/>'],
      ['پرداخت امن', 'درگاه رسمی بانکی', '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'],
      ['کالای اصل', 'ضمانت اصالت کالا', '<circle cx="12" cy="8" r="6"/><path d="m9 13-2 8 5-3 5 3-2-8"/>'],
      ['بازگشت کالا', '۷ روز مهلت تست', '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'],
      ['پشتیبانی ۲۴/۷', 'پاسخگویی همه‌روزه', '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4z"/><path d="M20 14a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1z"/>'],
    ] as [$t, $d, $path]): ?>
      <div class="trust-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><?= $path ?></svg>
        <span><b><?= e($t) ?></b><small><?= e($d) ?></small></span>
      </div>
    <?php endforeach; ?>
  </div>

  <!-- ═══ جشنواره + پرفروش‌های هفته ═══ -->
  <div class="festival-grid">
    <a class="festival" href="products.php?offer=1">
      <img src="https://images.pexels.com/photos/1620759/pexels-photo-1620759.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=1500" alt="جشنواره بهاره مینی‌مودا">
      <div class="festival-overlay"></div>
      <div class="festival-body">
        <span class="festival-tag">فقط تا پایان هفته</span>
        <h2>بزرگ‌ترین<br>جشنواره بهاره</h2>
        <p>تا ۶۰٪ تخفیف واقعی روی کالکشن جدید</p>
        <span class="btn btn-outline" style="background:#fff;border-color:#fff;color:var(--navy);height:40px;padding:0 20px;font-size:11px;width:max-content">خرید جشنواره</span>
      </div>
    </a>
    <aside class="weekly">
      <h3><svg viewBox="0 0 24 24" width="17" height="17" fill="#f2b33d" stroke="#f2b33d" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> پرفروش‌ترین‌های هفته</h3>
      <?php foreach ($weekly as $p): $img = productImage($p); $eff = effectivePrice($p); ?>
        <a class="weekly-item" href="product.php?slug=<?= e($p['slug']) ?>">
          <img src="<?= e($img) ?>" alt="<?= e($p['name']) ?>" loading="lazy">
          <span><p><?= e($p['name']) ?></p><strong><?= faMoney($eff) ?></strong></span>
        </a>
      <?php endforeach; ?>
    </aside>
  </div>

  <!-- ═══ پربیننده‌ترین اخبار مد ═══ -->
  <div class="sec-head">
    <h2 class="sec-title">پربیننده‌ترین اخبار مد و پوشاک</h2>
    <a class="sec-link" href="blog.php">همه مقالات ←</a>
  </div>
  <div class="blog-row">
    <?php foreach ($posts as $post): ?>
      <a class="blog-card" href="blog.php?slug=<?= e($post['slug']) ?>">
        <span class="blog-media"><img src="<?= e($post['image']) ?>" alt="<?= e($post['title']) ?>" loading="lazy"><span class="blog-tag"><?= e($post['tag']) ?></span></span>
        <span class="blog-body">
          <h3><?= e($post['title']) ?></h3>
          <span class="blog-foot"><span><?= faDate($post['created_at']) ?></span><span><?= faNum($post['views']) ?> بازدید</span></span>
        </span>
      </a>
    <?php endforeach; ?>
  </div>

  <!-- ═══ تب محصولات ═══ -->
  <div data-tabs>
    <div class="sec-head">
      <h2 class="sec-title">دیدنی‌ترین‌های مینی‌مودا</h2>
      <div class="tabs-bar">
        <button class="tab-btn is-active" data-tab-btn="best">پرفروش‌ترین‌ها</button>
        <button class="tab-btn" data-tab-btn="offers">تخفیف‌دارها</button>
        <button class="tab-btn" data-tab-btn="fresh">تازه‌رسیده‌ها</button>
      </div>
    </div>
    <div class="tab-panel grid-products is-active" data-tab-panel="best"><?php foreach ($bestsellers as $p) renderProductCard($p); ?></div>
    <div class="tab-panel grid-products" data-tab-panel="offers"><?php foreach ($offers as $p) renderProductCard($p); ?></div>
    <div class="tab-panel grid-products" data-tab-panel="fresh"><?php foreach ($fresh as $p) renderProductCard($p); ?></div>
  </div>

  <!-- ═══ بنرهای دوگانه ═══ -->
  <div class="duo-banners">
    <a class="duo duo-a" href="products.php?cat=kids">
      <img src="https://images.pexels.com/photos/19579097/pexels-photo-19579097.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1300" alt="کالکشن زمستانی" loading="lazy">
      <div class="duo-overlay"></div>
      <div class="duo-body"><small>کالکشن زمستانی ۲۰۲۶</small><h3>روزهای روشن،<br>خاطره‌های سفید</h3><span class="btn btn-outline" style="background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.4);color:#fff;height:36px;padding:0 16px;font-size:10px;width:max-content">جدیدترین‌ها</span></div>
    </a>
    <a class="duo duo-b" href="products.php?cat=formal">
      <img src="https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1300" alt="کالکشن مجلسی" loading="lazy">
      <div class="duo-overlay"></div>
      <div class="duo-body"><small>کالکشن مجلسی</small><h3>جشن‌ها باشکوه‌تر<br>با مینی‌مودا</h3><span class="btn btn-primary" style="height:36px;padding:0 16px;font-size:10px;width:max-content">خرید لباس مجلسی</span></div>
    </a>
  </div>

</div><!-- /wrap -->
<?php include __DIR__ . '/partials/footer.php'; ?>
