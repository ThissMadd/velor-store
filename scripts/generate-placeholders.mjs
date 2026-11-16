/**
 * VÉLOR placeholder asset generator.
 *
 * Produces consistent, on-brand SVG watch renders for every product variant,
 * collection card, editorial panel and the hero poster. These are PLACEHOLDERS
 * for real product photography — see ASSETS.md for the replacement manifest.
 *
 * Run: npm run assets
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");

/* ---------------------------------------------------------------- palette */

const METALS = {
  silver: ["#fbfbfa", "#d2cfc9", "#8f8b85", "#ecebe7", "#a9a59f"],
  black: ["#565656", "#262626", "#0a0a0a", "#363636", "#151515"],
  gold: ["#f3dfc4", "#cfa77b", "#8e6642", "#e9c7a0", "#ab8058"],
};

const DIALS = {
  black: { stops: ["#262626", "#0c0c0c", "#030303"], ink: "#ece9e4", sub: "#1a1a1a" },
  ivory: { stops: ["#fdfcf8", "#f1ede5", "#ddd7cc"], ink: "#1d1b19", sub: "#ebe6dc" },
  champagne: { stops: ["#efe3cf", "#d9c4a2", "#b89d76"], ink: "#2a2118", sub: "#d3bd99" },
};

const LEATHER = {
  black: ["#2c2926", "#141210", "#060505"],
  brown: ["#6b4a33", "#46301f", "#2a1b10"],
};

const BACKGROUNDS = {
  studio: { kind: "radial", stops: ["#f7f5f1", "#e9e6e0", "#d4d0c8"] },
  dark: { kind: "radial", stops: ["#2b2825", "#141312", "#070707"] },
  warm: { kind: "radial", stops: ["#a07c5c", "#6b4c35", "#2e2016"] },
  stone: { kind: "radial", stops: ["#a9a7a2", "#75736e", "#3c3b38"] },
};

/* --------------------------------------------------------------- helpers */

const f = (n) => Number(n.toFixed(2));

function gradientDefs(id, metal) {
  const m = METALS[metal];
  return `
  <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${m[0]}"/><stop offset=".28" stop-color="${m[1]}"/>
    <stop offset=".52" stop-color="${m[2]}"/><stop offset=".74" stop-color="${m[3]}"/>
    <stop offset="1" stop-color="${m[4]}"/>
  </linearGradient>
  <linearGradient id="${id}-r" x1="1" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="${m[0]}"/><stop offset=".3" stop-color="${m[1]}"/>
    <stop offset=".55" stop-color="${m[2]}"/><stop offset=".8" stop-color="${m[3]}"/>
    <stop offset="1" stop-color="${m[4]}"/>
  </linearGradient>
  <linearGradient id="${id}-c" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${m[1]}"/><stop offset=".5" stop-color="${m[0]}"/><stop offset="1" stop-color="${m[3]}"/>
  </linearGradient>
  <linearGradient id="${id}-h" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${m[2]}"/><stop offset=".22" stop-color="${m[1]}"/>
    <stop offset=".5" stop-color="${m[0]}"/><stop offset=".78" stop-color="${m[1]}"/>
    <stop offset="1" stop-color="${m[2]}"/>
  </linearGradient>`;
}

function background(bg) {
  const b = BACKGROUNDS[bg];
  return {
    defs: `<radialGradient id="bg" cx=".5" cy=".46" r=".75">
      <stop offset="0" stop-color="${b.stops[0]}"/><stop offset=".55" stop-color="${b.stops[1]}"/>
      <stop offset="1" stop-color="${b.stops[2]}"/></radialGradient>
      <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="${bg === "studio" ? 0.5 : 0.08}"/>
      <stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>`,
    body: `<rect x="-3000" y="-3000" width="7000" height="7000" fill="url(#bg)"/>
      <rect x="-3000" y="-3000" width="7000" height="7000" fill="url(#beam)"/>`,
  };
}

/* ----------------------------------------------------------------- straps */

