"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Img } from "@/components/ui/Img";

const EASE = [0.22, 1, 0.36, 1] as const;
/** First frame of the film — identical to what the video shows at t=0, so the swap is invisible. */
const POSTER = "/images/posters/hero.jpg";
/** Web-optimised copies of /videos/velor-hero.mp4: no audio, index at the start (streams immediately). */
const VIDEO_DESKTOP = "/videos/opt/hero-1080.mp4";
const VIDEO_MOBILE = "/videos/opt/hero-720.mp4";

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
/** Length of the dissolve between the end of the film and its beginning. */
const CROSSFADE_S = 1.2;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  // Two copies of the same film: while one finishes, the other starts from frame 0 and dissolves in.
  const videoA = useRef<HTMLVideoElement>(null);
  const videoB = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [src, setSrc] = useState<string | undefined>(undefined);

  // Pick the lighter 720p file on phones; decided on the client so nothing is fetched twice.
  useEffect(() => {
    setSrc(window.matchMedia("(max-width: 767px)").matches ? VIDEO_MOBILE : VIDEO_DESKTOP);
  }, []);

  useEffect(() => {
    const a = videoA.current;
    const b = videoB.current;
    const section = sectionRef.current;
    if (!a || !b || !section || !src) return;

    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (reduceMotion || conn?.saveData) {
      a.pause();
      b.pause();
      a.currentTime = 0;
      return;
    }

    let active = a;
    let standby = b;
    let fading = false;
    let onScreen = false;
    let raf = 0;
    let swapTimer = 0;

    const show = (v: HTMLVideoElement, on: boolean) => {
      v.style.opacity = on ? "1" : "0";
    };
    show(a, true);
    show(b, false);

    const play = (v: HTMLVideoElement) => v.play().catch(() => {});

    // Watch the active film; just before it ends, start the standby copy from the beginning
    // and dissolve it in, then swap roles. Nothing ever pauses or jumps back visibly.
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (fading || !onScreen) return;
      const d = active.duration;
      if (!Number.isFinite(d) || d <= CROSSFADE_S * 2) return;
      if (active.currentTime >= d - CROSSFADE_S) {
        fading = true;
        standby.currentTime = 0;
        play(standby);
        show(standby, true);
        show(active, false);
        const finished = active;
        swapTimer = window.setTimeout(() => {
          finished.pause();
          finished.currentTime = 0;
          active = standby;
          standby = finished;
          fading = false;
        }, CROSSFADE_S * 1000);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) {
          play(active);
          if (fading) play(standby);
        } else {
          a.pause();
          b.pause();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(section);
    raf = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(swapTimer);
    };
  }, [reduceMotion, src]);

  const videoClass =
    "absolute inset-0 size-full object-cover object-[68%_center] opacity-0 transition-opacity ease-in-out md:object-center";

  return (
    <section ref={sectionRef} aria-labelledby="hero-title" className="relative isolate h-[100svh] min-h-[600px] overflow-hidden bg-[#050505] text-ivory md:min-h-[680px]">
      {/*
        Video layer. Desktop/tablet: full-bleed cover; the watch sits centre-right in the film.
        Mobile: a tall band in the upper part of the screen so the 16:9 frame is only trimmed at the
        sides, softened top and bottom so it melts into the black.
      */}
      <div className="absolute inset-x-0 top-[9%] -z-20 h-[60%] bg-[#050505] md:inset-0 md:h-full">
        {/* Poster = the film's first frame, framed exactly like the video, painted instantly */}
        <Img
          src={POSTER}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          quality={80}
          className="object-cover object-[68%_center] md:object-center"
        />
        {/* Wrapper fades the whole film layer in once the first frame is decoded */}
        <div className={`absolute inset-0 transition-opacity duration-[1200ms] ease-(--ease-luxe) ${visible ? "opacity-100" : "opacity-0"}`}>
          {[videoA, videoB].map((ref, i) => (
            <video
              key={i}
              ref={ref}
              src={src}
              className={videoClass}
              style={{ transitionDuration: `${CROSSFADE_S * 1000}ms` }}
              autoPlay={i === 0}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              aria-hidden
              tabIndex={-1}
              onLoadedData={i === 0 ? () => setVisible(true) : undefined}
            />
          ))}
        </div>
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
