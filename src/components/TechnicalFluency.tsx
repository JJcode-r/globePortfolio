import React from 'react';
import { motion } from 'framer-motion';
import {
  Boxes,
  Cloud,
  Database,
  Landmark,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { TECHNICAL_FLUENCY } from '../content/site';

type Accent = 'yellow' | 'indigo' | 'emerald' | 'sky' | 'violet' | 'rose';

const ACCENTS: Record<Accent, { iconBg: string; icon: string; ring: string; border: string }> = {
  yellow: {
    iconBg: 'bg-yellow-400/10',
    icon: 'text-yellow-600',
    ring: 'ring-yellow-500/15',
    border: 'hover:border-yellow-500/30',
  },
  indigo: {
    iconBg: 'bg-indigo-500/10',
    icon: 'text-indigo-600',
    ring: 'ring-indigo-500/15',
    border: 'hover:border-indigo-500/30',
  },
  emerald: {
    iconBg: 'bg-emerald-500/10',
    icon: 'text-emerald-600',
    ring: 'ring-emerald-500/15',
    border: 'hover:border-emerald-500/30',
  },
  sky: {
    iconBg: 'bg-sky-500/10',
    icon: 'text-sky-600',
    ring: 'ring-sky-500/15',
    border: 'hover:border-sky-500/30',
  },
  violet: {
    iconBg: 'bg-violet-500/10',
    icon: 'text-violet-600',
    ring: 'ring-violet-500/15',
    border: 'hover:border-violet-500/30',
  },
  rose: {
    iconBg: 'bg-rose-500/10',
    icon: 'text-rose-600',
    ring: 'ring-rose-500/15',
    border: 'hover:border-rose-500/30',
  },
};

// Paired with TECHNICAL_FLUENCY by position: one icon and one accent per
// domain. The first entry (Cloudflare Workers) is given a featured, wider
// card, since it's the runtime everything else in the stack sits on.
const META: { icon: LucideIcon; accent: Accent; featured?: boolean }[] = [
  { icon: Cloud, accent: 'yellow', featured: true },
  { icon: ShieldCheck, accent: 'emerald' },
  { icon: Database, accent: 'sky' },
  { icon: Landmark, accent: 'indigo' },
  { icon: Boxes, accent: 'violet' },
  { icon: Sparkles, accent: 'rose' },
];

const TechnicalFluency: React.FC = () => (
  <section id="tech" className="relative w-full overflow-hidden py-16 sm:py-20 lg:py-24">
    {/* A quiet wash, echoing the hero's texture, so the section reads as
        designed rather than a bare list on white. */}
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
      style={{
        background:
          'radial-gradient(ellipse 60% 50% at 15% 0%, rgba(234,179,8,0.06) 0%, transparent 70%)',
      }}
    />

    <div className="relative mx-auto max-w-5xl px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-neutral-900">
          Skills
        </h2>
        <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-[1.75] text-neutral-600">
          Things I can speak to in depth and defend under pressure.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TECHNICAL_FLUENCY.map((item, i) => {
          const { icon: Icon, accent, featured } = META[i % META.length];
          const a = ACCENTS[accent];
          return (
            <motion.div
              key={item.area}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.55,
                delay: Math.min(i * 0.06, 0.3),
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-900/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7 ${a.border} ${
                featured ? 'sm:col-span-2 sm:flex-row sm:items-center sm:gap-8 lg:col-span-2' : ''
              }`}
            >
              <div className={featured ? 'sm:flex-1' : ''}>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${a.iconBg} ring-1 ${a.ring}`}
                >
                  <Icon className={`h-6 w-6 ${a.icon}`} strokeWidth={1.75} aria-hidden="true" />
                </div>

                <h3
                  className={`mt-5 font-semibold tracking-[-0.01em] text-neutral-900 ${
                    featured ? 'text-xl' : 'text-[1.05rem]'
                  }`}
                >
                  {item.area}
                </h3>
                <p
                  className={`mt-2.5 leading-[1.75] text-neutral-600 ${
                    featured ? 'text-[15px] sm:max-w-[42ch]' : 'text-[14.5px]'
                  }`}
                >
                  {item.body}
                </p>
              </div>

              {featured && (
                <div
                  className="hidden shrink-0 self-stretch sm:block"
                  style={{ width: '1px', background: 'rgba(0,0,0,0.06)' }}
                  aria-hidden="true"
                />
              )}

              {featured && (
                <p className="mt-5 hidden shrink-0 text-[13px] font-medium uppercase tracking-[0.1em] text-yellow-600/70 sm:mt-0 sm:block">
                  The runtime<br />everything else<br />sits on
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default TechnicalFluency;