function strap({ kind, tone }, caseMetal) {
  const top = { y: -200, h: 520 };
  const bottom = { y: 680, h: 520 };
  const w = 232;
  const x = 400 - w / 2;
  const parts = [];

  if (kind === "steel") {
    for (const seg of [top, bottom]) {
      parts.push(`<rect x="${x}" y="${seg.y}" width="${w}" height="${seg.h}" fill="url(#strap-h)"/>`);
      // centre polished links
      parts.push(`<rect x="${400 - 38}" y="${seg.y}" width="76" height="${seg.h}" fill="url(#strap-c)"/>`);
      for (let y = seg.y; y < seg.y + seg.h; y += 46) {
        parts.push(`<rect x="${x}" y="${y}" width="${w}" height="2.2" fill="#000" opacity=".28"/>`);
        parts.push(`<rect x="${x}" y="${y + 2.2}" width="${w}" height="1.2" fill="#fff" opacity=".35"/>`);
      }
      parts.push(`<rect x="${400 - 39}" y="${seg.y}" width="1.6" height="${seg.h}" fill="#000" opacity=".35"/>`);
      parts.push(`<rect x="${400 + 37.4}" y="${seg.y}" width="1.6" height="${seg.h}" fill="#000" opacity=".35"/>`);
    }
  } else if (kind === "mesh") {
    for (const seg of [top, bottom]) {
      parts.push(`<rect x="${x}" y="${seg.y}" width="${w}" height="${seg.h}" fill="url(#strap-h)"/>`);
      parts.push(`<rect x="${x}" y="${seg.y}" width="${w}" height="${seg.h}" fill="url(#mesh)"/>`);
      parts.push(`<rect x="${x}" y="${seg.y}" width="4" height="${seg.h}" fill="#000" opacity=".25"/>`);
      parts.push(`<rect x="${x + w - 4}" y="${seg.y}" width="4" height="${seg.h}" fill="#000" opacity=".25"/>`);
    }
  } else {
    for (const seg of [top, bottom]) {
      const lw = w - 10;
      const lx = 400 - lw / 2;
      parts.push(`<rect x="${lx}" y="${seg.y}" width="${lw}" height="${seg.h}" rx="18" fill="url(#leather)"/>`);
      parts.push(`<rect x="${lx + 11}" y="${seg.y}" width="${lw - 22}" height="${seg.h}" rx="12" fill="none" stroke="${tone === "brown" ? "#c9a27a" : "#5d5852"}" stroke-width="1.6" stroke-dasharray="7 6" opacity=".7"/>`);
      parts.push(`<rect x="${lx}" y="${seg.y}" width="${lw}" height="${seg.h}" rx="18" fill="url(#grain)" opacity=".35"/>`);
    }
    // keeper loop on lower strap
    parts.push(`<rect x="${400 - w / 2 - 4}" y="905" width="${w + 8}" height="34" rx="6" fill="url(#leather)" stroke="#000" stroke-opacity=".35"/>`);
  }

  const strapMetal = kind === "leather" ? null : caseMetal;
  const leather = LEATHER[tone] ?? LEATHER.black;
  const defs = `
    ${strapMetal ? gradientDefs("strap", strapMetal) : ""}
    <linearGradient id="leather" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${leather[2]}"/><stop offset=".25" stop-color="${leather[1]}"/>
      <stop offset=".5" stop-color="${leather[0]}"/><stop offset=".75" stop-color="${leather[1]}"/>
      <stop offset="1" stop-color="${leather[2]}"/></linearGradient>
    <pattern id="mesh" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="6" height="6" fill="none"/><line x1="0" y1="0" x2="0" y2="6" stroke="#000" stroke-opacity=".22" stroke-width="1.6"/>
      <line x1="3" y1="0" x2="3" y2="6" stroke="#fff" stroke-opacity=".18" stroke-width="1"/></pattern>
    <pattern id="grain" width="9" height="9" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="3" r=".9" fill="#000" fill-opacity=".5"/><circle cx="6.5" cy="7" r=".7" fill="#fff" fill-opacity=".12"/></pattern>`;
  return { defs, body: parts.join("\n") };
}

/* ------------------------------------------------------------------ watch */

function hand(points, angle, fillA, fillB) {
  // two-tone faceted hand: left half lighter, right half darker
  const [tip, side, tail] = points;
  return `<g transform="translate(400 500) rotate(${angle})">
    <polygon points="0,${-tip} ${-side},0 0,${tail}" fill="${fillA}"/>
    <polygon points="0,${-tip} ${side},0 0,${tail}" fill="${fillB}"/></g>`;
}

