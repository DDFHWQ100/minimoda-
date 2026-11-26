<?php
// ══════════════════════════════════════════════════════════════
//  MiniModa — کتابخانه مشترک بخش «مدیریت فروشگاه» در پنل PHP
// ══════════════════════════════════════════════════════════════
declare(strict_types=1);

/** آیا جدول وجود دارد؟ */
function shopHasTable(string $table): bool {
    try { db()->query('SELECT 1 FROM `' . $table . '` LIMIT 1'); return true; } catch (Throwable $ex) { return false; }
}

/** کارت آماری */
function shopStat(string $label, string $value, string $tone = 'navy'): string {
    return '<div class="adm-stat"><small>' . e($label) . '</small><b style="color:' . ($tone === 'green' ? '#059669' : ($tone === 'red' ? '#dc2626' : 'var(--navy)')) . '">' . $value . '</b></div>';
}

/** وضعیت سفارش → برچسب فارسی */
function shopOrderStatus(string $s): string {
    return ['pending' => 'در انتظار پرداخت', 'processing' => 'در حال آماده‌سازی', 'shipped' => 'ارسال شده', 'delivered' => 'تحویل داده شد', 'cancelled' => 'لغو شده'][$s] ?? $s;
}

function shopPaymentLabel(string $p): string {
    return ['online' => 'آنلاین (زرین‌پال)', 'onsite' => 'درب منزل', 'card' => 'کارت به کارت'][$p] ?? $p;
}

function shopReturnStatus(string $s): string {
    return ['requested' => 'در انتظار بررسی', 'approved' => 'تأیید شده', 'rejected' => 'رد شده', 'done' => 'انجام شد'][$s] ?? $s;
}

