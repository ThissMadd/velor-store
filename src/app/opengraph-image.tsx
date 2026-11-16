import { ImageResponse } from "next/og";

export const alt = "VÉLOR — Timeless Elegance (portfolio concept)";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Generated Open Graph placeholder. Replace with a real hero still when available (see ASSETS.md). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "radial-gradient(circle at 75% 45%, #2b2825 0%, #0b0b0b 60%)",
          color: "#F6F4F0",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 12, color: "#A78B63" }}>VÉLOR</div>
        <div style={{ fontSize: 92, lineHeight: 1, marginTop: 28, letterSpacing: 2 }}>TIMELESS</div>
        <div style={{ fontSize: 92, lineHeight: 1, letterSpacing: 2 }}>ELEGANCE</div>
        <div style={{ fontSize: 30, marginTop: 28, color: "#D6D2CB" }}>Crafted for Every Moment.</div>
        <div style={{ fontSize: 20, marginTop: 48, color: "#8f8a82", fontFamily: "sans-serif" }}>
          Portfolio concept by Madd Agency · Fictional brand
        </div>
      </div>
    ),
    size,
  );
}
