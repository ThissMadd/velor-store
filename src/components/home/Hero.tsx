"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;
const POSTER = "/images/hero/hero-poster.svg";
const POSTER_MOBILE = "/images/hero/hero-poster-mobile.svg";
const VIDEO = "/videos/velor-hero.mp4";

/** Entrance timeline: eyebrow 300ms → heading 500ms → description 800ms → buttons 1000ms. */
const DELAYS = [0.3, 0.5, 0.8, 1.0];
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE, delay: DELAYS[i] } }),
};

/**
 * Cinematic autoplay hero. The VÉLOR watch film loops silently behind the existing copy.
 * It pauses whenever the hero is off-screen and resumes when it returns; reduced-motion and
 * Save-Data visitors get the film's first frame as a still instead of playback.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const still = Boolean(reduceMotion || conn?.saveData);

    if (still) {
      video.pause();
      video.currentTime = 0;
      return;
    }

    const tryPlay = () => {
      video.play().catch(() => {
        /* autoplay blocked — the first frame / poster stays visible */
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) tryPlay();
        else video.pause();
      },
      { threshold: 0.15 },
    );
    observer.observe(section);

    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <section ref={sectionRef} aria-labelledby="hero-title" className="relative isolate h-[100svh] min-h-[600px] overflow-hidden bg-[#050505] text-ivory md:min-h-[680px]">
      {/* Fallback art shown until the first video frame is decoded */}
      <picture>
        <source media="(max-width: 767px)" srcSet={POSTER_MOBILE} />
        <img src={POSTER} alt="" aria-hidden fetchPriority="high" className="absolute inset-0 -z-30 size-full object-cover object-[70%_center] md:object-center" />
      </picture>

      {/*
        Video layer. Desktop/tablet: full-bleed cover; the watch sits centre-right in the film.
        Mobile: a tall band in the upper part of the screen so the 16:9 frame is only trimmed at the
        sides, softened top and bottom so it melts into the black.
      */}
      <div className="absolute inset-x-0 top-[9%] -z-20 h-[60%] bg-[#050505] md:inset-0 md:h-full">
        <video
          ref={videoRef}
          src={VIDEO}
          className={`size-full object-cover object-[68%_center] transition-opacity duration-[1200ms] ease-(--ease-luxe) md:object-center ${visible ? "opacity-100" : "opacity-0"}`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden
          tabIndex={-1}
          onLoadedData={() => setVisible(true)}
        />
        <div aria-hidden className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-[#050505] to-transparent md:hidden" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#050505] to-transparent md:hidden" />
      </div>

      {/* Readability overlays — left-to-right on desktop, bottom-weighted on mobile */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent md:bg-gradient-to-r md:from-[#050505]/90 md:via-[#050505]/40 md:via-45% md:to-transparent" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-48 bg-gradient-to-b from-[#050505]/70 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#050505]/80 to-transparent" />

      <div className="container-luxe flex h-full flex-col justify-end pb-20 md:justify-center md:pt-[108px] md:pb-0">
        <div className="max-w-xl">
          <motion.p custom={0} initial="hidden" animate="visible" variants={item} className="mb-6 flex items-center gap-4 text-champagne">
            <span aria-hidden className="h-px w-12 bg-current" />
            <span className="eyebrow">The VÉLOR Collection</span>
          </motion.p>
          <motion.h1
            id="hero-title"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={item}
            className="font-serif text-[clamp(3rem,8.5vw,6.5rem)] leading-[0.95] font-normal tracking-[0.01em] uppercase"
          >
            Timeless
            <br />
            Elegance
          </motion.h1>
          <motion.p custom={2} initial="hidden" animate="visible" variants={item} className="mt-6 text-lg text-ivory/80 md:text-xl">
            Crafted for Every Moment.
          </motion.p>
          <motion.div custom={3} initial="hidden" animate="visible" variants={item} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className="btn btn-light">
              Explore Collection <ArrowRight className="btn-arrow size-4" />
            </Link>
            <Link href="/about" className="btn btn-outline-light">
              Our Story
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute right-5 bottom-6 hidden items-center gap-3 text-[0.65rem] tracking-[0.3em] text-ivory/60 uppercase sm:right-8 md:flex lg:right-12"
      >
        Scroll
        <span className="relative block h-10 w-px overflow-hidden bg-ivory/20">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.4s_ease-in-out_infinite] bg-[#C8A46A] motion-reduce:hidden" />
        </span>
      </motion.div>
    </section>
  );
}
