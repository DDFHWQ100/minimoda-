<?php
// ══════════════════════════════════════════════════════════════
//  MiniModa — موتور قالب (Theme Engine) نسخه PHP
//  خواندن تنظیمات/منو/بنر/اجزا از MySQL + تزریق CSS variables
// ══════════════════════════════════════════════════════════════
declare(strict_types=1);

/** همه تنظیمات قالب به‌صورت key => value (کش شده در طول درخواست) */
function themeSettings(): array {
    static $cache = null;
    if ($cache !== null) { return $cache; }
    $cache = [];
    try {
        foreach (db()->query('SELECT `key`, `value` FROM theme_settings') as $row) {
            $cache[$row['key']] = $row['value'];
        }
    } catch (Throwable $ex) {
        // جداول قالب هنوز ایمپورت نشده — پیش‌فرض‌ها استفاده می‌شوند
    }
    return $cache;
}

function themeGet(string $key, string $default = ''): string {
    $s = themeSettings();
    return array_key_exists($key, $s) ? (string) $s[$key] : $default;
}

function themeBool(string $key, bool $default = false): bool {
    $v = themeGet($key, $default ? '1' : '0');
    return in_array(strtolower($v), ['1', 'true', 'yes', 'on'], true);
}

/** ذخیره چند تنظیم + ثبت لاگ (فقط از پنل مدیریت) */
function themeSet(array $entries, string $actor = 'admin'): void {
    $pdo = db();
    $st = $pdo->prepare('INSERT INTO theme_settings (`key`, `value`, label, `group`, updated_by) VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), updated_by = VALUES(updated_by)');
    foreach ($entries as $key => $value) {
        $st->execute([(string) $key, (string) $value, (string) $key, 'custom', $actor]);
    }
}

function themeLog(string $actor, string $action, string $detail = ''): void {
    try {
        db()->prepare('INSERT INTO theme_activity (actor, action, detail) VALUES (?, ?, ?)')->execute([$actor, $action, mb_substr($detail, 0, 400)]);
    } catch (Throwable $ex) { /* لاگ هرگز نباید سایت را بیندازد */ }
}

/** بخش‌های صفحه اصلی: id => enabled (مرتب‌شده بر اساس sort) */
function themeSections(): array {
    static $cache = null;
    if ($cache !== null) { return $cache; }
    $cache = [];
    try {
        foreach (db()->query('SELECT id, enabled, sort FROM theme_sections ORDER BY sort ASC') as $r) {
            $cache[$r['id']] = (bool) $r['enabled'];
        }
    } catch (Throwable $ex) {}
    return $cache;
}

function themeSectionOn(string $id): bool {
    $s = themeSections();
    return array_key_exists($id, $s) ? $s[$id] : true; // اگر جدول نبود، همه نمایش داده شوند
}

/** بنرهای فعال */
function themeBanners(): array {
    try { return db()->query('SELECT * FROM theme_banners WHERE active = 1 ORDER BY sort ASC, id ASC')->fetchAll(); }
    catch (Throwable $ex) { return []; }
}

/** منوی درختی برای یک مکان */
function themeMenu(string $location): array {
    try {
        $rows = db()->prepare('SELECT * FROM theme_menu_items WHERE location = ? AND enabled = 1 ORDER BY sort ASC, id ASC');
        $rows->execute([$location]);
        $all = $rows->fetchAll();
    } catch (Throwable $ex) { return []; }
    $roots = array_values(array_filter($all, fn($m) => empty($m['parent_id'])));
    foreach ($roots as &$r) {
        $r['sub'] = array_values(array_filter($all, fn($m) => (int) ($m['parent_id'] ?? 0) === (int) $r['id']));
    }
    return $roots;
}

