import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  "Home",
  "About",
  "Tech Stack",
  "Projects",
  "Testimonials",
  "Build a Website",
];

const linkMap: Record<string, string> = {
  Home: "#hero",
  About: "#about",
  "Tech Stack": "#tech",
  Projects: "#projects",
  Testimonials: "#testimonials",
  "Build a Website": "#discovery",
};

const idToNameMap: Record<string, string> = {
  hero: "Home",
  about: "About",
  tech: "Tech Stack",
  projects: "Projects",
  testimonials: "Testimonials",
  discovery: "Build a Website",
  footer: "Build a Website",
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  // const [isDark, setIsDark] = useState(true);
  const [textColor, setTextColor] = useState("#fff");

  // const { scrollY } = useScroll();

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
    document.body.classList.toggle("overflow-hidden", !isOpen);
  };

const scrollToSection = (id: string) => {
    const cleanId = id.replace("#", "").toLowerCase();

    // CORRECTION: Allow 'undefined' to fix TS2322 error
  let target: HTMLElement | null | undefined =
      (document.querySelector(id) as HTMLElement | null) ||
      (document.querySelector(`section${id}, footer${id}`) as HTMLElement | null);

    if (!target) {
      target = Array.from(document.querySelectorAll("section[id], footer[id]")).find(
        (sec) => sec.id?.toLowerCase().includes(cleanId)
      ) as HTMLElement | undefined;
    }

    if (target) {
      const viewportHeight = window.innerHeight;
      const scrollOffset = viewportHeight * 0.20; 
      
      const y = target.getBoundingClientRect().top + window.scrollY - scrollOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      
      // 🌟 REQUIRED CHANGE: Dispatch a custom event if we are scrolling to #discovery
      if (id === "#discovery") {
          window.dispatchEvent(new CustomEvent('openDiscoveryForm'));
      }
      
    } else {
      console.warn(`No section found for ${id}`);
    }

    setIsOpen(false);
    document.body.classList.remove("overflow-hidden");
  };

  // Final Synchronized Intersection Observer Logic
  useEffect(() => {
    const sections = document.querySelectorAll("section[id], footer[id]");
    
    const observer = new IntersectionObserver(
      (entries) => {
        let currentSection: IntersectionObserverEntry | undefined;
        
        const visibleEntries = entries
            .filter(entry => entry.boundingClientRect.top <= window.innerHeight - 1)
            .sort((a, b) => (a.boundingClientRect.top - b.boundingClientRect.top));

        if (visibleEntries.length > 0) {
            currentSection = visibleEntries.find(entry => entry.isIntersecting) || visibleEntries[0];
        }

        if (currentSection) {
          const entry = currentSection;

          // --- Theme/Color Logic ---
          const bgColor = getComputedStyle(entry.target as HTMLElement).backgroundColor;
          const rgb = bgColor.match(/\d+/g)?.map(Number) || [255, 255, 255];
          const luminance = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
          const isDarkBg = luminance < 130;
          // setIsDark(isDarkBg);
          setTextColor(isDarkBg ? "#fff" : "#000");
          // --- End Theme/Color Logic ---

          const id = (entry.target as HTMLElement).id;
          const name = idToNameMap[id];
          if (name) setActiveSection(name);
        }
      },
      { 
          root: null, 
          // Match scroll offset to trigger line
          rootMargin: '-20% 0px -80% 0px', 
          threshold: 0.0
      }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const nebulaGradient = `
    linear-gradient(280deg,
      rgba(22, 10, 55, 0.95) 0%,
      rgba(40, 0, 85, 1) 25%,
      rgba(8, 0, 25, 1) 50%,
      rgba(55, 0, 90, 1) 75%,
      rgba(18, 5, 45, 1) 100%
    )
  `;

  const nebulaKeyframes = `
    @keyframes nebulaShift {
      0% { background-position: 35% 50%; }
      100% { background-position: 65% 50%; }
    }
  `;

  // 1. Change 'md' to 'lg' for larger desktop links breakpoint (768px-1024px will now show mobile menu)
  const navClass = `fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[95%] max-w-6xl px-4 lg:px-8 py-4 
    rounded-2xl flex justify-between items-center transition-all duration-500
    ${textColor === "#fff" ? "text-white" : "text-black"}`;

  const textClass = `transition-colors duration-300 ${
    textColor === "#fff" ? "text-white" : "text-black"
  }`;

  const linkClass = `relative font-medium text-base lg:text-lg tracking-wide hover:scale-105 transition-all duration-300
    before:content-[''] before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-[2px]
    before:bg-current before:transition-all before:duration-500 hover:before:w-full hover:text-yellow-400 hover:drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]`;

  // 🌗 Adjust background when theme changes dynamically (event listener logic remains unchanged)
  useEffect(() => {
    const handleThemeChange = (e: any) => {
      const theme = e.detail;
      const nav = document.querySelector("nav");
      if (!nav) return;

      if (theme === "night") {
        (nav as HTMLElement).style.background =
          "linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.25) 100%)";
        (nav as HTMLElement).style.backdropFilter =
          "blur(24px) saturate(250%)";
        (nav as HTMLElement).style.border =
          "1px solid rgba(255,255,255,0.25)";
        (nav as HTMLElement).style.boxShadow =
          "0 6px 20px rgba(255,255,255,0.15), inset 0 0 10px rgba(255,255,255,0.05)";
      } else {
        (nav as HTMLElement).style.background = nebulaGradient;
        (nav as HTMLElement).style.backdropFilter =
          "blur(24px) saturate(190%)";
        (nav as HTMLElement).style.border =
          "1px solid rgba(255,255,255,0.08)";
        (nav as HTMLElement).style.boxShadow =
          "0 6px 24px rgba(0,0,0,0.55), inset 0 0 12px rgba(255,255,255,0.05)";
      }
    };

    window.addEventListener("themeChange", handleThemeChange);
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, [nebulaGradient]);

  return (
    <>
      <motion.nav
        key="navbar"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 90,
          damping: 16,
          delay: 0.25,
        }}
        className={navClass}
        style={{
          background: nebulaGradient,
          color: textColor,
          boxShadow:
            "0 6px 24px rgba(0,0,0,0.55), inset 0 0 12px rgba(255,255,255,0.05)",
          backgroundSize: "300% 300%",
          animation: "nebulaShift 60s ease-in-out infinite",
          backdropFilter: "blur(24px) saturate(190%)",
          WebkitBackdropFilter: "blur(24px) saturate(190%)",
          border: "1px solid rgba(255,255,255,0.08)",
          outline: "1px solid rgba(255,255,255,0.03)",
        }}
      >
        <style>{nebulaKeyframes}</style>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-[1.15rem] font-extrabold tracking-[0.05em] select-none"
        >
          <span className="text-yellow-500">Globe</span>
        </motion.div>

        {/* Desktop Links (Visible from 1024px and up) */}
        {/* 2. Change 'md:flex' to 'lg:flex' */}
        <div className="hidden lg:flex gap-4 xl:gap-10 items-center">
          {/* Main Navigation Links */}
          <div className="flex gap-4 xl:gap-8">
            {navItems
              .filter((item) => item !== "Build a Website")
              .map((item) => (
                <motion.a
                  key={item}
                  href={linkMap[item]}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(linkMap[item]);
                  }}
                  whileHover={{ scale: 1.08 }}
                  className={`${linkClass} ${
                    activeSection === item
                      ? "text-yellow-500 font-semibold drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] before:!w-full"
                      : textClass
                  }`}
                >
                  {item}
                </motion.a>
              ))}
          </div>

          {/* 🟡 CTA Button */}
          <motion.a
            key="Build a Website"
            href={linkMap["Build a Website"]}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(linkMap["Build a Website"]);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1.5 xl:px-5 xl:py-2 text-black text-sm xl:text-base font-bold tracking-wide rounded-full transition-all duration-300 whitespace-nowrap 
                        bg-yellow-500 hover:bg-yellow-400 shadow-lg hover:shadow-xl
                        ${activeSection === "Build a Website" ? "drop-shadow-[0_0_10px_rgba(250,204,21,1)]" : ""}`}
          >
            Let's Plan your Website Strategy
          </motion.a>
        </div>

        {/* Hamburger (mobile) */}
        {/* 3. Change 'md:hidden' to 'lg:hidden' */}
        <motion.button
          className="flex flex-col justify-around w-8 h-8 cursor-pointer z-[10000] lg:hidden"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {["top", "middle", "bottom"].map((_, idx) => (
            <motion.span
              key={idx}
              animate={
                isOpen
                  ? idx === 0
                    ? { rotate: 45, y: 6 }
                    : idx === 1
                    ? { opacity: 0 }
                    : { rotate: -45, y: -6 }
                  : { rotate: 0, y: 0, opacity: 1 }
              }
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className={`block h-0.5 w-full rounded-full ${
                textColor === "#fff" ? "bg-white" : "bg-black"
              }`}
            />
          ))}
        </motion.button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            // 4. Change 'md:hidden' to 'lg:hidden'
            className="fixed top-[100px] left-1/2 -translate-x-1/2 w-[90%] max-w-sm lg:hidden z-[9998]
              rounded-xl px-6 py-8 flex flex-col items-center space-y-4 shadow-xl"
            style={{
              background: "rgba(15, 15, 25, 0.92)",
              boxShadow: "0 12px 32px rgba(0,0,0,0.7)",
              border: "1px solid rgba(173, 216, 230, 0.1)",
              backdropFilter: "blur(22px) saturate(180%)",
              WebkitBackdropFilter: "blur(22px) saturate(180%)",
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
                whileHover={{ scale: 1.08 }}
                className={`text-center font-semibold tracking-wide ${
                    item === "Build a Website" ? "text-yellow-400" : ""
                }`}
                style={{
                  fontSize: "1.4rem",
                  letterSpacing: "0.5px",
                  color: item === "Build a Website" ? undefined : "rgba(255,255,255,0.95)",
                }}
              >
                {item}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;