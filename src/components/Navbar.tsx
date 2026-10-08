import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

// In-page scroll targets, in the order the sections actually appear.
const navItems = ["Home", "Work", "Skills", "About", "Services"];

const linkMap: Record<string, string> = {
  Home: "#hero",
  Work: "#projects",
  Skills: "#tech",
  About: "#about",
  Services: "#services",
};

// Each heading is written to read exactly as its nav label, so the active
// link always matches what's on screen. Sections with no nav entry (e.g.
// Testimonials) are left out here rather than mapped to an unrelated item.
const idToNameMap: Record<string, string> = {
  hero: "Home",
  projects: "Work",
  tech: "Skills",
  about: "About",
  services: "Services",
};

const CTA_LABEL = "Start a project";
// A separate route, not an in-page scroll: shown with an external-page icon
// so it reads differently from the rest of the nav.
const CASE_STUDIES_LABEL = "Case Studies";

// Walks up to the first non-transparent background. Transparent sections are
// painted by <body>, so the walk reaches it.
const resolveBackground = (el: HTMLElement): string => {
  let node: HTMLElement | null = el;
  while (node) {
    const c = getComputedStyle(node).backgroundColor;
    if (c !== "rgba(0, 0, 0, 0)" && c !== "transparent") return c;
    node = node.parentElement;
  }
  return "rgb(255, 255, 255)";
};

