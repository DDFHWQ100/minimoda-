<?php
require __DIR__ . '/bootstrap.php';
$pdo = db();

$slug = trim((string)($_GET['slug'] ?? ''));

if ($slug !== '') {
    // ── نمایش تک مقاله ──
    $pdo->prepare('UPDATE blog_posts SET views = views + 1 WHERE slug = ?')->execute([$slug]);
    $st = $pdo->prepare('SELECT * FROM blog_posts WHERE slug = ? LIMIT 1');
    $st->execute([$slug]);
    $post = $st->fetch();
    if (!$post) { http_response_code(404); $pageTitle = 'مقاله یافت نشد'; include __DIR__ . '/partials/header.php'; echo '<div class="wrap"><div class="empty"><h3>مقاله یافت نشد</h3><a class="btn btn-primary" href="blog.php" style="height:44px;padding:0 24px;margin-top:10px">همه مقالات</a></div></div>'; include __DIR__ . '/partials/footer.php'; exit; }
    $related = $pdo->query('SELECT * FROM blog_posts WHERE id <> ' . (int)$post['id'] . ' ORDER BY views DESC LIMIT 3')->fetchAll();
    $pageTitle = $post['title'] . ' | وبلاگ مینی‌مودا';
    include __DIR__ . '/partials/header.php';
    ?>
    <article class="wrap" style="max-width:880px">
      <nav class="breadcrumb"><a href="index.php">خانه</a><span>‹</span><a href="blog.php">وبلاگ</a><span>‹</span><b><?= e($post['tag']) ?></b></nav>
      <h1 style="font-size:21px;line-height:1.8;color:var(--navy);margin:6px 0"><?= e($post['title']) ?></h1>
      <p class="muted" style="font-size:10px"><?= faDate($post['created_at']) ?> · <?= faNum($post['views']) ?> بازدید · <?= e($post['tag']) ?></p>
      <div style="border-radius:var(--radius);overflow:hidden;margin:12px 0;box-shadow:var(--shadow)"><img src="<?= e($post['image']) ?>" alt="<?= e($post['title']) ?>" style="width:100%;height:280px;object-fit:cover"></div>
      <p style="background:#fffbeb;border:1px solid #fde68a;color:#92400e;border-radius:14px;padding:12px 16px;font-size:12px;font-weight:700;line-height:2"><?= e($post['excerpt']) ?></p>
      <div style="font-size:13px;line-height:2.3;color:#374151;white-space:pre-line;margin-top:12px"><?= e($post['content']) ?></div>
      <a class="btn btn-primary" href="products.php" style="height:48px;padding:0 26px;margin:18px 0">مشاهده فروشگاه ←</a>
      <h2 class="sec-title" style="font-size:16px">مقالات مرتبط</h2>
      <div class="grid-products-4" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">
        <?php foreach ($related as $r): ?>
          <a class="blog-card" href="blog.php?slug=<?= e($r['slug']) ?>" style="flex:auto"><span class="blog-media"><img src="<?= e($r['image']) ?>" alt="<?= e($r['title']) ?>" style="height:130px;width:100%;object-fit:cover"></span><span class="blog-body"><h3 style="min-height:0"><?= e($r['title']) ?></h3></span></a>
        <?php endforeach; ?>
      </div>
    </article>
    <?php
    include __DIR__ . '/partials/footer.php';
    exit;
}

// ── لیست مقالات ──
$posts = $pdo->query('SELECT * FROM blog_posts ORDER BY created_at DESC')->fetchAll();
$featured = $posts[0] ?? null;
$pageTitle = 'وبلاگ مد و پوشاک کودک | مینی‌مودا';
include __DIR__ . '/partials/header.php';
?>
<div class="wrap">
  <h1 class="sec-title" style="margin-top:16px">وبلاگ مینی‌مودا</h1>
  <p class="muted" style="font-size:12px;margin:2px 0 14px">ترندهای مد کودک، راهنمای خرید و نکات سلامتی فرزندتان</p>

  <?php if ($featured): ?>
    <a href="blog.php?slug=<?= e($featured['slug']) ?>" style="position:relative;display:block;border-radius:var(--radius);overflow:hidden;height:280px;text-decoration:none;margin-bottom:14px;box-shadow:var(--shadow)">
      <img src="<?= e($featured['image']) ?>" alt="<?= e($featured['title']) ?>" style="width:100%;height:100%;object-fit:cover">
      <span style="position:absolute;inset:0;background:linear-gradient(to top, rgba(14,28,54,.9), transparent 60%)"></span>
      <span style="position:absolute;bottom:0;right:0;left:0;padding:20px;color:#fff">
        <span class="blog-tag" style="position:static;display:inline-block;margin-bottom:6px"><?= e($featured['tag']) ?></span>
        <h2 style="margin:0;font-size:17px;line-height:1.8"><?= e($featured['title']) ?></h2>
      </span>
    </a>
  <?php endif; ?>

  <div class="grid-products-4" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">
    <?php foreach (array_slice($posts, 1) as $post): ?>
      <a class="blog-card" href="blog.php?slug=<?= e($post['slug']) ?>" style="flex:auto">
        <span class="blog-media"><img src="<?= e($post['image']) ?>" alt="<?= e($post['title']) ?>" loading="lazy"><span class="blog-tag"><?= e($post['tag']) ?></span></span>
        <span class="blog-body"><h3><?= e($post['title']) ?></h3><span class="blog-foot"><span><?= faDate($post['created_at']) ?></span><span><?= faNum($post['views']) ?> بازدید</span></span></span>
      </a>
    <?php endforeach; ?>
  </div>
</div>
<?php include __DIR__ . '/partials/footer.php'; ?>
