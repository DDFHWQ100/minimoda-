<?php
// ══════════════════════════════════════════════════════════════
//  MiniModa — پنل مدیریت قالب و پوسته (نسخه PHP)
//  مسیر: /admin/  (مثلاً http://localhost/minimoda/admin/)
// ══════════════════════════════════════════════════════════════
require dirname(__DIR__) . '/bootstrap.php';
$pdo = db();

// ── گارد مدیر ────────────────────────────────────────────────
if (!currentUser()) { redirect('../auth.php?action=login&next=' . urlencode('admin/index.php')); }
if (!isAdmin()) { http_response_code(403); die('<div dir="rtl" style="font-family:Tahoma;text-align:center;margin:80px auto"><h2>دسترسی غیرمجاز</h2><a href="../index.php">بازگشت</a></div>'); }
$me = currentUser();
$actor = $me['name'];

// ── بررسی وجود جداول قالب ─────────────────────────────────────
try { $pdo->query('SELECT 1 FROM theme_settings LIMIT 1'); }
catch (Throwable $ex) {
    http_response_code(500);
    die('<div dir="rtl" style="font-family:Tahoma;max-width:560px;margin:80px auto;padding:24px;border:1px solid #fde68a;background:#fffbeb;border-radius:16px;color:#92400e"><h2>جداول قالب نصب نشده‌اند</h2><p>فایل <b>database.sql</b> جدید را در phpMyAdmin دوباره Import کنید (نسخه جدید شامل جداول theme_* است).</p><a href="../index.php">بازگشت به سایت</a></div>');
}

$tab = preg_replace('/[^a-z_]/', '', (string) ($_GET['tab'] ?? 'overview')) ?: 'overview';
$tabs = [
    'overview'  => ['نمای کلی', '▦'],
    'themes'    => ['مدیریت قالب‌ها', '◫'],
    'design'    => ['رنگ‌ها و ظاهر', '◐'],
    'hero'      => ['هیرو و هدر', '▭'],
    'sections'  => ['اجزای صفحه اصلی', '☰'],
    'banners'   => ['بنرها', '▣'],
    'menus'     => ['منوها', '≡'],
    'code'      => ['کدهای سفارشی', '</>'],
    'seo'       => ['سئو و فوتر', '◎'],
    'backup'    => ['پشتیبان و نسخه‌ها', '⟲'],
    'activity'  => ['گزارش فعالیت‌ها', '≣'],
    'settings'  => ['تنظیمات عمومی', '⚙'],
];
if (!isset($tabs[$tab])) { $tab = 'overview'; }

