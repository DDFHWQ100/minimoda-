<?php
require __DIR__ . '/bootstrap.php';
$pdo = db();

// ── گارد مدیر ─────────────────────────────────────────────────
if (!currentUser()) { redirect('auth.php?action=login&next=admin.php'); }
if (!isAdmin()) {
    http_response_code(403);
    $pageTitle = 'دسترسی غیرمجاز';
    include __DIR__ . '/partials/header.php';
    echo '<div class="wrap"><div class="empty"><h3>دسترسی غیرمجاز</h3><p>این بخش فقط برای مدیر فروشگاه در دسترس است.</p><a class="btn btn-navy" href="index.php" style="height:46px;padding:0 24px;margin-top:10px">بازگشت به فروشگاه</a></div></div>';
    include __DIR__ . '/partials/footer.php';
    exit;
}

// ── اکشن‌ها ───────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrfCheck();
    $action = (string)($_POST['action'] ?? '');

    if ($action === 'delete_product') {
        $pdo->prepare('DELETE FROM products WHERE id = ?')->execute([(int)($_POST['id'] ?? 0)]);
        flash('محصول حذف شد');
        redirect('admin.php?tab=products');
    }

    if ($action === 'toggle') {
        $field = (string)($_POST['field'] ?? '');
        $allowed = ['is_featured', 'is_offer', 'is_new'];
        if (in_array($field, $allowed, true)) {
            $pdo->prepare("UPDATE products SET $field = 1 - $field WHERE id = ?")->execute([(int)($_POST['id'] ?? 0)]);
            flash('وضعیت محصول به‌روز شد');
        }
        redirect('admin.php?tab=products');
    }

    if ($action === 'order_status') {
        $status = (string)($_POST['status'] ?? '');
        if (in_array($status, ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], true)) {
            $pdo->prepare('UPDATE orders SET status = ? WHERE id = ?')->execute([$status, (int)($_POST['order_id'] ?? 0)]);
            flash('وضعیت سفارش به‌روز شد');
        }
        redirect('admin.php?tab=orders');
    }

    if ($action === 'create_product') {
        $name = trim((string)($_POST['name'] ?? ''));
        $description = trim((string)($_POST['description'] ?? ''));
        $price = (float)($_POST['price'] ?? 0);
        $discount = is_numeric($_POST['discount_price'] ?? null) && (float)$_POST['discount_price'] > 0 ? (float)$_POST['discount_price'] : null;
        $stock = max(0, (int)($_POST['stock'] ?? 0));
        $categoryId = is_numeric($_POST['category_id'] ?? null) ? (int)$_POST['category_id'] : null;
        $sizes = array_values(array_filter(array_map('trim', explode(',', (string)($_POST['sizes'] ?? '')))));
        $colors = [];
        foreach (preg_split('/\r\n|\r|\n/', (string)($_POST['colors'] ?? '')) as $line) {
            $parts = array_map('trim', explode(',', $line));
            if (count($parts) >= 1 && $parts[0] !== '') { $colors[] = ['name' => $parts[0], 'hex' => $parts[1] ?? '#999999']; }
        }
        $images = array_values(array_filter(array_map('trim', preg_split('/\r\n|\r|\n/', (string)($_POST['images'] ?? ''))), fn($u) => $u !== '' && strpos($u, 'http') === 0));

        $errs = [];
        if (mb_strlen($name) < 3) { $errs[] = 'نام محصول نامعتبر است.'; }
        if ($price <= 0) { $errs[] = 'قیمت باید عددی مثبت باشد.'; }
        if ($discount !== null && $discount >= $price) { $errs[] = 'قیمت تخفیف باید کمتر از قیمت اصلی باشد.'; }
        if (!$images) { $errs[] = 'حداقل یک آدرس تصویر وارد کنید.'; }

        if (!$errs) {
            $slug = 'mm-' . base_convert((string)time(), 10, 36);
            $st = $pdo->prepare('INSERT INTO products (name, slug, description, price, discount_price, category_id, stock, sizes, colors, images, rating, review_count, sales_count, is_new, is_offer, is_featured) VALUES (?,?,?,?,?,?,?,?,?,?,4.5,0,0,?,?,?)');
            $st->execute([
                $name, $slug, $description, (int)$price, $discount !== null ? (int)$discount : null, $categoryId, $stock,
                json_encode($sizes, JSON_UNESCAPED_UNICODE), json_encode($colors, JSON_UNESCAPED_UNICODE), json_encode($images, JSON_UNESCAPED_UNICODE),
                isset($_POST['is_new']) ? 1 : 0, (isset($_POST['is_offer']) || $discount !== null) ? 1 : 0, isset($_POST['is_featured']) ? 1 : 0,
            ]);
            flash('محصول با موفقیت به فروشگاه اضافه شد');
            redirect('admin.php?tab=products');
        }
        foreach ($errs as $err) { flash($err, 'error'); }
        redirect('admin.php?tab=new');
    }
}

