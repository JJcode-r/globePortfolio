'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, ShieldCheck, Zap } from 'lucide-react';
import React from 'react';

const CARDS = [
  {
    id: 'who',
    num: '01',
    title: 'Who I Am',
    body: "I'm a full-stack developer who builds where design meets money. Beautiful front ends are table stakes  what sets my work apart is everything behind the checkout: payment integrations, wallets, and reliable transaction flows that don't silently lose deposits. I make platforms that look premium and get paid.",
    tag: 'Craftsmanship & Vision',
    Icon: Layers,
    accent: 'indigo',
  },
  {
    id: 'why',
    num: '02',
    title: 'Why Choose Me',
    body: "Because I build the parts that scare other developers. Payment gateways, webhook reliability, failed-transaction recovery, multi-currency wallets  the systems where one silent bug costs you every sale. I've debugged exactly that and rebuilt it to work under real load.",
    tag: 'Conversion-Driven',
    Icon: ShieldCheck,
    accent: 'yellow',
  },
  {
    id: 'ethos',
    num: '03',
    title: 'How I Work',
    body: "Clear communication, fast iteration, zero hand-waving. I treat your checkout and your revenue flow as seriously as your homepage  because that's where the money actually moves.",
    tag: 'Empathy · Execution · Results',
    Icon: Zap,
    accent: 'emerald',
  },
] as const;

type AccentKey = 'indigo' | 'yellow' | 'emerald';

const accentConfig: Record<
  AccentKey,
  {
    numColor: string;
    iconBg: string;
    iconColor: string;
    tagBg: string;
    tagText: string;
    borderHover: string;
    glowColor: string;
  }
> = {
  indigo: {
    numColor: 'text-indigo-400/25',
    iconBg: 'bg-indigo-500/10',
    iconColor: 'text-indigo-400',
    tagBg: 'bg-indigo-500/10',
    tagText: 'text-indigo-300',
    borderHover: 'hover:border-indigo-500/30',
    glowColor: 'hover:shadow-indigo-900/30',
  },
  yellow: {
    numColor: 'text-yellow-400/25',
    iconBg: 'bg-yellow-400/10',
    iconColor: 'text-yellow-400',
    tagBg: 'bg-yellow-400/10',
    tagText: 'text-yellow-300',
    borderHover: 'hover:border-yellow-500/30',
    glowColor: 'hover:shadow-yellow-900/20',
  },
  emerald: {
    numColor: 'text-emerald-400/25',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    tagBg: 'bg-emerald-500/10',
    tagText: 'text-emerald-300',
    borderHover: 'hover:border-emerald-500/30',
    glowColor: 'hover:shadow-emerald-900/20',
  },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 48, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  const target = document.getElementById('discovery');
  if (target) target.scrollIntoView({ behavior: 'smooth' });
  window.dispatchEvent(new Event('openDiscoveryForm'));
};

export default function AboutPinned() {
  return (
    <section
      id="about"
      className="relative w-full flex flex-col items-center justify-center py-20 sm:py-28 lg:pb-44 pb-24 mt-10 mb-22"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-[-0.03em] text-center text-neutral-900 dark:text-white mb-14"
      >
        About Me
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-6 w-full"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {CARDS.map((c) => {
          const cfg = accentConfig[c.accent];
          return (
            <motion.article
              key={c.id}
              variants={cardVariants}
              className={`group relative flex flex-col rounded-3xl p-7 md:p-9
                bg-neutral-950/80 backdrop-blur-xl
                border border-white/[0.06] ${cfg.borderHover}
                shadow-xl shadow-black/40 ${cfg.glowColor}
                hover:shadow-2xl hover:-translate-y-1
                transition-all duration-500 ease-out overflow-hidden cursor-default`}
            >
              {/* Decorative large number in background */}
              <span
                className={`absolute -top-4 -right-2 text-[7rem] font-black leading-none select-none pointer-events-none ${cfg.numColor} transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-1`}
                aria-hidden="true"
              >
                {c.num}
              </span>

              {/* Top row: icon + tag */}
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div
                  className={`flex items-center justify-center w-11 h-11 rounded-2xl ${cfg.iconBg} ring-1 ring-white/5`}
                >
                  <c.Icon
                    className={`w-5 h-5 ${cfg.iconColor}`}
                    strokeWidth={1.75}
                  />
                </div>
                <span
                  className={`text-[0.65rem] font-semibold tracking-[0.14em] uppercase px-3 py-1 rounded-full ${cfg.tagBg} ${cfg.tagText} ring-1 ring-white/5`}
                >
                  {c.tag}
                </span>
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col flex-1">
                <h3 className="text-lg md:text-xl font-semibold mb-3 tracking-[-0.02em] text-white leading-snug">
                  {c.title}
                </h3>
                <p className="text-[0.88rem] md:text-[0.93rem] leading-[1.85] text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300">
                  {c.body}
                </p>
              </div>

              {/* Bottom rule accent */}
              <div
                className={`mt-7 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent relative z-10`}
              />
            </motion.article>
          );
        })}
      </motion.div>

      {/* CTA card  full-width, split layout */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 max-w-6xl mx-auto px-6 w-full mb-24"
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-neutral-950/80 backdrop-blur-xl shadow-2xl shadow-black/50">
          {/* Background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-yellow-400/5 blur-3xl" />
            <div className="absolute -bottom-16 -right-16 w-60 h-60 rounded-full bg-indigo-500/5 blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 p-8 md:p-10">
            {/* Left: copy */}
            <div className="flex-1 text-center lg:text-left">
              <p className="text-[0.7rem] font-semibold tracking-[0.18em] uppercase text-yellow-400/80 mb-2 select-none">
                Ready to move?
              </p>
              <h3 className="text-2xl md:text-3xl font-bold tracking-[-0.025em] text-white mb-3">
                Let's Build Something Great
              </h3>
              <p className="text-[0.9rem] text-neutral-400 leading-[1.8] max-w-md">
                Have a vision in mind or just need a fresh online presence?
                Let's team up and turn your ideas into a site that inspires,
                converts, and stands out.
              </p>
            </div>

            {/* Right: CTA */}
            <div className="flex-shrink-0">
              <a
                href="#discovery"
                onClick={handleCtaClick}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl
                           bg-yellow-400 text-neutral-900 font-semibold text-[0.95rem]
                           shadow-[0_0_0_0_rgba(234,179,8,0)] hover:shadow-[0_0_32px_6px_rgba(234,179,8,0.35)]
                           hover:bg-yellow-300 active:scale-[0.97] active:bg-yellow-500
                           focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/50
                           transition-all duration-300 ease-out"
              >
                Start Building
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-neutral-900/15 group-hover:translate-x-1 transition-transform duration-300">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
