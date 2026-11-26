<?php
require __DIR__ . '/bootstrap.php';
$pageTitle = 'مینی‌مودا | فروشگاه آنلاین مد و پوشاک کودک و نوزاد';
$pdo = db();
$cats        = $pdo->query('SELECT * FROM categories ORDER BY sort_order ASC')->fetchAll();
$bestsellers = $pdo->query('SELECT * FROM products ORDER BY sales_count DESC LIMIT 6')->fetchAll();
$latestPosts = $pdo->query('SELECT * FROM blog_posts ORDER BY views DESC LIMIT 4')->fetchAll();

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
$px = fn(string $id, int $w = 900, int $h = 700) => "https://images.pexels.com/photos/$id/pexels-photo-$id.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=$h&w=$w";
$catGradients = ['from-pink-400 to-rose-500','from-sky-400 to-blue-600','from-amber-300 to-orange-500','from-violet-400 to-purple-600','from-emerald-400 to-teal-600','from-cyan-400 to-sky-600','from-fuchsia-400 to-pink-600'];
?>

<div class="wrap">

  <!-- ═══ هیرو قالب مرجع ═══ -->
  <section class="hero" aria-label="پیشنهادهای ویژه">
    <div class="hero-slide is-active">
      <img src="assets/images/ref-hero.jpg" alt="استایل خاص برای نسل خاص" fetchpriority="high">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <span class="hero-eyebrow">کالکشن جدید ۲۰۲۶</span>
        <h1 class="hero-title">استایل خاص<br>برای نسل خاص!</h1>
        <p class="hero-sub">جدیدترین کالکشن لباس کودک و نوجوان</p>
        <div class="hero-cta-row">
          <a class="btn" href="products.php?cat=formal" style="height:46px;padding:0 28px;font-size:13px;background:var(--pink);color:#fff;border-radius:99px;box-shadow:0 12px 26px -10px rgba(233,30,99,.55)">مشاهده مجموعه ←</a>
          <span class="hero-latin">Be Happy :)</span>
        </div>
      </div>
      <span class="hero-badge"><b>۷۰٪</b><small>تا تخفیف</small></span>
    </div>
    <button class="hero-arrow prev" aria-label="اسلاید قبلی" onclick="void(0)"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg></button>
    <button class="hero-arrow next" aria-label="اسلاید بعدی" onclick="void(0)"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg></button>
    <div class="hero-dots"><span class="hero-dot is-active"></span><span class="hero-dot"></span><span class="hero-dot"></span></div>
  </section>

  <!-- ═══ دسته‌بندی‌های گرد ═══ -->
  <div class="cat-row">
    <?php foreach ($cats as $i => $c): $icon = $catIcons[$c['icon']] ?? $catIcons['Shirt']; ?>
      <a class="cat-item" href="products.php?cat=<?= e($c['slug']) ?>">
        <span class="cat-icon" style="background:linear-gradient(135deg,#fda4af,#fb923c)"><div><?= $icon ?></div></span>
        <span><?= e($c['name']) ?></span>
      </a>
    <?php endforeach; ?>
  </div>

  <!-- ═══ بنرهای ۴ تایی ═══ -->
  <div class="promo-grid">
    <a class="promo-card" href="products.php?cat=kids&amp;q=<?= urlencode('کاپشن') ?>"><img src="<?= e($px('29224161')) ?>" alt="کاپشن‌های زمستانی" loading="lazy"><div class="promo-overlay"></div><div class="promo-body"><span class="promo-tag">تا ۳۰٪ تخفیف</span><h3>کاپشن‌های زمستانی</h3><small>مشاهده مطالب ←</small></div></a>
    <a class="promo-card" href="products.php?cat=formal"><img src="<?= e($px('33939726')) ?>" alt="پیراهن‌های مجلسی" loading="lazy"><div class="promo-overlay"></div><div class="promo-body"><span class="promo-tag">کالکشن سلطنتی</span><h3>پیراهن‌های مجلسی</h3><small>مشاهده بیشتر ←</small></div></a>
    <a class="promo-card" href="products.php?cat=shoes"><img src="<?= e($px('9537104')) ?>" alt="کتانی‌های ورزشی" loading="lazy"><div class="promo-overlay"></div><div class="promo-body"><span class="promo-tag">ضد لغزش و سبک</span><h3>کتانی‌های ورزشی</h3><small>خرید کنید ←</small></div></a>
    <a class="promo-card" href="products.php?cat=boys&amp;q=<?= urlencode('کت') ?>"><img src="<?= e($px('30690921')) ?>" alt="کت و شلوار پسرانه" loading="lazy"><div class="promo-overlay"></div><div class="promo-body"><span class="promo-tag">ست کامل رسمی</span><h3>کت و شلوار پسرانه</h3><small>خرید کنید ←</small></div></a>
  </div>

  <!-- ═══ محبوب‌ترین‌های فروشگاه ═══ -->
  <div class="sec-head" style="margin-top:26px"><h2 class="sec-title">محبوب‌ترین‌های فروشگاه</h2><a class="sec-link" href="products.php?sort=sales">همه ←</a></div>
  <p class="muted" style="margin:-8px 0 10px;font-size:10px">پرطرفدارترین محصولات فروشگاه</p>
  <div class="grid-products-4" style="display:grid;grid-auto-flow:column;grid-auto-columns:calc(16.66% - 9px);overflow-x:auto;gap:10px;padding-bottom:6px">
    <?php foreach ($bestsellers as $p) renderProductCard($p); ?>
  </div>

  <!-- ═══ سه بنر کالکشن ═══ -->
  <div class="duo-banners" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
    <a class="duo" href="products.php?cat=kids" style="background:linear-gradient(135deg,#122747,#1b3a6b)">
      <img src="<?= e($px('29224161', 700, 480)) ?>" alt="New Arrivals" loading="lazy" style="opacity:.85">
      <div class="duo-overlay"></div>
      <div class="duo-body"><small dir="ltr" style="color:#ffd54a">New Arrivals</small><h3>جدیدترین محصولات</h3><span class="btn" style="background:#fff;color:var(--navy);height:36px;padding:0 18px;font-size:10px;border-radius:99px;width:max-content">مشاهده کنید ←</span></div>
    </a>
    <a class="duo" href="products.php?cat=formal" style="background:linear-gradient(135deg,#3b0a2a,#651f4e)">
      <img src="<?= e($px('1620759', 700, 480)) ?>" alt="Workwear Reimagined" loading="lazy" style="opacity:.85">
      <div class="duo-overlay" style="background:linear-gradient(to left, rgba(59,10,42,.85), rgba(59,10,42,.25), transparent)"></div>
      <div class="duo-body"><small dir="ltr" style="color:#f9a8d4">Workwear Reimagined</small><h3>استایل رسمی و مدرسه‌ای</h3><span class="btn" style="background:#fff;color:#3b0a2a;height:36px;padding:0 18px;font-size:10px;border-radius:99px;width:max-content">مشاهده مجموعه ←</span></div>
    </a>
    <a class="duo" href="products.php?cat=kids" style="background:linear-gradient(135deg,#0e2a47,#14532d)">
      <img src="<?= e($px('1620760', 700, 480)) ?>" alt="Weekend Looks" loading="lazy" style="opacity:.85">
      <div class="duo-overlay" style="background:linear-gradient(to left, rgba(14,42,71,.85), rgba(14,42,71,.25), transparent)"></div>
      <div class="duo-body"><small dir="ltr" style="color:#67e8f9">Weekend Looks</small><h3>استایل آخر هفته</h3><span class="btn" style="background:#fff;color:#0e2a47;height:36px;padding:0 18px;font-size:10px;border-radius:99px;width:max-content">مشاهده مجموعه ←</span></div>
    </a>
  </div>

  <!-- ═══ نوار اعتماد ═══ -->
  <div class="trust-row" style="grid-template-columns:repeat(2,1fr);margin-top:14px">
    <?php foreach ([
      ['پشتیبانی سریع', 'پاسخگویی ۲۴ ساعته', '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4z"/><path d="M20 14a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1z"/>'],
      ['ضمانت بازگشت', 'تا ۷ روز', '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'],
      ['بسته‌بندی شیک', 'و هدیه جذاب', '<path d="M20 12v10H4V12"/><rect x="2" y="7" width="20" height="5" rx="1"/><path d="M12 7v15M16 7a4 4 0 0 0-4-4 4 4 0 0 0-4 4"/>'],
      ['پرداخت امن', 'با تمامی کارت‌ها', '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'],
      ['ارسال سریع', 'به سراسر کشور', '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 8h4l4 4v5a1 1 0 0 1-1 1h-2"/><circle cx="7.5" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/>'],
    ] as [$t, $d, $path]): ?>
      <div class="trust-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="color:#e91e63"><?= $path ?></svg><span><b><?= e($t) ?></b><small><?= e($d) ?></small></span></div>
    <?php endforeach; ?>
  </div>

  <!-- ═══ مجله + بنر میانی + ست‌های پیشنهادی ═══ -->
  <div class="blog-row-wrap" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;margin-top:22px">
    <section class="panel">
      <div class="sec-head" style="margin:0 0 8px"><h2 class="sec-title" style="font-size:15px">آخرین مقالات مجله</h2><a class="sec-link" href="blog.php">همه ←</a></div>
      <?php foreach (array_slice($latestPosts, 0, 3) as $post): ?>
        <a href="blog.php?slug=<?= e($post['slug']) ?>" class="weekly-item" style="border-bottom:1px dashed var(--line)">
          <img src="<?= e($post['image']) ?>" alt="<?= e($post['title']) ?>" loading="lazy" style="width:64px;height:64px;border-radius:12px;object-fit:cover">
          <span><p style="font-size:11px"><?= e($post['title']) ?></p><small class="muted"><?= faDate($post['created_at']) ?></small></span>
        </a>
      <?php endforeach; ?>
    </section>
    <a href="blog.php" style="position:relative;border-radius:24px;overflow:hidden;min-height:280px;text-decoration:none;display:flex;align-items:center;padding:24px;box-shadow:var(--shadow)">
      <img src="<?= e($px('5088176', 800, 700)) ?>" alt="ایده بگیر و استایل بساز با MiniModa" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 18%" loading="lazy">
      <span style="position:absolute;inset:0;background:linear-gradient(to left, rgba(27,58,107,.88), rgba(27,58,107,.3) 60%, transparent)"></span>
      <span style="position:relative;max-width:58%">
        <small style="color:#ffd54a;font-size:10px;font-weight:900;letter-spacing:.1em">مجله مینی‌مودا</small>
        <b style="display:block;color:#fff;font-size:24px;line-height:1.6;margin:8px 0">ایده بگیر و<br>استایل بساز<br>با MiniModa</b>
        <span class="btn" style="background:var(--pink);color:#fff;height:38px;padding:0 18px;font-size:10px;width:max-content;border-radius:99px">مشاهده مقالات ←</span>
      </span>
    </a>
    <section class="panel" style="display:flex;flex-direction:column">
      <div class="sec-head" style="margin:0 0 10px"><h2 class="sec-title" style="font-size:15px">ست‌های پیشنهادی</h2><a class="sec-link" href="products.php">همه ←</a></div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;flex:1">
        <div style="border-radius:16px;overflow:hidden;background:#f6f4ef"><img src="<?= e($px('28506036', 300, 400)) ?>" alt="هودی آبی" style="width:100%;height:100%;object-fit:cover;object-position:top center" loading="lazy"></div>
        <div style="border-radius:16px;overflow:hidden;background:#f6f4ef"><img src="<?= e($px('9537104', 300, 400)) ?>" alt="کتانی" style="width:100%;height:100%;object-fit:cover;object-position:center" loading="lazy"></div>
        <div style="border-radius:16px;overflow:hidden;background:#f6f4ef"><img src="<?= e($px('30690921', 300, 400)) ?>" alt="کت پسرانه" style="width:100%;height:100%;object-fit:cover;object-position:top center" loading="lazy"></div>
      </div>
      <a href="products.php" class="btn" style="margin-top:10px;height:46px;background:var(--pink);color:#fff;border-radius:16px;font-size:11px">ست کامل با قیمت ویژه</a>
    </section>
  </div>

  <!-- ═══ جدیدترین اخبار مد و پوشاک ═══ -->
  <div class="sec-head"><h2 class="sec-title">جدیدترین اخبار مد و پوشاک</h2><a class="sec-link" href="blog.php">همه مقالات ←</a></div>
  <div class="grid-products-4" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px">
    <?php foreach ($latestPosts as $post): ?>
      <a class="blog-card" href="blog.php?slug=<?= e($post['slug']) ?>" style="flex:auto">
        <span class="blog-media"><img src="<?= e($post['image']) ?>" alt="<?= e($post['title']) ?>" loading="lazy" style="height:130px;width:100%;object-fit:cover"><span class="blog-tag"><?= e($post['tag']) ?></span></span>
        <span class="blog-body"><h3><?= e($post['title']) ?></h3><span class="blog-foot"><span><?= faDate($post['created_at']) ?></span><span><?= faNum($post['views']) ?> بازدید</span></span></span>
      </a>
    <?php endforeach; ?>
  </div>

  <!-- ═══ دو بنر پایین ═══ -->
  <div class="duo-banners">
    <a class="duo duo-a" href="products.php?cat=kids"><img src="<?= e($px('28246503', 1000, 650)) ?>" alt="Breezy Styles" loading="lazy" class="" style="object-position:50% 18%"><div class="duo-overlay"></div><div class="duo-body"><small dir="ltr" style="color:#67e8f9">Breezy Styles Bright Days</small><h3>روزهای روشن،<br>خاطره‌های سفید</h3><span class="btn" style="background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.4);color:#fff;height:36px;padding:0 18px;font-size:10px;border-radius:99px;width:max-content">مشاهده کالکشن ←</span></div></a>
    <a class="duo duo-b" href="products.php?offer=1"><img src="<?= e($px('14211426', 1000, 650)) ?>" alt="تخفیف ویژه تا ۵۰٪" loading="lazy" style="object-position:50% 18%"><div class="duo-overlay"></div><div class="duo-body"><small style="color:#fda4af">تخفیف ویژه</small><h3>تا ۵۰٪ تخفیف<br>روی منتخبات</h3><span class="btn" style="background:var(--pink);color:#fff;height:36px;padding:0 18px;font-size:10px;border-radius:99px;width:max-content">همین حالا خرید کنید ←</span></div></a>
  </div>

</div><!-- /wrap -->
<?php include __DIR__ . '/partials/footer.php'; ?>
