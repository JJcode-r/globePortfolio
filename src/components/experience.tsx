import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

// --- Types & Constants ---

type Project = {
  id: number;
  title: string;
  desktopPoster: string;
  mobilePoster: string;
  desktopVideo?: string;
  mobileVideo?: string;
  live?: string;
};

type FrameProps = {
  project: Project;
  index: number;
  playShimmer: boolean;
  openVideoIndex: number | null;
  setOpenVideoIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Wise Guys NFT (Scrolls with Content)",
    desktopPoster:
      "https://res.cloudinary.com/dytogib3m/image/upload/v1760056724/wiseGuysGroup_peh1tr.webp",
    mobilePoster:
      "https://res.cloudinary.com/dytogib3m/image/upload/v1760056724/wiseGuysGroup_peh1tr.webp",
    desktopVideo:
      "https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/wiseGuys2.mp4",
    mobileVideo:
      "https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/wiseGuy3.mp4",
    live: "https://the-wise-guys.vercel.app/",
  },
  {
    id: 2,
    title: "Temedie Portfolio (Sticky Start)",
    desktopPoster:
      "https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/temedieThumbnail.jpg",
    mobilePoster:
      "https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/TemediethumbnailMobile.jpg",
    desktopVideo:
      "https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/TemedieDesktop.mp4",
    mobileVideo:
      "https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/temedieMobile.mp4",
    live: "https://temedieportfolio-fifth-deploy.netlify.app/",
  },
  {
    id: 3,
    title: "BestVersion (Sticky Middle)",
    desktopPoster:
      "https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/thumbnailDesktop.jpg",
    mobilePoster:
      "https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/bestversionthumbnailMobile.jpg",
    desktopVideo:
      "https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/bestversionDesktop.mp4",
    mobileVideo:
      "https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/bestversionMobile.mp4",
    live: "https://bestversionofyourself.netlify.app/",
  },
  {
    id: 4,
    title: "Dogman NFT (Sticky End)",
    desktopPoster:
      "https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/DogmanthumbnailDesktop.jpg",
    mobilePoster:
      "https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/DogmanMobileThumbnail.jpg",
    desktopVideo:
      "https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/DogmanDesktop.mp4",
    mobileVideo:
      "https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/DogmanMobile.mp4",
    live: "#",
  },
];

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const INTRO_BLOCK_HEIGHT_PX = 180;
// We add 0px to the top offset to ensure the sticky element is fully visible below a potential navbar/header.
const STICKY_TOP_OFFSET = `calc(var(--navbar-height, 0px) + ${INTRO_BLOCK_HEIGHT_PX * 0.5}px)`; 
const STICKY_PROJECT_COUNT = PROJECTS.length - 1; // Number of projects in the sticky section (3)
// Height of the viewport area where the sticky content lives
const STICKY_FRAME_HEIGHT = `calc(100vh - ${STICKY_TOP_OFFSET})`;
// This height pulls the scroll to the first sticky frame when entering the section
const SCROLL_PULL_HEIGHT_VAL = `calc(100vh - ${STICKY_TOP_OFFSET})`; 
// Total scrollable height for the sticky section (3 projects * 100vh + 60vh buffer)
const STICKY_SCROLL_HEIGHT = `calc(100vh * ${STICKY_PROJECT_COUNT} + 60vh)`;

// --- Shared Components ---

type MediaDisplayProps = {
  isMobile: boolean;
  project: Project;
  playing: boolean;
  playShimmer: boolean;
};

const MediaDisplay: React.FC<MediaDisplayProps> = ({
  isMobile,
  project,
  playing,
  playShimmer,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const poster = isMobile ? project.mobilePoster : project.desktopPoster;
  const videoUrl = isMobile ? project.mobileVideo : project.desktopVideo;
  const mediaKey = isMobile ? "m" : "d";

  useEffect(() => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.currentTime = 0;
      videoUrl && videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
      try {
        // Resetting time might fail if source isn't fully loaded, so wrap in try/catch
        videoRef.current.currentTime = 0;
      } catch {}
    }
  }, [playing, videoUrl]);

  return (
    <div className="absolute inset-0 rounded-lg overflow-hidden bg-black flex items-center justify-center">
      <AnimatePresence mode="wait">
        {!playing || !videoUrl ? (
          <motion.img
            key={`poster-${mediaKey}-${project.id}`}
            src={poster}
            alt={`${project.title} poster`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            // Basic image error fallback
            onError={(e) => (e.currentTarget.src = `https://placehold.co/1920x1080/0d0d0d/e2e8f0?text=Image+Unavailable`)}
          />
        ) : (
          <motion.video
            key={`video-${mediaKey}-${project.id}`}
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover"
            controls
            autoPlay
            playsInline
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.36 }}
          />
        )}
      </AnimatePresence>

      {/* Shimmer Effect */}
      {isMobile ? null : ( // Only show shimmer on desktop frame for cleaner look
        <AnimatePresence>
          {playShimmer && (
            <motion.div
              key={`shimmerd-${project.id}`}
              initial={{ x: "-30%", opacity: 0 }}
              animate={{ x: "130%", opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1 }}
              className="absolute top-[12%] left-[-20%] w-[60%] h-[20%] skew-x-[-18deg]"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.14), rgba(255,255,255,0))",
                pointerEvents: "none",
              }}
            />
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