/** CSS variables قالب فعال — در <head> تزریق می‌شود */
function themeCssVars(): string {
    $primary = themeGet('theme.primary', '#1b3a6b');
    $accent  = themeGet('theme.accent', '#e91e63');
    $gold    = themeGet('theme.gold', '#ffc107');
    $radius  = (int) themeGet('theme.radius', '20');
    $font    = themeGet('theme.font', 'Vazirmatn');
    $width   = (int) themeGet('design.content_width', '1280');
    $bg      = themeGet('design.bg_color', '#f3f4f8');
    $anim    = themeBool('design.animations', true);
    $css = ":root{--navy:{$primary};--navy-deep:{$primary};--navy-soft:{$primary};--pink:{$accent};--pink-dark:{$accent};--gold:{$gold};--radius:{$radius}px;--bg:{$bg}}";
    $css .= "body{font-family:'{$font}',Tahoma,sans-serif;background:{$bg}}.wrap{max-width:{$width}px}";
    if (!$anim) { $css .= "*,*::before,*::after{animation:none!important;transition:none!important}"; }
    return $css;
}

/** اعتبارسنجی ساده CSS سفارشی */
function themeValidateCss(string $css): ?string {
    $c = substr_count($css, '{') - substr_count($css, '}');
    if ($c !== 0) { return 'تعداد آکولادها متعادل نیست'; }
    return null;
}

/** پشتیبان لحظه‌ای کل قالب */
function themeSnapshot(string $label, string $actor): int {
    $pdo = db();
    $snap = [
        'settings' => $pdo->query('SELECT `key`, `value` FROM theme_settings')->fetchAll(),
        'sections' => $pdo->query('SELECT id, enabled, sort FROM theme_sections')->fetchAll(),
        'banners'  => $pdo->query('SELECT title, subtitle, href, image, tone, sort, active FROM theme_banners')->fetchAll(),
        'menus'    => $pdo->query('SELECT location, label, href, parent_id, sort, enabled, highlight FROM theme_menu_items')->fetchAll(),
        'themes'   => $pdo->query('SELECT slug, is_active, tokens, version FROM theme_themes')->fetchAll(),
    ];
    $pdo->prepare('INSERT INTO theme_revisions (label, snapshot, created_by) VALUES (?, ?, ?)')
        ->execute([$label, json_encode($snap, JSON_UNESCAPED_UNICODE), $actor]);
    return (int) $pdo->lastInsertId();
}

function themeRestore(int $id, string $actor): bool {
    $pdo = db();
    $st = $pdo->prepare('SELECT * FROM theme_revisions WHERE id = ?'); $st->execute([$id]);
    $rev = $st->fetch();
    if (!$rev) { return false; }
    $d = json_decode($rev['snapshot'], true);
    if (!is_array($d)) { return false; }
    $pdo->beginTransaction();
    try {
        $up = $pdo->prepare('INSERT INTO theme_settings (`key`,`value`,label,`group`,updated_by) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE `value`=VALUES(`value`), updated_by=VALUES(updated_by)');
        foreach ($d['settings'] ?? [] as $s) { $up->execute([$s['key'], $s['value'], $s['key'], 'restored', $actor]); }
        $us = $pdo->prepare('UPDATE theme_sections SET enabled=?, sort=? WHERE id=?');
        foreach ($d['sections'] ?? [] as $s) { $us->execute([(int)$s['enabled'], (int)$s['sort'], $s['id']]); }
        if (!empty($d['banners'])) {
            $pdo->exec('DELETE FROM theme_banners');
            $ib = $pdo->prepare('INSERT INTO theme_banners (title, subtitle, href, image, tone, sort, active) VALUES (?,?,?,?,?,?,?)');
            foreach ($d['banners'] as $b) { $ib->execute([$b['title'],$b['subtitle'],$b['href'],$b['image'],$b['tone'],(int)$b['sort'],(int)$b['active']]); }
        }
        $ut = $pdo->prepare('UPDATE theme_themes SET is_active=?, tokens=?, version=? WHERE slug=?');
        foreach ($d['themes'] ?? [] as $t) { $ut->execute([(int)$t['is_active'], $t['tokens'], $t['version'], $t['slug']]); }
        $pdo->commit();
    } catch (Throwable $ex) { $pdo->rollBack(); return false; }
    themeLog($actor, 'بازیابی نسخه', 'بازگشت به پشتیبان «' . $rev['label'] . '»');
    return true;
}
