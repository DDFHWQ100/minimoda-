<?php
require __DIR__ . '/../shop-lib.php';
$pdo = db();
$star = max(0, min(5, (int)($_GET['star'] ?? 0)));
$sql = 'SELECT r.*, p.name AS pname, p.slug AS pslug FROM reviews r JOIN products p ON p.id = r.product_id';
if ($star) { $sql .= ' WHERE r.rating = ' . $star; }
$sql .= ' ORDER BY r.id DESC LIMIT 100';
$reviews = $pdo->query($sql)->fetchAll();
$avg = (float) $pdo->query('SELECT COALESCE(AVG(rating),0) FROM reviews')->fetchColumn();
?>
<h1 class="adm-h1">نظرات و امتیازها</h1>
<p class="adm-sub"><?= faNum(count($reviews)) ?> نظر — میانگین <b><?= faDigits(number_format($avg, 1)) ?> ★</b></p>
<div class="adm-row" style="gap:6px;margin-bottom:12px">
  <a class="adm-btn adm-btn-ghost adm-btn-sm" href="index.php?tab=shop_reviews">همه</a>
  <?php foreach ([5,4,3,2,1] as $s): ?><a class="adm-btn <?= $star === $s ? 'adm-btn-navy' : 'adm-btn-ghost' ?> adm-btn-sm" href="index.php?tab=shop_reviews&star=<?= $s ?>"><?= faDigits($s) ?> ★</a><?php endforeach; ?>
</div>
<div class="adm-grid-3">
  <?php foreach ($reviews as $r): ?>
    <div class="adm-card">
      <div class="adm-row" style="justify-content:space-between"><b style="font-size:11px;color:var(--navy)"><?= e($r['author_name']) ?></b><span style="color:#f59e0b"><?= str_repeat('★', (int)$r['rating']) . str_repeat('☆', 5 - (int)$r['rating']) ?></span></div>
      <a href="../product.php?slug=<?= e($r['pslug']) ?>" style="font-size:9px;color:#0369a1;text-decoration:none"><?= e($r['pname']) ?></a>
      <p style="font-size:11px;line-height:1.9;color:#374151;margin:6px 0 8px"><?= e($r['comment']) ?></p>
      <div class="adm-row" style="justify-content:space-between"><small style="color:#9ca3af"><?= faDate($r['created_at']) ?></small>
        <form method="post" onsubmit="return confirm('این نظر حذف شود؟')"><?= csrfField() ?><input type="hidden" name="action" value="shop_delete"><input type="hidden" name="table" value="reviews"><input type="hidden" name="id" value="<?= (int)$r['id'] ?>"><button class="adm-btn adm-btn-danger adm-btn-sm">حذف</button></form>
      </div>
    </div>
  <?php endforeach; ?>
  <?php if (!$reviews): ?><div class="adm-card" style="grid-column:1/-1;text-align:center;color:#9ca3af">نظری با این فیلتر ثبت نشده.</div><?php endif; ?>
</div>
