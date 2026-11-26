<?php
require __DIR__ . '/bootstrap.php';
$pdo = db();

$cat   = inputString($_GET, 'cat');
$q     = mb_substr(inputString($_GET, 'q'), 0, 80);
$offer = inputString($_GET, 'offer') === '1';
$new   = inputString($_GET, 'new') === '1';
$sort  = inputString($_GET, 'sort', 'sales');
$min   = isset($_GET['min']) && is_numeric($_GET['min']) ? (float)$_GET['min'] : null;
$max   = isset($_GET['max']) && is_numeric($_GET['max']) ? (float)$_GET['max'] : null;
$page  = max(1, (int)inputString($_GET, 'page', '1'));
$perPage = 12;

$sorts = [
    'sales'      => ['label' => 'پرفروش‌ترین', 'sql' => 'sales_count DESC'],
    'newest'     => ['label' => 'جدیدترین',     'sql' => 'created_at DESC'],
    'price-asc'  => ['label' => 'ارزان‌ترین',   'sql' => 'price ASC'],
    'price-desc' => ['label' => 'گران‌ترین',    'sql' => 'price DESC'],
    'rating'     => ['label' => 'بهترین امتیاز','sql' => 'rating DESC'],
];
if (!isset($sorts[$sort])) { $sort = 'sales'; }

// نرمال‌سازی کامل: $cats و $activeCat همیشه آرایه‌ی انجمنی هستند
try {
    $cats = $pdo->query('SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) AS cnt FROM categories c ORDER BY c.sort_order ASC')->fetchAll(PDO::FETCH_ASSOC);
} catch (Throwable $ex) {
    $cats = [];
}
if (!is_array($cats)) { $cats = []; }
$cats = array_filter($cats, 'is_array');

$activeCat = null;
if ($cat !== '') {
    foreach ($cats as $c) {
        if (is_array($c) && isset($c['slug']) && $c['slug'] === $cat) { $activeCat = $c; break; }
    }
}

$where = [];
$params = [];
if ($activeCat) { $where[] = 'category_id = ?'; $params[] = (int)$activeCat['id']; }
elseif ($cat !== '') { $where[] = '1 = 0'; } // اسلاگ نامعتبر → هیچ نتیجه‌ای
if ($q !== '') { $where[] = 'name LIKE ?'; $params[] = '%' . $q . '%'; }
if ($offer)    { $where[] = 'discount_price IS NOT NULL AND discount_price < price'; }
if ($new)      { $where[] = 'is_new = 1'; }
if ($min !== null) { $where[] = 'price >= ?'; $params[] = $min; }
if ($max !== null) { $where[] = 'price <= ?'; $params[] = $max; }
$whereSql = $where ? 'WHERE ' . implode(' AND ', $where) : '';

$stCount = $pdo->prepare("SELECT COUNT(*) FROM products $whereSql");
$stCount->execute($params);
$total = (int)$stCount->fetchColumn();
$totalPages = max(1, (int)ceil($total / $perPage));
$page = min($page, $totalPages);
$offset = ($page - 1) * $perPage;

$st = $pdo->prepare("SELECT * FROM products $whereSql ORDER BY {$sorts[$sort]['sql']} LIMIT $perPage OFFSET $offset");
$st->execute($params);
$items = $st->fetchAll();

$buildUrl = function (array $overrides) use ($cat, $q, $offer, $new, $sort, $min, $max) {
    $params = array_filter([
        'cat'   => $cat ?: null,
        'q'     => $q ?: null,
        'offer' => $offer ? '1' : null,
        'new'   => $new ? '1' : null,
        'sort'  => $sort !== 'sales' ? $sort : null,
        'min'   => $min,
        'max'   => $max,
    ], fn($v) => $v !== null && $v !== '');
    foreach ($overrides as $k => $v) {
        if ($v === null || $v === '' || $v === false) { unset($params[$k]); } else { $params[$k] = $v; }
    }
    return 'products.php' . ($params ? ('?' . http_build_query($params)) : '');
};

$pageTitle = ($activeCat ? e($activeCat['name']) . ' | ' : ($q !== '' ? 'جستجو: ' . e($q) . ' | ' : '')) . 'محصولات مینی‌مودا';
include __DIR__ . '/partials/header.php';
?>

