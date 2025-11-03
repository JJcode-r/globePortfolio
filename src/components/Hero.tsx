import React, { useRef, useLayoutEffect, useEffect, memo } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion"; // FIX 1: Import Variants as a type
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import {
  Sparkles,
  Github,
  Linkedin,
  Twitter,
  Grid,
  Code,
  Layers,
  Zap,
  Wrench,
  CheckCircle,
} from "lucide-react";
import profilePhoto from "/image.webp";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const PrimaryButton = memo(
  ({
    children,
    className = "",
    onClick,
    ...props
  }: React.ComponentPropsWithoutRef<"a"> & { onClick?: () => void }) => (
    <a
      {...props}
      onClick={onClick}
      className={`group relative flex items-center justify-center gap-2 px-7 py-2.5 text-base font-semibold rounded-full 
					 bg-yellow-500 text-neutral-900 hover:bg-yellow-400 
					 shadow-lg shadow-yellow-400/40 
					 transition-all duration-300 transform active:scale-[0.98]
					 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/50 ${className}`}
    >
      {children}
    </a>
  )
);
PrimaryButton.displayName = "PrimaryButton";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
};
// FIX 2: Corrected 'ease' to a valid string or array type for Framer Motion Variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeInOut" },
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
    const discoverySection = document.getElementById("discovery");
    if (discoverySection) {
      gsap.to(window, {
        duration: 0.8,
        scrollTo: { y: discoverySection, offsetY: 20 },
        ease: "power2.inOut",
        // FIX 4: Casting onComplete to () => void to satisfy GSAP's type definition
        onComplete: (() => window.dispatchEvent(new Event("openDiscoveryForm"))) as () => void,
      });
      return;
    }
    // Fallback: if discovery section isn't present, just request the discovery form
    window.dispatchEvent(new Event("openDiscoveryForm"));
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      prefersReducedMotion.current =
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

      const animatedElements = [
        titleRef.current,
        subtitleRef.current,
        portraitRef.current,
        socialLinksRef.current,
        ctasRef.current,
        badgeRef.current,
      ];

      if (prefersReducedMotion.current) {
        gsap.set(animatedElements, { autoAlpha: 1, x: 0, y: 0 });
        return;
      }

      const entryTL = gsap.timeline({ defaults: { duration: 1.5, ease: "power3.out" } });
      gsap.set(animatedElements, { autoAlpha: 0 });

      entryTL.fromTo(
        portraitRef.current,
        { x: "100%", autoAlpha: 0 },
        { x: "0%", autoAlpha: 1, duration: 1.5, ease: "power4.out" },
        0
      );
      entryTL.fromTo(
        titleRef.current,
        { y: -80, autoAlpha: 0, filter: "blur(10px)" },
        { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 1.4, ease: "power4.out" },
        0.2
      );
      entryTL.fromTo(
        subtitleRef.current,
        { x: -100, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 1.3, ease: "power3.out" },
        0.7
      );
      entryTL.fromTo(
        [socialLinksRef.current, ctasRef.current],
        { y: 60, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1.2, stagger: 0.1, ease: "power3.out" },
        1.0
      );

      entryTL.fromTo(
        badgeRef.current,
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1.0, ease: "elastic.out(1, 0.7)" },
        1.8
      );

      iconRefs.current.forEach((icon, i) => {
        if (!icon) return;
        gsap.to(icon, {
          yPercent: i % 2 === 0 ? 15 : -15,
          ease: "none",
          scrollTrigger: {
            trigger: icon,
            start: "top bottom",
            end: "bottom top",
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
          ease: "sine.inOut",
        });

        gsap.to(badgeRef.current, {
          scrollTrigger: {
            trigger: "#discovery",
            start: "top bottom",
            end: "top center",
            scrub: 0.5,
          },
          autoAlpha: 0,
          y: "+=30",
        });
      }
    });

    return () => ctx.revert();
    // Intentionally no deps: we rely on stable refs passed into the component
  }, []);

  useEffect(() => {
    const portrait = portraitRef.current;
    if (!portrait) return;

    const imgEl = portrait.querySelector("img") as HTMLImageElement | null;
    if (!imgEl) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const rect = portrait.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const x = (clientX - rect.left - rect.width / 2) / rect.width;
      const y = (clientY - rect.top - rect.height / 2) / rect.height;

      gsap.to(imgEl, {
        rotationY: x * 10,
        rotationX: -y * 10,
        x: x * 30,
        y: y * 30,
        scale: 1.06,
        transformPerspective: 800,
        ease: "power3.out",
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
        ease: "power2.out",
      });

    portrait.addEventListener("mousemove", handleMove);
    portrait.addEventListener("touchmove", handleMove);
    portrait.addEventListener("mouseleave", reset);
    portrait.addEventListener("touchend", reset);

    return () => {
      portrait.removeEventListener("mousemove", handleMove);
      portrait.removeEventListener("touchmove", handleMove);
      portrait.removeEventListener("mouseleave", reset);
      portrait.removeEventListener("touchend", reset);
    };
  }, []);

  const iconData = [
    { icon: <Code />, style: { top: "5%", left: "10%" } },
    { icon: <Grid />, style: { top: "20%", right: "12%" } },
    { icon: <Layers />, style: { bottom: "15%", left: "25%" } },
    { char: "⚛", style: { top: "55%", right: "3%" } },
    { char: "∞", style: { bottom: "5%", left: "5%" } },
  ];

  const iconBase =
    "absolute text-[clamp(8rem,15vw,12rem)] opacity-[0.10] blur-[1px] pointer-events-none select-none text-neutral-600 will-change-transform";

  const socialLinks = [
    { Icon: Github, href: "https://github.com/JJcode-r/" },
    { Icon: Linkedin, href: "https://www.linkedin.com/in/joshua-igburu-7b178919a/" },
    { Icon: Twitter, href: "https://x.com/globe_the_dev?t=RO6MAOivsMGasX5H5XPZVA&s=09" },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden 
					bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),rgba(240,240,240,0.3)_70%,transparent_100%)] text-black"
    >
      <div className="absolute inset-0">
        {iconData.map((item, i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) iconRefs.current[i] = el;
            }}
            className={`${iconBase} ${item.char ? "font-black" : ""}`}
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
              <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium tracking-wide rounded-full 
											bg-white/80 backdrop-blur-xl border border-neutral-200 shadow-md text-neutral-700">
                <Zap className="w-4 h-4 text-emerald-500" />
                Seamless UX Engineering → High-Value Conversions
              </span>
            </motion.div>

            <h1
              ref={titleRef}
              className="text-[clamp(2.6rem,5.5vw,4.3rem)] font-[950] tracking-tighter leading-[1.05] text-neutral-900"
            >
              Globe The <span className="text-yellow-600">Dev</span>
            </h1>

            <p
              ref={subtitleRef}
              className="text-[clamp(1rem,2.3vw,1.45rem)] font-light text-neutral-800 max-w-2xl leading-relaxed mt-1"
            >
              {/* START: Updated Subtitle for Clarity and Focus */}
              Stop losing leads. I architect scalable, conversion-optimized platforms for <span className=" text-yellow-600"> businesses, companies and Web3 projects </span> with each line of code built to outperform your competition and help your brand grow.
              {/* END: Updated Subtitle for Clarity and Focus */}
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

              <div className="text-center mt-3 sm:mt-0 sm:ml-4 text-yellow-600 text-sm">
                Trusted by startups & creators worldwide
              </div>
            </div>

            <div
              ref={ctasRef}
              className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="relative z-[2] group"
              >
                <PrimaryButton href="#discovery" onClick={handleConsultationClick} className="overflow-hidden">
                  {/* START: Updated Primary CTA Text */}
                  Let’s Plan Your Website Strategy
                  {/* END: Updated Primary CTA Text */}
                  <motion.span
                    className="relative inline-flex items-center"
                    initial={{ rotate: 0, scale: 1 }}
                    whileHover={{
                      rotate: [0, 15, -10, 0],
                      scale: [1, 1.2, 1, 1.15],
                    }}
                    transition={{
                      duration: 0.6,
                      ease: "easeInOut",
                      repeat: 1,
                      repeatType: "reverse",
                    }}
                  >
                    <Sparkles className="w-4 h-4 ml-1 text-yellow-600 drop-shadow-[0_0_4px_rgba(255,255,100,0.6)]" />
                  </motion.span>
                </PrimaryButton>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="relative z-[1]"
              >
                <a
                  href="#workflow"
                  className="flex items-center justify-center gap-2 px-7 py-2.5 text-base font-medium rounded-full border border-neutral-300 
											text-black/80 hover:bg-neutral-100 backdrop-blur-sm
											focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-400"
                >
                  <Wrench className="w-4 h-4 text-neutral-500" />
                  View My Strategy
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
          <span className="z-[999] text-sm font-bold text-neutral-800">Proven Results</span>
          <CheckCircle className="w-4 h-4 text-sky-500" />
        </div>
        <p className="text-xs font-light text-neutral-500 mt-1">
          Typical client ROI uplift: <span className="font-medium text-emerald-600">+35%</span>
          <a href="#caseStudies" className="text-blue-500 hover:underline ml-1">
            (See Case Study)
          </a>
        </p>
      </div>
    </section>
  );
};

export default Hero;