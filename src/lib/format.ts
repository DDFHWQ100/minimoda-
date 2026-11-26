export function toFaDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export function formatPrice(value: number): string {
  return `${Number(value).toLocaleString("fa-IR")} تومان`;
}

export function formatNumber(value: number): string {
  return Number(value).toLocaleString("fa-IR");
}

export function discountPercent(price: number, discountPrice?: number | null): number {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
}

export function effectivePrice(p: { price: number; discountPrice: number | null }): number {
  return p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price;
}

export type ColorOption = { name: string; hex: string };

export function parseJsonArray<T = unknown>(raw: string | null | undefined, fallback: T[] = []): T[] {
  try {
    const v = JSON.parse(raw ?? "[]");
    return Array.isArray(v) ? (v as T[]) : fallback;
  } catch {
    return fallback;
  }
}

export function faDate(input: Date | string): string {
  const d = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function faDay(input: Date | string): string {
  const d = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export const ORDER_STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: "در انتظار پرداخت", cls: "bg-amber-100 text-amber-700 border-amber-200" },
  processing: { label: "در حال آماده‌سازی", cls: "bg-blue-100 text-blue-700 border-blue-200" },
  shipped: { label: "ارسال شده", cls: "bg-violet-100 text-violet-700 border-violet-200" },
  delivered: { label: "تحویل داده شد", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  cancelled: { label: "لغو شده", cls: "bg-rose-100 text-rose-700 border-rose-200" },
};

export const PAYMENT_METHODS: Record<string, string> = {
  online: "درگاه آنلاین (زرین‌پال)",
  onsite: "پرداخت در محل",
  card: "کارت به کارت",
};