// ── اکشن‌ها (POST) ────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrfCheck();
    $action = (string) ($_POST['action'] ?? '');
    $back = 'index.php?tab=' . ($tab);

    try {
        switch ($action) {
            case 'save_settings': {
                $entries = $_POST['s'] ?? [];
                if (!is_array($entries)) { $entries = []; }
                $clean = [];
                foreach ($entries as $k => $v) {
                    $k = preg_replace('/[^a-z0-9_.]/', '', (string) $k);
                    if ($k === '') continue;
                    $v = (string) $v;
                    if ($k === 'custom.css' && ($err = themeValidateCss($v)) !== null) { flash('CSS نامعتبر: ' . $err, 'error'); redirect($back); }
                    if (in_array($k, ['custom.css', 'custom.js', 'custom.head'], true)) {
                        $prev = themeGet($k);
                        if ($prev !== $v) { $pdo->prepare('INSERT INTO theme_code_history (`key`, content, created_by) VALUES (?,?,?)')->execute([$k, $prev, $actor]); }
                    }
                    $clean[$k] = $v;
                }
                // سوییچ‌ها: اگر در فرم نبودند، خاموش
                foreach (explode(',', (string) ($_POST['switches'] ?? '')) as $sw) {
                    $sw = trim($sw); if ($sw !== '' && !isset($clean[$sw])) { $clean[$sw] = '0'; }
                }
                themeSet($clean, $actor);
                themeLog($actor, 'ویرایش تنظیمات', count($clean) . ' تنظیم در بخش «' . $tabs[$tab][0] . '»');
                flash('تنظیمات ذخیره و روی سایت اعمال شد');
                break;
            }
            case 'activate_theme': {
                $slug = (string) ($_POST['slug'] ?? '');
                $st = $pdo->prepare('SELECT * FROM theme_themes WHERE slug = ?'); $st->execute([$slug]); $t = $st->fetch();
                if (!$t) { flash('قالب یافت نشد', 'error'); break; }
                $pdo->exec('UPDATE theme_themes SET is_active = 0');
                $pdo->prepare('UPDATE theme_themes SET is_active = 1 WHERE slug = ?')->execute([$slug]);
                $tok = json_decode($t['tokens'], true) ?: [];
                $map = ['primary' => 'theme.primary', 'accent' => 'theme.accent', 'gold' => 'theme.gold', 'font' => 'theme.font', 'radius' => 'theme.radius'];
                $entries = [];
                foreach ($map as $from => $to) { if (!empty($tok[$from])) $entries[$to] = (string) $tok[$from]; }
                themeSet($entries, $actor);
                themeLog($actor, 'فعال‌سازی قالب', '«' . $t['name'] . '» v' . $t['version']);
                flash('قالب «' . $t['name'] . '» فعال شد');
                break;
            }
            case 'duplicate_theme': {
                $slug = (string) ($_POST['slug'] ?? '');
                $st = $pdo->prepare('SELECT * FROM theme_themes WHERE slug = ?'); $st->execute([$slug]); $t = $st->fetch();
                if (!$t) break;
                $name = trim((string) ($_POST['name'] ?? '')) ?: $t['name'] . ' (رونوشت)';
                $pdo->prepare('INSERT INTO theme_themes (name, slug, description, author, version, preview, is_active, tokens) VALUES (?,?,?,?,?,?,0,?)')
                    ->execute([$name, $slug . '-copy-' . base_convert((string) time(), 10, 36), $t['description'], $actor, $t['version'], $t['preview'], $t['tokens']]);
                themeLog($actor, 'تکثیر قالب', $name);
                flash('رونوشت قالب ساخته شد');
                break;
            }
            case 'delete_theme': {
                $slug = (string) ($_POST['slug'] ?? '');
                $st = $pdo->prepare('SELECT * FROM theme_themes WHERE slug = ?'); $st->execute([$slug]); $t = $st->fetch();
                if (!$t) break;
                if ($t['is_active']) { flash('قالب فعال را نمی‌توان حذف کرد', 'error'); break; }
                $pdo->prepare('DELETE FROM theme_themes WHERE slug = ?')->execute([$slug]);
                themeLog($actor, 'حذف قالب', $t['name']);
                flash('قالب حذف شد');
                break;
            }
            case 'install_theme': {
                // نصب از theme.json (فقط توکن‌های طراحی)
                $json = '';
                if (!empty($_FILES['theme_file']['tmp_name'])) { $json = (string) file_get_contents($_FILES['theme_file']['tmp_name']); }
                else { $json = (string) ($_POST['theme_json'] ?? ''); }
                $m = json_decode($json, true);
                if (!is_array($m) || empty($m['name'])) { flash('فایل قالب نامعتبر است (theme.json با فیلد name لازم است)', 'error'); break; }
                $tok = (array) ($m['tokens'] ?? []);
                foreach (['primary', 'accent', 'gold'] as $c) { if (!empty($tok[$c]) && !preg_match('/^#[0-9a-fA-F]{6}$/', (string) $tok[$c])) { flash("رنگ {$c} نامعتبر است", 'error'); redirect($back); } }
                $tokens = json_encode(['primary' => $tok['primary'] ?? '#1b3a6b', 'accent' => $tok['accent'] ?? '#e91e63', 'gold' => $tok['gold'] ?? '#ffc107', 'font' => mb_substr((string) ($tok['font'] ?? 'Vazirmatn'), 0, 40), 'radius' => (string) ((int) ($tok['radius'] ?? 20))], JSON_UNESCAPED_UNICODE);
                $slug = preg_replace('/[^a-z0-9-]+/', '-', strtolower((string) ($m['slug'] ?? $m['name']))) . '-' . base_convert((string) time(), 10, 36);
                $pdo->prepare('INSERT INTO theme_themes (name, slug, description, author, version, preview, is_active, tokens) VALUES (?,?,?,?,?,?,0,?)')
                    ->execute([mb_substr((string) $m['name'], 0, 120), $slug, mb_substr((string) ($m['description'] ?? ''), 0, 400), mb_substr((string) ($m['author'] ?? 'ناشناس'), 0, 80), mb_substr((string) ($m['version'] ?? '1.0.0'), 0, 20), strpos((string) ($m['preview'] ?? ''), 'http') === 0 ? (string) $m['preview'] : '', $tokens]);
                themeLog($actor, 'نصب قالب از فایل', (string) $m['name']);
                flash('قالب «' . $m['name'] . '» نصب شد و آماده فعال‌سازی است');
                break;
            }
            case 'save_sections': {
                $enabled = $_POST['enabled'] ?? [];
                $order = $_POST['order'] ?? [];
                $all = $pdo->query('SELECT id FROM theme_sections')->fetchAll(PDO::FETCH_COLUMN);
                $up = $pdo->prepare('UPDATE theme_sections SET enabled = ?, sort = ? WHERE id = ?');
                $pos = 1;
                foreach ((array) $order as $id) { if (in_array($id, $all, true)) { $up->execute([isset($enabled[$id]) ? 1 : 0, $pos++, $id]); } }
                themeLog($actor, 'ویرایش اجزای صفحه اصلی', 'ترتیب و وضعیت نمایش به‌روز شد');
                flash('اجزای صفحه اصلی ذخیره شد');
                break;
            }
            case 'save_banner': {
                $id = (int) ($_POST['id'] ?? 0);
                $title = trim((string) ($_POST['title'] ?? '')); $image = trim((string) ($_POST['image'] ?? ''));
                if (mb_strlen($title) < 2 || !preg_match('#^(https?://|assets/)#', $image)) { flash('عنوان و آدرس تصویر معتبر لازم است', 'error'); break; }
                $vals = [$title, trim((string) ($_POST['subtitle'] ?? '')), trim((string) ($_POST['href'] ?? 'products.php')) ?: 'products.php', $image, trim((string) ($_POST['tone'] ?? 'rgba(15,23,42,.8)'))];
                if ($id > 0) { $pdo->prepare('UPDATE theme_banners SET title=?, subtitle=?, href=?, image=?, tone=? WHERE id=?')->execute([...$vals, $id]); }
                else { $max = (int) $pdo->query('SELECT COALESCE(MAX(sort),0) FROM theme_banners')->fetchColumn(); $pdo->prepare('INSERT INTO theme_banners (title, subtitle, href, image, tone, sort, active) VALUES (?,?,?,?,?,?,1)')->execute([...$vals, $max + 1]); }
                themeLog($actor, $id ? 'ویرایش بنر' : 'افزودن بنر', $title);
                flash('بنر ذخیره شد');
                break;
            }
            case 'toggle_banner': $pdo->prepare('UPDATE theme_banners SET active = 1 - active WHERE id = ?')->execute([(int) $_POST['id']]); break;
            case 'delete_banner': $pdo->prepare('DELETE FROM theme_banners WHERE id = ?')->execute([(int) $_POST['id']]); themeLog($actor, 'حذف بنر', '#' . (int) $_POST['id']); flash('بنر حذف شد'); break;
            case 'move_banner': {
                $id = (int) $_POST['id']; $dir = $_POST['dir'] === 'up' ? -1 : 1;
                $rows = $pdo->query('SELECT id, sort FROM theme_banners ORDER BY sort ASC, id ASC')->fetchAll();
                foreach ($rows as $i => $r) if ((int) $r['id'] === $id && isset($rows[$i + $dir])) { $o = $rows[$i + $dir];
                    $pdo->prepare('UPDATE theme_banners SET sort=? WHERE id=?')->execute([$o['sort'], $id]);
                    $pdo->prepare('UPDATE theme_banners SET sort=? WHERE id=?')->execute([$r['sort'], $o['id']]); }
                break;
            }
            case 'save_menu': {
                $id = (int) ($_POST['id'] ?? 0);
                $label = trim((string) ($_POST['label'] ?? '')); $href = trim((string) ($_POST['href'] ?? 'index.php')) ?: 'index.php';
                $loc = in_array($_POST['location'] ?? '', ['main', 'footer_quick', 'footer_service'], true) ? $_POST['location'] : 'main';
                $parent = (int) ($_POST['parent_id'] ?? 0) ?: null; $hl = isset($_POST['highlight']) ? 1 : 0;
                if ($label === '') { flash('عنوان آیتم منو الزامی است', 'error'); break; }
                if ($id > 0) { $pdo->prepare('UPDATE theme_menu_items SET label=?, href=?, location=?, parent_id=?, highlight=? WHERE id=?')->execute([$label, $href, $loc, $parent, $hl, $id]); }
                else { $st = $pdo->prepare('SELECT COALESCE(MAX(sort),0) FROM theme_menu_items WHERE location=?'); $st->execute([$loc]); $max = (int) $st->fetchColumn();
                    $pdo->prepare('INSERT INTO theme_menu_items (location, label, href, parent_id, sort, enabled, highlight) VALUES (?,?,?,?,?,1,?)')->execute([$loc, $label, $href, $parent, $max + 1, $hl]); }
                themeLog($actor, $id ? 'ویرایش آیتم منو' : 'افزودن آیتم منو', $label);
                flash('منو ذخیره شد');
                break;
            }
            case 'toggle_menu': $pdo->prepare('UPDATE theme_menu_items SET enabled = 1 - enabled WHERE id = ?')->execute([(int) $_POST['id']]); break;
            case 'delete_menu': { $id = (int) $_POST['id']; $pdo->prepare('DELETE FROM theme_menu_items WHERE id = ? OR parent_id = ?')->execute([$id, $id]); themeLog($actor, 'حذف آیتم منو', '#' . $id); flash('آیتم منو حذف شد'); break; }
            case 'move_menu': {
                $id = (int) $_POST['id']; $dir = $_POST['dir'] === 'up' ? -1 : 1;
                $cur = $pdo->prepare('SELECT * FROM theme_menu_items WHERE id=?'); $cur->execute([$id]); $c = $cur->fetch(); if (!$c) break;
                $sib = $pdo->prepare('SELECT id, sort FROM theme_menu_items WHERE location=? AND ' . ($c['parent_id'] ? 'parent_id=?' : 'parent_id IS NULL') . ' ORDER BY sort ASC, id ASC');
                $sib->execute($c['parent_id'] ? [$c['location'], $c['parent_id']] : [$c['location']]); $rows = $sib->fetchAll();
                foreach ($rows as $i => $r) if ((int) $r['id'] === $id && isset($rows[$i + $dir])) { $o = $rows[$i + $dir];
                    $pdo->prepare('UPDATE theme_menu_items SET sort=? WHERE id=?')->execute([$o['sort'], $id]);
                    $pdo->prepare('UPDATE theme_menu_items SET sort=? WHERE id=?')->execute([$r['sort'], $o['id']]); }
                break;
            }
            case 'create_backup': { $label = trim((string) ($_POST['label'] ?? '')) ?: 'پشتیبان دستی'; $rid = themeSnapshot($label, $actor); themeLog($actor, 'تهیه پشتیبان', "«{$label}» (#{$rid})"); flash('پشتیبان ساخته شد'); break; }
            case 'restore_backup': { if (themeRestore((int) $_POST['id'], $actor)) flash('قالب به نسخه پشتیبان بازگردانده شد'); else flash('بازیابی ناموفق بود', 'error'); break; }
            case 'delete_backup': $pdo->prepare('DELETE FROM theme_revisions WHERE id=?')->execute([(int) $_POST['id']]); flash('پشتیبان حذف شد'); break;
            case 'restore_code': {
                $st = $pdo->prepare('SELECT * FROM theme_code_history WHERE id=?'); $st->execute([(int) $_POST['id']]); $h = $st->fetch();
                if ($h) { $pdo->prepare('INSERT INTO theme_code_history (`key`, content, created_by) VALUES (?,?,?)')->execute([$h['key'], themeGet($h['key']), $actor]); themeSet([$h['key'] => $h['content']], $actor); themeLog($actor, 'بازگردانی کد', $h['key']); flash('کد بازگردانده شد'); }
                break;
            }
            case 'clear_activity': { $pdo->exec('DELETE FROM theme_activity WHERE created_at < NOW() - INTERVAL 30 DAY'); flash('گزارش‌های قدیمی پاک شد'); break; }
        }
    } catch (Throwable $ex) {
        flash('خطا: ' . $ex->getMessage(), 'error');
    }
    redirect($back);
}