<div class="wrap">
  <nav class="breadcrumb"><a href="index.php">خانه</a><span>‹</span><a href="products.php">محصولات</a><?php if (is_array($activeCat) && !empty($activeCat['name'])): ?><span>‹</span><b><?= e($activeCat['name']) ?></b><?php endif; ?><?php if ($q !== ''): ?><span>‹</span><b>«<?= e($q) ?>»</b><?php endif; ?></nav>

  <div style="display:flex;gap:18px;align-items:flex-start;flex-wrap:wrap">

    <!-- ═══ فیلترها ═══ -->
    <aside class="panel" style="width:100%;max-width:250px;flex-shrink:0">
      <form method="get" action="products.php">
        <input type="hidden" name="cat" value="<?= e($cat) ?>">
        <input type="hidden" name="sort" value="<?= e($sort) ?>">
        <?php if ($q !== ''): ?><input type="hidden" name="q" value="<?= e($q) ?>"><?php endif; ?>
        <h2 style="margin:0;font-size:14px;color:var(--navy)">فیلتر محصولات</h2>
        <label class="label" style="margin-top:10px">محدوده قیمت (تومان)</label>
        <div style="display:flex;gap:8px;align-items:center">
          <input class="input" type="number" name="min" min="0" placeholder="از" value="<?= $min !== null ? (int)$min : '' ?>" dir="ltr" style="height:40px">
          <span class="muted">تا</span>
          <input class="input" type="number" name="max" min="0" placeholder="تا" value="<?= $max !== null ? (int)$max : '' ?>" dir="ltr" style="height:40px">
        </div>
        <label style="display:flex;gap:8px;align-items:center;margin-top:12px;font-size:12px;font-weight:700;cursor:pointer"><input type="checkbox" name="offer" value="1" <?= $offer ? 'checked' : '' ?> style="accent-color:var(--pink);width:17px;height:17px"> فقط تخفیف‌دار</label>
        <label style="display:flex;gap:8px;align-items:center;margin-top:8px;font-size:12px;font-weight:700;cursor:pointer"><input type="checkbox" name="new" value="1" <?= $new ? 'checked' : '' ?> style="accent-color:#10b981;width:17px;height:17px"> فقط جدیدها</label>
        <button class="btn btn-navy btn-block" type="submit" style="height:44px;margin-top:12px;font-size:12px">اعمال فیلترها</button>
        <?php if ($q !== '' || $offer || $new || $min !== null || $max !== null || $cat !== ''): ?>
          <a href="products.php" style="display:block;text-align:center;margin-top:8px;font-size:11px;color:var(--muted);text-decoration:none">حذف همه فیلترها ✕</a>
        <?php endif; ?>
      </form>

      <h3 style="margin:16px 0 8px;font-size:13px;color:var(--navy)">دسته‌بندی‌ها</h3>
      <ul style="list-style:none;margin:0;padding:0;display:grid;gap:2px;font-size:12px">
        <li><a href="<?= e($buildUrl(['cat' => null, 'page' => null])) ?>" style="display:flex;justify-content:space-between;padding:8px 10px;border-radius:10px;text-decoration:none;<?= $cat === '' ? 'background:var(--navy);color:var(--gold);font-weight:800' : 'color:#4b5563' ?>">همه محصولات</a></li>
        <?php foreach ($cats as $c): ?>
          <li><a href="<?= e($buildUrl(['cat' => $c['slug'], 'page' => null])) ?>" style="display:flex;justify-content:space-between;padding:8px 10px;border-radius:10px;text-decoration:none;<?= $cat === $c['slug'] ? 'background:var(--navy);color:var(--gold);font-weight:800' : 'color:#4b5563' ?>"><?= e($c['name']) ?><span><?= faNum($c['cnt']) ?></span></a></li>
        <?php endforeach; ?>
      </ul>
    </aside>

    <!-- ═══ نتایج ═══ -->
    <div style="flex:1;min-width:0">
      <div class="panel" style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 14px;flex-wrap:wrap">
        <p style="margin:0;font-size:12px;font-weight:700;color:#4b5563"><b style="color:var(--pink)"><?= faNum($total) ?></b> محصول <?= $activeCat ? 'در «' . e($activeCat['name']) . '»' : '' ?> <?= $q !== '' ? 'برای «' . e($q) . '»' : '' ?> یافت شد</p>
        <form method="get" action="products.php" style="display:flex;gap:6px;align-items:center">
          <?php foreach (['cat' => $cat, 'q' => $q, 'offer' => $offer ? '1' : null, 'new' => $new ? '1' : null, 'min' => $min, 'max' => $max] as $k => $v): if ($v === null || $v === '' || $v === false) continue; ?>
            <input type="hidden" name="<?= e($k) ?>" value="<?= e((string)$v) ?>">
          <?php endforeach; ?>
          <label class="label" style="margin:0;font-size:10px">مرتب‌سازی:</label>
          <select class="select" name="sort" onchange="this.form.submit()" style="height:36px;width:130px;font-size:11px">
            <?php foreach ($sorts as $k => $s): ?><option value="<?= e($k) ?>" <?= $sort === $k ? 'selected' : '' ?>><?= e($s['label']) ?></option><?php endforeach; ?>
          </select>
        </form>
      </div>

      <?php if (!$items): ?>
        <div class="empty" style="margin-top:14px">
          <svg viewBox="0 0 24 24" width="52" height="52" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/><line x1="8.5" y1="11" x2="13.5" y2="11"/></svg>
          <h3>محصولی یافت نشد</h3>
          <p>عبارت دیگری جستجو کنید یا فیلترها را حذف کنید.</p>
          <a class="btn btn-primary" href="products.php" style="height:44px;padding:0 26px;margin-top:10px">مشاهده همه محصولات</a>
        </div>
      <?php else: ?>
        <div class="grid-products-4" style="display:grid;margin-top:12px">
          <?php foreach ($items as $p) renderProductCard($p); ?>
        </div>

        <?php if ($totalPages > 1): ?>
          <nav class="pagination" aria-label="صفحه‌بندی">
            <?php if ($page > 1): ?><a href="<?= e($buildUrl(['page' => $page - 1])) ?>">‹</a><?php endif; ?>
            <?php for ($i = 1; $i <= $totalPages; $i++): ?>
              <?php if ($i === $page): ?><span class="current"><?= faDigits($i) ?></span><?php else: ?><a href="<?= e($buildUrl(['page' => $i])) ?>"><?= faDigits($i) ?></a><?php endif; ?>
            <?php endfor; ?>
            <?php if ($page < $totalPages): ?><a href="<?= e($buildUrl(['page' => $page + 1])) ?>">›</a><?php endif; ?>
          </nav>
        <?php endif; ?>
      <?php endif; ?>
    </div>
  </div>
</div>

<?php include __DIR__ . '/partials/footer.php'; ?>
