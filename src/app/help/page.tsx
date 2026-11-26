"use client";

import { useState } from "react";
import { Truck, CreditCard, RotateCcw, Ruler, MessageCircleQuestion, Phone, ChevronDown, Headphones } from "lucide-react";

const SECTIONS: { id: string; icon: typeof Truck; title: string; items: { q: string; a: string }[] }[] = [
  {
    id: "delivery", icon: Truck, title: "نحوه ثبت سفارش و ارسال",
    items: [
      { q: "چطور سفارش ثبت کنم؟", a: "محصول را انتخاب کنید، سایز و رنگ را مشخص کنید و به سبد خرید اضافه کنید. سپس در صفحه تسویه، اطلاعات گیرنده را وارد و روش پرداخت را انتخاب کنید. سفارش شما بلافاصله در سیستم ثبت می‌شود." },
      { q: "زمان تحویل سفارش چقدر است؟", a: "تهران: ۱ تا ۲ روز کاری با پیک اختصاصی؛ سایر شهرها: ۲ تا ۴ روز کاری با تیپاکس یا پست پیشتاز. سفارش‌های بالای ۲ میلیون تومان شامل ارسال رایگان هستند؛ در غیر این صورت هزینه ۴۵,۰۰۰ تومان محاسبه می‌شود." },
      { q: "آیا امکان تغییر آدرس پس از ثبت وجود دارد؟", a: "بله، تا قبل از خروج سفارش از انبار با شماره ۰۲۱-۸۸۷۶۶۵۵۴ تماس بگیرید تا آدرس را اصلاح کنیم." },
    ],
  },
  {
    id: "payment", icon: CreditCard, title: "پرداخت و روش‌های پرداخت",
    items: [
      { q: "چه روش‌های پرداختی دارید؟", a: "پرداخت آنلاین از طریق درگاه زرین‌پال (همه کارت‌های عضو شتاب)، پرداخت درب منزل در تهران و کرج (نقد یا کارت) و کارت به کارت. سفارش‌های درب منزل قبل از ارسال تلفنی هماهنگ می‌شوند." },
      { q: "پرداخت آنلاین امن است؟", a: "بله؛ تمام تراکنش‌ها از طریق درگاه رسمی شاپرک با رمز دوم و CVV2 انجام می‌شود و مینی‌مودا هیچ‌گاه اطلاعات کارت شما را ذخیره نمی‌کند." },
      { q: "فاکتور خرید چطور ارسال می‌شود؟", a: "فاکتور رسمی به همراه بسته ارسال می‌شود و نسخه PDF آن نیز به ایمیل حساب کاربری‌تان ارسال خواهد شد." },
    ],
  },
  {
    id: "return", icon: RotateCcw, title: "ضمانت بازگشت ۷ روزه کالا",
    items: [
      { q: "شرایط بازگشت کالا چیست؟", a: "تا ۷ روز پس از تحویل، با ارائه فاکتور و برچسب سلامت، کالا را بدون قید و شرط مرجوع کنید. وجه شما حداکثر ۷۲ ساعت پس از بررسی انبار به همان کارت بازگردانده می‌شود." },
      { q: "هزینه ارسال برگشت با کیست؟", a: "اگر کالا مغایرت یا ایراد داشته باشد، هزینه برگشت با مینی‌مودا است؛ در غیر این صورت هزینه پیک با مشتری است." },
    ],
  },
  {
    id: "size", icon: Ruler, title: "راهنمای انتخاب سایز",
    items: [
      { q: "سایزها بر چه اساسی هستند؟", a: "سایزهای مینی‌مودا بر اساس سن و قد کودک است: ۲-۳ (قد ۹۲–۹۸)، ۴-۵ (۱۰۴–۱۱۰)، ۶-۷ (۱۱۶–۱۲۲)، ۸-۹ (۱۲۸–۱۳۴)، ۱۰-۱۱ (۱۴۰–۱۴۶) سانتی‌متر. برای نوزاد: 0-6m، 6-12m و 12-24m." },
      { q: "بین دو سایز مانده‌ام؛ کدام را بخرم؟", a: "برای کاپشن و کت همیشه سایز بزرگ‌تر بگیرید (کودک رشد می‌کند)؛ برای لباس‌های رسمی و کش، سایز دقیق مناسب‌تر است. جدول سایز هر محصول در صفحه همان محصول درج شده است." },
    ],
  },
  {
    id: "faq", icon: MessageCircleQuestion, title: "سوالات متداول",
    items: [
      { q: "آیا لباس‌ها اصل و اورجینال هستند؟", a: "بله؛ تمام محصولات با ضمانت اصالت و سلامت فیزیکی کالا عرضه می‌شوند و برچسب مینی‌مودا روی هر لباس دوخته شده است." },
      { q: "امکان شست‌وشوی لباس‌ها چطور است؟", a: "برچسب نگهداری روی هر محصول دوخته شده؛ بیشتر لباس‌ها با آب سرد و شوینده ملایم قابل شستشو هستند و رنگ ثابتی دارند." },
      { q: "آیا خرید قسطی دارید؟", a: "در جشنواره‌های فصلی امکان خرید اعتباری از طریق اسنپ‌پی فعال است؛ کد تخفیف اعضا نیز هر ماه در خبرنامه اعلام می‌شود." },
    ],
  },
  {
    id: "contact", icon: Headphones, title: "تماس با پشتیبانی",
    items: [
      { q: "راه‌های ارتباطی شما چیست؟", a: "تلفن ۰۲۱-۸۸۷۶۶۵۵۴ (شنبه تا پنجشنبه ۹ تا ۲۱)، ایمیل support@minimoda.ir، و تلگرام @minimoda_ir. پاسخگویی در کمتر از ۳۰ دقیقه در ساعات اداری." },
      { q: "آدرس فروشگاه حضوری کجاست؟", a: "تهران، خیابان ولیعصر، بالاتر از پارک ملت، مجتمع تجاری نیایش، طبقه دوم، واحد ۲۱۴. همه روزه ۱۰ صبح تا ۹ شب پذیرای شما هستیم." },
    ],
  },
];