/** هندلر اکشن‌های فروشگاه — از switch پنل فراخوانی می‌شود */
function shopHandlePost(): void {
    $pdo = db();
    $actor = currentUser()['name'] ?? 'admin';
    $action = (string) ($_POST['action'] ?? '');
    $int = fn($v, $d = 0) => is_numeric($v) ? (int) $v : $d;
    $str = fn($v, $max = 500) => mb_substr(trim((string) $v), 0, $max);

    switch ($action) {
        case 'shop_toggle': {
            $table = $str($_POST['table'] ?? '', 40);
            $field = $str($_POST['field'] ?? '', 40);
            $allowed = ['products' => ['is_new', 'is_offer', 'is_featured'], 'discount_codes' => ['active'], 'shipping_methods' => ['active'], 'campaigns' => ['active'], 'size_charts' => ['active'], 'contact_messages' => ['is_read']];
            if (!isset($allowed[$table]) || !in_array($field, $allowed[$table], true)) { flash('نوع عملیات نامعتبر است', 'error'); return; }
            $id = $int($_POST['id']);
            $pdo->prepare("UPDATE `{$table}` SET `{$field}` = 1 - `{$field}` WHERE id = ?")->execute([$id]);
            themeLog($actor, 'تغییر وضعیت', "{$table} #{$id} → {$field}");
            flash('وضعیت به‌روز شد');
            return;
        }
        case 'shop_delete': {
            $table = $str($_POST['table'] ?? '', 40);
            $allowed = ['products', 'reviews', 'blog_posts', 'content_pages', 'brands', 'suppliers', 'discount_codes', 'shipping_methods', 'campaigns', 'size_charts', 'contact_messages'];
            if (!in_array($table, $allowed, true)) { flash('نوع عملیات نامعتبر است', 'error'); return; }
            $id = $int($_POST['id']);
            $pdo->prepare("DELETE FROM `{$table}` WHERE id = ?")->execute([$id]);
            themeLog($actor, 'حذف رکورد', "{$table} #{$id}");
            flash('حذف شد');
            return;
        }
        case 'shop_set_status': {
            $entity = $str($_POST['entity'] ?? '', 40);
            $id = $int($_POST['id']);
            $status = $str($_POST['status'] ?? '', 20);
            if ($entity === 'orders') {
                if (!in_array($status, ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], true)) { flash('وضعیت نامعتبر', 'error'); return; }
                $pdo->prepare('UPDATE orders SET status = ? WHERE id = ?')->execute([$status, $id]);
                themeLog($actor, 'تغییر وضعیت سفارش', "#MM-" . str_pad((string) $id, 5, '0', STR_PAD_LEFT) . " → {$status}");
            } elseif ($entity === 'returns_requests') {
                if (!in_array($status, ['requested', 'approved', 'rejected', 'done'], true)) { flash('وضعیت نامعتبر', 'error'); return; }
                $pdo->prepare('UPDATE returns_requests SET status = ? WHERE id = ?')->execute([$status, $id]);
                themeLog($actor, 'تغییر وضعیت مرجوعی', "#{$id} → {$status}");
            } else { flash('موجودیت نامعتبر', 'error'); return; }
            flash('وضعیت ذخیره شد');
            return;
        }
        case 'shop_set_stock': {
            $id = $int($_POST['id']);
            $stock = max(0, $int($_POST['stock']));
            $pdo->prepare('UPDATE products SET stock = ? WHERE id = ?')->execute([$stock, $id]);
            $pdo->prepare('INSERT INTO stock_movements (product_id, delta, reason, note) VALUES (?, 0, ?, ?)')
                ->execute([$id, 'اصلاح موجودی', 'تنظیم دستی از پنل']);
            themeLog($actor, 'اصلاح موجودی', "محصول #{$id} → {$stock}");
            flash('موجودی ذخیره شد');
            return;
        }
        case 'shop_adjust_stock': {
            $productId = $int($_POST['product_id']);
            $delta = $int($_POST['delta']);
            $reason = $str($_POST['reason'] ?? 'اصلاح موجودی', 120);
            $note = $str($_POST['note'] ?? '', 200);
            if (!$productId || $delta === 0) { flash('محصول و مقدار تغییر الزامی است', 'error'); return; }
            $st = $pdo->prepare('UPDATE products SET stock = GREATEST(stock + ?, 0) WHERE id = ?')->execute([$delta, $productId]);
            $pdo->prepare('INSERT INTO stock_movements (product_id, delta, reason, note) VALUES (?, ?, ?, ?)')->execute([$productId, $delta, $reason, $note]);
            themeLog($actor, 'حرکت انبار', ($delta > 0 ? '+' : '') . $delta . ' — ' . $reason);
            flash('حرکت انبار ثبت شد');
            return;
        }
        case 'shop_create_discount': {
            $code = strtoupper(str_replace(' ', '', $str($_POST['code'] ?? '', 40)));
            $type = ($_POST['type'] ?? 'percent') === 'fixed' ? 'fixed' : 'percent';
            $value = $int($_POST['value']);
            if (!preg_match('/^[A-Z0-9_-]{3,40}$/', $code)) { flash('کد باید ۳ تا ۴۰ کاراکتر انگلیسی باشد', 'error'); return; }
            if ($value <= 0 || ($type === 'percent' && $value > 100)) { flash('مقدار تخفیف نامعتبر است', 'error'); return; }
            $exists = $pdo->prepare('SELECT id FROM discount_codes WHERE code = ?');
            $exists->execute([$code]);
            if ($exists->fetch()) { flash('این کد قبلاً ثبت شده است', 'error'); return; }
            $exp = trim((string)($_POST['expires_at'] ?? ''));
            $pdo->prepare('INSERT INTO discount_codes (code, type, value, min_order, max_uses, expires_at, active) VALUES (?,?,?,?,?,?,1)')
                ->execute([$code, $type, $value, max(0, $int($_POST['min_order'] ?? 0)), max(1, $int($_POST['max_uses'] ?? 100, 100)), $exp !== '' ? $exp : null]);
            themeLog($actor, 'ایجاد کد تخفیف', $code);
            flash('کد تخفیف ثبت شد');
            return;
        }
        case 'shop_create_shipping': {
            $name = $str($_POST['name'] ?? '', 120);
            if (mb_strlen($name) < 2) { flash('نام روش ارسال الزامی است', 'error'); return; }
            $pdo->prepare('INSERT INTO shipping_methods (name, cost, free_over, eta_days, active) VALUES (?,?,?,?,1)')
                ->execute([$name, max(0, $int($_POST['cost'] ?? 0)), max(0, $int($_POST['free_over'] ?? 0)), max(1, $int($_POST['eta_days'] ?? 2, 2))]);
            themeLog($actor, 'افزودن روش ارسال', $name);
            flash('روش ارسال ثبت شد');
            return;
        }
        case 'shop_create_supplier': {
            $name = $str($_POST['name'] ?? '', 120);
            if (mb_strlen($name) < 2) { flash('نام تأمین‌کننده الزامی است', 'error'); return; }
            $pdo->prepare('INSERT INTO suppliers (name, contact_person, phone, address, notes) VALUES (?,?,?,?,?)')
                ->execute([$name, $str($_POST['contact_person'] ?? '', 80), $str($_POST['phone'] ?? '', 30), $str($_POST['address'] ?? '', 300), $str($_POST['notes'] ?? '', 500)]);
            themeLog($actor, 'افزودن تأمین‌کننده', $name);
            flash('تأمین‌کننده ثبت شد');
            return;
        }
        case 'shop_create_campaign': {
            $title = $str($_POST['title'] ?? '', 160);
            if (mb_strlen($title) < 3) { flash('عنوان کمپین الزامی است', 'error'); return; }
            $slug = preg_replace('/[^a-z0-9-]+/', '-', mb_strtolower(str_replace([' ', '_'], '-', $title))) ?: 'camp-' . time();
            $codeId = $int($_POST['discount_code_id'] ?? 0);
            $pdo->prepare('INSERT INTO campaigns (title, slug, description, banner_image, start_at, end_at, discount_code_id, active) VALUES (?,?,?,?,?,?,?,1)')
                ->execute([$title, $slug . '-' . base_convert((string) time(), 10, 36), $str($_POST['description'] ?? '', 600), $str($_POST['banner_image'] ?? '', 500), $str($_POST['start_at'] ?? '', 20) ?: null, $str($_POST['end_at'] ?? '', 20) ?: null, $codeId > 0 ? $codeId : null]);
            themeLog($actor, 'ایجاد کمپین', $title);
            flash('کمپین ثبت شد');
            return;
        }
        case 'shop_create_sizechart': {
            $name = $str($_POST['name'] ?? '', 120);
            $rows = json_decode((string) ($_POST['rows_json'] ?? ''), true);
            if (mb_strlen($name) < 2 || !is_array($rows) || !count($rows)) { flash('نام و ردیف‌های JSON معتبر لازم است', 'error'); return; }
            $clean = [];
            foreach ($rows as $r) { if (is_array($r) && !empty($r['size'])) $clean[] = ['size' => $str($r['size'] ?? '', 20), 'height' => $str($r['height'] ?? '', 20), 'chest' => $str($r['chest'] ?? '', 20), 'waist' => $str($r['waist'] ?? '', 20)]; }
            if (!$clean) { flash('هیچ ردیف معتبری یافت نشد', 'error'); return; }
            $pdo->prepare('INSERT INTO size_charts (name, rows_json, active) VALUES (?,?,1)')->execute([$name, json_encode($clean, JSON_UNESCAPED_UNICODE)]);
            themeLog($actor, 'ایجاد جدول سایزبندی', $name);
            flash('جدول سایزبندی ثبت شد');
            return;
        }
        case 'shop_create_page': {
            $title = $str($_POST['title'] ?? '', 160);
            $slug = preg_replace('/[^a-z0-9-]+/', '-', mb_strtolower(str_replace(' ', '-', trim((string) ($_POST['slug'] ?? '')))));
            $body = (string) ($_POST['body'] ?? '');
            if (mb_strlen($title) < 2 || $slug === '' || mb_strlen($body) < 20) { flash('عنوان، اسلاگ و متن (حداقل ۲۰ کاراکتر) لازم است', 'error'); return; }
            $exists = $pdo->prepare('SELECT id FROM content_pages WHERE slug = ?');
            $exists->execute([$slug]);
            if ($exists->fetch()) { flash('این اسلاگ قبلاً استفاده شده است', 'error'); return; }
            $pdo->prepare('INSERT INTO content_pages (title, slug, body) VALUES (?,?,?)')->execute([$title, $slug, $body]);
            themeLog($actor, 'ایجاد صفحه محتوا', $title);
            flash('صفحه منتشر شد');
            return;
        }
        case 'shop_create_brand': {
            $name = $str($_POST['name'] ?? '', 120);
            $rawSlug = trim((string) ($_POST['slug'] ?? ''));
            $slug = $rawSlug !== '' ? preg_replace('/[^a-z0-9-]+/', '-', mb_strtolower($rawSlug)) : 'brand-' . time();
            if (mb_strlen($name) < 2) { flash('نام برند الزامی است', 'error'); return; }
            $exists = $pdo->prepare('SELECT id FROM brands WHERE slug = ?');
            $exists->execute([$slug]);
            if ($exists->fetch()) { flash('این اسلاگ قبلاً ثبت شده است', 'error'); return; }
            $pdo->prepare('INSERT INTO brands (name, slug, logo) VALUES (?,?,?)')->execute([$name, $slug, $str($_POST['logo'] ?? '', 500)]);
            themeLog($actor, 'افزودن برند', $name);
            flash('برند ثبت شد');
            return;
        }
        case 'shop_create_post': {
            $title = $str($_POST['title'] ?? '', 220);
            $content = (string) ($_POST['content'] ?? '');
            if (mb_strlen($title) < 5 || mb_strlen($content) < 20) { flash('عنوان و متن کافی لازم است', 'error'); return; }
            $slug = trim((string) ($_POST['slug'] ?? ''));
            $slug = $slug !== '' ? $slug : 'post-' . time();
            $exists = $pdo->prepare('SELECT id FROM blog_posts WHERE slug = ?');
            $exists->execute([$slug]);
            if ($exists->fetch()) { $slug = $slug . '-' . base_convert((string) time(), 10, 36); }
            $pdo->prepare('INSERT INTO blog_posts (title, slug, excerpt, content, image, tag, views) VALUES (?,?,?,?,?,?,0)')
                ->execute([$title, $slug, $str($_POST['excerpt'] ?? '', 300), $content, $str($_POST['image'] ?? '', 500) ?: 'https://images.pexels.com/photos/35607631/pexels-photo-35607631.jpeg', $str($_POST['tag'] ?? 'مد و پوشاک', 60)]);
            themeLog($actor, 'انتشار مقاله', $title);
            flash('مقاله منتشر شد');
            return;
        }
        case 'shop_set_role': {
            $userId = $int($_POST['user_id']);
            $role = ($_POST['role'] ?? 'user') === 'admin' ? 'admin' : 'user';
            if ($userId === (int) (currentUser()['id'] ?? 0)) { flash('نقش خودتان قابل تغییر نیست', 'error'); return; }
            $pdo->prepare('UPDATE users SET role = ? WHERE id = ?')->execute([$role, $userId]);
            themeLog($actor, 'تغییر نقش کاربر', "#{$userId} → {$role}");
            flash('نقش کاربر تغییر کرد');
            return;
        }
    }
}

