<?php
require __DIR__ . '/bootstrap.php';
$pageTitle = 'مینی‌مودا | فروشگاه آنلاین مد و پوشاک کودک و نوجوان';
$pdo = db();
$cats        = $pdo->query('SELECT * FROM categories ORDER BY sort_order ASC')->fetchAll();
$bestsellers = $pdo->query('SELECT * FROM products ORDER BY sales_count DESC LIMIT 6')->fetchAll();
$offers      = $pdo->query('SELECT * FROM products WHERE discount_price IS NOT NULL AND discount_price < price ORDER BY sales_count DESC LIMIT 6')->fetchAll();
$fresh       = $pdo->query('SELECT * FROM products WHERE is_new = 1 ORDER BY created_at DESC LIMIT 6')->fetchAll();
$posts       = $pdo->query('SELECT * FROM blog_posts ORDER BY views DESC LIMIT 4')->fetchAll();

$PX = fn(string $id, int $w = 900, int $h = 700) => "https://images.pexels.com/photos/{$id}/pexels-photo-{$id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h={$h}&w={$w}";

$catIcons = [
    'Crown'      => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 8l4.5 4L12 4l4.5 8L21 8l-1.8 11H4.8L3 8z"/></svg>',
    'Shirt'      => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M20.4 3.5 16 2a4 4 0 0 1-8 0l-4.4 1.5a2 2 0 0 0-1.3 2.3l.6 3.4a1 1 0 0 0 1 .9H6a2 2 0 0 1 2 2v8.9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-8.9a2 2 0 0 1 2-2h1.1a1 1 0 0 0 1-.9l.6-3.4a2 2 0 0 0-1.3-2.3z"/></svg>',
    'Sparkles'   => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3l1.9 5.7L19.6 10l-5.7 1.9L12 17.6l-1.9-5.7L4.4 10l5.7-1.3L12 3z"/></svg>',
    'Baby'       => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="6.5" r="3"/><path d="M9 21v-2.5a3 3 0 0 1 6 0V21"/><path d="M5 12h2M17 12h2"/></svg>',
    'Gem'        => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M6 3h12l4 6-10 12L2 9l4-6z"/><path d="M2 9h20"/></svg>',
    'Footprints' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><ellipse cx="7.5" cy="8" rx="2.4" ry="4"/><ellipse cx="16.5" cy="15" rx="2.4" ry="4"/></svg>',
    'ShoppingBag'=> '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l1.5 13a2 2 0 0 1-2 1.7H6.5a2 2 0 0 1-2-1.7L6 7z"/><path d="M9 11V6a3 3 0 0 1 6 0v5"/></svg>',
];
$arrow = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
include __DIR__ . '/partials/header.php';
?>

