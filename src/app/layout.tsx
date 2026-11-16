import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header, HeaderSpacer } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/layout/Providers";
import { SITE } from "@/lib/format";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "VÉLOR — Timeless Elegance | Luxury Watch Concept",
    template: "%s | VÉLOR",
  },
  description: SITE.description,
  applicationName: "VÉLOR (demo)",
  openGraph: {
    type: "website",
    siteName: "VÉLOR — portfolio demo",
    title: "VÉLOR — Timeless Elegance",
    description: SITE.description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: "VÉLOR — Timeless Elegance", description: SITE.description },
  // Portfolio concept: discourage search engines from indexing a fictional storefront.
  robots: { index: false, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only z-[100] bg-ivory px-4 py-3 text-obsidian focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <Providers>
          <Header />
          <HeaderSpacer />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