/** خروجی صفحه‌بندی استاندارد */
function shopPagination(string $base, int $page, int $totalPages, array $extra = []): string {
    $q = http_build_query(array_filter(array_merge($extra, ['page' => null]), fn($v) => $v !== null && $v !== ''));
    $suffix = $q ? '&' . $q : '';
    $html = '<nav class="adm-row" style="justify-content:center;margin-top:14px">';
    if ($page > 1) $html .= '<a class="adm-btn adm-btn-ghost adm-btn-sm" href="' . $base . '?tab=' . $base . '&page=' . ($page - 1) . $suffix . '">قبلی</a>';
    for ($i = 1; $i <= $totalPages; $i++) {
        if ($i === $page) $html .= '<span class="adm-btn adm-btn-navy adm-btn-sm">' . faDigits($i) . '</span>';
        else $html .= '<a class="adm-btn adm-btn-ghost adm-btn-sm" href="' . $base . '?tab=' . $base . '&page=' . $i . $suffix . '">' . faDigits($i) . '</a>';
    }
    if ($page < $totalPages) $html .= '<a class="adm-btn adm-btn-ghost adm-btn-sm" href="' . $base . '?tab=' . $base . '&page=' . ($page + 1) . $suffix . '">بعدی</a>';
    return $html . '</nav>';
}
