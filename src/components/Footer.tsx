import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLDivElement>(null);

  const owlBackground =
    "https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/owl.jpg";

  const siteMapLinks = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Tech Stack", href: "#tech" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ];

  const expertiseLinks = [
    { name: "Web Development", href: "#webdev" },
    { name: "UI/UX Design", href: "#uix" },
    { name: "SaaS Solutions", href: "#saas" },
    { name: "SEO Solutions", href: "#seo" },
    { name: "AI Integration", href: "#ai" },
    { name: "Performance Optimization", href: "#performance" },
  ];

  const connectLinks = [
    { name: "LinkedIn", href: "https://www.linkedin.com/in/globe-the-dev-7b178919a/", icon: "fab fa-linkedin" },
    { name: "Twitter", href: "https://x.com/globe_the_dev?t=RO6MAOivsMGasX5H5XPZVA&s=09", icon: "fab fa-twitter" },
    { name: "Email", href: "mailto:globetechwrld@gmail.com", icon: "fas fa-envelope" },
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const discoverySection = document.getElementById("discovery");
    if (discoverySection) discoverySection.scrollIntoView({ behavior: "smooth", block: "start" });
    window.dispatchEvent(new Event("openDiscoveryForm"));
  };

  useEffect(() => {
    if (!footerRef.current) return;
    const footer = footerRef.current;
    const stars: HTMLDivElement[] = [];

    for (let i = 0; i < 60; i++) {
      const star = document.createElement("div");
      star.className =
        "footer-star w-1 h-1 bg-white rounded-full absolute opacity-60 pointer-events-none";
      star.style.top = `${Math.random() * footer.offsetHeight}px`;
      star.style.left = `${Math.random() * footer.offsetWidth}px`;
      footer.appendChild(star);
      stars.push(star);
    }

    const gsapScript = document.createElement("script");
    gsapScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
    gsapScript.onload = () => {
      const gsap = (window as any).gsap;
      if (gsap) {
        stars.forEach((star) => {
          gsap.to(star, {
            opacity: gsap.utils.random(0.2, 0.7),
            repeat: -1,
            yoyo: true,
            duration: gsap.utils.random(1, 3),
            delay: gsap.utils.random(0, 2),
          });
        });
      }
    };
    document.body.appendChild(gsapScript);

    return () => {
      stars.forEach((s) => s.remove());
      if (gsapScript.parentNode === document.body) document.body.removeChild(gsapScript);
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative w-full text-white py-20 px-6 md:px-20 overflow-hidden border-t border-yellow-900/50"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(13,27,42,0.95) 0%, rgba(13,27,42,0.7) 70%, rgba(13,27,42,0.5) 100%), url(${owlBackground})`,
        backgroundSize: "cover, contain",
        backgroundPosition: "center center, right center",
        backgroundRepeat: "no-repeat, no-repeat",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className="absolute top-4 right-4 bg-yellow-500 text-black rounded-lg p-2 md:p-3 shadow-xl hover:bg-yellow-600 transition duration-300 font-bold z-10"
        aria-label="Back to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path
            fillRule="evenodd"
            d="M8 10a.5.5 0 0 0 .5-.5V3.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 3.707V9.5a.5.5 0 0 0 .5.5z"
          />
        </svg>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.2 }}
        className="w-full max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 md:gap-20 border-b border-gray-800 pb-12 justify-items-center"
      >
        {/* Brand + CTA */}
        <div className="hidden lg:flex flex-col items-center lg:items-start text-center lg:text-left col-span-1">
          <div className="text-3xl font-extrabold text-yellow-400 mb-4 tracking-wider">Globe The Dev</div>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4">
            Creating immersive, cutting-edge web experiences with scalable design and modern technology.
          </p>
          <a
            href="#discovery"
            onClick={handleCtaClick}
            className="inline-flex items-center justify-center gap-2 bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg shadow hover:bg-yellow-600 transition duration-300 whitespace-nowrap"
          >
            <i className="fas fa-calendar-alt"></i> Start your project
          </a>
        </div>

        {/* Site Map */}
        <div className="text-center md:text-left lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4 text-white">Site Map</h3>
          <ul className="flex flex-col gap-2 text-gray-300 text-sm">
            {siteMapLinks.map((link, idx) => (
              <li key={idx}>
                <a
                  href={link.href}
                  className="hover:text-yellow-400 transition transform hover:translate-x-1 hover:scale-105 duration-200 block"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Expertise */}
        <div className="text-center md:text-left lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4 text-white">Expertise</h3>
          <ul className="flex flex-col gap-2 text-gray-300 text-sm">
            {expertiseLinks.map((link, idx) => (
              <li key={idx}>
                <a
                  href={link.href}
                  className="hover:text-yellow-400 transition transform hover:translate-x-1 hover:scale-105 duration-200 block"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div className="text-center md:text-left lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4 text-white">Connect</h3>
          <ul className="flex flex-col gap-2 text-gray-300 text-sm">
            {connectLinks.map((link, idx) => (
              <li key={idx}>
                <a
                  href={link.href}
                  className="flex items-center justify-center md:justify-start gap-2 hover:text-yellow-400 transition transform hover:translate-x-1 hover:scale-105 duration-200"
                  target={link.href.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                >
                  {link.icon && <i className={`${link.icon}`}></i>}
                  {link.name}
                </a>
              </li>
            ))}
            <li className="mt-3">
              <a
                href="#discovery"
                onClick={handleCtaClick}
                className="inline-flex items-center justify-center gap-2 bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition duration-300"
              >
                <i className="fas fa-phone-alt"></i> Let's plan your website strategy
              </a>
            </li>
          </ul>
        </div>

        {/* Mobile Brand */}
        <div className="flex flex-col items-center justify-start lg:hidden col-span-2 md:col-span-1 p-4 rounded-lg bg-gray-900/50">
          <div className="text-2xl font-extrabold text-yellow-400 tracking-wider">Globe</div>
          <p className="text-gray-400 text-xs mt-1 mb-3">
            Building premium, responsive, and conversion-ready web experiences.
          </p>
          
        </div>
      </motion.div>

      <hr className="border-gray-700 my-6" />

      <div className="mt-4 w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-400 text-xs text-center md:text-left">
        <p>&copy; {new Date().getFullYear()} Globe. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