<div class="wrap">

  <!-- ═══ هیرو ═══ -->
  <?php if (themeSectionOn('hero')): ?>
  <section class="hero" id="hero" aria-label="پیشنهادهای ویژه">
    <div class="hero-slide is-active">
      <img src="<?= e(themeGet('hero.image', 'assets/images/ref-hero.jpg')) ?>" alt="<?= e(strip_tags(themeGet('hero.title', 'استایل خاص برای نسل خاص'))) ?>" fetchpriority="high">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <span class="hero-eyebrow">کالکشن جدید ۲۰۲۶</span>
        <h1 class="hero-title"><?= strip_tags(themeGet('hero.title', 'استایل خاص<br>برای نسل خاص!'), '<br>') ?></h1>
        <p class="hero-sub"><?= e(themeGet('hero.sub', 'جدیدترین کالکشن لباس کودک و نوجوان')) ?></p>
        <div class="hero-cta-row">
          <a class="btn btn-primary" href="<?= e(themeGet('hero.href', 'products.php?cat=formal')) ?>" style="height:44px;padding:0 24px;font-size:12px;border-radius:99px"><?= e(themeGet('hero.cta', 'مشاهده مجموعه')) ?> <?= $arrow ?></a>
          <span class="hero-latin">Be Happy :)</span>
        </div>
      </div>
      <span class="hero-badge"><b><?= e(themeGet('hero.badge', '۷۰٪')) ?></b><small>تا تخفیف</small></span>
    </div>
    <div class="hero-slide">
      <img src="<?= $PX('5088176', 1600, 900) ?>" alt="ست‌های ملوانی">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <span class="hero-eyebrow">کالکشن ملوانی</span>
        <h1 class="hero-title">ست‌های دونفره<br>ملوانی</h1>
        <p class="hero-sub">روح دریانوردی در هر مهمانی</p>
        <div class="hero-cta-row"><a class="btn btn-primary" href="products.php?cat=kids" style="height:44px;padding:0 24px;font-size:12px;border-radius:99px">خرید ست‌های ملوانی <?= $arrow ?></a></div>
      </div>
      <span class="hero-badge" style="background:radial-gradient(circle at 35% 35%, #38bdf8, #0369a1)"><b>جدید</b><small>تابستانه ۲۰۲۶</small></span>
    </div>
    <div class="hero-slide">
      <img src="<?= $PX('29224161', 1600, 900) ?>" alt="کاپشن زمستانی">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <span class="hero-eyebrow">کالکشن زمستانی</span>
        <h1 class="hero-title">گرم‌ترین زمستان<br>فرزندتان</h1>
        <p class="hero-sub">کاپشن و پالتوهای پشمی تا ۳۰٪ تخفیف</p>
        <div class="hero-cta-row"><a class="btn btn-primary" href="products.php?cat=kids&amp;q=<?= urlencode('کاپشن') ?>" style="height:44px;padding:0 24px;font-size:12px;border-radius:99px">خرید کاپشن‌های زمستانی <?= $arrow ?></a></div>
      </div>
      <span class="hero-badge"><b>٪۳۰-</b><small>تخفیف زمستانی</small></span>
    </div>
    <button class="hero-arrow prev" data-hero-prev aria-label="اسلاید قبلی"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg></button>
    <button class="hero-arrow next" data-hero-next aria-label="اسلاید بعدی"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg></button>
    <div class="hero-dots">
      <button class="hero-dot is-active" aria-label="اسلاید ۱"></button>
      <button class="hero-dot" aria-label="اسلاید ۲"></button>
      <button class="hero-dot" aria-label="اسلاید ۳"></button>
    </div>
  </section>
  <?php endif; ?>

  <!-- ═══ دسته‌بندی‌های گرد ═══ -->
  <?php if (themeSectionOn('categories')): ?>
  <div class="cat-row">
    <?php foreach ($cats as $c): $icon = $catIcons[$c['icon']] ?? $catIcons['Shirt']; ?>
      <a class="cat-item" href="products.php?cat=<?= e($c['slug']) ?>">
        <span class="cat-icon"><div><?= $icon ?></div></span>
        <span><?= e($c['name']) ?></span>
      </a>
    <?php endforeach; ?>
  </div>
  <?php endif; ?>

  <!-- ═══ بنرهای تبلیغاتی ۴ تایی (قابل مدیریت از پنل قالب) ═══ -->
  <?php if (themeSectionOn('banners')): ?>
  <div class="promo-grid">
    <?php $dbBanners = themeBanners(); $promo = $dbBanners ? array_map(fn($b) => ['img' => $b['image'], 'tag' => $b['subtitle'], 'title' => $b['title'], 'href' => $b['href']], $dbBanners) : [
      ['img' => $PX('29224161', 1000, 700), 'tag' => 'تا ۳۰٪ تخفیف', 'title' => 'کاپشن‌های زمستانی', 'href' => 'products.php?cat=kids&q=' . urlencode('کاپشن')],
      ['img' => $PX('33939726', 1000, 700), 'tag' => 'کالکشن سلطنتی', 'title' => 'پیراهن‌های مجلسی', 'href' => 'products.php?cat=formal'],
      ['img' => $PX('9537104', 1000, 700), 'tag' => 'ضد لغزش و سبک', 'title' => 'کتانی‌های ورزشی', 'href' => 'products.php?cat=shoes'],
      ['img' => $PX('30690921', 1000, 700), 'tag' => 'ست کامل رسمی', 'title' => 'کت و شلوار پسرانه', 'href' => 'products.php?cat=boys&q=' . urlencode('کت')],
    ]; foreach ($promo as $b): ?>
      <a class="promo-card" href="<?= e($b['href']) ?>">
        <img src="<?= e($b['img']) ?>" alt="<?= e($b['title']) ?>" loading="lazy">
        <div class="promo-overlay"></div>
        <div class="promo-body"><span class="promo-tag"><?= e($b['tag']) ?></span><h3><?= e($b['title']) ?></h3></div>
      </a>
    <?php endforeach; ?>
  </div>
  <?php endif; ?>

  <!-- ═══ محبوب‌ترین‌ها ═══ -->
  <?php if (themeSectionOn('popular')): ?>
  <div class="sec-head">
    <div>
      <h2 class="sec-title"><svg viewBox="0 0 24 24" width="22" height="22" fill="var(--pink)" stroke="var(--pink)" stroke-width="1.5" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg> محبوب‌ترین‌ها</h2>
      <p class="muted" style="font-size:11px;margin:2px 0 0">پرطرفدارترین محصولات فروشگاه</p>
    </div>
    <a class="sec-link" href="products.php?sort=sales">همه ←</a>
  </div>
  <div class="grid-products" style="display:grid"><?php foreach ($bestsellers as $p) renderProductCard($p); ?></div>
  <?php endif; ?>

  <!-- ═══ سه بنر کالکشن ═══ -->
  <?php if (themeSectionOn('trio')): ?>
  <div class="trio-grid">
    <?php foreach ([
      ['img' => $PX('29224161', 900, 650), 'latin' => 'New Arrivals', 'title' => 'جدیدترین محصولات', 'cta' => 'مشاهده کنید', 'href' => 'products.php?cat=kids', 'tone' => 'rgba(27,58,107,.82)', 'accent' => '#fcd34d'],
      ['img' => $PX('1620759', 900, 650), 'latin' => 'Workwear Reimagined', 'title' => 'استایل رسمی و مدرسه‌ای', 'cta' => 'مشاهده مجموعه', 'href' => 'products.php?cat=formal', 'tone' => 'rgba(59,10,42,.82)', 'accent' => '#f9a8d4'],
      ['img' => $PX('1620760', 900, 650), 'latin' => 'Weekend Looks', 'title' => 'استایل آخر هفته', 'cta' => 'مشاهده مجموعه', 'href' => 'products.php?cat=kids', 'tone' => 'rgba(14,42,71,.82)', 'accent' => '#67e8f9'],
    ] as $t): ?>
      <a class="trio" href="<?= e($t['href']) ?>">
        <img src="<?= e($t['img']) ?>" alt="<?= e($t['title']) ?>" loading="lazy">
        <div class="trio-overlay" style="background:linear-gradient(to left, <?= $t['tone'] ?>, rgba(0,0,0,.2), transparent)"></div>
        <div class="trio-body">
          <small dir="ltr" style="color:<?= $t['accent'] ?>"><?= e($t['latin']) ?></small>
          <h3><?= e($t['title']) ?></h3>
          <span class="btn" style="background:#fff;color:var(--navy);height:36px;padding:0 16px;font-size:10px;border-radius:99px;width:max-content"><?= e($t['cta']) ?> <?= $arrow ?></span>
        </div>
      </a>
    <?php endforeach; ?>
  </div>
  <?php endif; ?>

  <!-- ═══ نوار اعتماد ═══ -->
  <?php if (themeSectionOn('trust')): ?>
  <div class="trust-row">
    <?php foreach ([
      ['پشتیبانی سریع', 'پاسخگویی ۲۴ ساعته', '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4z"/><path d="M20 14a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1z"/>'],
      ['ضمانت بازگشت', 'تا ۷ روز', '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'],
      ['بسته‌بندی شیک', 'و هدیه جذاب', '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>'],
      ['پرداخت امن', 'با تمامی کارت‌ها', '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'],
      ['ارسال سریع', 'به سراسر کشور', '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 8h4l4 4v5a1 1 0 0 1-1 1h-2"/><circle cx="7.5" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/>'],
    ] as [$t, $d, $path]): ?>
      <div class="trust-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><?= $path ?></svg>
        <span><b><?= e($t) ?></b><small><?= e($d) ?></small></span>
      </div>
    <?php endforeach; ?>
  </div>
  <?php endif; ?>

  <!-- ═══ مجله + بنر میانی + ست‌های پیشنهادی ═══ -->
  <?php if (themeSectionOn('magazine')): ?>
  <div class="mag-grid">
    <section class="panel">
      <div class="sec-head" style="margin:0 0 6px"><h3 style="margin:0;font-size:13px;color:var(--navy)">آخرین مقالات مجله</h3><a class="sec-link" href="blog.php">همه ←</a></div>
      <?php foreach (array_slice($posts, 0, 3) as $post): ?>
        <a class="weekly-item" href="blog.php?slug=<?= e($post['slug']) ?>">
          <img src="<?= e($post['image']) ?>" alt="<?= e($post['title']) ?>" loading="lazy" style="width:60px;height:60px;border-radius:12px">
          <span><p><?= e($post['title']) ?></p><small class="muted" style="font-size:9px"><?= faDate($post['created_at']) ?></small></span>
        </a>
      <?php endforeach; ?>
    </section>
    <a class="festival" href="blog.php" style="min-height:260px">
      <img src="<?= $PX('5088176', 1000, 800) ?>" alt="ایده بگیر و استایل بساز با MiniModa">
      <div class="festival-overlay"></div>
      <div class="festival-body">
        <span class="festival-tag" style="background:var(--gold);color:#3d2b0a">مجله مینی‌مودا</span>
        <h2 style="font-size:22px">ایده بگیر و<br>استایل بساز<br>با MiniModa</h2>
        <span class="btn btn-primary" style="height:36px;padding:0 16px;font-size:10px;border-radius:99px;width:max-content">مشاهده مقالات <?= $arrow ?></span>
      </div>
    </a>
    <section class="panel" style="display:flex;flex-direction:column">
      <div class="sec-head" style="margin:0 0 8px"><h3 style="margin:0;font-size:13px;color:var(--navy)">ست‌های پیشنهادی</h3><a class="sec-link" href="products.php">همه ←</a></div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;flex:1">
        <?php foreach ([$PX('28506036', 300, 400), $PX('9537104', 300, 400), $PX('30690921', 300, 400)] as $img): ?>
          <img src="<?= e($img) ?>" alt="ست پیشنهادی" loading="lazy" style="width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:14px;background:#f6f4ef">
        <?php endforeach; ?>
      </div>
      <a class="btn btn-primary" href="products.php" style="height:42px;margin-top:10px;font-size:11px;border-radius:14px">♥ ست کامل با قیمت ویژه</a>
    </section>
  </div>
  <?php endif; ?>

  <!-- ═══ جدیدترین اخبار مد و پوشاک ═══ -->
  <?php if (themeSectionOn('news')): ?>
  <div class="sec-head">
    <h2 class="sec-title">جدیدترین اخبار مد و پوشاک</h2>
    <a class="sec-link" href="blog.php">همه مقالات ←</a>
  </div>
  <div class="news-grid">
    <?php foreach ($posts as $post): ?>
      <a class="blog-card" href="blog.php?slug=<?= e($post['slug']) ?>" style="flex:auto;width:auto">
        <span class="blog-media" style="height:120px"><img src="<?= e($post['image']) ?>" alt="<?= e($post['title']) ?>" loading="lazy"><span class="blog-tag"><?= e($post['tag']) ?></span></span>
        <span class="blog-body">
          <h3><?= e($post['title']) ?></h3>
          <span class="blog-foot"><span><?= faDate($post['created_at']) ?></span><span><?= faNum($post['views']) ?> بازدید</span></span>
        </span>
      </a>
    <?php endforeach; ?>
  </div>
  <?php endif; ?>

  <!-- ═══ بنرهای دوگانه پایین ═══ -->
  <?php if (themeSectionOn('duo')): ?>
  <div class="duo-banners">
    <a class="duo duo-a" href="products.php?cat=kids">
      <img src="<?= $PX('28246503', 1000, 650) ?>" alt="Breezy Styles Bright Days" loading="lazy">
      <div class="duo-overlay"></div>
      <div class="duo-body"><small dir="ltr">Breezy Styles Bright Days</small><h3>روزهای روشن،<br>خاطره‌های سفید</h3><span class="btn btn-outline" style="background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.4);color:#fff;height:36px;padding:0 16px;font-size:10px;width:max-content;border-radius:99px">مشاهده کالکشن <?= $arrow ?></span></div>
    </a>
    <a class="duo duo-b" href="products.php?offer=1">
      <img src="<?= $PX('14211426', 1000, 650) ?>" alt="تخفیف ویژه تا ۵۰٪" loading="lazy">
      <div class="duo-overlay"></div>
      <div class="duo-body"><small>تخفیف ویژه</small><h3>تا ۵۰٪ تخفیف<br>روی منتخبات</h3><span class="btn btn-primary" style="height:36px;padding:0 16px;font-size:10px;width:max-content;border-radius:99px">همین حالا خرید کنید <?= $arrow ?></span></div>
    </a>
  </div>
  <?php endif; ?>

  <!-- ═══ تب محصولات ═══ -->
  <?php if (themeSectionOn('tabs')): ?>
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
  <?php endif; ?>

</div><!-- /wrap -->
<?php include __DIR__ . '/partials/footer.php'; ?>
