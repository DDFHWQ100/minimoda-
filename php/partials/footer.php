<?php // partials/footer.php — فوتر سرمه‌ای قالب مرجع + Toastهای فلش ?>
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div class="f-col">
      <a class="f-logo" href="index.php" style="display:flex;align-items:center;gap:10px">
        <span style="width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,#fcd34d,#f59e0b);display:grid;place-items:center;flex-shrink:0"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#1b3a6b" stroke-width="2.2" stroke-linejoin="round"><path d="M3 8l4.5 4L12 4l4.5 8L21 8l-1.8 11H4.8L3 8z"/></svg></span>
        <span><span style="display:block">Mini<em>Moda</em></span><span style="display:block;font-size:9px;font-weight:400;color:rgba(255,255,255,.6);direction:ltr;text-align:right">Kids &amp; Teens Fashion</span></span>
      </a>
      <h4 style="margin-top:10px">درباره مینی‌مودا</h4>
      <p><?= e(themeGet('footer.about', 'فروشگاه اینترنتی پوشاک کودک و نوجوان — کیفیت و جدیدترین مدل‌ها با ضمانت اصالت کالا و ارسال سریع به سراسر ایران.')) ?></p>
    </div>
    <div class="f-col">
      <h4>دسترسی سریع</h4>
      <?php $fq = themeMenu('footer_quick'); if (!$fq) $fq = [['label'=>'محصولات پرفروش','href'=>'products.php?sort=sales'],['label'=>'تخفیف‌های ویژه','href'=>'products.php?offer=1'],['label'=>'مجله مد','href'=>'blog.php'],['label'=>'کفش و کتانی','href'=>'products.php?cat=shoes']]; foreach ($fq as $l): ?><a href="<?= e($l['href']) ?>"><?= e($l['label']) ?></a><?php endforeach; ?>
    </div>
    <div class="f-col">
      <h4>خدمات مشتریان</h4>
      <?php $fs = themeMenu('footer_service'); if (!$fs) $fs = [['label'=>'راهنمای خرید','href'=>'help.php#delivery'],['label'=>'پیگیری سفارش','href'=>'account.php'],['label'=>'سوالات متداول','href'=>'help.php#faq'],['label'=>'ضمانت بازگشت کالا','href'=>'help.php#return']]; foreach ($fs as $l): ?><a href="<?= e($l['href']) ?>"><?= e($l['label']) ?></a><?php endforeach; ?>
    </div>
    <div class="f-col">
      <h4>عضویت در خبرنامه</h4>
      <p>جدیدترین اخبار و تخفیف‌ها را دریافت کنید</p>
      <?php if (!empty($_GET['subscribed'])): ?>
        <p class="newsletter-done">عضویت شما در خبرنامه ثبت شد ✓</p>
      <?php else: ?>
      <form class="newsletter-form" action="newsletter.php" method="post" style="margin-top:6px">
        <?= csrfField() ?>
        <input type="email" name="email" required placeholder="آدرس ایمیل خود را وارد کنید" dir="ltr" aria-label="ایمیل خبرنامه">
        <button type="submit">عضویت</button>
      </form>
      <?php endif; ?>
      <div style="display:flex;gap:8px;margin-top:12px">
        <a href="<?= e(themeGet('footer.instagram', 'https://www.instagram.com/minimoda.ir')) ?>" target="_blank" rel="noreferrer" aria-label="اینستاگرام" style="width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.12);display:grid;place-items:center;color:#fff;text-decoration:none"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M16 8h.01"/><rect x="3" y="3" width="18" height="18" rx="5"/></svg></a>
        <a href="<?= e(themeGet('footer.telegram', 'https://t.me/minimoda_ir')) ?>" target="_blank" rel="noreferrer" aria-label="تلگرام" style="width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.12);display:grid;place-items:center;color:#fff;text-decoration:none"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg></a>
        <a href="tel:02188766554" aria-label="تلفن" style="width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.12);display:grid;place-items:center;color:#fff;text-decoration:none"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></a>
      </div>
    </div>
  </div>

  <div class="wrap footer-bottom">
    <p><a href="help.php#faq" style="color:inherit;text-decoration:none">قوانین و مقررات</a> &nbsp;|&nbsp; <a href="help.php" style="color:inherit;text-decoration:none">حریم خصوصی</a></p>
    <p><?= e(themeGet('footer.copyright', '© ۱۴۰۴ — کلیه حقوق محفوظ است — فروشگاه مینی‌مودا')) ?></p>
  </div>
</footer>

<!-- Toastها -->
<div class="toasts" id="toasts">
  <?php foreach (getFlashes() as $flash): ?>
    <div class="toast <?= $flash['type'] === 'error' ? 'toast-error' : '' ?>"><?= e($flash['msg']) ?></div>
  <?php endforeach; ?>
</div>

<script src="assets/app.js" defer></script>
<?php if (($cj = themeGet('custom.js')) !== ''): ?><script id="custom-js"><?= $cj ?></script><?php endif; ?>
</body>
</html>
