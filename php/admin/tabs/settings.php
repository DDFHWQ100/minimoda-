<h1 class="adm-h1">تنظیمات عمومی</h1>
<p class="adm-sub">حالت تعمیر و تنظیمات سراسری</p>
<form method="post" class="adm-card" style="max-width:640px">
  <?= csrfField() ?><input type="hidden" name="action" value="save_settings"><input type="hidden" name="switches" value="maintenance.enabled">
  <label class="adm-row" style="justify-content:space-between;border:1px solid #fecdd3;background:#fff1f2;border-radius:12px;padding:12px;margin-bottom:10px"><span style="font-size:11px;font-weight:800;color:#9f1239">حالت تعمیر (Maintenance)<small style="display:block;font-weight:400;color:#be123c">غیرمدیران فقط صفحه «در حال به‌روزرسانی» را می‌بینند؛ مدیران وارد می‌شوند.</small></span><span class="adm-switch"><input type="checkbox" name="s[maintenance.enabled]" value="1" <?= themeBool('maintenance.enabled') ? 'checked' : '' ?>><i></i></span></label>
  <label class="adm-field"><span>پیام حالت تعمیر</span><textarea class="adm-textarea" name="s[maintenance.message]" style="min-height:70px"><?= e(themeGet('maintenance.message')) ?></textarea></label>
  <button class="adm-btn adm-btn-primary" style="width:100%;height:46px">ذخیره</button>
</form>
<div class="adm-card" style="max-width:640px;margin-top:14px">
  <h3 style="margin:0 0 6px;font-size:13px;color:var(--navy)">امنیت و دسترسی</h3>
  <ul class="adm-list" style="font-size:11px">
    <li><span>✅</span><span class="grow"><b>کنترل دسترسی سمت سرور</b><small style="direction:rtl">فقط کاربران با نقش admin به این پنل دسترسی دارند</small></span></li>
    <li><span>✅</span><span class="grow"><b>CSRF روی همه فرم‌ها</b><small style="direction:rtl">توکن نشست برای هر عملیات</small></span></li>
    <li><span>✅</span><span class="grow"><b>Prepared Statements</b><small style="direction:rtl">همه کوئری‌ها پارامتری هستند</small></span></li>
    <li><span>✅</span><span class="grow"><b>Audit Log</b><small style="direction:rtl">همه تغییرات قالب با نام کاربر ثبت می‌شود</small></span></li>
    <li><span>✅</span><span class="grow"><b>نصب قالب ایمن</b><small style="direction:rtl">فقط توکن‌های طراحی پذیرفته می‌شود؛ کد اجرایی وارد نمی‌شود</small></span></li>
    <li><span>ℹ️</span><span class="grow"><b>تأیید دومرحله‌ای (2FA)</b><small style="direction:rtl">نیازمند درگاه پیامکی/OTP — زیرساخت</small></span></li>
  </ul>
</div>
