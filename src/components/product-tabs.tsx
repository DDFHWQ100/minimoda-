"use client";

import { useState } from "react";
import { Flame, Zap, Sparkles } from "lucide-react";
import ProductCard, { type ProductCardData } from "@/components/product-card";

type Tabs = { bestsellers: ProductCardData[]; offers: ProductCardData[]; fresh: ProductCardData[] };

export default function ProductTabs({ tabs }: { tabs: Tabs }) {
  const [active, setActive] = useState<keyof Tabs>("bestsellers");

  const buttons: { key: keyof Tabs; label: string; icon: typeof Flame }[] = [
    { key: "bestsellers", label: "پرفروش‌ترین‌ها", icon: Flame },
    { key: "offers", label: "تخفیف‌دارها", icon: Zap },
    { key: "fresh", label: "تازه‌رسیده‌ها", icon: Sparkles },
  ];

  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4 mt-8">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="flex items-center gap-2 text-lg sm:text-2xl font-black text-[#1b3a6b]">
          <span className="h-7 w-1.5 rounded-full inline-block" style={{ background: "var(--brand-accent)" }} />
          دیدنی‌ترین‌های مینی‌مودا
        </h2>
        <div className="flex items-center gap-1 rounded-full bg-white border border-slate-200 p-1 shadow-sm">
          {buttons.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`flex items-center gap-1.5 rounded-full px-3 sm:px-4 h-9 text-[11px] sm:text-[12px] font-bold transition-all ${
                active === key ? "text-white shadow" : "text-slate-500 hover:text-[#1b3a6b]"
              }`}
              style={active === key ? { background: "var(--brand-accent)" } : undefined}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {tabs[active].slice(0, 6).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