function watch(spec) {
  const { metal, dial, type, date = false } = spec;
  const d = DIALS[dial];
  const markerFill = metal === "gold" ? "url(#metal)" : dial === "black" ? "#e9e6e1" : "url(#metal-r)";
  const out = [];

  // lugs
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      const lx = 400 + sx * 108 - 14;
      const ly = sy < 0 ? 270 : 672;
      out.push(`<rect x="${lx}" y="${ly}" width="28" height="58" rx="10" fill="url(#metal)"/>`);
    }
  }

  // pushers (chronograph)
  if (type === "chrono") {
    for (const a of [-38, 38]) {
      out.push(`<g transform="translate(400 500) rotate(${a})"><rect x="214" y="-11" width="30" height="22" rx="4" fill="url(#metal-h)"/></g>`);
    }
  }

  // crown
  out.push(`<rect x="606" y="474" width="20" height="52" rx="5" fill="url(#metal-r)"/>`);
  out.push(`<rect x="620" y="468" width="30" height="64" rx="7" fill="url(#metal-h)"/>`);
  for (let y = 474; y < 528; y += 6) out.push(`<rect x="621" y="${y}" width="28" height="1.6" fill="#000" opacity=".28"/>`);

  // case & bezel
  out.push(`<circle cx="400" cy="500" r="222" fill="url(#metal)"/>`);
  out.push(`<circle cx="400" cy="500" r="222" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="2"/>`);
  out.push(`<circle cx="400" cy="500" r="206" fill="url(#metal-r)"/>`);
  out.push(`<circle cx="400" cy="500" r="196" fill="#000" opacity=".55"/>`);

  // dial
  out.push(`<circle cx="400" cy="500" r="192" fill="url(#dial)"/>`);
  out.push(`<circle cx="400" cy="500" r="192" fill="url(#sunray)" opacity="${dial === "black" ? 0.5 : 0.35}"/>`);

  // minute track
  if (type !== "minimal") {
    for (let i = 0; i < 60; i++) {
      if (i % 5 === 0) continue;
      out.push(`<rect x="-0.8" y="-184" width="1.6" height="9" fill="${d.ink}" opacity=".55" transform="translate(400 500) rotate(${i * 6})"/>`);
    }
  }

  // hour markers
  for (let i = 0; i < 12; i++) {
    if (date && i === 3 && type !== "chrono") continue;
    if (type === "chrono" && (i === 3 || i === 9 || i === 6)) continue;
    if (type === "minimal" && i % 3 !== 0) {
      out.push(`<circle cx="400" cy="${500 - 168}" r="2.6" fill="${markerFill}" transform="rotate(${i * 30} 400 500)"/>`);
      continue;
    }
    const major = i % 3 === 0;
    const w = type === "minimal" ? 3.4 : major ? 11 : 7;
    const len = type === "minimal" ? 26 : major ? 40 : 30;
    if (i === 0 && type !== "minimal") {
      for (const off of [-9, 9]) {
        out.push(`<rect x="${f(off - 4.5)}" y="-180" width="9" height="${len + 4}" rx="1.5" fill="${markerFill}" transform="translate(400 500)"/>`);
      }
      continue;
    }
    out.push(`<rect x="${f(-w / 2)}" y="-180" width="${w}" height="${len}" rx="1.5" fill="${markerFill}" transform="translate(400 500) rotate(${i * 30})"/>`);
  }

  // sub-dials (chronograph)
  if (type === "chrono") {
    for (const [cx, cy] of [[315, 500], [485, 500], [400, 590]]) {
      out.push(`<circle cx="${cx}" cy="${cy}" r="44" fill="${d.sub}"/>`);
      out.push(`<circle cx="${cx}" cy="${cy}" r="44" fill="none" stroke="${d.ink}" stroke-opacity=".5" stroke-width="1.4"/>`);
      for (let i = 0; i < 12; i++) {
        out.push(`<rect x="-.7" y="${-42}" width="1.4" height="${i % 3 === 0 ? 8 : 5}" fill="${d.ink}" opacity=".7" transform="translate(${cx} ${cy}) rotate(${i * 30})"/>`);
      }
      out.push(`<rect x="-1.3" y="-34" width="2.6" height="38" rx="1.3" fill="${d.ink}" transform="translate(${cx} ${cy}) rotate(${(cx * 7 + cy) % 360})"/>`);
      out.push(`<circle cx="${cx}" cy="${cy}" r="3.4" fill="${d.ink}"/>`);
    }
  }

  // date window
  if (date && type !== "chrono") {
    out.push(`<rect x="512" y="486" width="40" height="28" rx="2" fill="url(#metal-r)"/>`);
    out.push(`<rect x="515" y="489" width="34" height="22" rx="1" fill="#f7f5f0"/>`);
    out.push(`<text x="532" y="506" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="15" font-weight="600" fill="#151515">28</text>`);
  }

  // wordmark
  const logoY = type === "chrono" ? 415 : 420;
  out.push(`<text x="400" y="${logoY}" text-anchor="middle" font-family="Didot, 'Bodoni 72', 'Playfair Display', Georgia, serif" font-size="${type === "minimal" ? 24 : 27}" letter-spacing="5" fill="${metal === "gold" && dial === "black" ? "#d9b88f" : d.ink}">VÉLOR</text>`);

  // hands — 10:10 presentation
  const handA = dial === "black" ? "#f4f2ee" : metal === "gold" ? "#c79c6f" : "#3a3836";
  const handB = dial === "black" ? "#a8a49e" : metal === "gold" ? "#8e6642" : "#151413";
  out.push(hand([112, 9, 18], 305, handA, handB));
  out.push(hand([164, 7.5, 20], 60, handA, handB));
  if (type !== "minimal") {
    const sec = metal === "gold" ? "#c79c6f" : "#a78b63";
    out.push(`<g transform="translate(400 500) rotate(198)"><rect x="-1.1" y="-176" width="2.2" height="214" fill="${sec}"/><circle cx="0" cy="26" r="6" fill="${sec}"/></g>`);
  }
  out.push(`<circle cx="400" cy="500" r="9" fill="url(#metal)"/><circle cx="400" cy="500" r="3" fill="#111"/>`);

  // crystal reflection
  out.push(`<g clip-path="url(#dialclip)"><ellipse cx="300" cy="380" rx="260" ry="120" transform="rotate(-38 300 380)" fill="url(#glass)"/></g>`);
  out.push(`<circle cx="400" cy="500" r="192" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="2"/>`);

  const defs = `
    ${gradientDefs("metal", metal)}
    <radialGradient id="dial" cx=".42" cy=".38" r=".75">
      <stop offset="0" stop-color="${d.stops[0]}"/><stop offset=".6" stop-color="${d.stops[1]}"/>
      <stop offset="1" stop-color="${d.stops[2]}"/></radialGradient>
    <radialGradient id="sunray" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".85" stop-color="#fff" stop-opacity=".04"/>
      <stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <clipPath id="dialclip"><circle cx="400" cy="500" r="192"/></clipPath>`;
  return { defs, body: out.join("\n") };
}

