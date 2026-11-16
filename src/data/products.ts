/**
 * VÉLOR demo catalog. Fictional products, illustrative prices.
 * Image paths follow the convention produced by scripts/generate-placeholders.mjs:
 *   /images/products/{slug}/{color}-{strap}-{front|dark|wrist}.svg
 *   /images/products/{slug}/{color}-detail.svg
 */

export type CategoryId = "men" | "women" | "chronograph" | "minimal";
export type StrapId = "steel" | "leather" | "mesh";
export type ColorId = "silver" | "black" | "gold";

export interface ColorVariant {
  id: ColorId;
  label: string;
  swatch: string;
}

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  /** Optional one-line summary shown under the title on the product page. */
  shortDescription?: string;
  series?: string;
  price: number;
  categories: CategoryId[];
  description: string;
  details: string[];
  colors: ColorVariant[];
  straps: StrapId[];
  specs: { label: string; value: string }[];
  bestsellerRank: number;
  releaseOrder: number;
  related: string[];
  /** Real photography per color. When present it replaces the generated placeholder renders. */
  gallery?: Partial<Record<ColorId, string[]>>;
  /** Accessible names for each gallery position (e.g. Front, Angle, Caseback). */
  galleryLabels?: string[];
  /** Product-specific wording for a strap option, e.g. "Metal Link Bracelet". */
  strapLabels?: Partial<Record<StrapId, string>>;
}

export const COLOR_META: Record<ColorId, ColorVariant> = {
  silver: { id: "silver", label: "Silver", swatch: "linear-gradient(135deg,#f5f5f3,#a9a59f)" },
  black: { id: "black", label: "Black", swatch: "linear-gradient(135deg,#3a3a3a,#050505)" },
  gold: { id: "gold", label: "Champagne Gold", swatch: "linear-gradient(135deg,#efd5b4,#9a7048)" },
};

export const STRAP_META: Record<StrapId, { id: StrapId; label: string }> = {
  steel: { id: "steel", label: "Stainless Steel" },
  leather: { id: "leather", label: "Leather" },
  mesh: { id: "mesh", label: "Mesh" },
};

export interface Collection {
  id: CategoryId;
  name: string;
  shortName: string;
  description: string;
  image: string;
  /** CSS object-position that keeps the watch in frame when the square photo is cropped. */
  imagePosition: string;
}

export const COLLECTIONS: Collection[] = [
  {
    id: "men",
    name: "Men's Collection",
    shortName: "Men",
    description: "Assured proportions, brushed steel and dials that read at a glance.",
    image: "/images/collections/mens-collection.png",
    imagePosition: "42% 45%",
  },
  {
    id: "women",
    name: "Women's Collection",
    shortName: "Women",
    description: "Refined cases and warm metals, sized for a lighter presence on the wrist.",
    image: "/images/collections/womens-collection.png",
    imagePosition: "50% 45%",
  },
  {
    id: "chronograph",
    name: "Chronograph",
    shortName: "Chronograph",
    description: "Three registers, two pushers and a quiet obsession with measured time.",
    image: "/images/collections/chronograph-collection.png",
    imagePosition: "56% 45%",
  },
  {
    id: "minimal",
    name: "Minimal",
    shortName: "Minimal",
    description: "Only what matters: two hands, clean indices and generous negative space.",
    image: "/images/collections/minimal-collection.png",
    imagePosition: "45% 45%",
  },
];

const c = (...ids: ColorId[]) => ids.map((id) => COLOR_META[id]);

