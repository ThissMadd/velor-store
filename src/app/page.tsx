import { Hero } from "@/components/home/Hero";
import { FeatureStrip } from "@/components/home/FeatureStrip";
import { SignatureCollection } from "@/components/home/SignatureCollection";
import { BrandStory } from "@/components/home/BrandStory";
import { Editorial } from "@/components/home/Editorial";

export default function HomePage() {
  return (
    // Homepage runs on a black canvas; other pages keep the ivory theme.
    <div className="home-dark bg-[#0B0B0B] text-ivory">
      <Hero />
      <FeatureStrip />
      <SignatureCollection />
      <BrandStory />
      <Editorial />
    </div>
  );
}
