import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HERO_STACK, type StackItem } from '../content/site';

/**
 * Sliding logo strip beneath the hero CTAs. The marquee pauses on hover so a
 * moving target can actually be caught, and the hovered item reveals its name
 * and a line of detail. Falls back to a wordmark where no logo exists.
 */

const MarqueeItem: React.FC<{
  item: StackItem;
  onHover: (name: string | null) => void;
  active: boolean;
}> = ({ item, onHover, active }) => {
  const [broken, setBroken] = useState(false);

  return (
    <li
      className="relative flex-shrink-0"
      onMouseEnter={() => onHover(item.name)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(item.name)}
      onBlur={() => onHover(null)}
    >
      <button
        type="button"
        aria-label={item.name}
        className="flex h-11 min-w-[52px] items-center justify-center rounded-xl px-3 outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-yellow-400/70"
      >
        {item.logo && !broken ? (
          <img
            src={item.logo}
            alt=""
            aria-hidden="true"
            loading="lazy"
            onError={() => setBroken(true)}
            className={`h-7 w-7 object-contain transition duration-300 ${
              active ? 'grayscale-0 opacity-100' : 'grayscale opacity-60'
            }`}
          />
        ) : (
          <span
            className={`font-mono text-[13px] tracking-tight transition-colors duration-300 ${
              active ? 'text-neutral-900' : 'text-neutral-400'
            }`}
          >
            {item.name}
          </span>
        )}
      </button>
    </li>
  );
};

const HeroStack: React.FC = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  const active = HERO_STACK.find((i) => i.name === hovered) ?? null;

  // Two passes of the same list make the loop seamless.
  const lane = [...HERO_STACK, ...HERO_STACK];

  return (
    <div className="w-full max-w-xl">
      <style>{`
        @keyframes heroStackSlide {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .hero-stack-lane {
          animation: heroStackSlide 32s linear infinite;
          width: max-content;
        }
        .hero-stack-viewport:hover .hero-stack-lane,
        .hero-stack-viewport:focus-within .hero-stack-lane {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-stack-lane { animation: none; }
        }
      `}</style>

      <div className="border-t border-neutral-900/10 pt-5">
        <div
          className="hero-stack-viewport relative overflow-hidden"
          style={{
            maskImage:
              'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
          }}
        >
          <ul className="hero-stack-lane flex items-center gap-3">
            {lane.map((item, i) => (
              <MarqueeItem
                key={`${item.name}-${i}`}
                item={item}
                onHover={setHovered}
                active={hovered === item.name}
              />
            ))}
          </ul>
        </div>

        {/* Reserved space, so revealing detail never shifts the layout. */}
        <div className="relative mt-2 h-[42px] sm:h-[34px]">
          <AnimatePresence mode="wait">
            {active ? (
              <motion.p
                key={active.name}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="absolute inset-x-0 text-center text-[13px] leading-snug text-neutral-500"
              >
                <span className="font-semibold text-neutral-800">{active.name}.</span>{' '}
                {active.blurb}
              </motion.p>
            ) : (
              <motion.p
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="absolute inset-x-0 text-center text-[13px] text-neutral-400"
              >
                Hover a logo to see where it earns its place.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default HeroStack;
