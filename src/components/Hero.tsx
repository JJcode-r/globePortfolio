import React, { useRef, useLayoutEffect, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion'; // FIX 1: Import Variants as a type
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import {
  Github,
  Linkedin,
  Twitter,
  Grid,
  Code,
  Layers,
  CheckCircle,
  CreditCard,
  ArrowRight,
} from 'lucide-react';
import profilePhoto from '/image.webp';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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
					 bg-yellow-400 text-neutral-900
					 shadow-[0_4px_20px_rgba(234,179,8,0.4)] hover:shadow-[0_8px_32px_rgba(234,179,8,0.55)]
					 hover:bg-yellow-300 active:scale-[0.96] active:bg-yellow-500 active:shadow-none
					 transition-all duration-300
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
    transition: { staggerChildren: 0.05, delayChildren: 0.2 },
  },
};
// FIX 2: Corrected 'ease' to a valid string or array type for Framer Motion Variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeInOut' },
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
  const iconRefs = useRef<HTMLSpanElement[]>([]);
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
      const SUN_INTRO = 1.9;

      const entryTL = gsap.timeline({ defaults: { ease: 'power3.out' } });
      gsap.set(heroOwnedElements, { autoAlpha: 0 });

      // Portrait slides in from right while sun is still in flight
      entryTL.fromTo(
        portraitRef.current,
        { x: '100%', autoAlpha: 0 },
        { x: '0%', autoAlpha: 1, duration: 1.5, ease: 'power4.out' },
        0.2
      );
      // Social links + CTAs fade up just before sun lands
      entryTL.fromTo(
        [socialLinksRef.current, ctasRef.current],
        { y: 50, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.1 },
        SUN_INTRO - 0.3
      );
      // Badge bounces in after sun has settled and text is appearing
      entryTL.fromTo(
        badgeRef.current,
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1.0, ease: 'elastic.out(1, 0.7)' },
        SUN_INTRO + 0.5
      );

      iconRefs.current.forEach((icon, i) => {
        if (!icon) return;
        gsap.to(icon, {
          yPercent: i % 2 === 0 ? 15 : -15,
          ease: 'none',
          scrollTrigger: {
            trigger: icon,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      });

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
        scale: 1.06,
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
        scale: 1,
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

  const iconData = [
    { icon: <Code />, style: { top: '5%', left: '10%' } },
    { icon: <Grid />, style: { top: '20%', right: '12%' } },
    { icon: <Layers />, style: { bottom: '15%', left: '25%' } },
    { char: '⚛', style: { top: '55%', right: '3%' } },
    { char: '∞', style: { bottom: '5%', left: '5%' } },
  ];

  const iconBase =
    'absolute text-[clamp(8rem,15vw,12rem)] opacity-[0.10] blur-[1px] pointer-events-none select-none text-neutral-600 will-change-transform';

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
      style={{
        background:
          'radial-gradient(ellipse 130% 90% at 10% 15%, rgba(255,255,255,1) 0%, rgba(255,252,240,0.98) 45%, rgba(248,248,248,0.92) 80%, transparent 100%)',
      }}
    >
      <div className="absolute inset-0">
        {iconData.map((item, i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) iconRefs.current[i] = el;
            }}
            className={`${iconBase} ${item.char ? 'font-black' : ''}`}
            style={item.style}
          >
            {item.icon || item.char}
          </span>
        ))}
      </div>

      <div className="pt-25 z-[999] pb-20 w-full max-w-6xl z-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-11 gap-x-12 xl:gap-x-16 w-full items-center"
        >
          <div className="lg:col-span-7 flex flex-col items-center text-center space-y-3 lg:space-y-4">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 text-[0.75rem] font-semibold tracking-[0.12em] uppercase rounded-full bg-white/90 backdrop-blur-xl border border-neutral-200/80 shadow-sm text-neutral-500">
                <CreditCard className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                Payment Systems · Wallets · Conversion-Ready Platforms
              </span>
            </motion.div>

            <h1
              ref={titleRef}
              className="text-[clamp(2.8rem,5.8vw,4.6rem)] font-bold tracking-[-0.03em] leading-[1.03] text-neutral-900"
            >
              Globe The <span className="text-yellow-600">Dev</span>
            </h1>

            <p
              ref={subtitleRef}
              className="text-[clamp(1rem,2vw,1.3rem)] font-normal text-neutral-600 max-w-xl leading-[1.75] mt-2 tracking-[-0.005em]"
            >
              I build the platforms businesses run on and the payment systems
              that actually collect the money.{' '}
              <span className="text-yellow-600">
                Paystack, Flutterwave, Stripe
              </span>
              , wallets, payouts, and front ends engineered to convert. Built
              right, so you stop losing revenue to broken checkouts and dead
              leads.
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
											shadow-md shadow-neutral-300/30 transition-all duration-300
											hover:border-yellow-500 hover:bg-yellow-50 hover:shadow-yellow-300/40
											hover:scale-110 hover:text-yellow-600 hover:shadow-lg hover:shadow-yellow-300/30"
                  >
                    <Icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-125" />
                  </a>
                ))}
              </div>

              <div className="text-center mt-3 sm:mt-0 sm:ml-4 text-[0.8rem] tracking-wide text-neutral-500">
                Trusted by startups, founders & Web3 teams worldwide
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
                  Let’s fix your revenue leak
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
                <a
                  href="#projects"
                  className="group flex items-center justify-center gap-2 px-7 py-3 text-[0.95rem] font-medium rounded-full border border-neutral-300/80
											text-neutral-700 hover:border-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 active:scale-[0.97] active:bg-neutral-200 backdrop-blur-sm
											transition-all duration-300
											focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-400/60"
                >
                  View my work
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-all duration-300" />
                </a>
              </motion.div>
            </div>
          </div>

          <div
            ref={portraitRef}
            className="lg:col-span-4 flex justify-center lg:justify-start mt-10 lg:mt-0 lg:pl-10 perspective-[1200px]"
          >
            <div className="relative w-full max-w-[340px] h-[480px] overflow-hidden rounded-[2.2rem] shadow-[0_25px_60px_rgba(0,0,0,0.2)] border border-white/80">
              <img
                src={profilePhoto}
                alt="Portrait of Joshua Igburu, Web Developer"
                loading="lazy"
                className="object-cover w-full h-full will-change-transform transition-transform duration-700"
              />
              <div className="absolute inset-0 rounded-[2.2rem] ring-1 ring-yellow-400/20 pointer-events-none" />
            </div>
          </div>
        </motion.div>
      </div>

      <div
        ref={badgeRef}
        className="fixed bottom-8 right-8 z-40 p-4 rounded-3xl bg-white/80 backdrop-blur-2xl border border-neutral-200
					 shadow-2xl shadow-neutral-400/20 text-black hidden md:block select-none transform transition-all
					 duration-500 hover:translate-y-[-4px]"
      >
        <div className=" flex items-center justify-start mb-1 gap-2">
          <span className="z-[999] text-sm font-bold text-neutral-800">
            Proven Results
          </span>
          <CheckCircle className="w-4 h-4 text-sky-500" />
        </div>
        <p className="text-xs font-light text-neutral-500 mt-1">
          Typical client ROI uplift:{' '}
          <span className="font-medium text-emerald-600">+35%</span>
          <a href="#caseStudies" className="text-blue-500 hover:underline ml-1">
            (See Case Study)
          </a>
        </p>
      </div>
    </section>
  );
};

export default Hero;