/* ------------------------------------------------------------- composing */

function compose({ spec, bg, viewBox = "0 0 800 1000", rotate = 0, scale = 1, translate = [0, 0], shadow = true }) {
  const b = background(bg);
  const s = strap(spec.strap, spec.metal);
  const w = watch(spec);
  const sc = scale * (spec.petite ? 0.88 : 1);
  const transform = `translate(${translate[0]} ${translate[1]}) translate(400 500) rotate(${rotate}) scale(${sc}) translate(-400 -500)`;
  const [, , vw, vh] = viewBox.split(" ").map(Number);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${vw}" height="${vh}" viewBox="${viewBox}" preserveAspectRatio="xMidYMid slice">
  <defs>${b.defs}${s.defs}${w.defs}
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="26" stdDeviation="26" flood-color="#000" flood-opacity="${bg === "studio" ? 0.26 : 0.6}"/></filter>
  </defs>
  ${b.body}
  <g transform="${transform}" ${shadow ? 'filter="url(#shadow)"' : ""}>
    ${s.body}
    ${w.body}
  </g>
</svg>`;
}

function write(rel, svg) {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, svg.replace(/\n\s*\n/g, "\n"));
  count += 1;
}
let count = 0;

/* ---------------------------------------------------------------- catalog */
// Must mirror src/data/products.ts (colors / straps / visual type).
const CATALOG = [
  {
    // Real photography supplied (public/images/products/velor-classic/{color}/) — spec kept for editorial art only.
    slug: "velor-classic", type: "classic", date: true, leather: "black", photographed: true,
    colors: { silver: ["silver", "black"], black: ["black", "black"], gold: ["gold", "ivory"] },
    straps: ["steel", "leather", "mesh"],
  },
  {
    // Real photography supplied (public/images/products/velor-chrono/{black,silver}/) — spec kept for editorial art only.
    slug: "velor-chrono", type: "chrono", leather: "black", photographed: true,
    colors: { black: ["black", "black"], silver: ["silver", "black"] },
    straps: ["steel", "leather"],
  },
  {
    // Real photography supplied (public/images/products/velor-minimal/{silver,black}/) — spec kept for editorial art only.
    slug: "velor-minimal", type: "minimal", leather: "black", photographed: true,
    colors: { silver: ["silver", "ivory"], gold: ["gold", "ivory"], black: ["black", "black"] },
    straps: ["leather", "mesh"],
  },
  {
    // Real photography supplied (public/images/products/velor-royale/) — spec kept for editorial art only.
    slug: "velor-royale", type: "classic", date: true, petite: true, leather: "black", photographed: true,
    colors: { gold: ["gold", "black"], silver: ["silver", "champagne"] },
    straps: ["steel"],
  },
  {
    slug: "velor-heritage", type: "chrono", leather: "brown",
    colors: { black: ["black", "black"], silver: ["silver", "ivory"] },
    straps: ["leather", "steel"],
  },
  {
    slug: "velor-luna", type: "minimal", petite: true, leather: "brown",
    colors: { gold: ["gold", "ivory"], silver: ["silver", "ivory"] },
    straps: ["leather", "mesh"],
  },
];

function specFor(p, color, strapKind) {
  const [metal, dial] = p.colors[color];
  return {
    metal, dial, type: p.type, date: p.date, petite: p.petite,
    strap: { kind: strapKind, tone: strapKind === "leather" ? p.leather : metal },
  };
}

for (const p of CATALOG) {
  if (p.photographed) continue;
  for (const color of Object.keys(p.colors)) {
    for (const strapKind of p.straps) {
      const spec = specFor(p, color, strapKind);
      write(`products/${p.slug}/${color}-${strapKind}-front.svg`, compose({ spec, bg: "studio", scale: 1.2 }));
      write(`products/${p.slug}/${color}-${strapKind}-dark.svg`, compose({ spec, bg: "dark", rotate: -14, scale: 1.1 }));
      write(`products/${p.slug}/${color}-${strapKind}-wrist.svg`, compose({ spec, bg: "stone", rotate: 72, scale: 1.0 }));
    }
    const spec = specFor(p, color, p.straps[0]);
    write(`products/${p.slug}/${color}-detail.svg`, compose({ spec, bg: "dark", viewBox: "330 300 340 425", shadow: false }));
  }
}

/* ------------------------------------------------------------ collections */
const byslug = Object.fromEntries(CATALOG.map((p) => [p.slug, p]));
const collections = [
  ["men", specFor(byslug["velor-classic"], "silver", "steel"), "dark"],
  ["women", specFor(byslug["velor-royale"], "gold", "steel"), "warm"],
  ["chronograph", specFor(byslug["velor-chrono"], "black", "steel"), "dark"],
  ["minimal", specFor(byslug["velor-minimal"], "silver", "leather"), "stone"],
];
for (const [name, spec, bg] of collections) {
  write(`collections/${name}.svg`, compose({ spec, bg, rotate: -18, scale: 1.08, translate: [30, 30] }));
}

/* -------------------------------------------------------------- editorial */
const classic = specFor(byslug["velor-classic"], "silver", "steel");
// editorial/precision.svg retired: the homepage uses the supplied photo editorial/velor-precision-macro.png
write("editorial/material-case.svg", compose({ spec: classic, bg: "dark", viewBox: "160 260 300 375", rotate: 0, shadow: false }));
write("editorial/material-dial.svg", compose({ spec: specFor(byslug["velor-chrono"], "black", "steel"), bg: "dark", viewBox: "260 380 280 350", shadow: false }));
write("editorial/material-strap.svg", compose({ spec: specFor(byslug["velor-heritage"], "black", "leather"), bg: "dark", viewBox: "250 660 300 375", shadow: false }));
write("editorial/craft-wide.svg", compose({ spec: specFor(byslug["velor-royale"], "gold", "steel"), bg: "warm", viewBox: "-300 250 1400 700", rotate: -22, scale: 0.9, translate: [180, 0] }));
write("editorial/about-portrait.svg", compose({ spec: specFor(byslug["velor-heritage"], "silver", "leather"), bg: "stone", rotate: -10, scale: 0.95 }));

/* ------------------------------------------------------------ hero poster */
write("hero/hero-poster.svg", compose({ spec: classic, bg: "dark", viewBox: "-900 -40 1920 1080", rotate: -16, scale: 1.05, translate: [180, 0] }));
write("hero/hero-poster-mobile.svg", compose({ spec: classic, bg: "dark", viewBox: "60 80 680 1210", rotate: -16, scale: 0.95, translate: [0, -40] }));

console.log(`Generated ${count} placeholder SVGs in public/images`);
