'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { Layers, ShieldCheck, Zap } from 'lucide-react';
import { useState } from 'react';
import CtaPanel from './CtaPanel';

const POINTS = [
  {
    id: 'who',
    title: 'Who I Am',
    body: "I'm a full-stack developer and CS student at Federal University Otuoke who builds production software in the same hours other people study it. My stack is Cloudflare Workers, Hono, D1, Drizzle and Next.js, plus the African payment stack, with enough production scar tissue to know exactly where things go wrong.",
    Icon: Layers,
    accent: 'text-indigo-500',
  },
  {
    id: 'why',
    title: 'How I Work',
    body: "My instinct is to go deeper, not around. When a D1 database read count hit 753 million rows overnight, I didn't restart and hope. I traced it to an unconditional cron combined with a broken pagination cache key, fixed it, and built a layer to stop it happening again. Problems get understood before they get closed.",
    Icon: ShieldCheck,
    accent: 'text-yellow-600',
  },
  {
    id: 'ethos',
    title: 'Two Brands',
    body: 'GlobeTheDev handles client work: websites, web apps and platforms for businesses across Nigeria and internationally. Gemynd is where I build the products I actually want to exist, from webhook monitoring to community intelligence.',
    Icon: Zap,
    accent: 'text-emerald-600',
  },
];

const SLIDE_VARIANTS = {
  enter: (direction: number) => ({ x: direction > 0 ? 32 : -32, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -32 : 32, opacity: 0 }),
};

export default function AboutPinned() {
  // [activeIndex, direction] — same tuple pattern as the testimonial
  // carousel, so the slide direction always matches which tab was clicked.
  const [[active, direction], setActive] = useState<[number, number]>([0, 0]);
  const point = POINTS[active];

  return (
    <section id="about" className="relative w-full py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-neutral-900"
        >
          About
        </motion.h2>

        {/* Editorial split: a portrait column beside a tabbed text column.
            The portrait is a gentler crop of the same hero photo, so the
            face isn't filling the frame twice in two different ways. */}
        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-16 lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative mx-auto max-w-sm overflow-hidden rounded-[2rem] border border-yellow-500/20 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.25)] lg:mx-0 lg:max-w-none">
              <div className="aspect-[4/5] w-full">
                <picture className="block h-full w-full">
                  <source
                    srcSet="https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/portfolioHero2.webp"
                    type="image/webp"
                  />
                  <img
                    src="https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/portfolioHero-optimized.png"
                    alt="Joshua Igburu at his desk"
                    loading="lazy"
                    className="h-full w-full origin-[50%_14%] scale-[1.3] object-cover"
                  />
                </picture>
              </div>
              {/* A plain corner accent, not a text overlay: the photo stands
                  on its own, without a caption plastered across it. */}
              <div
                className="pointer-events-none absolute right-5 top-5 h-8 w-8 border-r-2 border-t-2 border-yellow-400/70"
                aria-hidden="true"
              />
            </div>
            <p className="mx-auto mt-4 max-w-sm text-center text-[13px] text-neutral-400 lg:mx-0 lg:max-w-none lg:text-left">
              Joshua Igburu (Globe the Dev)
            </p>
          </motion.div>

          <div className="lg:col-span-7">
            {/* Tabs, styled like the site's own nav links: same underline-
                on-active treatment, same type scale. Clicking one swaps the
                panel below with a slide, instead of showing all three at
                once — reads as a deliberate interaction, not a wall of text. */}
            <div
              role="tablist"
              aria-label="About topics"
              className="flex flex-wrap gap-x-8 gap-y-3 border-b border-neutral-900/10 pb-4"
            >
              {POINTS.map((p, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`about-panel-${p.id}`}
                    onClick={() => setActive([i, i > active ? 1 : -1])}
                    className="group relative pb-4 -mb-4 text-[15px] font-medium tracking-[0.01em] transition-colors duration-300"
                    style={{ color: isActive ? '#a16207' : 'rgba(23,23,23,0.45)' }}
                  >
                    {p.title}
                    <span
                      aria-hidden="true"
                      className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-yellow-600 transition-all duration-300 ease-out ${
                        isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-40'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Reserved height keeps the layout still while the longest of
                the three bodies swaps in. */}
            <div className="relative mt-7 min-h-[230px] sm:min-h-[170px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={point.id}
                  id={`about-panel-${point.id}`}
                  role="tabpanel"
                  custom={direction}
                  variants={SLIDE_VARIANTS}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.32, ease: 'easeOut' }}
                  className="flex gap-4"
                >
                  <point.Icon
                    className={`mt-1 h-5 w-5 flex-shrink-0 ${point.accent}`}
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <p className="max-w-[56ch] text-[15px] leading-[1.8] text-neutral-600">
                    {point.body}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* CTA card, full-width, split layout */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          className="mt-16 lg:mt-20"
        >
          <CtaPanel />
        </motion.div>
      </div>
    </section>
  );
}
