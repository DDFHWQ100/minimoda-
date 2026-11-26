import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { StoreProvider } from "@/components/store-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import DemoBar from "@/components/demo-bar";
import { Baby, Wrench, LogIn, Phone, Mail, Eye, X } from "lucide-react";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { themes } from "@/db/schema";
import { getSessionUser, isAdminDemoOpen } from "@/lib/auth";
import { getThemeBundle, themeCssVariables, fontLinkFor, settingBool, buildNav } from "@/lib/theme";
import PopupWidget from "@/components/popup-widget";

export async function generateMetadata(): Promise<Metadata> {
  const bundle = await getThemeBundle().catch(() => null);
  const s = bundle?.settings ?? {};
  const storeName = s["store.name"] ?? "مینی‌مودا";
  const suffix = s["seo.title_suffix"] ?? `| ${storeName}`;
  return {
    metadataBase: new URL("http://localhost:3000"),
    title: {
      default: `${storeName} | فروشگاه آنلاین مد و پوشاک کودک و نوزاد`,
      template: `%s ${suffix}`,
    },
    description: "خرید آنلاین لباس مجلسی، کاپشن، کت و شلوار، کفش و اکسسوری کودک و نوزاد با ضمانت اصالت، بهترین قیمت و ارسال سریع به سراسر ایران.",
    keywords: ["لباس کودک", "پوشاک بچه گانه", "لباس نوزاد", "لباس مجلسی کودک", "کاپشن بچه گانه", "کفش کودک", "مینی مودا"],
    openGraph: {
      title: `${storeName} | مد و پوشاک کودک و نوزاد`,
      description: "بهترین کالکشن‌های لباس کودک با ارسال رایگان بالای ۲ میلیون تومان",
      type: "website",
      locale: "fa_IR",
      images: [{ url: s["seo.og_image"] ?? "/images/hero-royal-junior.jpg", width: 1600, height: 900, alt: storeName }],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#14264a",
  width: "device-width",
  initialScale: 1,
};

function MaintenanceScreen({ message, storeName }: { message: string; storeName: string }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta httpEquiv="refresh" content="30" />
        <title>{storeName} | در حال به‌روزرسانی</title>
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#0e1c36] text-white flex items-center justify-center p-6" style={{ fontFamily: "Vazirmatn, Tahoma, sans-serif" }}>
        <div className="max-w-lg text-center">
          <div className="mx-auto h-24 w-24 rounded-3xl bg-gradient-to-br from-amber-300 to-orange-400 grid place-items-center shadow-2xl shadow-amber-500/20 animate-pulse">
            <Wrench className="h-12 w-12 text-[#14264a]" strokeWidth={2} />
          </div>
          <h1 className="mt-6 text-2xl sm:text-3xl font-black">{storeName} در حال به‌روزرسانی است</h1>
          <p className="mt-3 text-white/75 leading-7 text-sm">{message}</p>
          <div className="mt-5 flex items-center justify-center gap-4 text-[11px] text-white/50">
            <a href="tel:02188766554" dir="ltr" className="flex items-center gap-1.5 hover:text-amber-300 transition"><Phone className="h-4 w-4" /> 021-88766554</a>
            <a href="mailto:support@minimoda.ir" dir="ltr" className="flex items-center gap-1.5 hover:text-amber-300 transition"><Mail className="h-4 w-4" /> support@minimoda.ir</a>
          </div>
          <a href="/login" className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-400/40 text-amber-300 px-5 h-11 text-[12px] font-bold hover:bg-amber-400/10 transition"><LogIn className="h-4 w-4" /> ورود مدیران سایت</a>
          <p className="mt-4 text-[10px] text-white/30">این صفحه هر ۳۰ ثانیه به‌صورت خودکار تازه می‌شود.</p>
        </div>
      </body>
    </html>
  );
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  const demoOpen = isAdminDemoOpen();
  const bundle = await getThemeBundle().catch(() => null);
  const s = { ...(bundle?.settings ?? {}) };
  const storeName = s["store.name"] ?? "مینی‌مودا";
  const tagline = s["store.tagline"] ?? "مد و پوشاک کودک و نوزاد";

  // ─── پیش‌نمایش زنده قالب (فقط برای مدیر) ───
  let previewTheme: { name: string; slug: string } | null = null;
  if (user?.role === "admin") {
    try {
      const store = await cookies();
      const previewSlug = store.get("mm_preview_theme")?.value;
      if (previewSlug) {
        const rows = await db.select().from(themes).where(eq(themes.slug, previewSlug)).limit(1);
        const theme = rows[0];
        if (theme) {
          previewTheme = { name: theme.name, slug: theme.slug };
          let tokens: Record<string, string> = {};
          try { tokens = JSON.parse(theme.tokens || "{}"); } catch { tokens = {}; }
          if (tokens.primary) s["theme.primary"] = tokens.primary;
          if (tokens.accent) s["theme.accent"] = tokens.accent;
          if (tokens.gold) s["theme.gold"] = tokens.gold;
          if (tokens.font) s["theme.font"] = tokens.font;
          if (tokens.radius) s["theme.radius"] = String(tokens.radius);
        }
      }
    } catch { /* preview optional */ }
  }

  // ─── حالت تعمیر: برای غیرمدیران فقط صفحه تعمیر ───
  if (s["maintenance.enabled"] === "true" && user?.role !== "admin") {
    return <MaintenanceScreen message={s["maintenance.message"] ?? "سایت در حال به‌روزرسانی است."} storeName={storeName} />;
  }

  const varsCss = themeCssVariables(s);
  const announcementOn = settingBool(s, "announcement.enabled", true) && (s["announcement.text"] ?? "") !== "";
  const announcementTone = s["announcement.tone"] ?? "gold";
  const announcementCls =
    announcementTone === "pink"
      ? "bg-pink-600 text-white"
      : announcementTone === "navy"
        ? "bg-[#14264a] text-amber-300"
        : "bg-amber-300 text-amber-950";

  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2222%22 fill=%22%2314264a%22/><text x=%2250%22 y=%2272%22 font-size=%2252%22 text-anchor=%22middle%22 fill=%22%23f2b33d%22 font-family=%22Tahoma%22 font-weight=%22bold%22>M</text></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={fontLinkFor(s["theme.font"])} rel="stylesheet" />
        {/* توکن‌های پوسته (تزریق از Theme Engine) */}
        <style id="theme-vars" dangerouslySetInnerHTML={{ __html: varsCss }} />
        {/* داده‌های ساختاریافته Schema.org (قابل خاموش‌کردن از پنل سئو) */}
        {s["seo.schema_org"] !== "false" && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org", "@type": "ClothingStore", name: storeName, description: s["seo.default_description"] ?? tagline,
            telephone: s["header.phone"] ?? "", address: s["footer.address"] ?? "", email: s["footer.email"] ?? "",
            sameAs: [s["footer.instagram"], s["footer.telegram"]].filter(Boolean),
          }) }} />
        )}
        {/* CSS سفارشی — قلب شخصی‌سازی پوسته */}
        {s["custom.css"] && <style id="custom-css" dangerouslySetInnerHTML={{ __html: s["custom.css"] }} />}
      </head>
      <body className="bg-[#f3f4f8] text-slate-800 antialiased">
        {/* نوار اطلاع‌رسانی — قابل مدیریت از پنل قالب */}
        {announcementOn && (
          <div className={`relative z-[70] text-center text-[10px] sm:text-[11px] font-bold leading-8 px-4 truncate ${announcementCls}`}>
            {s["announcement.text"]}
          </div>
        )}
        {/* کدهای Head سفارشی (متاتگ‌ها، وریفیکیشن‌ها) — تزریق خام */}
        {s["custom.head"] && <div id="custom-head" style={{ display: "none" }} dangerouslySetInnerHTML={{ __html: s["custom.head"] }} />}
        {/* بنر پیش‌نمایش زنده قالب */}
        {previewTheme && (
          <div className="relative z-[70] bg-violet-700 text-white text-[10px] sm:text-[11px] font-bold px-4 h-9 flex items-center justify-center gap-2 flex-wrap">
            <Eye className="h-4 w-4" />
            پیش‌نمایش زنده قالب «{previewTheme.name}» — این قالب هنوز فعال نشده است
            <a href={`/api/admin/theme/preview?slug=${previewTheme.slug}&action=stop`} className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 hover:bg-white/25 transition"><X className="h-3.5 w-3.5" /> خروج از پیش‌نمایش</a>
            <a href={`/admin/theme/themes`} className="rounded-full bg-amber-400 text-[#1b3a6b] px-2 py-0.5 hover:bg-amber-300 transition">فعال‌سازی این قالب</a>
          </div>
        )}
        <StoreProvider>
          <DemoBar />
          <Header
            userName={user?.name ?? null}
            isAdmin={user?.role === "admin" || demoOpen}
            nav={buildNav(bundle?.menus ?? [], "main")}
            announcement={s["announcement.text"]}
            phone={s["header.phone"]}
          />
          <main>{children}</main>
          <Footer
            storeName={storeName}
            tagline={tagline}
            about={s["footer.about"]}
            quickLinks={buildNav(bundle?.menus ?? [], "footer_quick").map((n) => ({ label: n.label, href: n.href }))}
            serviceLinks={buildNav(bundle?.menus ?? [], "footer_service").map((n) => ({ label: n.label, href: n.href }))}
            instagram={s["footer.instagram"]}
            telegram={s["footer.telegram"]}
            phone={s["header.phone"]}
            copyright={s["footer.copyright"]}
            showTrustBadges={s["footer.show_trust_badges"] !== "false"}
          />
          {(bundle?.widgets ?? []).filter((w) => w.enabled && w.type === "popup").slice(0, 1).map((w) => (
            <PopupWidget key={w.id} id={w.id} config={w.config} />
          ))}
        </StoreProvider>
        {/* JavaScript سفارشی — تزریق در پایان body */}
        {s["custom.js"] && <script id="custom-js" dangerouslySetInnerHTML={{ __html: s["custom.js"] }} />}
      </body>
    </html>
  );
}
