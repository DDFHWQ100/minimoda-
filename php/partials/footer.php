<?php // partials/footer.php — فوتر مشترک + خبرنامه + Toastهای فلش ?>
<footer class="site-footer">
  <div class="wrap newsletter">
    <div class="newsletter-text">
      <strong><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg> عضویت در خبرنامه مینی‌مودا</strong>
      <span>جدیدترین کالکشن‌ها و کدهای تخفیف را اول از همه بگیرید.</span>
    </div>
    <?php if (!empty($_GET['subscribed'])): ?>
      <p class="newsletter-done">عضویت شما در خبرنامه ثبت شد ✓</p>
    <?php else: ?>
    <form class="newsletter-form" action="newsletter.php" method="post">
      <?= csrfField() ?>
      <input type="email" name="email" required placeholder="ایمیل شما..." dir="ltr" aria-label="ایمیل خبرنامه">
      <button type="submit">عضویت</button>
    </form>
    <?php endif; ?>
  </div>

  <div class="wrap footer-grid">
    <div class="f-col">
      <a class="f-logo" href="index.php">Mini<em>Moda</em></a>
      <p>مینی‌مودا، فروشگاه آنلاین تخصصی مد و پوشاک کودک و نوزاد؛ با ضمانت اصالت کالا، بهترین قیمت و سریع‌ترین ارسال به سراسر ایران.</p>
      <div class="f-badges"><span>نماد اعتماد الکترونیکی</span><span>ساماندهی رسانه</span></div>
    </div>
    <div class="f-col">
      <h4>دسترسی سریع</h4>
      <a href="index.php">خانه</a><a href="products.php">همه محصولات</a><a href="products.php?offer=1">حراج و تخفیف‌ها</a><a href="blog.php">وبلاگ مد کودک</a><a href="cart.php">سبد خرید</a><a href="account.php">حساب کاربری</a>
    </div>
    <div class="f-col">
      <h4>راهنمای خرید</h4>
      <a href="help.php#delivery">نحوه ثبت سفارش و ارسال</a><a href="help.php#payment">پرداخت و روش‌ها</a><a href="help.php#return">ضمانت بازگشت ۷ روزه</a><a href="help.php#size">راهنمای انتخاب سایز</a><a href="help.php#faq">سوالات متداول</a><a href="help.php#contact">تماس با پشتیبانی</a>
    </div>
    <div class="f-col">
      <h4>با ما در تماس باشید</h4>
      <p>تهران، خیابان ولیعصر، بالاتر از پارک ملت، مجتمع نیایش، طبقه ۲</p>
      <a href="tel:02188766554" dir="ltr">۰۲۱-۸۸۷۶۶۵۵۴</a>
      <a href="mailto:support@minimoda.ir" dir="ltr">support@minimoda.ir</a>
      <p class="f-note">پشتیبانی: شنبه تا پنجشنبه ۹ تا ۲۱</p>
    </div>
  </div>

  <div class="wrap footer-bottom">
    <p>© ۲۰۲۶ مینی‌مودا؛ تمامی حقوق محفوظ است.</p>
    <p class="f-pay">درگاه‌های پرداخت: <span>زرین‌پال</span><span>زرین‌کارت</span><span>آسان‌پرداخت</span><span>به‌پرداخت ملت</span></p>
  </div>
</footer>

<!-- Toastها -->
<div class="toasts" id="toasts">
  <?php foreach (getFlashes() as $flash): ?>
    <div class="toast <?= $flash['type'] === 'error' ? 'toast-error' : '' ?>"><?= e($flash['msg']) ?></div>
  <?php endforeach; ?>
</div>

<script src="assets/app.js" defer></script>
</body>
</html>
