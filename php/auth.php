<?php
require __DIR__ . '/bootstrap.php';
$pdo = db();
$action = (string)($_GET['action'] ?? 'login');
$next = safeNext($_GET['next'] ?? 'index.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrfCheck();
    $action = (string)($_POST['action'] ?? 'login');
    $next = safeNext($_POST['next'] ?? 'index.php');

    if ($action === 'logout') {
        $_SESSION = [];
        if (ini_get('session.use_cookies')) { $p = session_get_cookie_params(); setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], (bool)$p['secure'], (bool)$p['httponly']); }
        session_destroy();
        redirect('index.php');
    }

    if ($action === 'register') {
        $name = trim((string)($_POST['name'] ?? ''));
        $email = strtolower(trim((string)($_POST['email'] ?? '')));
        $phone = trim((string)($_POST['phone'] ?? ''));
        $password = (string)($_POST['password'] ?? '');
        $errs = [];
        if (mb_strlen($name) < 3) { $errs[] = 'نام باید حداقل ۳ کاراکتر باشد.'; }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { $errs[] = 'ایمیل نامعتبر است.'; }
        if ($phone !== '' && !preg_match('/^09\d{9}$/', $phone)) { $errs[] = 'شماره موبایل نامعتبر است.'; }
        if (mb_strlen($password) < 6) { $errs[] = 'رمز عبور باید حداقل ۶ کاراکتر باشد.'; }
        if (!$errs) {
            $exists = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
            $exists->execute([$email]);
            if ($exists->fetch()) { $errs[] = 'این ایمیل قبلاً ثبت‌نام شده است؛ وارد شوید.'; }
        }
        if (!$errs) {
            $st = $pdo->prepare('INSERT INTO users (name, email, phone, password_hash, role) VALUES (?,?,?,?,?)');
            $st->execute([$name, $email, $phone, password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]), 'user']);
            session_regenerate_id(true);
            $_SESSION['user_id'] = (int)$pdo->lastInsertId();
            flash('خوش آمدید! ثبت‌نام شما انجام شد.');
            redirect($next);
        }
        foreach ($errs as $err) { flash($err, 'error'); }
        redirect('auth.php?action=register&next=' . urlencode($next));
    }

    // ورود
    $email = strtolower(trim((string)($_POST['email'] ?? '')));
    $password = (string)($_POST['password'] ?? '');
    $st = $pdo->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
    $st->execute([$email]);
    $user = $st->fetch();
    if ($user && password_verify($password, $user['password_hash'])) {
        session_regenerate_id(true);
        $_SESSION['user_id'] = (int)$user['id'];
        flash('خوش آمدید، ' . $user['name'] . '!');
        redirect($next);
    }
    flash('ایمیل یا رمز عبور اشتباه است.', 'error');
    redirect('auth.php?action=login&next=' . urlencode($next));
}

if (currentUser()) { // اگر از قبل وارد است، بفرست به حساب
    redirect('account.php');
}

$pageTitle = $action === 'register' ? 'ثبت‌نام | مینی‌مودا' : 'ورود | مینی‌مودا';
$isRegister = $action === 'register';
include __DIR__ . '/partials/header.php';
?>
<div class="wrap" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:0;max-width:1020px;margin-top:18px;border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow)">
  <div style="position:relative;min-height:280px;display:flex;align-items:flex-end;background:#0e1c36">
    <img src="assets/images/hero-royal-junior.jpg" alt="کالکشن سلطنتی" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:65% 15%;opacity:.9">
    <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(14,28,54,.92), transparent 60%)"></div>
    <div style="position:relative;padding:26px;color:#fff">
      <span style="font-size:9px;letter-spacing:.3em;color:var(--gold);font-weight:800">ROYAL JUNIOR</span>
      <h2 style="font-size:24px;line-height:1.6;margin:6px 0">به دنیای خاص<br>مینی‌مودا خوش آمدید</h2>
      <p style="font-size:11px;color:rgba(255,255,255,.75);line-height:2">پیگیری سفارش، لیست علاقه‌مندی و کدهای تخفیف اختصاصی اعضا</p>
    </div>
  </div>

  <div class="panel" style="border:0;border-radius:0">
    <h1 style="font-size:20px;color:var(--navy);margin:0"><?= $isRegister ? 'ساخت حساب کاربری' : 'ورود به حساب کاربری' ?></h1>
    <p class="muted" style="font-size:11px;margin:6px 0 14px"><?php if ($isRegister): ?>حساب بسازید و از تخفیف‌های اعضا بهره‌مند شوید.<?php else: ?>هنوز عضو نیستید؟ <a href="auth.php?action=register&amp;next=<?= e(urlencode($next)) ?>" style="color:var(--pink);font-weight:800">ثبت‌نام کنید</a><?php endif; ?></p>

    <form method="post" action="auth.php" class="form">
      <?= csrfField() ?>
      <input type="hidden" name="action" value="<?= $isRegister ? 'register' : 'login' ?>">
      <input type="hidden" name="next" value="<?= e($next) ?>">

      <?php if ($isRegister): ?>
        <div><label class="label" for="name">نام و نام خانوادگی</label><input class="input" id="name" name="name" required placeholder="مثلاً سارا محمدی"></div>
      <?php endif; ?>
      <div><label class="label" for="email">ایمیل</label><input class="input" id="email" name="email" type="email" dir="ltr" required placeholder="you@example.com"></div>
      <?php if ($isRegister): ?>
        <div><label class="label" for="phone">شماره موبایل</label><input class="input" id="phone" name="phone" dir="ltr" placeholder="09121234567"></div>
      <?php endif; ?>
      <div><label class="label" for="password">رمز عبور<?= $isRegister ? ' (حداقل ۶ کاراکتر)' : '' ?></label><input class="input" id="password" name="password" type="password" dir="ltr" required placeholder="••••••••"></div>

      <button class="btn btn-primary btn-block" type="submit" style="height:52px;font-size:14px"><?= $isRegister ? 'ثبت‌نام و ورود' : 'ورود به حساب' ?></button>
    </form>

    <div style="margin-top:14px;border:1px dashed #d6d9e2;border-radius:14px;padding:10px;background:#fafbfe">
      <p class="muted" style="font-size:9px;font-weight:800;margin:0 0 6px">ورود سریع با حساب‌های آزمایشی:</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
        <button class="btn btn-outline" style="height:44px;font-size:9px;flex-direction:column;gap:0" onclick="document.getElementById('email').value='admin@minimoda.ir';document.getElementById('password').value='admin123'"><b style="font-size:10px">مدیر فروشگاه</b><span dir="ltr" style="font-weight:400">admin@minimoda.ir / admin123</span></button>
        <button class="btn btn-outline" style="height:44px;font-size:9px;flex-direction:column;gap:0" onclick="document.getElementById('email').value='sara@example.com';document.getElementById('password').value='user123'"><b style="font-size:10px">سارا (مشتری)</b><span dir="ltr" style="font-weight:400">sara@example.com / user123</span></button>
      </div>
    </div>
  </div>
</div>
<?php include __DIR__ . '/partials/footer.php'; ?>
