import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import CheckoutForm from "@/components/checkout-form";
import { getThemeSettings, settingInt } from "@/lib/theme";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "تکمیل سفارش" };

export default async function CheckoutPage() {
  const user = await getSessionUser();
  const settings = await getThemeSettings().catch(() => ({}) as Record<string, string>);
  const freeAt = settingInt(settings, "free_shipping_at", 2_000_000);
  return (
    <CheckoutForm
      freeAt={freeAt}
      defaultName={user?.name ?? ""}
      defaultPhone={user?.phone ?? ""}
      defaultAddress={user?.address ?? ""}
      isLoggedIn={!!user}
    />
  );
}
