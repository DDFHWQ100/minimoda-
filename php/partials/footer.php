<?php // partials/footer.php — فوتر قالب مرجع (سرمه‌ای + خبرنامه کپسولی) ?>
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div class="f-col">
      <a class="f-logo" href="index.php"><span class="f-logo-mark"><svg viewBox="0 0 24 24" fill="none" stroke="#1b3a6b" stroke-width="2" stroke-linejoin="round"><path d="M3 10.5L12 4l9 6.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5z"/><path d="M9 21v-6h6v6"/></svg></span><span><b>Mini<em>Moda</em></b><small>Kids &amp; Teens Fashion</small></span></a>
      <p>MiniModa، فروشگاه اینترنتی مد و پوشاک کودک و نوجوان — کیفیت و جدیدترین مدل‌ها با ضمانت اصالت کالا و ارسال سریع به سراسر ایران.</p>
    </div>
    <div class="f-col">
      <h4>دسترسی سریع</h4>
      <a href="products.php?sort=sales">محصولات پرفروش</a><a href="products.php?offer=1">تخفیف‌های ویژه</a><a href="blog.php">مجله مد</a><a href="products.php?cat=formal">لباس مجلسی</a><a href="products.php?cat=shoes">کفش و کتانی</a><a href="products.php?cat=baby">نوزاد</a>
    </div>
    <div class="f-col">
      <h4>خدمات مشتریان</h4>
      <a href="help.php#delivery">راهنمای خرید</a><a href="help.php#delivery">شیوه‌های ارسال</a><a href="account.php?tab=orders">پیگیری سفارش</a><a href="help.php#faq">سوالات متداول</a><a href="help.php#return">ضمانت بازگشت کالا</a><a href="help.php#contact">تماس با ما</a>
    </div>
    <div class="f-col">
      <h4>عضویت در خبرنامه</h4>
      <p>جدیدترین اخبار و تخفیف‌ها را دریافت کنید.</p>
      <?php if (!empty($_GET['subscribed'])): ?>
        <p class="newsletter-done">عضویت شما در خبرنامه ثبت شد ✓</p>
      <?php else: ?>
      <form class="newsletter-form" action="newsletter.php" method="post">
        <?= csrfField() ?>
        <input type="email" name="email" required placeholder="آدرس ایمیل خود را وارد کنید" dir="ltr" aria-label="ایمیل خبرنامه">
        <button type="submit">عضویت</button>
      </form>
      <?php endif; ?>
      <div class="f-badges"><span>نماد اعتماد الکترونیکی</span><span>ساماندهی رسانه</span></div>
    </div>
  </div>

  <div class="wrap footer-bottom">
    <p><a href="pages/terms">قوانین و مقررات</a><span class="sep">|</span><a href="pages/privacy">حریم خصوصی</a></p>
    <p>© ۱۴۰۴ مینی‌مودا — کلیه حقوق محفوظ است</p>
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
