import type { Metadata } from "next";
import CartView from "@/components/cart-view";
import { getThemeSettings, settingInt } from "@/lib/theme";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "سبد خرید" };

export default async function CartPage() {
  const settings = await getThemeSettings().catch(() => ({}) as Record<string, string>);
  const freeAt = settingInt(settings, "free_shipping_at", 2_000_000);
  return <CartView freeAt={freeAt} />;
}
