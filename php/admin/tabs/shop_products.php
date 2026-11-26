<?php
require __DIR__ . '/../shop-lib.php';
$pdo = db();
$products = $pdo->query('SELECT id, name, slug, price, discount_price, stock, sales_count, is_new, is_offer, is_featured, images FROM products ORDER BY id ASC')->fetchAll();
$img = function (string $images): string { $a = json_decode($images, true); return is_array($a) && $a ? (string) $a[0] : '../assets/images/ref-hero.jpg'; };
?>
<h1 class="adm-h1">مدیریت محصولات</h1>
<p class="adm-sub"><?= faNum(count($products)) ?> محصول — روشن/خاموش‌کردن «جدید/پیشنهاد ویژه/ویژه» و حذف مستقیم</p>
<div class="adm-card" style="overflow-x:auto">
  <table class="adm-table">
    <thead><tr><th>محصول</th><th>قیمت</th><th>موجودی</th><th>فروش</th><th>وضعیت</th><th>عملیات</th></tr></thead>
    <tbody>
      <?php foreach ($products as $p): $disc = $p['discount_price'] && $p['discount_price'] < $p['price']; ?>
        <tr>
          <td>
            <div class="adm-row" style="gap:8px;max-width:260px">
              <img src="<?= e($img($p['images'])) ?>" alt="" style="width:40px;height:52px;object-fit:cover;border-radius:8px;background:#f6f4ef">
              <a href="../product.php?slug=<?= e($p['slug']) ?>" target="_blank" style="color:var(--navy);font-weight:700;font-size:11px;line-height:1.6;text-decoration:none"><?= e($p['name']) ?></a>
            </div>
          </td>
          <td><?php if ($disc): ?><s style="color:#9ca3af;font-size:9px"><?= faMoney($p['price']) ?></s><br><b style="color:var(--pink)"><?= faMoney($p['discount_price']) ?></b><?php else: ?><b><?= faMoney($p['price']) ?></b><?php endif; ?></td>
          <td><b style="color:<?= $p['stock'] <= 10 ? '#dc2626' : '#059669' ?>"><?= faNum($p['stock']) ?></b></td>
          <td><?= faNum($p['sales_count']) ?></td>
          <td>
            <?php if ($p['is_offer']): ?><span style="font-size:9px;background:#fdf2f8;color:#be185d;border:1px solid #f9a8d4;border-radius:99px;padding:2px 8px">تخفیف</span> <?php endif; ?>
            <?php if ($p['is_new']): ?><span style="font-size:9px;background:#d1fae5;color:#065f46;border:1px solid #a7f3d0;border-radius:99px;padding:2px 8px">جدید</span> <?php endif; ?>
            <?php if ($p['is_featured']): ?><span style="font-size:9px;background:#fef3c7;color:#92400e;border:1px solid #fde68a;border-radius:99px;padding:2px 8px">ویژه</span><?php endif; ?>
          </td>
          <td>
            <div class="adm-row" style="gap:4px">
              <form method="post"><?= csrfField() ?><input type="hidden" name="action" value="shop_toggle"><input type="hidden" name="table" value="products"><input type="hidden" name="field" value="is_featured"><input type="hidden" name="id" value="<?= (int)$p['id'] ?>"><button class="adm-btn adm-btn-ghost adm-btn-sm" title="ویژه">★</button></form>
              <form method="post"><?= csrfField() ?><input type="hidden" name="action" value="shop_toggle"><input type="hidden" name="table" value="products"><input type="hidden" name="field" value="is_offer"><input type="hidden" name="id" value="<?= (int)$p['id'] ?>"><button class="adm-btn adm-btn-ghost adm-btn-sm" title="تخفیف">٪</button></form>
              <form method="post"><?= csrfField() ?><input type="hidden" name="action" value="shop_toggle"><input type="hidden" name="table" value="products"><input type="hidden" name="field" value="is_new"><input type="hidden" name="id" value="<?= (int)$p['id'] ?>"><button class="adm-btn adm-btn-ghost adm-btn-sm" title="جدید">✦</button></form>
              <form method="post" onsubmit="return confirm('حذف «<?= e($p['name']) ?>» مطمئن هستید؟')"><?= csrfField() ?><input type="hidden" name="action" value="shop_delete"><input type="hidden" name="table" value="products"><input type="hidden" name="id" value="<?= (int)$p['id'] ?>"><button class="adm-btn adm-btn-danger adm-btn-sm">حذف</button></form>
            </div>
          </td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</div>