export const PRODUCTS: Product[] = [
  {
    slug: "velor-classic",
    name: "VÉLOR Classic",
    tagline: "The everyday signature",
    shortDescription: "Timeless design. Refined details. Everyday elegance.",
    series: "Classic",
    price: 179,
    categories: ["men"],
    description:
      "Discover the perfect balance of sophistication and modern design with the VÉLOR Classic. Featuring a refined black dial, elegant hour markers, and a beautifully designed metal bracelet, this timepiece brings effortless style to every occasion.\n\nFrom business meetings to everyday moments, the VÉLOR Classic is designed for those who appreciate understated luxury.",
    details: ["Refined black dial", "Elegant hour markers", "Date window", "Metal link bracelet"],
    colors: c("silver", "black", "gold"),
    straps: ["steel"],
    strapLabels: { steel: "Metal Link Bracelet" },
    specs: [
      { label: "Collection", value: "Men's Collection" },
      { label: "Series", value: "Classic" },
      { label: "Dial", value: "Black" },
      { label: "Bracelet", value: "Metal Link Bracelet" },
      { label: "Display", value: "Analog with Date Window" },
      { label: "Available colors", value: "Silver, Black, Champagne Gold" },
      { label: "Style", value: "Classic Luxury" },
    ],
    bestsellerRank: 1,
    releaseOrder: 1,
    related: ["velor-royale", "velor-minimal", "velor-heritage"],
    galleryLabels: ["Front", "Angled view", "Caseback"],
    gallery: {
      silver: [
        "/images/products/velor-classic/silver/Vélor Silver Watch on White.png",
        "/images/products/velor-classic/silver/Silver VÉLOR Watch on White Background.png",
        "/images/products/velor-classic/silver/Vélor Classic Series Caseback.png",
      ],
      black: [
        "/images/products/velor-classic/black/Sleek Black Vélor Watch Product Shot.png",
        "/images/products/velor-classic/black/Black Vélor Watch Product Shot.png",
        "/images/products/velor-classic/black/Vélor Classic Series Watch Back.png",
      ],
      gold: [
        "/images/products/velor-classic/champagne-gold/Vélor Gold Dress Watch on White.png",
        "/images/products/velor-classic/champagne-gold/Gold V VÉLOR Watch with Bracelet.png",
        "/images/products/velor-classic/champagne-gold/Champagne Gold Vélor Watch Caseback.png",
      ],
    },
  },
  {
    slug: "velor-chrono",
    name: "VÉLOR Chrono",
    tagline: "Measured in moments",
    shortDescription: "Bold precision-inspired design. Modern luxury. Timeless confidence.",
    price: 249,
    categories: ["men", "chronograph"],
    description:
      "VÉLOR Chrono brings together bold contemporary design and timeless sophistication. Featuring a striking black dial, three chronograph-style subdials, a distinctive tachymeter-inspired bezel, and a refined metal bracelet, this timepiece is designed to make an impression.\n\nAvailable in two elegant finishes, Black & Gold and Silver, the VÉLOR Chrono delivers a confident, modern look for everyday wear and special occasions.",
    details: [
      "Black dial with three chronograph-style subdials",
      "Tachymeter-inspired bezel",
      "Black & Gold: gold-tone hands, indices, crown and pushers",
      "Silver: silver-tone hands, indices, crown and pushers",
      "Refined metal bracelet",
    ],
    colors: [
      { id: "black", label: "Black & Gold", swatch: "linear-gradient(135deg,#2a2a2a 0 58%,#c9a24a 58% 100%)" },
      COLOR_META.silver,
    ],
    straps: ["steel"],
    strapLabels: { steel: "Metal Bracelet" },
    specs: [
      { label: "Collection", value: "Men's Collection" },
      { label: "Category", value: "Chronograph" },
      { label: "Dial", value: "Black, three chronograph-style subdials" },
      { label: "Bezel", value: "Tachymeter-inspired" },
      { label: "Bracelet", value: "Metal bracelet" },
      { label: "Finishes", value: "Black & Gold, Silver" },
      { label: "Note", value: "Design concept — movement, chronograph function and water resistance are not specified" },
    ],
    bestsellerRank: 2,
    releaseOrder: 4,
    related: ["velor-heritage", "velor-classic", "velor-royale"],
    galleryLabels: ["Front", "Three-quarter view", "Caseback"],
    gallery: {
      black: [
        "/images/products/velor-chrono/black/Black-and-Gold Vélor Chronograph Watch.png",
        "/images/products/velor-chrono/black/VÉLOR Chrono Black and Gold Watch.png",
        "/images/products/velor-chrono/black/Vélor Chrono Caseback Detail.png",
      ],
      silver: [
        "/images/products/velor-chrono/silver/VÉLOR Chronograph Wristwatch.png",
        "/images/products/velor-chrono/silver/Silver VÉLOR Chronograph Watch.png",
        "/images/products/velor-chrono/silver/Vélor Stainless Steel Chronograph Back.png",
      ],
    },
  },
  {
    slug: "velor-minimal",
    name: "VÉLOR Minimal",
    tagline: "Nothing more, nothing less",
    shortDescription: "The art of simplicity. Refined design, timeless elegance.",
    price: 159,
    categories: ["minimal", "men"],
    description:
      "Discover understated sophistication with the VÉLOR Minimal, a modern timepiece concept created for those who appreciate simplicity and refined aesthetics.\n\nFeaturing an ultra-clean dial, slim hour markers, a polished minimalist case, and an elegant black leather-style strap, VÉLOR Minimal brings effortless style to any occasion.\n\nIts balanced proportions and timeless design make it a versatile accessory for everyday outfits, business attire, and special moments.\n\nAvailable in three distinctive finishes — Silver, Black and Champagne Gold — each offering its own interpretation of contemporary elegance.",
    details: [
      "Elegant minimalist dial",
      "Slim hour markers",
      "Refined round case",
      "Black leather-style strap",
      "Three color options",
      "Timeless contemporary design",
    ],
    colors: c("gold", "silver", "black"),
    straps: ["leather"],
    strapLabels: { leather: "Black Leather-style Strap" },
    specs: [
      { label: "Collection", value: "Minimal Collection, Men's Collection" },
      { label: "Type", value: "Minimalist watch" },
      { label: "Silver", value: "Polished silver-tone case, clean white dial, silver-tone hands and markers" },
      { label: "Black", value: "Black-tone case, black dial, silver-tone hands and markers" },
      { label: "Champagne Gold", value: "Gold-tone case, clean white dial, gold-tone hands and markers" },
      { label: "Strap", value: "Black leather-style strap" },
      { label: "Note", value: "Design concept — movement, dimensions and water resistance are not specified" },
    ],
    bestsellerRank: 3,
    releaseOrder: 3,
    related: ["velor-luna", "velor-classic", "velor-royale"],
    galleryLabels: ["Front", "Three-quarter view", "Caseback"],
    gallery: {
      silver: [
        "/images/products/velor-minimal/silver/Minimal Silver Vélor Watch.png",
        "/images/products/velor-minimal/silver/VÉLOR Silver Watch Product Shot.png",
        "/images/products/velor-minimal/silver/Stainless Steel Vélor Watch Back.png",
      ],
      black: [
        "/images/products/velor-minimal/black/Minimalist Black Vélor Wristwatch.png",
        "/images/products/velor-minimal/black/Minimalist Vélor Black Leather Watch.png",
        "/images/products/velor-minimal/black/Vélor Minimal Black Watch Back.png",
      ],
      gold: [
        "/images/products/velor-minimal/gold/VÉLOR Gold Minimalist Wristwatch.png",
        "/images/products/velor-minimal/gold/Vélor Gold Watch Three-Quarter View.png",
        "/images/products/velor-minimal/gold/Vélor Minimal Gold-Case Watch Back.png",
      ],
    },
  },
  {
    slug: "velor-royale",
    name: "VÉLOR Royale",
    tagline: "Warm metal, deep night",
    shortDescription: "An expression of timeless femininity. Refined elegance for every moment.",
    price: 299,
    categories: ["women"],
    description:
      "Introducing VÉLOR Royale — a refined women's timepiece concept designed to celebrate elegance, confidence, and timeless beauty.\n\nFeaturing a sophisticated round dial, delicate crystal-inspired hour markers, slender hands, and a beautifully finished metal-link bracelet, VÉLOR Royale brings an elevated touch to everyday style.\n\nIts elegant proportions and carefully balanced design make it a beautiful accessory for formal occasions, professional outfits, and memorable moments.\n\nChoose between two distinctive finishes: Rose Gold & Black for a bold, luxurious expression, or Silver for a luminous and understated look.\n\nVÉLOR Royale is where contemporary design meets timeless sophistication.",
    details: [
      "Elegant women's watch design",
      "Refined round dial",
      "Crystal-inspired hour markers",
      "Polished metal-link bracelet",
      "Slim, sophisticated hands",
      "Two premium color options",
      "Timeless luxury-inspired aesthetic",
    ],
    colors: [
      { id: "gold", label: "Rose Gold & Black", swatch: "linear-gradient(135deg,#e6b8a2 0 58%,#151515 58% 100%)" },
      COLOR_META.silver,
    ],
    straps: ["steel"],
    strapLabels: { steel: "Metal-Link Bracelet" },
    specs: [
      { label: "Collection", value: "Women's Collection" },
      { label: "Type", value: "Women's luxury watch" },
      { label: "Rose Gold & Black", value: "Rose gold-tone case and bracelet, deep black dial, rose gold-tone hands and markers" },
      { label: "Silver", value: "Silver-tone case and bracelet, silver-white dial, silver-tone hands and markers" },
      { label: "Accents", value: "Crystal-inspired accents at 12, 3, 6 and 9" },
      { label: "Bracelet", value: "Metal-link bracelet" },
      { label: "Note", value: "Design concept — movement, dimensions, water resistance and stone materials are not specified" },
    ],
    bestsellerRank: 4,
    releaseOrder: 2,
    related: ["velor-luna", "velor-classic", "velor-minimal"],
    galleryLabels: ["Front", "Three-quarter view", "Rear view"],
    gallery: {
      gold: [
        "/images/products/velor-royale/Champagne Gold/Rose-Gold VÉLOR Royale Watch.png",
        "/images/products/velor-royale/Champagne Gold/Vélor Royale Rose Gold Watch.png",
        "/images/products/velor-royale/Champagne Gold/Rose-Gold Vélor Watch Back.png",
      ],
      silver: [
        "/images/products/velor-royale/silver/Vélor Royale Silver Watch.png",
        "/images/products/velor-royale/silver/Silver Vélor Royale Luxury Watch.png",
        "/images/products/velor-royale/silver/Vélor Royale Stainless Steel Watch.png",
      ],
    },
  },
  {
    slug: "velor-heritage",
    name: "VÉLOR Heritage",
    tagline: "A nod to the archive",
    price: 219,
    categories: ["men", "chronograph"],
    description:
      "Inspired by mid-century racing chronographs, the VÉLOR Heritage pairs a three-register dial with a hand-stitched-look leather strap that softens beautifully with wear.",
    details: ["Vintage-inspired register layout", "Contrast-stitched leather strap", "Domed crystal profile"],
    colors: c("black", "silver"),
    straps: ["leather", "steel"],
    specs: [
      { label: "Case diameter", value: "41 mm" },
      { label: "Case thickness", value: "11.8 mm" },
      { label: "Movement", value: "Quartz chronograph (concept specification)" },
      { label: "Crystal", value: "Sapphire-style domed crystal" },
      { label: "Water resistance", value: "Splash resistant (illustrative)" },
      { label: "Lug width", value: "20 mm" },
    ],
    bestsellerRank: 5,
    releaseOrder: 5,
    related: ["velor-chrono", "velor-classic", "velor-luna"],
  },
  {
    slug: "velor-luna",
    name: "VÉLOR Luna",
    tagline: "Soft light, sharp lines",
    price: 189,
    categories: ["women", "minimal"],
    description:
      "A petite case, a warm ivory dial and the gentlest champagne accents. The VÉLOR Luna is designed to be worn from morning meetings to moonlit dinners.",
    details: ["Petite 34 mm case", "Ivory dial with dot indices", "Supple leather or fine mesh strap"],
    colors: c("gold", "silver"),
    straps: ["leather", "mesh"],
    specs: [
      { label: "Case diameter", value: "34 mm" },
      { label: "Case thickness", value: "7.0 mm" },
      { label: "Movement", value: "Quartz (concept specification)" },
      { label: "Crystal", value: "Sapphire-style flat crystal" },
      { label: "Water resistance", value: "Splash resistant (illustrative)" },
      { label: "Lug width", value: "16 mm" },
    ],
    bestsellerRank: 6,
    releaseOrder: 6,
    related: ["velor-minimal", "velor-royale", "velor-classic"],
  },
];

