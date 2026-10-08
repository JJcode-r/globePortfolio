import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import type { RefObject } from 'react';

interface ColorMapItem {
  bg: string;
  text: string;
  sun: string;
  glow: string;
  moonOpacity: number;
}

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const colorMap: ColorMapItem[] = [
  {
    bg: '#ffffff',
    text: '#000000',
    sun: '#fff7c2',
    glow: 'rgba(255, 245, 200, 0.6)',
    moonOpacity: 0,
  },
  {
    bg: '#ffffff',
    text: '#000000',
    sun: '#fff7c2',
    glow: 'rgba(255, 245, 200, 0.6)',
    moonOpacity: 0,
  },
  {
    bg: '#ffffff',
    text: '#000000',
    sun: '#fff7c2',
    glow: 'rgba(255, 245, 200, 0.6)',
    moonOpacity: 0,
  },
  {
    bg: '#ffffff',
    text: '#000000',
    sun: '#fff7c2',
    glow: 'rgba(255, 245, 200, 0.6)',
    moonOpacity: 0,
  },
  {
    bg: '#ffffff',
    text: '#000000',
    sun: '#fff7c2',
    glow: 'rgba(255, 245, 200, 0.6)',
    moonOpacity: 0,
  },
  {
    bg: '#0D1B2A',
    text: '#ffffff',
    sun: '#0D1B2A',
    glow: 'rgba(13,27,42,0.4)',
    moonOpacity: 1,
  },
  {
    bg: '#0D1B2A',
    text: '#ffffff',
    sun: '#0D1B2A',
    glow: 'rgba(13,27,42,0.4)',
    moonOpacity: 1,
  },
];

function safeQuery(selector: string) {
  try {
    return document.querySelector(selector) as HTMLElement | null;
  } catch {
    return null;
  }
}

const computeSunArcPath = () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return [
    {
      x: Math.max(40, Math.round(w * 0.08)),
      y: Math.max(60, Math.round(h * 0.14)),
    },
    { x: Math.round(w * 0.5), y: Math.max(40, Math.round(h * 0.09)) },
    {
      x: Math.max(120, Math.round(w * 0.92)),
      y: Math.max(120, Math.round(h * 0.32)),
    },
  ];
};

const computeTopLeftAnchor = () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return {
    x: Math.max(36, Math.round(w * 0.1)),
    y: Math.max(28, Math.round(h * 0.06)),
  };
};

const computeBirdsPath = () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return [
    { x: w + 200, y: Math.round(h * 0.28) },
    { x: Math.round(w * 0.72), y: Math.max(40, Math.round(h * 0.12)) },
    { x: Math.round(w * 0.28), y: Math.round(h * 0.22) },
    { x: -200, y: Math.round(h * 0.32) },
  ];
};

