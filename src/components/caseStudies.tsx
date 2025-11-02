"use client";
import React, { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type CaseStudy = {
  id: string;
  title: string;
  blurb: string;
  tech: string[];
  link?: string;
};

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "wise-guys",
    title: "Wise Guys NFT",
    blurb:
      "A cinematic XRPL experience built with intention. From animated mint flows to claim forms — everything was designed to convert and immerse.",
    tech: ["React 19", "Tailwind", "GSAP", "XRPL"],
    link: "#",
  },
  {
    id: "dogman",
    title: "Dogman XRPL",
    blurb:
      "Built to feel like an unfolding story rather than a static website — combining live XRPL data with rich animations and fluid transitions.",
    tech: ["React", "ScrollTrigger", "XRPL APIs"],
    link: "#",
  },
  {
    id: "portfolio",
    title: "My Portfolio",
    blurb:
      "Designed to represent my process: immersive visuals, responsive design, and storytelling that keeps visitors scrolling effortlessly.",
    tech: ["React 19", "Tailwind", "GSAP", "Draggable"],
    link: "#",
  },
];

export const CaseStudies: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lockedIndex, setLockedIndex] = useState<number | null>(null);

  const focusIndex = lockedIndex !== null ? lockedIndex : hoveredIndex;

  const handleCardClick = useCallback(
    (index: number) => {
      setLockedIndex((prev) => (prev === index ? null : index));
    },
    []
  );

  const getCardAnimation = (i: number) =>
    focusIndex === i
      ? {
          scale: 1.12,
          y: -10,
          boxShadow:
            "0 22px 60px rgba(59,130,246,0.18), 0 8px 30px rgba(255,221,87,0.06)",
        }
      : { scale: 1.0, y: 0, boxShadow: "0 8px 30px rgba(0,0,0,0.3)" };

  // The function '_handleCtaClick' was currently not used, causing TS6133.
  // Commenting it out to resolve the build error safely.
  // const _handleCtaClick = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   const discoverySection = document.getElementById("discovery");
  //   if (discoverySection)
  //     discoverySection.scrollIntoView({ behavior: "smooth", block: "start" });
  //   window.dispatchEvent(new Event("openDiscoveryForm"));
  // };

  return (
    <section
      ref={sectionRef}
      id="caseStudies"
      className="relative flex flex-col items-center justify-start py-20 px-6 lg:px-12 overflow-visible bg-gradient-to-b from-slate-900/80 to-slate-800/100"
    >
      {/* Stars background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-20"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Heading */}
      <motion.div
        className="relative z-10 w-full max-w-6xl text-center mb-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-md">
          💼 Featured Case Studies
        </h2>
        <p className="mt-3 text-gray-300 max-w-3xl mx-auto">
          Exploring projects that blend clarity, animation, and
          conversion-driven storytelling.
        </p>
      </motion.div>

      {/* Card Track */}
      <div
        className="relative z-20 w-full"
        style={{ perspective: "1000px", overflow: "visible" }}
      >
        <div className="flex gap-12 px-3 pb-10 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {CASE_STUDIES.map((c, i) => (
            <motion.article
              key={c.id}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleCardClick(i)}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.15 }}
              whileTap={{ scale: 0.98 }}
              className="snap-center flex-shrink-0 w-[86%] sm:w-[48%] md:w-[36%] lg:w-[30%] rounded-2xl p-6 md:p-7 cursor-pointer select-none"
              style={{
                minHeight: "260px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
                transformStyle: "preserve-3d",
              }}
            >
              <motion.div
                animate={getCardAnimation(i)}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex flex-col h-full justify-between"
              >
                <div>
                  <motion.h3
                    className="text-xl md:text-2xl font-bold text-[#e6f1ff] mb-2"
                    animate={{
                      color: focusIndex === i ? "#ffdd57" : "#e6f1ff",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {c.title}
                  </motion.h3>
                  <p className="text-sm md:text-base text-gray-300 mb-3 leading-relaxed">
                    {c.blurb}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {c.tech.map((t) => (
                      <span
                        key={t}
                        className="text-xs md:text-sm px-2 py-1 rounded-md bg-white/10 text-gray-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {focusIndex === i && c.link && (
                    <motion.a
                      key="link"
                      href={c.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-1 text-sm font-medium"
                      style={{
                        color: "#ffdd57",
                        textDecoration: "underline",
                        textUnderlineOffset: 4,
                      }}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.3 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Visit Site
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="opacity-85"
                      >
                        <path
                          d="M7 17L17 7M17 7H9M17 7V15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.a>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