$tab = (string)($_GET['tab'] ?? 'dashboard');
if (!in_array($tab, ['dashboard', 'products', 'new', 'orders'], true)) { $tab = 'dashboard'; }
$pageTitle = 'پنل مدیریت | مینی‌مودا';
include __DIR__ . '/partials/header.php';
$statuses = ['pending' => ['در انتظار پرداخت', 'st-pending'], 'processing' => ['آماده‌سازی', 'st-processing'], 'shipped' => ['ارسال شده', 'st-shipped'], 'delivered' => ['تحویل شد', 'st-delivered'], 'cancelled' => ['لغو شد', 'st-cancelled']];
?>
<div class="wrap admin-grid">

  <!-- سایدبار مدیریت -->
  <aside style="background:var(--navy);color:#fff;border-radius:var(--radius);padding:16px;display:grid;gap:6px">
    <p style="margin:0 0 4px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,.12);font-size:13px;font-weight:900">پنل مدیریت <small style="display:block;font-weight:400;color:rgba(255,255,255,.6)"><?= e(currentUser()['name']) ?></small></p>
    <?php foreach (['dashboard' => 'داشبورد', 'products' => 'مدیریت محصولات', 'new' => 'افزودن محصول', 'orders' => 'سفارش‌ها'] as $k => $label): ?>
      <a href="admin.php?tab=<?= e($k) ?>" style="padding:11px 14px;border-radius:12px;text-decoration:none;font-size:12px;font-weight:800;<?= $tab === $k ? 'background:rgba(255,255,255,.14);color:var(--gold)' : 'color:rgba(255,255,255,.8)' ?>"><?= e($label) ?></a>
    <?php endforeach; ?>
    <a href="admin/index.php" style="padding:11px 14px;border-radius:12px;text-decoration:none;font-size:12px;font-weight:800;color:#1b3a6b;background:#fcd34d">👑 مدیریت قالب و پوسته</a>
    <a href="index.php" style="padding:11px 14px;border-radius:12px;text-decoration:none;font-size:12px;font-weight:800;color:#fcd34d;border:1px dashed rgba(252,211,77,.4)">← بازگشت به فروشگاه</a>
  </aside>

  <div style="min-width:0">
  <?php if ($tab === 'dashboard'):
    $rev = $pdo->query("SELECT COALESCE(SUM(total),0) AS s, COUNT(*) AS c FROM orders WHERE status <> 'cancelled'")->fetch();
    $prodCount = (int)$pdo->query('SELECT COUNT(*) FROM products')->fetchColumn();
    $userCount = (int)$pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
    $lowStock = (int)$pdo->query('SELECT COUNT(*) FROM products WHERE stock <= 10')->fetchColumn();
    $avg = $rev['c'] > 0 ? (int)($rev['s'] / $rev['c']) : 0;
    $recent = $pdo->query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5')->fetchAll();
    $top = $pdo->query('SELECT * FROM products ORDER BY sales_count DESC LIMIT 5')->fetchAll();
  ?>
    <h1 class="sec-title" style="margin:0">داشبورد فروشگاه</h1>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-top:12px">
      <div class="admin-stat"><small>فروش کل</small><b><?= faMoney($rev['s']) ?></b></div>
      <div class="admin-stat"><small>تعداد سفارش‌ها</small><b><?= faNum($rev['c']) ?></b></div>
      <div class="admin-stat"><small>محصولات</small><b><?= faNum($prodCount) ?></b></div>
      <div class="admin-stat"><small>کاربران</small><b><?= faNum($userCount) ?></b></div>
      <div class="admin-stat"><small>میانگین سبد خرید</small><b><?= faMoney($avg) ?></b></div>
      <div class="admin-stat"><small>کالاهای کم‌موجودی</small><b style="color:#dc2626"><?= faNum($lowStock) ?></b></div>
    </div>

    <div class="panel" style="margin-top:14px;overflow-x:auto">
      <h2 style="margin:0 0 8px;font-size:13px;color:var(--navy)">سفارش‌های اخیر</h2>
      <table class="table">
        <thead><tr><th>شماره</th><th>مشتری</th><th>تاریخ</th><th>وضعیت</th><th>مبلغ</th></tr></thead>
        <tbody>
          <?php foreach ($recent as $o): [$l, $c] = $statuses[$o['status']] ?? $statuses['pending']; ?>
            <tr><td><b>#MM-<?= faDigits(str_pad((string)$o['id'], 5, '0', STR_PAD_LEFT)) ?></b></td><td><?= e($o['customer_name']) ?></td><td><?= faDate($o['created_at']) ?></td><td><span class="st <?= e($c) ?>"><?= e($l) ?></span></td><td><?= faMoney($o['total']) ?></td></tr>
          <?php endforeach; ?>
          <?php if (!$recent): ?><tr><td colspan="5" style="text-align:center;color:var(--muted)">هنوز سفارشی ثبت نشده است.</td></tr><?php endif; ?>
        </tbody>
      </table>
    </div>

    <div class="panel" style="margin-top:12px">
      <h2 style="margin:0 0 8px;font-size:13px;color:var(--navy)">پرفروش‌ترین محصولات</h2>
      <?php foreach ($top as $p): $img = productImage($p); ?>
        <div style="display:flex;gap:10px;align-items:center;padding:6px 0;border-bottom:1px dashed var(--line)">
          <img src="<?= e($img) ?>" alt="<?= e($p['name']) ?>" style="width:40px;height:52px;object-fit:cover;border-radius:8px">
          <span style="flex:1;min-width:0;font-size:11px;font-weight:700;color:#374151;line-height:1.7"><?= e($p['name']) ?><br><small class="muted"><?= faNum($p['sales_count']) ?> فروش · موجودی <?= faNum($p['stock']) ?></small></span>
          <b style="font-size:10px;color:#059669;white-space:nowrap"><?= faMoney(effectivePrice($p)) ?></b>
        </div>
      <?php endforeach; ?>
    </div>

  <?php elseif ($tab === 'products'):
    $products = $pdo->query('SELECT p.*, c.name AS cat_name FROM products p LEFT JOIN categories c ON c.id = p.category_id ORDER BY p.id ASC')->fetchAll();
  ?>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
      <h1 class="sec-title" style="margin:0">مدیریت محصولات (<?= faNum(count($products)) ?>)</h1>
      <a class="btn btn-primary" href="admin.php?tab=new" style="height:42px;padding:0 20px;font-size:12px">+ افزودن محصول</a>
    </div>
    <div class="panel" style="margin-top:12px;overflow-x:auto">
      <table class="table">
        <thead><tr><th>محصول</th><th>دسته</th><th>قیمت</th><th>موجودی</th><th>فروش</th><th>وضعیت</th><th>عملیات</th></tr></thead>
        <tbody>
          <?php foreach ($products as $p): $img = productImage($p); $eff = effectivePrice($p); ?>
            <tr>
              <td><div style="display:flex;gap:8px;align-items:center;max-width:230px"><img src="<?= e($img) ?>" alt="<?= e($p['name']) ?>" style="width:36px;height:46px;object-fit:cover;border-radius:7px"><a href="product.php?slug=<?= e($p['slug']) ?>" style="color:var(--navy);text-decoration:none;font-weight:700;line-height:1.6"><?= e($p['name']) ?></a></div></td>
              <td><?= e($p['cat_name'] ?? '—') ?></td>
              <td><?php if ($p['discount_price']): ?><s class="muted" style="font-size:9px"><?= faMoney($p['price']) ?></s><br><b style="color:var(--pink)"><?= faMoney($eff) ?></b><?php else: ?><?= faMoney($eff) ?><?php endif; ?></td>
              <td><b style="color:<?= $p['stock'] <= 10 ? '#dc2626' : '#059669' ?>"><?= faNum($p['stock']) ?></b></td>
              <td><?= faNum($p['sales_count']) ?></td>
              <td><?php if ($p['is_offer']): ?><span class="st" style="background:#fdf2f8;color:#be185d;border-color:#f9a8d4">تخفیف</span> <?php endif; ?><?php if ($p['is_new']): ?><span class="st" style="background:#d1fae5;color:#065f46;border-color:#a7f3d0">جدید</span> <?php endif; ?><?php if ($p['is_featured']): ?><span class="st" style="background:#fef3c7;color:#92400e;border-color:#fde68a">ویژه</span><?php endif; ?></td>
              <td>
                <form method="post" action="admin.php?tab=products" style="display:inline"><?= csrfField() ?><input type="hidden" name="action" value="toggle"><input type="hidden" name="field" value="is_featured"><input type="hidden" name="id" value="<?= (int)$p['id'] ?>"><button class="btn btn-outline" title="ویژه/عادی" style="width:32px;height:32px;padding:0;font-size:14px">★</button></form>
                <form method="post" action="admin.php?tab=products" style="display:inline"><?= csrfField() ?><input type="hidden" name="action" value="toggle"><input type="hidden" name="field" value="is_offer"><input type="hidden" name="id" value="<?= (int)$p['id'] ?>"><button class="btn btn-outline" title="تخفیف‌دار/عادی" style="width:32px;height:32px;padding:0;font-size:12px">٪</button></form>
                <form method="post" action="admin.php?tab=products" style="display:inline" onsubmit="return confirm('حذف «<?= e($p['name']) ?>» مطمئن هستید؟');"><?= csrfField() ?><input type="hidden" name="action" value="delete_product"><input type="hidden" name="id" value="<?= (int)$p['id'] ?>"><button class="btn btn-outline" title="حذف" style="width:32px;height:32px;padding:0;color:#e11d48;border-color:#fecdd3"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button></form>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>

  <?php elseif ($tab === 'new'):
    $cats = $pdo->query('SELECT id, name FROM categories ORDER BY sort_order ASC')->fetchAll();
  ?>
    <h1 class="sec-title" style="margin:0">افزودن محصول جدید</h1>
    <form method="post" action="admin.php?tab=new" class="panel" style="margin-top:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px">
      <?= csrfField() ?>
      <input type="hidden" name="action" value="create_product">
      <div style="display:grid;gap:10px;align-content:start">
        <div><label class="label" for="name">نام محصول *</label><input class="input" id="name" name="name" required placeholder="پیراهن مجلسی..."></div>
        <div><label class="label" for="description">توضیحات</label><textarea class="textarea" id="description" name="description" rows="4"></textarea></div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
          <div><label class="label" for="price">قیمت (تومان) *</label><input class="input" id="price" name="price" type="number" min="0" required dir="ltr" placeholder="1500000"></div>
          <div><label class="label" for="discount_price">قیمت تخفیف</label><input class="input" id="discount_price" name="discount_price" type="number" min="0" dir="ltr" placeholder="اختیاری"></div>
          <div><label class="label" for="stock">موجودی</label><input class="input" id="stock" name="stock" type="number" min="0" dir="ltr" value="10"></div>
        </div>
        <div><label class="label" for="category_id">دسته‌بندی</label><select class="select" id="category_id" name="category_id"><?php foreach ($cats as $c): ?><option value="<?= (int)$c['id'] ?>"><?= e($c['name']) ?></option><?php endforeach; ?></select></div>
        <div><label class="label" for="sizes">سایزها (با کاما)</label><input class="input" id="sizes" name="sizes" dir="ltr" value="4-5, 6-7, 8-9, 10-11"></div>
        <div style="display:flex;gap:14px;flex-wrap:wrap;font-size:12px;font-weight:800;color:#374151"><label style="display:flex;gap:6px;align-items:center;cursor:pointer"><input type="checkbox" name="is_new" checked style="accent-color:var(--pink);width:17px;height:17px"> جدید</label><label style="display:flex;gap:6px;align-items:center;cursor:pointer"><input type="checkbox" name="is_offer" style="accent-color:var(--pink);width:17px;height:17px"> تخفیف‌دار</label><label style="display:flex;gap:6px;align-items:center;cursor:pointer"><input type="checkbox" name="is_featured" style="accent-color:var(--pink);width:17px;height:17px"> کالای ویژه</label></div>
      </div>
      <div style="display:grid;gap:10px;align-content:start">
        <div><label class="label" for="images">آدرس تصاویر — هر خط یک لینک *</label><textarea class="textarea" id="images" name="images" required dir="ltr" rows="4" placeholder="https://images.pexels.com/photos/.../photo.jpeg&#10;https://..."></textarea></div>
        <div><label class="label" for="colors">رنگ‌ها — هر خط: نام،hex</label><textarea class="textarea" id="colors" name="colors" dir="ltr" rows="3" placeholder="صورتی,#f2a7c3&#10;آبی,#4a6fa5"></textarea></div>
        <button class="btn btn-primary btn-block" type="submit" style="height:52px;font-size:13px">ذخیره محصول در فروشگاه</button>
      </div>
    </form>

  <?php elseif ($tab === 'orders'):
    $orders = $pdo->query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 100')->fetchAll();
    $orderIds = array_column($orders, 'id');
    $itemsByOrder = [];
    if ($orderIds) {
      $in = implode(',', array_map('intval', $orderIds));
      foreach ($pdo->query("SELECT * FROM order_items WHERE order_id IN ($in)") as $item) { $itemsByOrder[(int)$item['order_id']][] = $item; }
    }
    $paymentLabels = ['online' => 'آنلاین', 'onsite' => 'درب منزل', 'card' => 'کارت‌به‌کارت'];
  ?>
    <h1 class="sec-title" style="margin:0">سفارش‌ها (<?= faNum(count($orders)) ?>)</h1>
    <div style="display:grid;gap:10px;margin-top:12px">
      <?php foreach ($orders as $o): [$l, $c] = $statuses[$o['status']] ?? $statuses['pending']; $oItems = $itemsByOrder[(int)$o['id']] ?? []; ?>
        <article class="panel" style="padding:0;overflow:hidden">
          <header style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;background:#f8f9fc;padding:8px 14px;font-size:10px;border-bottom:1px solid var(--line)">
            <b>#MM-<?= faDigits(str_pad((string)$o['id'], 5, '0', STR_PAD_LEFT)) ?></b>
            <span class="muted"><?= faDate($o['created_at']) ?></span>
            <span class="muted"><?= e($paymentLabels[$o['payment_method']] ?? '') ?></span>
            <form method="post" action="admin.php?tab=orders" style="margin-inline-start:auto;display:flex;gap:6px;align-items:center">
              <?= csrfField() ?>
              <input type="hidden" name="action" value="order_status">
              <input type="hidden" name="order_id" value="<?= (int)$o['id'] ?>">
              <select class="select" name="status" onchange="this.form.submit()" style="height:32px;width:auto;font-size:10px;font-weight:700">
                <?php foreach ($statuses as $k => [$sl, $sc]): ?><option value="<?= e($k) ?>" <?= $o['status'] === $k ? 'selected' : '' ?>><?= e($sl) ?></option><?php endforeach; ?>
              </select>
            </form>
          </header>
          <div style="padding:10px 14px;display:flex;gap:14px;align-items:center;flex-wrap:wrap">
            <div style="display:flex;gap:6px;flex:1;overflow:auto">
              <?php foreach ($oItems as $item): ?>
                <img src="<?= e($item['image']) ?>" alt="<?= e($item['name']) ?>" title="<?= e($item['name']) ?> ×<?= (int)$item['quantity'] ?>" style="width:48px;height:60px;object-fit:cover;border-radius:8px;background:#f6f4ef">
              <?php endforeach; ?>
            </div>
            <div style="font-size:10px;min-width:170px">
              <b style="color:var(--navy);font-size:11px"><?= e($o['customer_name']) ?></b><br>
              <span dir="ltr" class="muted"><?= e($o['phone']) ?></span><br>
              <span class="muted"><?= e(mb_substr($o['address'], 0, 60)) ?><?= mb_strlen($o['address']) > 60 ? '…' : '' ?></span><br>
              <b style="color:var(--navy);font-size:12px"><?= faMoney($o['total']) ?></b>
            </div>
          </div>
        </article>
      <?php endforeach; ?>
      <?php if (!$orders): ?><div class="empty"><h3>هنوز سفارشی ثبت نشده است.</h3></div><?php endif; ?>
    </div>
  <?php endif; ?>
  </div>
</div>
<style>
.admin-grid { display: grid; grid-template-columns: 240px minmax(0, 1fr); gap: 16px; align-items: start; margin-top: 14px; }
@media (max-width: 1000px) { .admin-grid { grid-template-columns: 1fr; } }
</style>
<?php include __DIR__ . '/partials/footer.php'; ?>
