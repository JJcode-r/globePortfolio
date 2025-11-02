import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface Testimonial {
  quote: string;
  author: string;
  avatarUrl: string;
}

interface Stat {
  id: number;
  label: string;
  value: number;
  suffix?: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "A true craftsman. Love the detail and the time spent into Crafting my portfolio into something memorable",
    author: "— Barr. Temedie Peter-Grate, Legal Practioner",
    avatarUrl: "https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/temediePhoto.jpg",
  },
  {
    quote: "We had very few leads from our previous website untile Globe created our recent website and now we are making sales like never before.",
    author: "— Jireh Priime, Artist",
    avatarUrl: "https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/jirah.jpg",
  },
  {
    quote: "Working with Globe was like collaborating with a principled storyteller, not just a Programmer.",
    author: "— Fortune Chamberlain, Freelance Project Manager ",
    avatarUrl: "https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/fortune.jpg",
  },
  {
    quote: "WowThis is an amazing job you did with the Wise Guys website…….very impressive work my friend It’s very well done",
    author: "— Aloha Shawn, Founder AperunnerBTC Ecosystem",
    avatarUrl: "https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/alohaShawn.jpg",
  },
];

const stats: Stat[] = [
  { id: 1, label: "Projects Built", value: 45, suffix: "+" },
  { id: 2, label: "Avg. Conversion Increase", value: 210, suffix: "%" },
  { id: 3, label: "Happy Clients", value: 10, suffix: "+" },
  { id: 4, label: "Return Clients", value: 85, suffix: "%" },
];

const Testimonials: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    track.innerHTML += track.innerHTML;
    const cards = Array.from(track.children) as HTMLElement[];
    const cardWidth = 280 + 24;
    const totalWidth = (cardWidth * cards.length) / 2;

    const looper = gsap.to(track, {
      x: `-=${totalWidth}px`,
      duration: 35,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
      },
      onUpdate: () => {
        const trackRect = track.getBoundingClientRect();
        const centerX = trackRect.left + trackRect.width / 2;
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const distance = Math.abs(centerX - cardCenter);
          const maxDistance = 300;

          const scale = Math.max(0.85, 1 - distance / maxDistance / 2);
          const opacity = Math.max(0.7, 1 - distance / maxDistance / 1.5);

          gsap.to(card, {
            scale,
            opacity,
            duration: 0.2,
            ease: "power1.out",
          });
        });
      },
    });

    const pause = () => looper.pause();
    const resume = () => looper.play();
    track.parentElement?.addEventListener("mouseenter", pause);
    track.parentElement?.addEventListener("mouseleave", resume);

    return () => {
      looper.kill();
      track.parentElement?.removeEventListener("mouseenter", pause);
      track.parentElement?.removeEventListener("mouseleave", resume);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative flex flex-col items-center justify-start min-h-screen overflow-hidden px-6 py-16 transition-all duration-1000 bg-gradient-to-b from-[#1e2a44] to-[#0a0f1f] text-white"
    >
      {/* Stars Background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-70"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-10 max-w-6xl">
        <h2 className="text-4xl pt-20 md:text-5xl font-extrabold mb-2">
          What Clients Are Saying
        </h2>
        <p className="max-w-3xl mx-auto text-lg text-gray-300">
          Trusted by founders, creatives, and teams who turned vision into traction.
        </p>
      </div>

      {/* Stats */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16 max-w-6xl w-full">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="flex flex-col items-center justify-center rounded-2xl p-4 sm:p-6 text-center shadow-lg transition-all duration-500 hover:scale-[1.05] bg-white/10 border border-white/20 backdrop-blur-md"
          >
            <h3 className="text-4xl sm:text-5xl font-extrabold text-yellow-400">
              {stat.value}
              {stat.suffix}
            </h3>
            <p className="text-sm sm:text-base font-semibold uppercase tracking-wider text-gray-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Carousel */}
      <div className="relative w-full max-w-[1200px] overflow-hidden cursor-grab z-10">
        <div ref={trackRef} className="flex h-[300px] sm:h-[350px] items-center">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="flex-shrink-0 w-[220px] sm:w-[280px] rounded-2xl p-4 sm:p-6 mx-2 sm:mx-3 text-center shadow-lg transition-transform duration-300 bg-white/10 text-gray-200 border border-white/20 backdrop-blur-md"
            >
              <img
                src={t.avatarUrl}
                alt={t.author}
                className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full mb-3 sm:mb-4 object-cover ring-2 ring-yellow-400/40"
              />
              <p className="italic mb-3 sm:mb-4 text-base sm:text-lg leading-relaxed text-white">
                “{t.quote}”
              </p>
              <strong className="block text-sm sm:text-base font-semibold text-yellow-400">
                {t.author}
              </strong>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Bridge */}
      <div className="relative z-10 mt-16 flex flex-col items-center text-center">
        <h3 className="text-2xl font-bold mb-4 text-white">
          Ready to join the success stories?
        </h3>
        <a
          href="#discovery"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("discovery")?.scrollIntoView({ behavior: "smooth" });
            window.dispatchEvent(new Event("openDiscoveryForm"));
          }}
          className="inline-flex items-center justify-center gap-2 bg-yellow-600 text-black font-semibold px-6 mb-10 py-3 rounded-lg shadow hover:bg-yellow-600 transition duration-300"
        >
          <i className="fas fa-rocket"></i> Let’s Build Yours
        </a>
      </div>

      <style>{`
        @keyframes twinkle {
          from { opacity: 0.4; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