type ControlsProps = {
  project: Project;
  index: number;
  openVideoIndex: number | null;
  setOpenVideoIndex: React.Dispatch<React.SetStateAction<number | null>>;
  isMobile: boolean;
};

const FrameControls: React.FC<ControlsProps> = ({
  project,
  index,
  openVideoIndex,
  setOpenVideoIndex,
  isMobile,
}) => {
  const playing = openVideoIndex === index;
  const isOngoing = project.live === "#" || index === PROJECTS.length - 1;
  const videoAvailable = isMobile ? project.mobileVideo : project.desktopVideo;
  const baseClass = `px-3 py-1.5 rounded-full font-semibold text-sm shadow-md transition-all duration-300 ${isMobile ? 'w-auto min-w-[140px]' : ''}`;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center gap-3 ${isMobile ? 'pointer-events-auto' : 'rounded-full px-3 py-2'}`}
      style={isMobile ? {} : {
          background: "linear-gradient(90deg, rgba(0,0,0,0.36), rgba(255,255,255,0.02))",
          border: "1px solid rgba(255,255,255,0.04)",
        }}
    >
      <AnimatePresence initial={false} mode="wait">
        {playing && videoAvailable ? (
          <motion.button
            key="close-btn"
            onClick={() => setOpenVideoIndex(null)}
            className={`${baseClass} bg-white text-black`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            ✕ Close Demo
          </motion.button>
        ) : (
          videoAvailable && (
            <motion.button
              key="play-btn"
              onClick={() => setOpenVideoIndex(index)}
              className={`${baseClass} bg-yellow-500 text-black`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              ▶ Watch Demo
            </motion.button>
          )
        )}
      </AnimatePresence>

      {!isOngoing ? (
        <a
          href={project.live}
          target="_blank"
          rel="noreferrer noopener"
          className={`${baseClass} font-medium ${isMobile ? 'block lg:hidden text-white border border-white/20 bg-black/80 hover:bg-black/90' : 'hidden lg:inline-flex items-center gap-2 border border-white/10 text-white bg-white/5 hover:bg-white/10'}`}
        >
          🌐 Visit Live
        </a>
      ) : (
        <span
          className={`${baseClass} ${isMobile ? 'block lg:hidden text-gray-400 border border-gray-600 bg-black/50 cursor-not-allowed' : 'hidden lg:inline-flex items-center gap-2 border border-gray-600 text-gray-400 bg-black/30 cursor-not-allowed'} font-medium`}
        >
          🔧 Ongoing Project
        </span>
      )}
    </div>
  );
};

// --- Frame Components ---

const DesktopFrame: React.FC<FrameProps> = (props) => {
  return (
    <div className="relative w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl aspect-[1.8/1] max-h-[500px] rounded-[14px] overflow-hidden">
      {/* Device Shell Styling */}
      <div
        className="absolute inset-0 rounded-[14px]"
        style={{
          background: "linear-gradient(180deg,#0d0d0d,#141414)",
          border: "1px solid rgba(255,255,255,0.04)",
          boxShadow: "0 48px 100px rgba(2,6,23,0.65), inset 0 1px 0 rgba(255,255,255,0.02)",
        }}
      />
      {/* Inner Screen */}
      <div className="absolute inset-4 sm:inset-6 lg:inset-8 rounded-lg overflow-hidden bg-black flex items-center justify-center">
        <MediaDisplay isMobile={false} project={props.project} playing={props.openVideoIndex === props.index} playShimmer={props.playShimmer} />
      </div>

      {/* Controls Overlay - FIX: Removed pointer-events-none */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <FrameControls isMobile={false} {...props} />
      </div>
    </div>
  );
};

const MobileFrame: React.FC<FrameProps> = (props) => {
  return (
    <div className="relative w-[200px] sm:w-[230px] md:w-[250px] aspect-[9/19] rounded-[36px] overflow-hidden max-h-[520px] max-w-[280px]">
      {/* Device Shell Styling */}
      <div
        className="absolute inset-0 rounded-[36px]"
        style={{
          background: "linear-gradient(180deg,#080808,#0e0e0e)",
          border: "6px solid rgba(255,255,255,0.02)",
          boxShadow: "0 22px 48px rgba(2,6,23,0.55)",
        }}
      />
      {/* Inner Screen */}
      <div className="absolute inset-4 rounded-[28px] overflow-hidden bg-black">
        <MediaDisplay isMobile={true} project={props.project} playing={props.openVideoIndex === props.index} playShimmer={props.playShimmer} />
      </div>

      {/* Notch/Speaker Grill */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-3 rounded-b-lg bg-black/90" />

      {/* Controls Overlay - FIX: Removed pointer-events-none */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <FrameControls isMobile={true} {...props} />
      </div>

      {/* Bottom Shadow for depth */}
      <div
        className="absolute bottom-[-10px] left-[15%] w-[70%] h-[28px]"
        style={{
          background: "radial-gradient(ellipse at center, rgba(2,6,23,0.38), rgba(2,6,23,0))",
          filter: "blur(16px)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

// --- Main Component ---

export const WorkExperience: React.FC = () => {
  const stickyContainerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: stickyContainerRef,
    offset: ["start end", "end start"],
  });
  const [openVideoIndex, setOpenVideoIndex] = useState<number | null>(null);
  const scaled = useTransform(scrollYProgress, (p) => p * STICKY_PROJECT_COUNT);
  const [activeStickyIndex, setActiveStickyIndex] = useState(0);
  
  // Tracks if the shimmer has played for a project (index 0 is the non-sticky project)
  const [shimmerPlayed, setShimmerPlayed] = useState<boolean[]>(
    () => Array(PROJECTS.length).fill(false)
  );

  useEffect(() => {
    const unsub = scaled.onChange((val) => {
      // Determine the index of the currently active sticky element (0, 1, or 2)
      const stickyIdx = clamp(Math.floor(val + 0.0001), 0, STICKY_PROJECT_COUNT - 1);
      setActiveStickyIndex(stickyIdx);
      
      // The index in the full PROJECTS array (1, 2, or 3)
      const absoluteIndex = stickyIdx + 1;

      // Trigger shimmer effect once per project when it becomes active
      setShimmerPlayed((prev) => {
        if (!prev[absoluteIndex]) {
          const c = prev.slice();
          c[absoluteIndex] = true;
          return c;
        }
        return prev;
      });
      
      // Automatically close video if we scroll away from the currently playing project
      setOpenVideoIndex((current) => (current === absoluteIndex ? current : null));
    });
    return () => unsub();
  }, [scaled]);
  
  // Trigger shimmer for the first, non-sticky project on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShimmerPlayed((prev) => {
        if (!prev[0]) {
          const c = prev.slice();
          c[0] = true;
          return c;
        }
        return prev;
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);


  const entryVariant = (i: number) => {
    // i is the absolute index (1, 2, 3)
    // stickyIdx is the zero-based index for the transitions (0, 1, 2)
    const stickyIdx = i - 1;
    
    const base = {
      visible: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0.9, ease: "easeOut" } },
      hidden: {},
      exit: { transition: { duration: 0.6 } },
    } as any;

    switch (stickyIdx) {
      case 0: // Project 2: Enters from bottom, exits to top/back
        base.hidden = { opacity: 0, y: 60, scale: 0.98 };
        base.exit = { opacity: 0, y: -40, scale: 0.98 };
        break;
      case 1: // Project 3: Enters from scaled-down, exits to scaled-down/top
        base.hidden = { opacity: 0, scale: 0.8 };
        base.exit = { opacity: 0, scale: 0.96, y: -32 };
        break;
      case 2: // Project 4: Enters from right, exits to top/right
        base.hidden = { opacity: 0, x: 120, scale: 0.98 };
        base.exit = { opacity: 0, x: 60, y: -40 };
        break;
      default:
        base.hidden = { opacity: 0 };
        base.exit = { opacity: 0 };
    }
    return base;
  };

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Simulates scrolling to a discovery section and potentially triggering a form modal
    console.log("CTA clicked, attempting to scroll to #discovery and open form.");
    const discoverySection = document.getElementById("discovery");
    if (discoverySection) discoverySection.scrollIntoView({ behavior: "smooth", block: "start" });
    // Custom event for external form/modal trigger (if implemented outside this component)
    window.dispatchEvent(new CustomEvent("openDiscoveryForm")); 
  };

  const frameProps = { openVideoIndex, setOpenVideoIndex };

  return (
    <section id="projects" className="relative w-full dark:bg-neutral-950 text-neutral-900 dark:text-white font-sans">
      {/* --- Introduction Block --- */}
      <div className="relative w-full z-10" style={{ height: `${INTRO_BLOCK_HEIGHT_PX}px` }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black dark:text-white"
          >
            Featured Projects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="mt-3 text-[1.05rem] leading-relaxed text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-medium tracking-tight"
          >
            My catalogue of websites built with both desktop and mobile devices in mind,
            all crafted to deliver an{" "}
            <span className="text-black dark:text-yellow-400 font-semibold">
              immersive experience
            </span>{" "}
            your users can’t find anywhere else.
          </motion.p>
        </div>
      </div>

      <hr className="my-10 md:my-14 border-t border-gray-200 dark:border-gray-800" />

      {/* --- Initial Project (Non-Sticky) --- */}
      <div
        className="relative w-full flex items-center justify-center mb-22"
        style={{ height: SCROLL_PULL_HEIGHT_VAL }}
      >
        <div className="absolute w-full h-full flex items-center justify-center px-6">
          <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            {/* Mobile Frame (Always Order 1) */}
            <div className="flex-none order-1 lg:order-2 flex items-center justify-center">
              <MobileFrame
                project={PROJECTS[0]}
                index={0}
                playShimmer={shimmerPlayed[0]}
                {...frameProps}
              />
              
            </div>
            {/* Desktop Frame (Always Order 2) */}
            <div className="hidden lg:flex flex-1 order-2 lg:order-1 items-center justify-center">
              <DesktopFrame
                project={PROJECTS[0]}
                index={0}
                playShimmer={shimmerPlayed[0]}
                {...frameProps}
              />
            </div>
          </div>
        </div>
      </div>

      <hr className="my-16 md:my-24 border-t border-gray-200 dark:border-gray-800" />

      {/* --- Sticky Scroll Section --- */}
      <div
        ref={stickyContainerRef}
        className="relative w-full"
        style={{ height: STICKY_SCROLL_HEIGHT }}
      >
        <div
          className="sticky z-40"
          style={{
            top: STICKY_TOP_OFFSET,
            height: STICKY_FRAME_HEIGHT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="relative w-full max-w-7xl h-full flex items-center justify-center px-6">
            <AnimatePresence mode="wait">
              {PROJECTS.slice(1).map((p, i) => {
                const absoluteIndex = i + 1; // 1, 2, 3
                
                // Only render the currently active sticky element
                if (i !== activeStickyIndex) return null;

                const variants = entryVariant(absoluteIndex);
                
                return (
                  <motion.div
                    key={p.id}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={variants}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
                      {/* Mobile Frame (Order 1) */}
                      <div className="flex-none order-1 lg:order-2 flex items-center justify-center">
                        <MobileFrame
                          project={p}
                          index={absoluteIndex}
                          playShimmer={shimmerPlayed[absoluteIndex]}
                          {...frameProps}
                        />
                      </div>
                      {/* Desktop Frame (Order 2) */}
                      <div className="hidden lg:flex flex-1 order-2 lg:order-1 items-center justify-center">
                        <DesktopFrame
                          project={p}
                          index={absoluteIndex}
                          playShimmer={shimmerPlayed[absoluteIndex]}
                          {...frameProps}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <hr className="mt-8 mb-16 md:mt-12 md:mb-24 border-t border-gray-200 dark:border-gray-800" />

      {/* --- CTA Block --- */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="relative z-50 pt-0 pb-14 px-6 text-center max-w-4xl mx-auto"
      >
        <h3 className="text-4xl md:text-5xl font-black leading-tight">
          Ready for a website this powerful?
        </h3>
        <p className="mt-2 text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
          Let's discuss how we can build a high-performance, immersive experience
          that turns visitors into long-term clients.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <motion.a
            href="#discovery"
            onClick={handleCtaClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center gap-3 px-8 py-3 text-lg font-bold rounded-full bg-yellow-500 text-neutral-900 hover:bg-yellow-400 transition-all duration-300 shadow-2xl shadow-yellow-400/50 min-w-[280px]"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM15 13H13V17H11V13H9V11H11V7H13V11H15V13Z"
                fill="currentColor"
              />
            </svg>
            Let's Plan your Website strategy
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
};

export default WorkExperience;
