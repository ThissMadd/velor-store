const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatPrice(value: number): string {
  return usd.format(value);
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export const SITE = {
  name: "VÉLOR",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://velor-demo.example.com",
  description:
    "VÉLOR is a fictional luxury watch brand — a portfolio e-commerce concept by Madd Agency. Prices are illustrative and no real orders are placed.",
};
