import type { Metadata } from "next";
import { Confirmation } from "@/components/checkout/Confirmation";

export const metadata: Metadata = {
  title: "Demo Order Confirmation",
  robots: { index: false },
};

export default function ConfirmationPage() {
  return <Confirmation />;
}
