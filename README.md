# VÉLOR — Luxury Watch E-commerce Demo

A portfolio concept by **Madd Agency**: a fictional luxury watch house with a cinematic video hero,
editorial layouts, a working client-side cart and a simulated multi-step checkout.

> **Demo disclosure.** VÉLOR is not a real retailer. Products, specifications and prices are illustrative.
> No payments are taken, no card details are requested, no orders are created and nothing ships.

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript
- Tailwind CSS v4 (design tokens in `src/app/globals.css`)
- Motion for React (`motion/react`) for UI animation, with `MotionConfig reducedMotion="user"`
- Lucide React icons
- Zustand + `localStorage` for the cart and wishlist (no backend)

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

Production check:

```bash
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run build && npm start
npm run check        # all three in sequence
```

Optional: set `NEXT_PUBLIC_SITE_URL` so the sitemap, robots and Open Graph URLs use your deployed domain.

## What's included

| Area | Details |
| --- | --- |
| Home | Video hero, highlight strip, Shop by Collection, Our Bestsellers, Precision in Every Detail (parallax), craftsmanship editorial, demo newsletter |
| Shop `/shop` | Search (also reachable from the header via `?q=`), category, price range, strap and color filters, five sort options, mobile bottom-sheet filters |
| Collections | `/collections` overview plus `/collections/[men\|women\|chronograph\|minimal]` with filters |
| Product `/products/[slug]` | Gallery with thumbnails and crossfade, color and strap variants (the images update to match), quantity, Add to Cart, Buy Now, wishlist, specs accordion, related products |
| Cart | Slide-in drawer plus `/cart` page: add, remove, update quantity, subtotal, empty state; saved in `localStorage` |
| Checkout `/checkout` | Three steps (Information → Shipping → Review) with validation, simulated shipping methods, a demo acknowledgement and a simulated order |
| Confirmation | `/checkout/confirmation` shows a demo reference (kept in `sessionStorage` only) |
| Other | About, Contact (demo form), custom 404, `sitemap.xml`, `robots.txt`, generated Open Graph image |

## Hero video

- File: `public/videos/velor-hero.mp4` (1920×1080, 7.9 s, H.264, about 4.8 MB).
- `autoplay muted loop playsInline preload="metadata"`, `object-fit: cover`. It is never stretched; it is cropped toward the watch on mobile.
- A static poster paints immediately; the video fades in once it is actually playing.
- When `prefers-reduced-motion` or Save-Data is on, the video stays paused on the poster. A play/pause control is always available.

### Recommended video optimisations (not yet done; ffmpeg wasn't available in the build environment)

```bash
# Real poster frame (replace the generated SVG poster)
ffmpeg -ss 1 -i public/videos/velor-hero.mp4 -frames:v 1 -q:v 3 public/images/hero/hero-poster.jpg
# Strip the unused audio track and compress (~40–60% smaller)
ffmpeg -i public/videos/velor-hero.mp4 -an -c:v libx264 -crf 24 -preset slow -movflags +faststart public/videos/velor-hero-opt.mp4
# Optional portrait crop for phones
ffmpeg -i public/videos/velor-hero.mp4 -an -vf "crop=ih*9/16:ih:iw*0.62-ih*9/32:0,scale=720:-2" -crf 26 -movflags +faststart public/videos/velor-hero-mobile.mp4
```

After that, update the constants at the top of `src/components/home/Hero.tsx`.

## Images

All product, collection and editorial images are **generated SVG placeholders**: consistent concept renders,
not photography. See [ASSETS.md](ASSETS.md) for the full manifest and how to swap in real photos.
Regenerate them with `npm run assets`.

## Project structure

```
src/app/                 routes, metadata, sitemap, robots, OG image
src/components/layout/   header, mobile nav, search overlay, footer, providers
src/components/home/     homepage sections
src/components/products/ product card, shop view and filters, product detail and gallery
src/components/cart/     cart drawer, cart line, cart page view
src/components/checkout/ checkout flow, stepper, fields, confirmation
src/components/ui/       Reveal and Stagger motion helpers, Img, notices, quantity control
src/data/products.ts     catalog (6 products, 4 collections)
src/lib/                 cart and wishlist store, search, dialog a11y hook, formatting
scripts/                 placeholder asset generator
public/videos/           hero video
public/images/           placeholder art
```
