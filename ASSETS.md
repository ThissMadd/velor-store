# VÉLOR Asset Manifest

Status legend: ✅ final asset supplied · 🟡 generated placeholder (replace before showcasing as photography)

All placeholders are produced by `scripts/generate-placeholders.mjs` (`npm run assets`). They are SVG concept
renders drawn from the same parameters as the catalog, so colors and straps always match the selected variant.

**To replace a placeholder:** drop a real image at the same path with a raster extension (for example `.jpg` or
`.webp`) and update the extension in `productImages()` in `src/data/products.ts`, or in the component that
references it. Raster images go through the Next.js image optimiser automatically; SVGs bypass it.

## Hero

| Path | Status | Spec |
| --- | --- | --- |
| `public/videos/velor-hero.mp4` | ✅ | Google Flow render, 1920×1080, 24 fps, 7.9 s |
| `public/images/hero/hero-poster.svg` | 🟡 | Replace with a JPG frame from the video (1920×1080) |
| `public/images/hero/hero-poster-mobile.svg` | 🟡 | Portrait crop of the same frame (about 750×1334) |

## Products: `public/images/products/{slug}/`

Required photography per variant (4:5, at least 1600×2000, consistent lighting):

| File pattern | View | Status |
| --- | --- | --- |
| `{color}-{strap}-front.svg` | Front, ivory studio background | 🟡 |
| `{color}-{strap}-dark.svg` | Angled hero shot, dark background (also used as the card hover image) | 🟡 |
| `{color}-detail.svg` | Macro of the dial and crown | 🟡 |
| `{color}-{strap}-wrist.svg` | Profile or lifestyle shot (currently a rotated render on stone) | 🟡 |

**VÉLOR Classic: ✅ real photography** in `public/images/products/velor-classic/{silver,black,champagne-gold}/`,
three PNGs per color (1254×1254), in the order front → angled → caseback. Paths are listed in `gallery` in
`src/data/products.ts`. Filenames contain spaces and accents; the `Img` wrapper URL-encodes them for the optimiser.

**VÉLOR Chrono: ✅ real photography** in `public/images/products/velor-chrono/{black,silver}/`, three PNGs per
finish in the order front → three-quarter → caseback (paths listed in `gallery` in `src/data/products.ts`).

| File | View | Status |
| --- | --- | --- |
| `black/Black-and-Gold Vélor Chronograph Watch.png` | Front | ✅ transparent |
| `black/VÉLOR Chrono Black and Gold Watch.png` | Three-quarter | ✅ transparent |
| `black/Vélor Chrono Caseback Detail.png` | Rear | ✅ transparent |
| `silver/VÉLOR Chronograph Wristwatch.png` | Front | ✅ transparent |
| `silver/Silver VÉLOR Chronograph Watch.png` | Three-quarter | ✅ transparent |
| `silver/Vélor Stainless Steel Chronograph Back.png` | Rear | ✅ transparent |

After replacing an image at the same path, delete `.next/cache/images` and restart, otherwise Next.js keeps serving
its cached copy of the old file.

**VÉLOR Minimal: ✅ real photography** in `public/images/products/velor-minimal/{silver,black,gold}/`, three
transparent PNGs per finish (Silver, Black, Champagne Gold) in the order front → three-quarter → caseback (paths listed
in `gallery` in `src/data/products.ts`).

**VÉLOR Royale: ✅ real photography** in `public/images/products/velor-royale/{Champagne Gold,silver}/`, three
transparent PNGs per finish (Rose Gold & Black uses the `Champagne Gold` folder) in the order front → three-quarter →
rear (paths listed in `gallery` in `src/data/products.ts`).

Remaining placeholder products:

| Product | Colors | Straps | Files |
| --- | --- | --- | --- |
| velor-heritage | black, silver | leather, steel | 14 |
| velor-luna | gold, silver | leather, mesh | 14 |

## Collections: `public/images/collections/`

Supplied photography (1254×1254 PNG), shown as 4:5 cards cropped with `object-fit: cover`.
The crop position for each image is `imagePosition` in `COLLECTIONS` (`src/data/products.ts`).

| File | Subject | Status |
| --- | --- | --- |
| `mens-collection.png` | Steel, black dial, on rock | ✅ |
| `womens-collection.png` | Rose gold, mother-of-pearl dial, satin | ✅ |
| `chronograph-collection.png` | Steel chronograph, black dial, on rock | ✅ |
| `minimal-collection.png` | Rose gold, white dial, black leather | ✅ |

The earlier generated `men.svg`, `women.svg`, `chronograph.svg` and `minimal.svg` are no longer referenced.

## Editorial: `public/images/editorial/`

| File | Used in | Ratio | Status |
| --- | --- | --- | --- |
| `precision.svg` | Home: Precision in Every Detail (parallax) | 16:10 | 🟡 |
| `craft-wide.svg` | Home: craftsmanship banner | 21:9 | 🟡 |
| `material-case.svg`, `material-dial.svg`, `material-strap.svg` | Home: material triptych, About | 4:5 | 🟡 |
| `about-portrait.svg` | About hero | 4:5 | 🟡 |

## Open Graph

`src/app/opengraph-image.tsx` generates a typographic 1200×630 PNG at build time. 🟡 Swap it for a hero still
when real photography exists.
