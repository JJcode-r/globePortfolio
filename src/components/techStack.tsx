import React, { useRef, useState, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

export interface TechItem {
  id: number;
  name: string;
  logo: string;
  description: string;
  brandColor?: string;
  empty?: boolean;
}

interface StackDataRow {
  id: string;
  items: TechItem[];
}

// --- Core Tech Items ---
const coreItems: TechItem[] = [
  { id: 1, name: "React 19", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg", description: "Declarative UIs that feel alive — built with React 19.", brandColor: "#61DAFB" },
  { id: 2, name: "TypeScript", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg", description: "Strongly typed. Safe. Scalable. TypeScript is my second language.", brandColor: "#3178C6" },
  { id: 3, name: "Framer Motion", logo: "https://cdn.worldvectorlogo.com/logos/framer-motion.svg", description: "Cinematic animations that flow with intent and precision.", brandColor: "#E44CFF" },
  { id: 4, name: "Tailwind CSS", logo: "https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg", description: "Clean, responsive interfaces — built at the speed of thought.", brandColor: "#38BDF8" },
  { id: 5, name: "Next.js", logo: "https://cdn.worldvectorlogo.com/logos/nextjs-2.svg", description: "Blazing-fast apps powered by the Next.js ecosystem.", brandColor: "#FFFFFF" },
  { id: 6, name: "Ethers / Web3", logo: "https://raw.githubusercontent.com/ethers-io/ethers.js/master/docs/logo.svg", description: "Connecting user experiences to decentralized worlds.", brandColor: "#627EEA" },
  { id: 7, name: "JavaScript", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg", description: "The backbone of the web — clean, optimized, and expressive.", brandColor: "#F7DF1E" },
  { id: 8, name: "HTML 5", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg", description: "Structure and semantics that stand the test of time.", brandColor: "#E34F26" },
  { id: 9, name: "CSS 3", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg", description: "Modern layouts with depth, motion, and personality.", brandColor: "#2965F1" },
  { id: 10, name: "Empty1", logo: "", description: "", empty: true },
];

// --- Secondary Tech Items ---
const secondaryItems: TechItem[] = [
  { id: 11, name: "Firebase", logo: "https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg", description: "Scalable backends, simplified.", brandColor: "#FFCA28" },
  { id: 12, name: "Cypress", logo: "https://cdn.worldvectorlogo.com/logos/cypress-io-1.svg", description: "End-to-end testing that never misses a beat.", brandColor: "#69D3A7" },
  { id: 13, name: "Jest", logo: "https://www.vectorlogo.zone/logos/jestjsio/jestjsio-icon.svg", description: "Confidence through automated testing.", brandColor: "#99425B" },
  { id: 14, name: "Vercel", logo: "https://www.vectorlogo.zone/logos/vercel/vercel-icon.svg", description: "Deployments so seamless, they feel instant.", brandColor: "#FFFFFF" },
  { id: 15, name: "Git / GitHub", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", description: "Version control that fuels collaboration.", brandColor: "#F5F5F5" },
  { id: 16, name: "Figma", logo: "https://www.vectorlogo.zone/logos/figma/figma-icon.svg", description: "Turning design systems into living components.", brandColor: "#A259FF" },
  { id: 17, name: "Redux Toolkit", logo: "https://raw.githubusercontent.com/reduxjs/redux/master/logo/logo.svg", description: "Clean, structured state management that scales.", brandColor: "#764ABC" },
  { id: 18, name: "ESLint / Prettier", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg", description: "Consistency and clarity across every line of code.", brandColor: "#4B32C3" },
  { id: 19, name: "Empty2", logo: "", description: "", empty: true },
  { id: 20, name: "Empty3", logo: "", description: "", empty: true },
];

// --- Helpers ---
const getLoopedItems = (items: TechItem[]) => [...items, ...items, ...items];
export const STACK_DATA_ROWS: StackDataRow[] = [
  { id: "row1", items: getLoopedItems(coreItems) },
  { id: "row2", items: getLoopedItems(secondaryItems) },
];

const ITEM_GAP = 8;
const TILE_WIDTH = 150;
const ANIMATION_DURATION = 75;

// --- Component ---
export const InfiniteTechGrid: React.FC<{ data?: StackDataRow[] }> = ({ data = STACK_DATA_ROWS }) => {
  const [hoveredTech, setHoveredTech] = useState<TechItem | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [tooltipSide, setTooltipSide] = useState<"left" | "right" | "center">("center");

  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true, amount: 0.4 });
  const rowMotionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const uniqueItemCount = coreItems.length;
  const itemTotalWidth = TILE_WIDTH + ITEM_GAP * 2;
  const totalUniqueWidth = itemTotalWidth * uniqueItemCount;
  const totalLoopedWidth = totalUniqueWidth * 3;

  const loopVariants: Variants = useMemo(() => ({
    animate: {
      x: [0, -totalUniqueWidth],
      transition: {
        x: { repeat: Infinity, repeatType: "loop" as const, duration: ANIMATION_DURATION, ease: "linear" },
      },
    },
  }), [totalUniqueWidth]);

  const handleMouseEnter = (tech: TechItem, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;
    const vw = window.innerWidth;
    setTooltipSide(x < vw * 0.25 ? "left" : x > vw * 0.75 ? "right" : "center");
    setHoveredTech(tech);
    setHoverPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setHoveredTech(null);
    setHoverPosition(null);
  };

  const headingVariants: Variants = {
    hidden: { opacity: 0, x: -80 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 80, damping: 20 } },
  };

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const discoverySection = document.getElementById("discovery");
    if (discoverySection) discoverySection.scrollIntoView({ behavior: "smooth", block: "start" });
    window.dispatchEvent(new Event("openDiscoveryForm"));
  };

  return (
    <section id="tech" className="relative w-full overflow-hidden min-h-[50vh] flex flex-col justify-center py-16 bg-transparent backdrop-blur-md border-y border-white/10">
      {/* Heading */}
      <motion.div ref={headingRef} variants={headingVariants} initial="hidden" animate={isInView ? "visible" : "hidden"} className="text-center mb-12 px-4">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-black dark:text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]">My Tech Stack</h2>
        <p className="mt-5 text-base sm:text-lg md:text-xl text-black/80 dark:text-gray-200 max-w-2xl mx-auto leading-relaxed tracking-wide">
          These are the tools that power my builds — the same stack used by modern brands and startups for fast, scalable, and visually striking websites.
        </p>
      </motion.div>

      {/* Tech Rows */}
      {data.map((row, rowIndex) => (
        <div key={row.id} className="relative flex overflow-hidden my-2">
          <motion.div
            ref={(el) => { rowMotionRefs.current[rowIndex] = el; }}
            className="flex"
            animate="animate"
            variants={loopVariants}
            style={{ width: `${totalLoopedWidth}px` }}
          >
            {row.items.map((tech, techIndex) => (
              <motion.div
                key={`${row.id}-${tech.id}-${techIndex}`}
                whileHover={{ scale: 1.05, boxShadow: `0 0 25px ${tech.brandColor || "rgba(255,255,255,0.25)"}` }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className={`relative flex items-center justify-center w-[120px] sm:w-[150px] h-28 sm:h-32 p-3 sm:p-4 m-2 rounded-xl cursor-pointer border border-white/10 backdrop-blur-lg ${
                  tech.empty ? "bg-transparent border-dashed border-white/10" : "bg-black/40 hover:bg-black/60"
                }`}
                onMouseEnter={(e) => !tech.empty && handleMouseEnter(tech, e)}
                onMouseLeave={handleMouseLeave}
              >
                {!tech.empty && <img src={tech.logo} alt={tech.name} className="h-full max-h-14 sm:max-h-16 object-contain brightness-110 contrast-125" />}
              </motion.div>
            ))}
          </motion.div>
        </div>
      ))}

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredTech && hoverPosition && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="fixed z-50 max-w-[260px] px-5 py-4 rounded-2xl text-white backdrop-blur-xl shadow-lg"
            style={{
              background: `linear-gradient(to bottom right, ${hoveredTech.brandColor}40, rgba(0,0,0,0.7))`,
              border: `1px solid ${hoveredTech.brandColor}40`,
              left: tooltipSide === "left" ? Math.max(hoverPosition.x, 120) :
                    tooltipSide === "right" ? Math.min(hoverPosition.x, window.innerWidth - 120) :
                    hoverPosition.x,
              top: hoverPosition.y,
              transform: "translateX(-50%)",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <img src={hoveredTech.logo} alt={hoveredTech.name} className="h-5 w-5" />
              <span className="font-semibold" style={{ color: hoveredTech.brandColor || "#FFD66B" }}>{hoveredTech.name}</span>
            </div>
            <p className="text-white/90 text-sm leading-snug">{hoveredTech.description}</p>
            <div className="absolute left-1/2 bottom-[-10px] w-0 h-0" style={{
              transform: "translateX(-50%)",
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: `10px solid ${hoveredTech.brandColor}40`,
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 100, damping: 18 }} className="mt-16 text-center pb-32">
        <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-3">Ready to launch your project with this stack?</h3>
        <p className="text-lg text-neutral-700 dark:text-gray-300 mb-6">I use these exact technologies to build websites that load fast, look premium, and convert visitors into customers.</p>
        <a
          href="#discovery"
          onClick={handleCtaClick}
          className="inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-semibold rounded-full bg-yellow-500 text-neutral-900 hover:bg-yellow-400 transition-all duration-300 shadow-lg shadow-yellow-400/30 active:scale-[0.98]"
        >
          Let's Plan Your Strategy
        </a>
        <div className="mt-6">
          <a href="#projects" className="text-base font-medium text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-500 transition-colors duration-200 border-b border-transparent hover:border-yellow-500">
            Or, explore my portfolio first &rarr;
          </a>
        </div>
      </motion.div>
    </section>
  );
};
