<?php
require __DIR__ . '/../shop-lib.php';
$pdo = db();
$posts = $pdo->query('SELECT * FROM blog_posts ORDER BY created_at DESC')->fetchAll();
?>
<h1 class="adm-h1">بلاگ و مجله مد</h1>
<p class="adm-sub"><?= faNum(count($posts)) ?> مقاله — انتشار و مدیریت مقالات مجله مینی‌مودا</p>
<div class="adm-grid-2">
  <div class="adm-card">
    <ul class="adm-list">
      <?php foreach ($posts as $p): ?>
        <li>
          <span class="grow"><b><?= e($p['title']) ?></b><small><?= e($p['tag']) ?> · <?= faDate($p['created_at']) ?> · <?= faNum($p['views']) ?> بازدید</small></span>
          <span class="adm-row" style="gap:4px">
            <a class="adm-btn adm-btn-ghost adm-btn-sm" href="../blog.php?slug=<?= e($p['slug']) ?>" target="_blank">مشاهده</a>
            <form method="post" onsubmit="return confirm('مقاله «<?= e($p['title']) ?>» حذف شود؟')"><?= csrfField() ?><input type="hidden" name="action" value="shop_delete"><input type="hidden" name="table" value="blog_posts"><input type="hidden" name="id" value="<?= (int)$p['id'] ?>"><button class="adm-btn adm-btn-danger adm-btn-sm">حذف</button></form>
          </span>
        </li>
      <?php endforeach; ?>
      <?php if (!$posts): ?><li class="adm-note">هنوز مقاله‌ای منتشر نشده.</li><?php endif; ?>
    </ul>
  </div>
  <form method="post" class="adm-card">
    <?= csrfField() ?><input type="hidden" name="action" value="shop_create_post">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">نوشتن مقاله جدید</h3>
    <label class="adm-field"><span>عنوان *</span><input class="adm-input" name="title" required placeholder="عنوان مقاله..."></label>
    <div class="adm-row" style="gap:8px">
      <label class="adm-field" style="flex:1"><span>برچسب</span><input class="adm-input" name="tag" placeholder="ترند مد"></label>
      <label class="adm-field" style="flex:1"><span>اسلاگ (انگلیسی)</span><input class="adm-input" name="slug" dir="ltr" placeholder="my-post-slug"></label>
    </div>
    <label class="adm-field"><span>تصویر (URL)</span><input class="adm-input" name="image" dir="ltr" placeholder="https://images.pexels.com/..."></label>
    <label class="adm-field"><span>چکیده</span><input class="adm-input" name="excerpt" placeholder="خلاصه یک‌خطی..."></label>
    <label class="adm-field"><span>متن مقاله *</span><textarea class="adm-textarea" name="content" required rows="7" placeholder="متن کامل مقاله..."></textarea></label>
    <button class="adm-btn adm-btn-primary" style="width:100%">انتشار مقاله</button>
  </form>
</div>
