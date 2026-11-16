import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";

export const metadata: Metadata = {
  title: "Demo Checkout",
  description: "Simulated checkout for the VÉLOR portfolio demo. No payment is taken.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return <CheckoutFlow />;
}
