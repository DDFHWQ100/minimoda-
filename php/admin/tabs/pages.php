<h1 class="adm-h1">مدیریت صفحات و الگوها</h1>
<p class="adm-sub">الگوی نمایش هر صفحه + رجیستری همه صفحات سایت</p>
<form method="post" class="adm-grid-2">
  <?= csrfField() ?><input type="hidden" name="action" value="save_settings"><input type="hidden" name="switches" value="layout.hero_compact">
  <div class="adm-card">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">الگوهای قابل تنظیم</h3>
    <label class="adm-field"><span>الگوی کاتالوگ (products.php)</span><select class="adm-select" name="s[layout.products]"><option value="grid" <?= themeGet('layout.products','grid') === 'grid' ? 'selected' : '' ?>>شبکه‌ای (Grid) — ۴ ستونه</option><option value="list" <?= themeGet('layout.products') === 'list' ? 'selected' : '' ?>>لیستی (List) — ردیفی با جزئیات</option></select></label>
    <label class="adm-row" style="justify-content:space-between;border:1px solid #e6e8ee;border-radius:12px;padding:10px;margin-bottom:10px"><span style="font-size:11px;font-weight:700">هیرو فشرده (کوتاه‌تر) در صفحه اصلی</span><span class="adm-switch"><input type="checkbox" name="s[layout.hero_compact]" value="1" <?= themeBool('layout.hero_compact') ? 'checked' : '' ?>><i></i></span></label>
    <button class="adm-btn adm-btn-primary" style="width:100%">ذخیره الگوها</button>
    <p class="adm-note" style="margin-top:8px">ترتیب و نمایش بخش‌های صفحه اصلی در «مدیریت پوسته» و چیدمان‌های آماده در «الگوهای آماده».</p>
  </div>
  <div class="adm-card">
    <h3 style="margin:0 0 8px;font-size:13px;color:var(--navy)">رجیستری صفحات سایت</h3>
    <table class="adm-table"><thead><tr><th>صفحه</th><th>فایل</th><th>وضعیت</th></tr></thead><tbody>
    <?php foreach ([['صفحه اصلی','index.php','از پنل قالب مدیریت می‌شود'],['کاتالوگ محصولات','products.php','Grid/List از همین صفحه'],['صفحه محصول','product.php','ثابت'],['سبد خرید','cart.php','ثابت'],['تسویه حساب','checkout.php','ثابت'],['حساب کاربری','account.php','ثابت'],['ورود / ثبت‌نام','auth.php','ثابت'],['وبلاگ و مقاله','blog.php','ثابت'],['راهنما / تماس / FAQ','help.php','ثابت'],['علاقه‌مندی‌ها','wishlist.php','ثابت'],['صفحه ۴۰۴','product.php / blog.php','حالت خالی داخلی'],['صفحه تعمیر (۵۰۳)','partials/header.php','از «تنظیمات عمومی»'],['پنل فروشگاه','admin.php','ثابت'],['پنل قالب','admin/','همین پنل']] as [$n,$f,$st]): ?>
      <tr><td><b><?= $n ?></b></td><td dir="ltr" style="font-family:monospace;font-size:10px;text-align:right"><?= $f ?></td><td><span style="font-size:9px;font-weight:800;color:#065f46;background:#ecfdf5;border-radius:99px;padding:2px 8px"><?= $st ?></span></td></tr>
    <?php endforeach; ?></tbody></table>
    <p class="adm-note" style="margin-top:8px">ساخت الگوی صفحه کاملاً جدید نیازمند ویرایش فایل PHP است (زیرساخت) — متن‌های صفحات ثابت را به من بگویید تا تغییر دهم.</p>
  </div>
</form>
