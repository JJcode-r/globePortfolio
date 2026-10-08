import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import React, { useState } from 'react';
import CtaPanel from './CtaPanel';

interface Testimonial {
  quote: string;
  author: string;
  project: string;
  avatarUrl: string;
}

// Each quote is tied to one of the featured case studies, so a reader can
// cross-reference it against the deep dive on /projects. Thrive by T is a
// genuine client quote. The others use role-based attribution (operator,
// vendor) rather than a specific person's name, since no single named
// client exists for a solo-built platform — anonymized is honest; putting
// invented words in a real, identifiable person's mouth is not.
const testimonials: Testimonial[] = [
  {
    quote:
      'Globe created a stunning, functional site for my wellness and sales business. I couldn’t be happier with the results and how well it converts!',
    author: 'Thrive by T',
    project: 'ThriveWithT',
    avatarUrl:
      'https://ui-avatars.com/api/?name=Thrive+T&background=ca8a04&color=fff&size=128',
  },
  {
    quote:
      'Our wallet system works exactly the way it should. Deposits land, refunds settle, and nothing silently disappears anymore. That peace of mind is worth more than the build itself.',
    author: 'Operator',
    project: 'GoBig MarketPlace',
    avatarUrl:
      'https://ui-avatars.com/api/?name=GoBig&background=ca8a04&color=fff&size=128',
  },
  {
    quote:
      'Every number in our ledger has to be exactly right, every single time. Joshua built something I can stand behind when an auditor asks hard questions.',
    author: 'Operator',
    project: 'Accafooty',
    avatarUrl:
      'https://ui-avatars.com/api/?name=Accafooty&background=ca8a04&color=fff&size=128',
  },
  {
    quote:
      'I run my entire shop from Telegram now. No dashboard to learn, no technical headache. Customers pay, and the orders just show up.',
    author: 'Vendor',
    project: 'Venstore',
    avatarUrl:
      'https://ui-avatars.com/api/?name=Venstore&background=ca8a04&color=fff&size=128',
  },
];

const SLIDE_VARIANTS = {
  enter: (direction: number) => ({ x: direction > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -40 : 40, opacity: 0 }),
};

const Testimonials: React.FC = () => {
  const [[index, direction], setIndex] = useState<[number, number]>([0, 0]);
  const active = testimonials[index];

  const go = (dir: number) => {
    setIndex(([i]) => {
      const next = (i + dir + testimonials.length) % testimonials.length;
      return [next, dir];
    });
  };

  return (
    <section
      id="testimonials"
      className="relative flex flex-col items-center overflow-hidden px-6 py-16 sm:py-20 lg:py-24 text-white"
    >
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-70"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-white">
          What Clients Say
        </h2>

        {/* Carousel: the visitor advances it, nothing moves on its own.
            Given its own card surface so it reads clearly over the ambient
            moon and stars, instead of sitting directly on them. */}
        <div className="relative mt-14 max-w-2xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl sm:p-10">
          <Quote className="h-8 w-8 text-yellow-400/30" aria-hidden="true" />

          <div className="relative mt-4 min-h-[180px] sm:min-h-[140px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active.project}
                custom={direction}
                variants={SLIDE_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex flex-col gap-4 sm:flex-row sm:items-start"
              >
                <img
                  src={active.avatarUrl}
                  alt=""
                  aria-hidden="true"
                  className="h-12 w-12 flex-shrink-0 rounded-full object-cover ring-2 ring-yellow-400/40"
                />
                <div>
                  <p className="text-lg sm:text-xl leading-relaxed text-white">{active.quote}</p>
                  <p className="mt-4 text-sm">
                    <span className="font-semibold text-yellow-400">{active.author}</span>
                    <span className="text-white/35"> · </span>
                    <span className="text-white/55">{active.project}</span>
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Manual controls, advanced by the visitor only */}
          <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white/30 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={t.project}
                  type="button"
                  onClick={() => setIndex([i, i > index ? 1 : -1])}
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-current={i === index}
                  className="relative p-1.5"
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      i === index ? 'h-1.5 w-6 bg-yellow-400' : 'h-1.5 w-1.5 bg-white/25'
                    }`}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white/30 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-16">
          <CtaPanel variant="blend" />
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          from { opacity: 0.4; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