/* ---------------------------------------------------------------- helpers */

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getCollection(id: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.id === id);
}

export function getProductsByCategory(id: CategoryId): Product[] {
  return PRODUCTS.filter((p) => p.categories.includes(id)).sort((a, b) => a.bestsellerRank - b.bestsellerRank);
}

export function getBestsellers(limit = 4): Product[] {
  return [...PRODUCTS].sort((a, b) => a.bestsellerRank - b.bestsellerRank).slice(0, limit);
}

export function getRelated(product: Product): Product[] {
  return product.related.map(getProduct).filter((p): p is Product => Boolean(p));
}

export function productImages(product: Product, color: ColorId, strap: StrapId): string[] {
  const photos = product.gallery?.[color];
  if (photos?.length) return photos;
  const base = `/images/products/${product.slug}`;
  return [
    `${base}/${color}-${strap}-front.svg`,
    `${base}/${color}-${strap}-dark.svg`,
    `${base}/${color}-detail.svg`,
    `${base}/${color}-${strap}-wrist.svg`,
  ];
}

export function defaultImages(product: Product): string[] {
  return productImages(product, product.colors[0].id, product.straps[0]);
}

const DEFAULT_GALLERY_LABELS = ["Front", "Angle", "Dial detail", "Profile"];

export function galleryLabel(product: Product, index: number): string {
  return (product.galleryLabels ?? DEFAULT_GALLERY_LABELS)[index] ?? `Image ${index + 1}`;
}

export function strapLabel(product: Product, strap: StrapId): string {
  return product.strapLabels?.[strap] ?? STRAP_META[strap].label;
}

/** Colour name as this product presents it (e.g. "Black & Gold" for VÉLOR Chrono). */
export function colorLabel(product: Product, color: ColorId): string {
  return product.colors.find((c) => c.id === color)?.label ?? COLOR_META[color].label;
}

export const PRICE_BOUNDS = { min: 100, max: 400 } as const;