// ── دانلود پشتیبان ────────────────────────────────────────────
if (isset($_GET['download_backup'])) {
    $st = $pdo->prepare('SELECT * FROM theme_revisions WHERE id=?'); $st->execute([(int) $_GET['download_backup']]); $r = $st->fetch();
    if ($r) { header('Content-Type: application/json; charset=utf-8'); header('Content-Disposition: attachment; filename="theme-backup-' . (int) $r['id'] . '.json"'); echo $r['snapshot']; exit; }
}

$S = themeSettings();
$pageTitle = 'پنل مدیریت قالب | ' . $tabs[$tab][0];
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= e($pageTitle) ?></title>
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/style.css">
<link rel="stylesheet" href="admin.css">
</head>
<body class="adm">
<div class="adm-shell">
  <aside class="adm-side">
    <div class="adm-brand"><span class="adm-crown">👑</span><div><b>مدیریت قالب و پوسته</b><small><?= e($actor) ?></small></div></div>
    <nav>
      <?php foreach ($tabs as $k => [$label, $icon]): ?>
        <a href="index.php?tab=<?= $k ?>" class="<?= $tab === $k ? 'is-active' : '' ?>"><span class="adm-ic"><?= $icon ?></span><?= e($label) ?></a>
      <?php endforeach; ?>
      <a href="../admin.php" class="adm-muted">← پنل فروشگاه (محصول/سفارش)</a>
      <a href="../index.php" target="_blank" class="adm-muted">↗ مشاهده سایت</a>
    </nav>
  </aside>

  <main class="adm-main">
    <?php foreach (getFlashes() as $f): ?><div class="adm-flash <?= $f['type'] === 'error' ? 'is-error' : '' ?>"><?= e($f['msg']) ?></div><?php endforeach; ?>
    <?php include __DIR__ . '/tabs/' . $tab . '.php'; ?>
  </main>
</div>
<script src="admin.js" defer></script>
</body>
</html>
