import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Github,
  Linkedin,
  Twitter,
} from 'lucide-react';
import React, { memo, useEffect, useLayoutEffect, useRef } from 'react';

import { HERO } from '../content/site';
import HeroStack from './HeroStack';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Matches the portrait's `scale-[2]` className: the pointer-tilt effect below
// builds on this base instead of overriding it back to an unscaled 1.
const PORTRAIT_BASE_SCALE = 2;

const PrimaryButton = memo(
  ({
    children,
    className = '',
    onClick,
    ...props
  }: React.ComponentPropsWithoutRef<'a'> & { onClick?: () => void }) => (
    <a
      {...props}
      onClick={onClick}
      className={`group relative flex items-center justify-center gap-2 px-7 py-3 text-[0.95rem] font-semibold rounded-full overflow-hidden
					 bg-yellow-400 text-neutral-950
					 shadow-[0_4px_20px_rgba(234,179,8,0.4)] hover:shadow-[0_8px_32px_rgba(234,179,8,0.55)]
					 hover:bg-yellow-300 active:scale-[0.96] active:bg-yellow-500 active:shadow-none
					 transition duration-300
					 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/60 ${className}`}
    >
      {/* Shimmer sweep on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />
      {children}
    </a>
  )
);
PrimaryButton.displayName = 'PrimaryButton';

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.45 },
  },
};
// FIX 2: Corrected 'ease' to a valid string or array type for Framer Motion Variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: 'easeOut' },
  },
};

interface HeroProps {
  // FIX 3: Defined refs with their specific HTML element type and allowed '| null'
  titleRef: React.RefObject<HTMLHeadingElement | null>;
  subtitleRef: React.RefObject<HTMLParagraphElement | null>;
}

const Hero: React.FC<HeroProps> = ({ titleRef, subtitleRef }) => {
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const portraitRef = useRef<HTMLDivElement | null>(null);
  const socialLinksRef = useRef<HTMLDivElement | null>(null);
  const ctasRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useRef(false);

  // Scroll + open existing discovery section/modal
  const handleConsultationClick = () => {
    const discoverySection = document.getElementById('discovery');
    if (discoverySection) {
      gsap.to(window, {
        duration: 0.8,
        scrollTo: { y: discoverySection, offsetY: 20 },
        ease: 'power2.inOut',
        // FIX 4: Casting onComplete to () => void to satisfy GSAP's type definition
        onComplete: (() =>
          window.dispatchEvent(new Event('openDiscoveryForm'))) as () => void,
      });
      return;
    }
    // Fallback: if discovery section isn't present, just request the discovery form
    window.dispatchEvent(new Event('openDiscoveryForm'));
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      prefersReducedMotion.current =
        window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ??
        false;

      // gsapUtils.ts owns title + subtitle (animates them after the sun lands ~2.3 s).
      // Hero.tsx only manages portrait, social links, CTAs, and badge.
      const heroOwnedElements = [
        portraitRef.current,
        socialLinksRef.current,
        ctasRef.current,
        badgeRef.current,
      ];

      if (prefersReducedMotion.current) {
        gsap.set(heroOwnedElements, { autoAlpha: 1, x: 0, y: 0 });
        return;
      }

      // SUN_INTRO_DURATION must match the intro timeline in gsapUtils.ts (~2.3 s total)
      const SUN_INTRO = 2.6;

      const entryTL = gsap.timeline({ defaults: { ease: 'power3.out' } });
      gsap.set(heroOwnedElements, { autoAlpha: 0 });

      // Portrait slides in from right while sun is still in flight
      entryTL.fromTo(
        portraitRef.current,
        { x: '100%', autoAlpha: 0 },
        { x: '0%', autoAlpha: 1, duration: 2.1, ease: 'expo.out' },
        0.2
      );
      // Social links + CTAs fade up just before sun lands
      entryTL.fromTo(
        [socialLinksRef.current, ctasRef.current],
        { y: 50, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.5,
          stagger: 0.16,
          ease: 'power3.out',
        },
        SUN_INTRO - 0.6
      );
      // Badge bounces in after sun has settled and text is appearing
      entryTL.fromTo(
        badgeRef.current,
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1.4, ease: 'power3.out' },
        SUN_INTRO + 0.4
      );

      if (badgeRef.current) {
        gsap.to(badgeRef.current, {
          y: -5,
          repeat: -1,
          yoyo: true,
          duration: 2.5,
          ease: 'sine.inOut',
        });

        gsap.to(badgeRef.current, {
          scrollTrigger: {
            trigger: '#discovery',
            start: 'top bottom',
            end: 'top center',
            scrub: 0.5,
          },
          autoAlpha: 0,
          y: '+=30',
        });
      }
    });

    return () => ctx.revert();
    // Intentionally no deps: we rely on stable refs passed into the component
  }, []);

  useEffect(() => {
    const portrait = portraitRef.current;
    if (!portrait) return;

    const imgEl = portrait.querySelector('img') as HTMLImageElement | null;
    if (!imgEl) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const rect = portrait.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const x = (clientX - rect.left - rect.width / 2) / rect.width;
      const y = (clientY - rect.top - rect.height / 2) / rect.height;

      gsap.to(imgEl, {
        rotationY: x * 10,
        rotationX: -y * 10,
        x: x * 30,
        y: y * 30,
        // Builds on the base face-crop zoom (scale-[2] in the className) instead
        // of overriding it back down to 1 — otherwise the portrait would snap
        // out of its crop on the first pointer move.
        scale: PORTRAIT_BASE_SCALE * 1.03,
        transformOrigin: '50% 8%',
        transformPerspective: 800,
        ease: 'power3.out',
        duration: 0.8,
      });
    };

    const reset = () =>
      gsap.to(imgEl, {
        rotationY: 0,
        rotationX: 0,
        x: 0,
        y: 0,
        scale: PORTRAIT_BASE_SCALE,
        transformOrigin: '50% 8%',
        duration: 1,
        ease: 'power2.out',
      });

    portrait.addEventListener('mousemove', handleMove);
    portrait.addEventListener('touchmove', handleMove);
    portrait.addEventListener('mouseleave', reset);
    portrait.addEventListener('touchend', reset);

    return () => {
      portrait.removeEventListener('mousemove', handleMove);
      portrait.removeEventListener('touchmove', handleMove);
      portrait.removeEventListener('mouseleave', reset);
      portrait.removeEventListener('touchend', reset);
    };
  }, []);

  const socialLinks = [
    { Icon: Github, href: 'https://github.com/JJcode-r/' },
    {
      Icon: Linkedin,
      href: 'https://www.linkedin.com/in/globe-the-dev-7b178919a/',
    },
    {
      Icon: Twitter,
      href: 'https://x.com/globe_the_dev?t=RO6MAOivsMGasX5H5XPZVA&s=09',
    },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden text-black hero-dot-grid"
    >
      <div className="pt-32 sm:pt-36 lg:pt-40 z-[999] pb-16 w-full max-w-6xl z-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-11 gap-x-12 xl:gap-x-16 w-full items-center"
        >
          <div className="lg:col-span-7 flex flex-col items-center text-center space-y-3 lg:space-y-4">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2.5 px-4 py-1.5 text-[0.85rem] font-medium rounded-full bg-white/90 backdrop-blur-xl border border-neutral-200/80 shadow-sm text-neutral-600">
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Available for engineering roles and freelance work
              </span>
            </motion.div>

            <h1
              ref={titleRef}
              className="text-[clamp(2.8rem,5.8vw,4.6rem)] font-bold tracking-[-0.03em] leading-[1.03] text-neutral-900"
            >
              {HERO.name}{' '}
              <span className="text-[0.42em] font-medium text-yellow-600 align-middle">
                ({HERO.alias})
              </span>
            </h1>

            <motion.p
              variants={fadeUp}
              className="text-[clamp(1.05rem,2.1vw,1.35rem)] font-medium text-neutral-700 tracking-[-0.01em]"
            >
              {HERO.role}
            </motion.p>

            <p
              ref={subtitleRef}
              className="text-[clamp(1rem,2vw,1.2rem)] font-normal text-neutral-600 max-w-xl leading-[1.75] mt-2 tracking-[-0.005em]"
            >
              {HERO.pitch}
            </p>

            <div
              ref={socialLinksRef}
              className="flex flex-col sm:flex-row gap-4 mt-6 text-neutral-600 justify-center items-center"
            >
              <div className="flex gap-5 justify-center items-center">
                {socialLinks.map(({ Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={Icon.name}
                    className="group relative flex items-center justify-center w-12 h-12 rounded-full
											border border-neutral-300 bg-white/70 backdrop-blur-md
											shadow-md shadow-neutral-300/30 transition duration-300
											hover:border-yellow-500 hover:bg-yellow-50 hover:shadow-yellow-300/40
											hover:scale-110 hover:text-yellow-600 hover:shadow-lg hover:shadow-yellow-300/30"
                  >
                    <Icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-125" />
                  </a>
                ))}
              </div>

              <div className="text-center mt-3 sm:mt-0 sm:ml-4 text-[0.85rem] tracking-wide text-neutral-500">
                {HERO.location}
              </div>
            </div>

            <div
              ref={ctasRef}
              className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="relative z-[2] group"
              >
                <PrimaryButton
                  href="#discovery"
                  onClick={handleConsultationClick}
                >
                  Start a project
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-900/10 group-hover:translate-x-0.5 transition-transform duration-300">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </PrimaryButton>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="relative z-[1]"
              >
                <Link
                  to="/projects"
                  className="group flex items-center justify-center gap-2 px-7 py-3 text-[0.95rem] font-medium rounded-full border border-neutral-300/80
											text-neutral-700 hover:border-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 active:scale-[0.97] active:bg-neutral-200 backdrop-blur-sm
											transition duration-300
											focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-400/60"
                >
                  View case studies
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition duration-300" />
                </Link>
              </motion.div>
            </div>

            <motion.div variants={fadeUp} className="mt-9 w-full flex justify-center">
              <HeroStack />
            </motion.div>
          </div>

          <div
            ref={portraitRef}
            className="lg:col-span-4 flex justify-center lg:justify-start mt-10 lg:mt-0 lg:pl-10 perspective-[1200px]"
          >
            <div className="relative w-full max-w-[400px] h-[500px] overflow-hidden rounded-[2.2rem] shadow-[0_25px_60px_rgba(0,0,0,0.2)] border border-white/80">
              <picture className="block w-full h-full">
                <source
                  srcSet="https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/portfolioHero2.webp
"
                  type="image/webp"
                />
                <img
                  src="https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/portfolioHero-optimized.png"
                  alt="Portrait of Joshua Igburu, Web Developer"
                  loading="lazy"
                  // The source is a full-body shot at native 511x640; object-cover alone
                  // leaves the face as a small sliver at the top. A top-anchored scale
                  // crops in toward the face and shoulders without resampling the source.
                  className="object-cover w-full h-full origin-[50%_8%] scale-[2] will-change-transform transition-transform duration-700"
                />
              </picture>
              <div className="absolute inset-0 rounded-[2.2rem] ring-1 ring-yellow-400/20 pointer-events-none" />
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
};

export default Hero;