export function setupGsapAnimations(
  sunRef: RefObject<HTMLDivElement | null>,
  moonRef: RefObject<HTMLDivElement | null>,
  heroTitleRef: RefObject<HTMLHeadingElement | null>,
  heroSubtitleRef: RefObject<HTMLParagraphElement | null>,
  sections: HTMLElement[]
) {
  if (
    !sunRef?.current ||
    !moonRef?.current ||
    !heroTitleRef?.current ||
    !heroSubtitleRef?.current
  )
    return;

  // refreshInit listeners are removed in cleanup; otherwise they stack on every mount
  const refreshCleanups: Array<() => void> = [];
  const onRefresh = (fn: () => void) => {
    ScrollTrigger.addEventListener('refreshInit', fn);
    refreshCleanups.push(() => ScrollTrigger.removeEventListener('refreshInit', fn));
  };

  const sun = sunRef.current!;
  const moon = moonRef.current!;
  const heroTitle = heroTitleRef.current!;
  const heroSubtitle = heroSubtitleRef.current!;
  const navbar = safeQuery('.navbar');
  const menuToggle = safeQuery('.menu-toggle');
  const birds = safeQuery('.birds');
  const initialBirdPos = computeBirdsPath()[0];

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // ─── Initial states ────────────────────────────────────────────────────────
  //
  // Sun starts as a VISIBLE grey circle dead-centre of the viewport.
  // zIndex 10 during the intro so it appears above the hero's background;
  // it drops to 0 after landing so section content (z-index 1) sits above it.
  //
  gsap.set(sun, {
    position: 'fixed',
    left: '50%',
    top: '50vh',
    xPercent: -50,
    yPercent: -50,
    width: 112,
    height: 112,
    borderRadius: '50%',
    backgroundColor: '#9ca3af', // grey on load
    boxShadow: '0 0 0 rgba(0,0,0,0)',
    opacity: 1, // VISIBLE immediately
    scale: 1,
    zIndex: 10, // above hero bg during intro
    willChange: 'transform, left, top, background-color, box-shadow',
  });

  gsap.set(moon, {
    position: 'fixed',
    width: 92,
    height: 92,
    borderRadius: '50%',
    zIndex: 0,
    left: 0,
    top: 0,
    opacity: 0,
    transformOrigin: '50% 50%',
    background:
      'radial-gradient(circle at 35% 34%, rgba(255,255,255,0.96) 0%, rgba(250,250,250,0.92) 28%, rgba(235,235,235,0.88) 55%, rgba(220,220,220,0.82) 100%),' +
      'radial-gradient(circle at 62% 56%, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0) 30%),' +
      'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0) 60%)',
    boxShadow:
      '0 14px 32px rgba(0,0,0,0.14), inset 0 -6px 18px rgba(0,0,0,0.04)',
  });

  if (birds) {
    gsap.set(birds, {
      position: 'fixed',
      x: initialBirdPos.x,
      y: initialBirdPos.y,
      zIndex: 0,
      willChange: 'transform, opacity',
      opacity: 0,
      scale: window.innerWidth < 768 ? 0.6 : 1,
    });
    if (!reduceMotion) {
      // Organic wing-flap — runs continuously once birds are visible
      gsap.to(birds, {
        scaleY: 0.82,
        repeat: -1,
        yoyo: true,
        duration: 0.19,
        ease: 'sine.inOut',
        transformOrigin: '50% 50%',
      });
    }
  }

  // Hero title & subtitle start hidden; gsapUtils animates them in AFTER sun lands.
  // Hero.tsx owns the portrait / social / CTA animations.
  gsap.set(heroTitle, { opacity: 0, y: 40 });
  gsap.set(heroSubtitle, { opacity: 0, y: 30 });

  // ─── Utilities ─────────────────────────────────────────────────────────────

  const setMoonVisibilityForIndex = (index: number) => {
    const map = colorMap[Math.max(0, Math.min(index, colorMap.length - 1))];
    if (map.moonOpacity > 0) {
      gsap.to(moon, {
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        overwrite: true,
      });
      gsap.to(moon, {
        boxShadow:
          '0 14px 48px rgba(180,180,255,0.5), 0 0 90px rgba(200,200,255,0.2)',
        duration: 1.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    } else {
      gsap.to(moon, {
        opacity: 0,
        duration: 0.6,
        ease: 'power3.in',
        overwrite: true,
      });
    }
  };

  const topLeft = computeTopLeftAnchor();

  const setupSunScrollScrub = () => {
    gsap.to(sun, {
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        invalidateOnRefresh: true,
      },
      motionPath: { path: computeSunArcPath(), curviness: 1.6 },
      ease: 'none',
      immediateRender: false,
    });
  };

  // Gentle sun breathing — starts after intro lands
  const startSunBreathing = () => {
    if (reduceMotion) return;
    gsap.to(sun, {
      scale: 1.055,
      repeat: -1,
      yoyo: true,
      duration: 3.8,
      ease: 'sine.inOut',
      overwrite: false,
    });
    // Glow pulses on the same rhythm as the scale, so the sun reads as a
    // light source radiating heat rather than a flat, static disc. Day
    // sections share one glow colour, so section-change tweens (applyMap)
    // land on a value inside this range instead of fighting it.
    gsap.to(sun, {
      boxShadow: `0 0 130px ${colorMap[0].glow}`,
      repeat: -1,
      yoyo: true,
      duration: 3.8,
      ease: 'sine.inOut',
      overwrite: false,
    });
  };

  const onResize = () => {
    ScrollTrigger.refresh();
    if (birds) {
      gsap.to(birds, {
        scale: window.innerWidth < 768 ? 0.6 : 1,
        duration: 0.3,
        overwrite: 'auto',
      });
    }
  };

  // ─── Reduced-motion path (snap to final state) ─────────────────────────────
  if (reduceMotion) {
    gsap.set(sun, {
      left: topLeft.x,
      top: topLeft.y,
      xPercent: 0,
      yPercent: 0,
      opacity: 1,
      scale: 1,
      zIndex: 0,
      backgroundColor: colorMap[0].sun,
      boxShadow: `0 0 120px ${colorMap[0].glow}`,
    });
    gsap.set(heroTitle, { opacity: 1, y: 0 });
    gsap.set(heroSubtitle, { opacity: 1, y: 0 });
    setupSunScrollScrub();
    window.addEventListener('resize', onResize);
    return;
  }

  // ─── Full intro sequence ────────────────────────────────────────────────────
  //
  // 1. Sun (grey, centred) → moves to top-left  → turns yellow   (0 – 2.3 s)
  // 2. Hero title & subtitle animate in                           (2.3 s +)
  // 3. Sun z-index drops to 0, scroll-scrub + breathing start
  //
  const sunIntroTimeline = gsap.timeline({
    defaults: { ease: 'power4.out' },
    onComplete: () => {
      // Drop sun behind section content once it has landed
      gsap.set(sun, { zIndex: 0 });
      setupSunScrollScrub();
      startSunBreathing();
      window.addEventListener('resize', onResize);
    },
  });

  sunIntroTimeline
    // Move from centre to top-left
    .to(sun, {
      left: topLeft.x,
      top: topLeft.y,
      xPercent: 0,
      yPercent: 0,
      duration: 2.6,
      ease: 'expo.inOut',
    })
    // Colour transition: grey → warm yellow (overlaps with position tween)
    .to(sun, { backgroundColor: colorMap[0].sun, duration: 1.8, ease: 'power2.out' }, '-=1.9')
    // Glow builds as colour warms
    .to(
      sun,
      { boxShadow: `0 0 140px ${colorMap[0].glow}`, duration: 1.8, ease: 'power2.out' },
      '-=1.6'
    );

  // Hero text animates in right after sun lands (sequenced via ">")
  const heroTextTimeline = gsap.timeline({
    defaults: { ease: 'expo.out', duration: 1.4 },
  });
  heroTextTimeline
    .to(heroTitle, { opacity: 1, y: 0 })
    .to(heroSubtitle, { opacity: 1, y: 0, duration: 1.2 }, '<0.3');

  sunIntroTimeline.add(heroTextTimeline, '-=0.5');

  // ─── Birds (appear only after hero section exits viewport) ─────────────────
  if (birds && sections.length >= 4) {
    const heroSection = sections[0];
    const flightEndSection = sections[2];

    const birdsTween = gsap.to(birds, {
      motionPath: { path: computeBirdsPath(), curviness: 1.3, align: 'self' },
      ease: 'none',
      paused: true,
      immediateRender: false,
    });

    ScrollTrigger.create({
      id: 'birds-main',
      trigger: heroSection,
      start: 'bottom top',
      endTrigger: flightEndSection,
      end: 'bottom top',
      scrub: 1.2,
      invalidateOnRefresh: true,
      onEnter: () =>
        gsap.to(birds, { opacity: 1, duration: 0.5, ease: 'power2.out' }),
      onLeaveBack: () =>
        gsap.to(birds, {
          opacity: 0,
          duration: 0.35,
          onComplete: () => {
            birdsTween.progress(0);
          },
        }),
      onUpdate: (self) => {
        birdsTween.progress(self.progress);
      },
      onRefresh: (self) => {
        const before = self.scroll() < self.start;
        const after = self.scroll() > self.end;
        if (before) {
          gsap.set(birds, { opacity: 0 });
          birdsTween.progress(0);
        } else if (after) {
          gsap.set(birds, { opacity: 0 });
          birdsTween.progress(1);
        } else {
          gsap.set(birds, { opacity: 1 });
          birdsTween.progress(self.progress);
        }
      },
    });

    onRefresh(() => {
      (birdsTween.vars.motionPath as { path: { x: number; y: number }[] }).path = computeBirdsPath();
      birdsTween.invalidate();
      const pos = computeBirdsPath()[0];
      gsap.set(birds, { x: pos.x, y: pos.y });
    });
  }

  // ─── Moon motion ─────────────────────────────────────────
  // The moon travels a quadratic arc through the night sections, in plain
  // viewport pixels. It is clamped inside the viewport and below the navbar,
  // so it cannot clip off the right edge or slide under the pill.
  const NIGHT_INDEX = 5; // testimonials: first section on the night ground
  const moonSection = sections[Math.min(NIGHT_INDEX, sections.length - 1)];
  const MOON_TOP = 128;
  let moonProgress = 0;

  const placeMoon = (t: number, animate = true) => {
    moonProgress = t;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const size = moon.offsetWidth || 92;
    const minX = 24;
    const maxX = Math.max(minX, w - size - 24);
    const maxY = Math.max(MOON_TOP, h - size - 24);
    const start = { x: maxX, y: MOON_TOP };
    const control = { x: w * 0.5, y: Math.min(maxY, h * 0.42) };
    const end = { x: minX, y: MOON_TOP };
    const u = 1 - t;
    const to = {
      x: Math.min(maxX, Math.max(minX, u * u * start.x + 2 * u * t * control.x + t * t * end.x)),
      y: Math.min(maxY, Math.max(MOON_TOP, u * u * start.y + 2 * u * t * control.y + t * t * end.y)),
    };
    if (animate) gsap.to(moon, { ...to, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
    else gsap.set(moon, to);
  };

  if (moonSection) {
    placeMoon(0, false);
    onRefresh(() => placeMoon(moonProgress, false));

    ScrollTrigger.create({
      trigger: moonSection,
      start: 'top center',
      end: 'bottom center',
      invalidateOnRefresh: true,
      onEnter: (self) => {
        setMoonVisibilityForIndex(NIGHT_INDEX);
        placeMoon(self.progress, false);
        gsap.fromTo(
          moon,
          { scale: 0.85 },
          { scale: 1, duration: 1.4, ease: 'back.out(1.2)', overwrite: 'auto' }
        );
      },
      onUpdate: (self) => placeMoon(self.progress),
      onLeave: () => {
        placeMoon(1);
        setMoonVisibilityForIndex(NIGHT_INDEX);
      },
      onEnterBack: (self) => {
        setMoonVisibilityForIndex(NIGHT_INDEX);
        placeMoon(self.progress, false);
      },
      onLeaveBack: () => {
        gsap.to(moon, { opacity: 0, duration: 0.8, ease: 'power3.in', overwrite: 'auto' });
      },
    });
  } else {
    gsap.set(moon, { opacity: 0 });
  }

  // ─── Section colour transitions ────────────────────────────────────────────
  sections.forEach((sec, i) => {
    const applyMap = (index: number) => {
      const map = colorMap[Math.max(0, Math.min(index, colorMap.length - 1))];
      gsap.to(document.body, {
        backgroundColor: map.bg,
        color: map.text,
        duration: 0.85,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(sun, {
        backgroundColor: map.sun,
        boxShadow: `0 0 60px ${map.glow}`,
        duration: 0.85,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(sun, {
        opacity: 1 - map.moonOpacity,
        duration: 0.85,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      setMoonVisibilityForIndex(index);

      if (navbar) {
        navbar.classList.toggle('dark', index >= colorMap.length - 1);
      }
      if (menuToggle) {
        menuToggle.classList.toggle('dark', index >= colorMap.length - 1);
      }

      window.dispatchEvent(
        new CustomEvent('themeChange', {
          detail: index >= colorMap.length - 2 ? 'night' : 'day',
        })
      );

      if (index >= 3 && birds) {
        gsap.to(birds, { opacity: 0, duration: 0.5, overwrite: true });
      }
    };

    ScrollTrigger.create({
      trigger: sec,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => applyMap(i),
      onLeave: () => applyMap(Math.min(i + 1, colorMap.length - 1)),
      onEnterBack: () => applyMap(i),
      onLeaveBack: () => applyMap(Math.max(i - 1, 0)),
      markers: false,
    });
  });

  // Subtle section fade-ins
  sections.slice(1).forEach((sec) => {
    gsap.from(sec, {
      opacity: 0,
      y: 30,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sec,
        start: 'top 80%',
        invalidateOnRefresh: true,
      },
    });
  });

  // ─── Cleanup ───────────────────────────────────────────────────────────────
  return () => {
    refreshCleanups.forEach((off) => off());
    ScrollTrigger.getAll().forEach((t) => t.kill());
    gsap.killTweensOf([sun, moon, heroTitle, heroSubtitle]);
    if (birds) gsap.killTweensOf(birds);
    window.removeEventListener('resize', onResize);
  };
}