export default function HelpPage() {
  const [open, setOpen] = useState<string>("delivery-0");

  return (
    <div className="mx-auto max-w-4xl px-3 sm:px-4 py-6">
      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-black text-[#14264a]"><MessageCircleQuestion className="h-7 w-7 text-pink-600" /> راهنمای خرید و سوالات متداول</h1>
      <p className="mt-1 text-[12px] text-slate-500">پاسخ پرتکرارترین سوالات شما؛ اگر پاسخ سوال‌تان نبود با پشتیبانی تماس بگیرید.</p>

      <div className="mt-2 inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-[11px] font-bold text-emerald-700">
        <Phone className="h-4 w-4" /> پشتیبانی: <a dir="ltr" href="tel:02188766554" className="underline">021-88766554</a> — شنبه تا پنجشنبه ۹ تا ۲۱
      </div>

      {SECTIONS.map((section) => (
        <section key={section.id} id={section.id} className="mt-5 scroll-mt-28">
          <h2 className="flex items-center gap-2 font-black text-[#14264a] text-base sm:text-lg">
            <span className="h-9 w-9 grid place-items-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100"><section.icon className="h-5 w-5 text-orange-500" /></span>
            {section.title}
          </h2>
          <div className="mt-2 divide-y divide-slate-100 rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
            {section.items.map((item, i) => {
              const key = `${section.id}-${i}`;
              const isOpen = open === key;
              return (
                <div key={key}>
                  <button onClick={() => setOpen(isOpen ? "" : key)} className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-4 text-right text-[12px] sm:text-[13px] font-bold text-[#14264a] hover:bg-slate-50 transition">
                    {item.q}
                    <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-pink-600" : ""}`} />
                  </button>
                  {isOpen && <div className="px-4 sm:px-5 pb-4 -mt-1 text-[12px] leading-7 text-slate-600 border-t border-dashed border-slate-100 pt-3">{item.a}</div>}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
