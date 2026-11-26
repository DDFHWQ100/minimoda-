import { Gauge, CheckCircle2, AlertTriangle, XCircle, Search, Globe, Zap, ShieldCheck } from "lucide-react";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getThemeBundle } from "@/lib/theme";
import { parseJsonArray } from "@/lib/format";

export const dynamic = "force-dynamic";

type Level = "ok" | "warn" | "fail";
type Check = { level: Level; title: string; detail: string; action?: string; group: string };

export default async function SeoPage() {
  const [allProducts, bundle] = await Promise.all([
    db.select({ id: products.id, name: products.name, description: products.description, stock: products.stock, images: products.images, reviewCount: products.reviewCount }).from(products),
    getThemeBundle(),
  ]);
  const s = bundle.settings;

  const noImage = allProducts.filter((p) => parseJsonArray(p.images).length === 0).length;
  const shortDesc = allProducts.filter((p) => (p.description ?? "").trim().length < 60).length;
  const outOfStock = allProducts.filter((p) => p.stock <= 0).length;
  const noReviews = allProducts.filter((p) => p.reviewCount === 0).length;
  const ogSet = (s["seo.og_image"] ?? "").trim() !== "";
  const suffixSet = (s["seo.title_suffix"] ?? "").trim() !== "";
  const maintenance = s["maintenance.enabled"] === "true";
  const avgDesc = allProducts.length ? Math.round(allProducts.reduce((a, p) => a + (p.description ?? "").length, 0) / allProducts.length) : 0;

  const checks: Check[] = [
    { group: "ساختار و محتوا", level: noImage === 0 ? "ok" : "fail", title: "همه محصولات تصویر دارند", detail: noImage === 0 ? `${allProducts.length} محصول دارای حداقل یک تصویر هستند.` : `${noImage} محصول بدون تصویر — گوگل و مشتریان رد می‌کنند.`, action: noImage > 0 ? "به «مدیریت محصولات» بروید و تصویر اضافه کنید" : undefined },
    { group: "ساختار و محتوا", level: shortDesc === 0 ? "ok" : shortDesc <= 3 ? "warn" : "fail", title: "توضیحات محصول کافی است", detail: shortDesc === 0 ? `میانگین طول توضیحات ${avgDesc} کاراکتر — عالی.` : `${shortDesc} محصول توضیح کوتاه‌تر از ۶۰ کاراکتر دارند (میانگین ${avgDesc}).`, action: shortDesc > 0 ? "توضیحات را غنی‌تر کنید؛ کلمات کلیدی بلند (long-tail) اضافه کنید" : undefined },
    { group: "ساختار و محتوا", level: noReviews <= 4 ? "ok" : "warn", title: "نظرات مشتریان برای CTR", detail: `${noReviews} محصول بدون نظر هستند. نظرات ستاره‌دار نرخ کلیک را در گوگل تا ۳۵٪ افزایش می‌دهد.`, action: "در صفحه محصول، مشتریان را به ثبت نظر تشویق کنید" },
    { group: "موجودی و فروش", level: outOfStock === 0 ? "ok" : "warn", title: "محصول ناموجود نداریم", detail: outOfStock === 0 ? "همه کالاها موجود هستند." : `${outOfStock} کالا ناموجود است؛ گوگل صفحات ناموجود را به‌مرور از نتایج حذف می‌کند.`, action: "موجودی را در «مدیریت محصولات» به‌روزرسانی کنید" },
    { group: "متادیتا و اشتراک‌گذاری", level: ogSet && suffixSet ? "ok" : "warn", title: "Open Graph و پسوند عنوان", detail: ogSet && suffixSet ? "تصویر اشتراک‌گذاری و پسوند عنوان تنظیم شده‌اند." : "تصویر اشتراک‌گذاری یا پسوند عنوان خالی است — لینک سایت در شبکه‌های اجتماعی حرفه‌ای دیده نمی‌شود.", action: "در «تنظیمات عمومی» این دو فیلد را پر کنید" },
    { group: "عملکرد", level: "ok", title: "بارگذاری تنبل تصاویر فعال است", detail: "تصاویر محصولات و بنرها با loading=lazy سرو می‌شوند." },
    { group: "عملکرد", level: "ok", title: "فشرده‌سازی و کش فعال است", detail: "استایل‌ها و اسکریپت‌ها به‌صورت بهینه توسط Next.js باندل و کش می‌شوند." },
    { group: "دسترسی و پایداری", level: maintenance ? "fail" : "ok", title: "سایت در حالت عادی (نه تعمیر) است", detail: maintenance ? "حالت تعمیر فعال است — غیرمدیران سایت را نمی‌بینند!" : "حالت تعمیر غیرفعال است.", action: maintenance ? "در «تنظیمات عمومی» حالت تعمیر را خاموش کنید" : undefined },
  ];

  const score = Math.round((checks.filter((c) => c.level === "ok").length / checks.length) * 100);
  const scoreColor = score >= 85 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : "text-rose-600";
  const groups = [...new Set(checks.map((c) => c.group))];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#14264a] flex items-center gap-2"><Gauge className="h-6 w-6 text-pink-600" /> سئو و سلامت قالب</h1>
          <p className="text-[11px] text-slate-500 mt-0.5">بررسی خودکار و واقعی محتوا، متادیتا و عملکرد سایت — بر اساس داده زنده دیتابیس</p>
        </div>
        <div className="flex items-center gap-4 rounded-3xl border border-slate-200/70 bg-white px-6 py-3 shadow-sm">
          <div className="text-center">
            <p className={`text-3xl font-black ${scoreColor}`}>{score.toLocaleString("fa-IR")}</p>
            <p className="text-[9px] text-slate-400 font-bold">امتیاز سلامت</p>
          </div>
          <div className="h-12 w-px bg-slate-200" />
          <div className="text-[10px] text-slate-500 leading-5">
            <p><b className="text-emerald-600">{checks.filter((c) => c.level === "ok").length}</b> مورد سالم</p>
            <p><b className="text-amber-600">{checks.filter((c) => c.level === "warn").length}</b> هشدار</p>
            <p><b className="text-rose-600">{checks.filter((c) => c.level === "fail").length}</b> بحرانی</p>
          </div>
        </div>
      </div>

      {groups.map((group) => (
        <section key={group} className="mt-4">
          <h2 className="text-[11px] font-black text-slate-400 flex items-center gap-2">{group === "عملکرد" ? <Zap className="h-4 w-4" /> : group === "دسترسی و پایداری" ? <ShieldCheck className="h-4 w-4" /> : group === "متادیتا و اشتراک‌گذاری" ? <Globe className="h-4 w-4" /> : <Search className="h-4 w-4" />}{group}</h2>
          <div className="mt-1.5 grid md:grid-cols-2 gap-2">
            {checks.filter((c) => c.group === group).map((c) => {
              const Icon = c.level === "ok" ? CheckCircle2 : c.level === "warn" ? AlertTriangle : XCircle;
              const tone = c.level === "ok" ? "border-emerald-200 bg-emerald-50/50 text-emerald-800" : c.level === "warn" ? "border-amber-200 bg-amber-50/60 text-amber-800" : "border-rose-200 bg-rose-50/60 text-rose-800";
              return (
                <div key={c.title} className={`rounded-2xl border p-3 ${tone}`}>
                  <p className="flex items-center gap-1.5 text-[11px] font-black"><Icon className="h-4 w-4 shrink-0" />{c.title}</p>
                  <p className="mt-1 text-[10px] leading-5 opacity-90">{c.detail}</p>
                  {c.action && <p className="mt-1.5 text-[9px] font-bold opacity-80 border-t border-current/20 pt-1.5">اقدام پیشنهادی: {c.action}</p>}
                </div>
              );
            })}
          </div>
        </section>
      ))}
      <p className="mt-4 text-[9px] text-slate-400">بررسی‌های پیشرفته (Core Web Vitals واقعی، Schema.org، امتیاز Google PageSpeed) نیازمند اتصال به سرویس‌های خارجی و API کلیددار هستند؛ وضعیت آن‌ها در تب «اعلان‌ها» به‌عنوان کارهای زیرساختی ثبت شده است.</p>
    </div>
  );
}
