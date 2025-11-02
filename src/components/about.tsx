"use client";
import React from "react";
import { motion } from "framer-motion";

// Card data
const CARDS = [
  {
    id: "who",
    title: "Who I Am",
    body: "I’m a creative front-end developer who blends design, intuition with solid engineering. I love building smooth, beautiful experiences that feel natural to users and help brands stand out.",
    accent: "Craftsmanship & Vision",
  },
  {
    id: "why",
    title: "Why Choose Me",
    body: "Because I build with purpose. Every animation, layout, and detail is there to make your audience feel something — and take action. My work isn’t just about looks; it’s result oriented.",
    accent: "Conversion-Driven Design",
  },
  {
    id: "ethos",
    title: "How I Work",
    body: "Collaboration, transparency, and precision. Clear and concise communicaton, iterate fast, and make sure every pixel, line of code, and user interaction aligns with your business goals.",
    accent: "Empathy • Execution • Results",
  },
  {
    id: "cta",
    title: "Let’s Build Something Great",
    body: "Have a vision in mind or just need a fresh online presence? Let’s team up and turn your ideas into a website that inspires, converts, and stands out from the crowd.",
    accent: "Let's Build Your Website",
    isCTA: true,
  },
];

// TS-friendly variants
const containerVariants: Record<string, any> = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.25 } },
};

const cardVariants: Record<string, any> = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function AboutPinned() {
  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("discovery");
    if (target) target.scrollIntoView({ behavior: "smooth" });
    window.dispatchEvent(new Event("openDiscoveryForm"));
  };

  return (
    <section
      id="about"
      className="relative w-full flex flex-col items-center justify-center py-20 sm:py-24 lg:pb-44 pb-24 mt-10 mb-22"
    >
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-[950] tracking-tight text-center text-neutral-900 dark:text-white mb-12">
        About Me
      </h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {CARDS.map((c) => (
          <motion.article
            key={c.id}
            variants={cardVariants}
            className={`flex flex-col items-center justify-between text-center rounded-2xl p-8 md:p-10 backdrop-blur-md border shadow-lg transition-all duration-300
              ${c.isCTA
                ? "bg-gradient-to-br from-yellow-400 to-yellow-300 text-neutral-900 border-yellow-200 shadow-yellow-400/40 lg:col-span-3 lg:mx-auto lg:w-1/2 mb-24"
                : "bg-neutral-900/90 text-white border-white/10 shadow-black/30"
              }`}
          >
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold mb-3">{c.title}</h3>
              <p className="text-base md:text-lg mb-5 leading-relaxed opacity-90">{c.body}</p>
            </div>

            {c.isCTA ? (
              <a
                href="#discovery"
                onClick={handleCtaClick}
                className="group relative flex items-center justify-center gap-2 px-7 py-2.5 text-base font-semibold rounded-full
                           bg-yellow-500 text-neutral-900 hover:bg-yellow-400
                           shadow-lg shadow-yellow-400/40 transition-all duration-300 transform active:scale-[0.98]
                           focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/50"
              >
                {c.accent}
                <span className="ml-1 text-yellow-600 group-hover:animate-pulse">✨</span>
              </a>
            ) : (
              <span className="inline-block rounded-full px-4 py-2 text-sm md:text-base font-medium bg-white/10 text-white/90">
                {c.accent}
              </span>
            )}
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
