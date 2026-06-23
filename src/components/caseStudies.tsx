'use client';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';

type Metric = { value: string; label: string };

type CaseStudy = {
  id: string;
  index: string;
  category: string;
  title: string;
  blurb: string;
  tech: string[];
  metrics?: Metric[];
  link?: string;
};

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'payment-recovery',
    title: 'Silent Payment Failures → Wallet Recovery',
    blurb:
      'Six months, one bug: a silent catch block returning HTTP 200 when wallet credits failed. Paystack thought every transaction was resolved and never retried — money just vanished. Fixed with HTTP 500 on failure, idempotency keys to handle retries safely, a failed_transactions audit table for visibility, and an hourly cron that rescues orphaned deposits automatically.',
    tech: [
      'Cloudflare Workers',
      'Hono',
      'D1 (SQLite)',
      'Paystack',
      'Flutterwave',
    ],
    metrics: [
      { value: '$50K+', label: 'Revenue Rescued' },
      { value: '100%', label: 'Wallet Credit Rate' },
      { value: '0', label: 'Silent Failures' },
    ],
  },
  {
    id: 'gobig-marketplace',
    title: 'GoBig — Multi-Service Marketplace',
    blurb:
      'A multi-service marketplace built solo from scratch — SMS verification, SMM panel, eSIM data plans, and a dual-provider wallet checkout under one roof. Paystack and Flutterwave run in parallel with automatic failover, OTP polling persists across page reloads, and a normalization layer maps 4,220 raw SMSPool services into clean user-facing categories.',
    tech: [
      'Next.js 15',
      'Cloudflare Workers',
      'Hono',
      'D1',
      'PostgreSQL',
      'Paystack',
      'Flutterwave',
    ],
    metrics: [
      { value: '94', label: 'Active Users' },
      { value: '99.2%', label: 'Payment Success' },
      { value: '5', label: 'Provider Integrations' },
    ],
  },
  {
    id: 'wise-guys',
    title: 'Wise Guys NFT',
    blurb:
      'A cinematic XRPL experience built with intention. From animated mint flows to claim forms, everything was designed to convert and immerse — each interaction choreographed to move users from curiosity to commitment.',
    tech: ['React 19', 'Tailwind', 'GSAP', 'XRPL'],
  },
  {
    id: 'dogman',
    title: 'Dogman XRPL',
    blurb:
      'Built to feel like an unfolding story rather than a static website — combining live XRPL data with rich animations and fluid transitions. Users move through it, not scroll past it.',
    tech: ['React', 'ScrollTrigger', 'XRPL APIs'],
  },
  {
    id: 'portfolio',
    title: 'This Portfolio',
    blurb:
      'Designed to represent my process: immersive visuals, responsive design, and storytelling that keeps visitors scrolling effortlessly. Every section is a deliberate choice — nothing is decoration.',
    tech: ['React 19', 'Tailwind', 'GSAP', 'Framer Motion'],
  },
];

const SLIDE_VARIANTS = {
  enter: (dir: number) => ({
    x: dir > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -80 : 80,
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export const CaseStudies: React.FC = () => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (next: number) => {
      setDirection(next > active ? 1 : -1);
      setActive((next + CASE_STUDIES.length) % CASE_STUDIES.length);
    },
    [active]
  );

  const prev = () => go(active - 1);
  const next = useCallback(() => go(active + 1), [active, go]);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(next, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, next]);

  const c = CASE_STUDIES[active];

  return (
    <section
      id="caseStudies"
      className="relative flex flex-col items-center justify-start py-24 px-6 lg:px-16 overflow-hidden bg-gradient-to-b from-slate-900 to-[#0a0f1f]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Ambient glow behind active card */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 60%, rgba(202,138,4,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Heading */}
      <motion.div
        className="relative z-10 w-full max-w-5xl mb-14"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
          Case Studies
        </h2>
        <p className="mt-3 text-gray-400 max-w-xl text-sm md:text-base leading-relaxed">
          Real problems, deliberate solutions, measurable outcomes.
        </p>
      </motion.div>

      {/* Carousel */}
      <div className="relative z-10 w-full max-w-5xl">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.article
            key={c.id}
            custom={direction}
            variants={SLIDE_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            className="relative w-full rounded-3xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Yellow left accent */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-yellow-500 rounded-full" />

            {/* Large background index */}
            <span
              className="absolute right-6 top-4 font-black text-[7rem] md:text-[10rem] leading-none select-none pointer-events-none"
              style={{ color: 'rgba(255,255,255,0.03)' }}
            >
              {c.index}
            </span>

            <div className="relative p-8 md:p-12">
              {/* Category + index */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-mono text-yellow-500 tracking-widest">
                  {c.index}
                </span>
                <span className="h-px w-8 bg-yellow-500/40" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                  {c.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight mb-5 max-w-2xl">
                {c.title}
              </h3>

              {/* Blurb */}
              <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl mb-8">
                {c.blurb}
              </p>

              {/* Metrics */}
              {c.metrics && (
                <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8 max-w-lg">
                  {c.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl p-3 md:p-4 text-center"
                      style={{
                        background: 'rgba(202,138,4,0.08)',
                        border: '1px solid rgba(202,138,4,0.2)',
                      }}
                    >
                      <p className="text-xl md:text-2xl font-black text-yellow-400 tracking-tight">
                        {m.value}
                      </p>
                      <p className="text-[10px] md:text-xs text-gray-400 mt-1 uppercase tracking-wide font-medium">
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom row: tech + link */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {c.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-1 rounded-md font-medium text-gray-300"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {c.link && (
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition-colors whitespace-nowrap group"
                  >
                    View Project
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    >
                      <path
                        d="M7 17L17 7M17 7H9M17 7V15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          {/* Dots */}
          <div className="flex items-center gap-2">
            {CASE_STUDIES.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Go to case study ${i + 1}`}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: active === i ? '24px' : '6px',
                  height: '6px',
                  background:
                    active === i ? '#eab308' : 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>

          {/* Prev / Next */}
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              aria-label="Previous"
              className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 19l-7-7 7-7"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 5l7 7-7 7"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {!paused && (
          <div
            className="mt-4 h-[2px] w-full rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <motion.div
              key={active}
              className="h-full bg-yellow-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 6, ease: 'linear' }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default CaseStudies;