// Two skins: white glass over light sections, near-black glass over the night ground.
const skins = {
  light: {
    bar: "rgba(255, 255, 255, 0.92)",
    border: "rgba(15, 23, 42, 0.08)",
    shadow: "0 20px 50px -20px rgba(15, 23, 42, 0.22)",
    ink: "#0f172a",
    muted: "rgba(15, 23, 42, 0.72)",
    accent: "#a16207",
    rule: "rgba(15, 23, 42, 0.08)",
  },
  dark: {
    bar: "rgba(5, 9, 16, 0.92)",
    border: "rgba(255, 255, 255, 0.08)",
    shadow: "0 20px 50px -20px rgba(0, 0, 0, 0.7)",
    ink: "#f8fafc",
    muted: "rgba(248, 250, 252, 0.66)",
    accent: "#facc15",
    rule: "rgba(255, 255, 255, 0.08)",
  },
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const [isDark, setIsDark] = useState(false);
  const skin = isDark ? skins.dark : skins.light;

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
    document.body.classList.toggle("overflow-hidden", !isOpen);
  };

  const scrollToSection = (id: string) => {
    const cleanId = id.replace("#", "").toLowerCase();

    let target: HTMLElement | null | undefined =
      (document.querySelector(id) as HTMLElement | null) ||
      (document.querySelector(`section${id}, footer${id}`) as HTMLElement | null);

    if (!target) {
      target = Array.from(document.querySelectorAll("section[id], footer[id]")).find(
        (sec) => sec.id?.toLowerCase().includes(cleanId)
      ) as HTMLElement | undefined;
    }

    if (target) {
      const scrollOffset = window.innerHeight * 0.2;
      const y = target.getBoundingClientRect().top + window.scrollY - scrollOffset;
      window.scrollTo({ top: y, behavior: "smooth" });

      if (id === "#discovery") {
        window.dispatchEvent(new CustomEvent("openDiscoveryForm"));
      }
    } else {
      console.warn(`No section found for ${id}`);
    }

    setIsOpen(false);
    document.body.classList.remove("overflow-hidden");
  };

  // Tracks the section under the trigger line: highlights its link and picks the skin
  useEffect(() => {
    const sections = document.querySelectorAll("section[id], footer[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.boundingClientRect.top <= window.innerHeight - 1)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        const current =
          visibleEntries.find((entry) => entry.isIntersecting) || visibleEntries[0];

        if (current) {
          const target = current.target as HTMLElement;
          const name = idToNameMap[target.id];
          if (name) setActiveSection(name);

          const rgb = resolveBackground(target).match(/\d+/g)?.map(Number) || [255, 255, 255];
          const luminance = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
          setIsDark(luminance < 130);
        }
      },
      { root: null, rootMargin: "-20% 0px -80% 0px", threshold: 0.0 }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const linkStyle = (active: boolean): React.CSSProperties => ({
    color: active ? skin.accent : skin.muted,
  });

  return (
    <>
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        // Mobile keeps the bar spanning most of the screen (logo and hamburger need
        // room to sit apart). From lg up, width goes to auto: a fixed element
        // positioned by `left` alone shrinks to fit its content, so the pill hugs
        // its own content instead of stretching across the row.
        className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-sm lg:w-auto lg:max-w-[90vw] h-16 lg:h-[76px] flex items-center justify-between lg:justify-start gap-10 lg:gap-20 rounded-full pl-6 pr-2.5 lg:pl-11 lg:pr-4 backdrop-blur-2xl"
        style={{
          background: skin.bar,
          border: `1px solid ${skin.border}`,
          boxShadow: skin.shadow,
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          transition: "background 600ms ease, border-color 600ms ease, box-shadow 600ms ease",
          color: skin.ink,
        }}
      >
        {/* Wordmark: the person's own name, not the brand, so there's no
            ambiguity about who this site belongs to. */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("#hero");
          }}
          className="select-none whitespace-nowrap text-[1.5rem] leading-none font-semibold tracking-[-0.01em]"
          style={{ fontFamily: "'Newsreader', Georgia, serif", color: skin.ink }}
        >
          Joshua<span style={{ color: skin.accent }}>.</span>
        </a>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-14 xl:gap-16">
          <div className="flex items-center gap-10 xl:gap-12">
            {navItems.map((item) => {
              const active = activeSection === item;
              return (
                <motion.a
                  key={item}
                  href={linkMap[item]}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(linkMap[item]);
                  }}
                  whileHover={{ y: -1 }}
                  className="group relative text-[15px] font-medium tracking-[0.01em] whitespace-nowrap transition-colors duration-500"
                  style={linkStyle(active)}
                  aria-current={active ? "location" : undefined}
                >
                  {item}
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-2 left-0 h-[2px] rounded-full transition-[width,opacity] duration-500 ease-out ${
                      active ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-60"
                    }`}
                    style={{ background: skin.accent }}
                  />
                </motion.a>
              );
            })}

            {/* Route, not a scroll target: the small icon marks it as a
                page change, so clicking it doesn't feel like a broken scroll. */}
            <Link
              to="/projects"
              className="group relative inline-flex items-center gap-1 text-[15px] font-medium tracking-[0.01em] whitespace-nowrap transition-colors duration-500"
              style={linkStyle(false)}
            >
              {CASE_STUDIES_LABEL}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-50 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </Link>
          </div>

          <motion.a
            href="#discovery"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#discovery");
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-yellow-400 h-12 px-8 text-[14px] font-semibold text-neutral-950 shadow-[0_8px_24px_-8px_rgba(250,204,21,0.55)] transition-colors duration-300 hover:bg-yellow-300"
          >
            {CTA_LABEL}
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </motion.a>
        </div>

        {/* Hamburger (below lg) */}
        <button
          className="flex flex-col justify-around w-11 h-11 items-center cursor-pointer z-[10000] lg:hidden"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {[0, 1, 2].map((idx) => (
            <motion.span
              key={idx}
              animate={
                isOpen
                  ? idx === 0
                    ? { rotate: 45, y: 12 }
                    : idx === 1
                    ? { opacity: 0 }
                    : { rotate: -45, y: -12 }
                  : { rotate: 0, y: 0, opacity: 1 }
              }
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="block h-px w-5"
              style={{ background: skin.ink }}
            />
          ))}
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8, x: 12 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -8, x: 12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            // Anchored under the hamburger on the right, like a standard dropdown,
            // rather than floating as a full-width centered card.
            className="fixed top-[88px] right-4 w-[78vw] max-w-xs lg:hidden z-[9998] rounded-3xl p-3 backdrop-blur-2xl"
            style={{
              background: skin.bar,
              border: `1px solid ${skin.border}`,
              boxShadow: skin.shadow,
              color: skin.ink,
            }}
          >
            {navItems.map((item) => (
              <motion.a
                key={item}
                href={linkMap[item]}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(linkMap[item]);
                }}
                className="flex items-center px-4 py-4 text-[17px] font-medium border-b"
                style={{ color: skin.ink, borderColor: skin.rule }}
              >
                {item}
              </motion.a>
            ))}
            <Link
              to="/projects"
              onClick={() => {
                setIsOpen(false);
                document.body.classList.remove("overflow-hidden");
              }}
              className="flex items-center justify-between px-4 py-4 text-[17px] font-medium border-b"
              style={{ color: skin.ink, borderColor: skin.rule }}
            >
              {CASE_STUDIES_LABEL}
              <ArrowUpRight className="w-4 h-4 opacity-60" aria-hidden="true" />
            </Link>
            <a
              href="#discovery"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#discovery");
              }}
              className="flex items-center px-4 py-4 text-[17px] font-semibold last:border-b-0"
              style={{ color: skin.accent }}
            >
              {CTA_LABEL}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
