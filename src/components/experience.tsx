import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { ExternalLink, Play, Wrench, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────

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

// ─── Data ──────────────────────────────────────────────────────────────────────

const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Wise Guys NFT',
    desktopPoster:
      'https://res.cloudinary.com/dytogib3m/image/upload/v1760056724/wiseGuysGroup_peh1tr.webp',
    mobilePoster:
      'https://res.cloudinary.com/dytogib3m/image/upload/v1760056724/wiseGuysGroup_peh1tr.webp',
    desktopVideo:
      'https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/wiseGuys2.mp4',
    mobileVideo:
      'https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/wiseGuy3.mp4',
    live: 'https://the-wise-guys.vercel.app/',
  },
  {
    id: 2,
    title: 'Temedie Portfolio',
    desktopPoster:
      'https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/temedieThumbnail.jpg',
    mobilePoster:
      'https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/TemediethumbnailMobile.jpg',
    desktopVideo:
      'https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/TemedieDesktop.mp4',
    mobileVideo:
      'https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/temedieMobile.mp4',
    live: 'https://temedieportfolio-fifth-deploy.netlify.app/',
  },
  {
    id: 3,
    title: 'BestVersion',
    desktopPoster:
      'https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/thumbnailDesktop.jpg',
    mobilePoster:
      'https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/bestversionthumbnailMobile.jpg',
    desktopVideo:
      'https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/bestversionDesktop.mp4',
    mobileVideo:
      'https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/bestversionMobile.mp4',
    live: 'https://bestversionofyourself.netlify.app/',
  },
  {
    id: 4,
    title: 'Dogman NFT',
    desktopPoster:
      'https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/DogmanthumbnailDesktop.jpg',
    mobilePoster:
      'https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/DogmanMobileThumbnail.jpg',
    desktopVideo:
      'https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/DogmanDesktop.mp4',
    mobileVideo:
      'https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev/DogmanMobile.mp4',
    live: '#',
  },
];

// ─── Constants ─────────────────────────────────────────────────────────────────

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const INTRO_BLOCK_HEIGHT_PX = 180;
const STICKY_TOP_OFFSET = `calc(var(--navbar-height, 0px) + ${INTRO_BLOCK_HEIGHT_PX * 0.5}px)`;
const STICKY_PROJECT_COUNT = PROJECTS.length - 1;
const STICKY_FRAME_HEIGHT = `calc(var(--vh-full, 100dvh) - ${STICKY_TOP_OFFSET})`;
const SCROLL_PULL_HEIGHT = `calc(var(--vh-full, 100dvh) - ${STICKY_TOP_OFFSET})`;
const STICKY_SCROLL_HEIGHT = `calc(var(--vh-full, 100dvh) * ${STICKY_PROJECT_COUNT} + var(--vh-full, 100dvh) * 0.6)`;

// ─── Shared: MediaDisplay ──────────────────────────────────────────────────────

const MediaDisplay: React.FC<{
  isMobile: boolean;
  project: Project;
  playing: boolean;
  playShimmer: boolean;
}> = ({ isMobile, project, playing, playShimmer }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const poster = isMobile ? project.mobilePoster : project.desktopPoster;
  const videoUrl = isMobile ? project.mobileVideo : project.desktopVideo;
  const mediaKey = isMobile ? 'm' : 'd';

  useEffect(() => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.currentTime = 0;
      videoUrl && videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
      try {
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
            alt={`${project.title} preview`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onError={(e) =>
              (e.currentTarget.src = `https://placehold.co/1920x1080/0d0d0d/e2e8f0?text=Preview+Unavailable`)
            }
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
            transition={{ duration: 0.32 }}
          />
        )}
      </AnimatePresence>

      {/* Shimmer sweep  desktop only */}
      {!isMobile && (
        <AnimatePresence>
          {playShimmer && (
            <motion.div
              key={`shimmer-${project.id}`}
              initial={{ x: '-30%', opacity: 0 }}
              animate={{ x: '130%', opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1 }}
              className="absolute top-[12%] left-[-20%] w-[60%] h-[20%] skew-x-[-18deg] pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.14), rgba(255,255,255,0))',
              }}
            />
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

// ─── Shared: FrameControls ─────────────────────────────────────────────────────

const FrameControls: React.FC<{
  project: Project;
  index: number;
  openVideoIndex: number | null;
  setOpenVideoIndex: React.Dispatch<React.SetStateAction<number | null>>;
  isMobile: boolean;
}> = ({ project, index, openVideoIndex, setOpenVideoIndex, isMobile }) => {
  const playing = openVideoIndex === index;
  const isOngoing = project.live === '#' || index === PROJECTS.length - 1;
  const videoAvail = isMobile ? project.mobileVideo : project.desktopVideo;
  const btnBase =
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-sm shadow-md transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400';

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <AnimatePresence initial={false} mode="wait">
        {playing && videoAvail ? (
          <motion.button
            key="close"
            onClick={() => setOpenVideoIndex(null)}
            className={`${btnBase} bg-white text-black hover:bg-neutral-100 active:scale-95`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <X className="w-3.5 h-3.5" /> Close Demo
          </motion.button>
        ) : (
          videoAvail && (
            <motion.button
              key="play"
              onClick={() => setOpenVideoIndex(index)}
              className={`${btnBase} bg-yellow-400 text-neutral-900 hover:bg-yellow-300 active:scale-95`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Watch Demo
            </motion.button>
          )
        )}
      </AnimatePresence>

      {!isOngoing ? (
        <a
          href={project.live}
          target="_blank"
          rel="noreferrer noopener"
          className={`${btnBase} border border-white/20 text-white bg-black/70 hover:bg-black/90 active:scale-95`}
        >
          <ExternalLink className="w-3.5 h-3.5" /> Visit Live
        </a>
      ) : (
        <span
          className={`${btnBase} border border-neutral-600 text-neutral-400 bg-black/40 cursor-not-allowed`}
        >
          <Wrench className="w-3.5 h-3.5" /> Ongoing
        </span>
      )}
    </div>
  );
};

// ─── Desktop frames ────────────────────────────────────────────────────────────

const DesktopFrame: React.FC<FrameProps> = (props) => (
  <div className="relative w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl aspect-[1.8/1] max-h-[500px] rounded-[14px] overflow-hidden">
    <div
      className="absolute inset-0 rounded-[14px]"
      style={{
        background: 'linear-gradient(180deg,#0d0d0d,#141414)',
        border: '1px solid rgba(255,255,255,0.04)',
        boxShadow:
          '0 48px 100px rgba(2,6,23,0.65), inset 0 1px 0 rgba(255,255,255,0.02)',
      }}
    />
    <div className="absolute inset-4 sm:inset-6 lg:inset-8 rounded-lg overflow-hidden bg-black">
      <MediaDisplay
        isMobile={false}
        project={props.project}
        playing={props.openVideoIndex === props.index}
        playShimmer={props.playShimmer}
      />
    </div>
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <FrameControls isMobile={false} {...props} />
    </div>
  </div>
);

const MobileFrame: React.FC<FrameProps> = (props) => (
  <div className="relative w-[180px] sm:w-[210px] md:w-[230px] aspect-[9/19] rounded-[32px] overflow-hidden max-h-[500px]">
    <div
      className="absolute inset-0 rounded-[32px]"
      style={{
        background: 'linear-gradient(180deg,#080808,#0e0e0e)',
        border: '5px solid rgba(255,255,255,0.025)',
        boxShadow: '0 22px 48px rgba(2,6,23,0.55)',
      }}
    />
    <div className="absolute inset-[14px] rounded-[22px] overflow-hidden bg-black">
      <MediaDisplay
        isMobile={true}
        project={props.project}
        playing={props.openVideoIndex === props.index}
        playShimmer={props.playShimmer}
      />
    </div>
    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-14 h-2.5 rounded-b-lg bg-black/90" />
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <FrameControls isMobile={true} {...props} />
    </div>
  </div>
);

// ─── Mobile linear card ────────────────────────────────────────────────────────

const MobileProjectCard: React.FC<{
  project: Project;
  index: number;
  playShimmer: boolean;
  openVideoIndex: number | null;
  setOpenVideoIndex: React.Dispatch<React.SetStateAction<number | null>>;
}> = ({ project, index, playShimmer, openVideoIndex, setOpenVideoIndex }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className="flex flex-col items-center gap-5 w-full"
  >
    {/* Project number + title */}
    <div className="flex items-center gap-3 w-full max-w-xs">
      <span className="text-[0.65rem] font-bold tracking-[0.16em] uppercase text-neutral-400 tabular-nums">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="h-px flex-1 bg-white/10" />
      <span className="text-sm font-semibold text-white">{project.title}</span>
    </div>

    {/* Mobile mockup */}
    <div className="flex justify-center">
      <MobileFrame
        project={project}
        index={index}
        playShimmer={playShimmer}
        openVideoIndex={openVideoIndex}
        setOpenVideoIndex={setOpenVideoIndex}
      />
    </div>
  </motion.div>
);

// ─── Main component ────────────────────────────────────────────────────────────

export const WorkExperience: React.FC = () => {
  const stickyContainerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: stickyContainerRef,
    offset: ['start end', 'end start'],
  });

  const [openVideoIndex, setOpenVideoIndex] = useState<number | null>(null);
  const scaled = useTransform(scrollYProgress, (p) => p * STICKY_PROJECT_COUNT);
  const [activeStickyIndex, setActiveStickyIndex] = useState(0);
  const [shimmerPlayed, setShimmerPlayed] = useState<boolean[]>(() =>
    Array(PROJECTS.length).fill(false)
  );

  useEffect(() => {
    const unsub = scaled.onChange((val) => {
      const stickyIdx = clamp(
        Math.floor(val + 0.0001),
        0,
        STICKY_PROJECT_COUNT - 1
      );
      const absoluteIdx = stickyIdx + 1;
      setActiveStickyIndex(stickyIdx);
      setShimmerPlayed((prev) => {
        if (!prev[absoluteIdx]) {
          const c = [...prev];
          c[absoluteIdx] = true;
          return c;
        }
        return prev;
      });
      setOpenVideoIndex((cur) => (cur === absoluteIdx ? cur : null));
    });
    return () => unsub();
  }, [scaled]);

  useEffect(() => {
    const t = setTimeout(() => {
      setShimmerPlayed((prev) => {
        if (!prev[0]) {
          const c = [...prev];
          c[0] = true;
          return c;
        }
        return prev;
      });
    }, 500);
    return () => clearTimeout(t);
  }, []);

  const entryVariant = (i: number) => {
    const base: any = {
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: { duration: 0.9, ease: 'easeOut' },
      },
      hidden: {},
      exit: { transition: { duration: 0.6 } },
    };
    switch (i - 1) {
      case 0:
        base.hidden = { opacity: 0, y: 60, scale: 0.98 };
        base.exit = { opacity: 0, y: -40, scale: 0.98 };
        break;
      case 1:
        base.hidden = { opacity: 0, scale: 0.8 };
        base.exit = { opacity: 0, scale: 0.96, y: -32 };
        break;
      case 2:
        base.hidden = { opacity: 0, x: 120, scale: 0.98 };
        base.exit = { opacity: 0, x: 60, y: -40 };
        break;
      default:
        base.hidden = { opacity: 0 };
        base.exit = { opacity: 0 };
    }
    return base;
  };

  const handleCta = (e: React.MouseEvent) => {
    e.preventDefault();
    document
      .getElementById('discovery')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.dispatchEvent(new CustomEvent('openDiscoveryForm'));
  };

  const frameProps = { openVideoIndex, setOpenVideoIndex };

  return (
    <section
      id="projects"
      className="relative w-full text-neutral-900 dark:text-white font-sans"
      style={{ touchAction: 'pan-y' }}
    >
      {/* ── Section header ─────────────────────────────────────────────────────── */}
      <div className="w-full" style={{ height: `${INTRO_BLOCK_HEIGHT_PX}px` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-black dark:text-white"
          >
            Featured Projects
          </motion.h2>
        </div>
      </div>

      {/* ── Case study callout ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto px-4 sm:px-6 mt-10 sm:mt-14 mb-4"
      >
        <div
          className="relative rounded-2xl p-6 sm:p-8 border border-white/10 bg-neutral-950 overflow-hidden"
          style={{ borderLeft: '3px solid #EAB308' }}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 mb-4 sm:mb-5">
            Case Study · Backend &amp; Payments
          </span>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 leading-snug">
            GoBigMarketplace Payment System &amp; Recovery
          </h3>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed mb-5 sm:mb-6">
            Built a full payment layer with Paystack and Flutterwave and a
            multi-currency wallet. Diagnosed and fixed a checkout silently
            losing every deposit failed webhooks, no error logging, users paying
            and receiving nothing. Rebuilt with polling-based confirmation, full
            logging, and a failed-transaction recovery dashboard.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              'Next.js',
              'Cloudflare Workers',
              'Hono',
              'Drizzle',
              'D1',
              'Paystack',
              'Flutterwave',
            ].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/70 border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      <hr className="my-8 sm:my-12 border-t border-gray-200 dark:border-gray-800" />

      {/* ══════════════════════════════════════════════════════════════════════════
          MOBILE: linear scroll  one project card per viewport section
          (hidden on lg+, replaced by sticky scroll below)
         ══════════════════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden px-4 sm:px-6 space-y-14 pb-16">
        {PROJECTS.map((p, i) => (
          <MobileProjectCard
            key={p.id}
            project={p}
            index={i}
            playShimmer={shimmerPlayed[i]}
            openVideoIndex={openVideoIndex}
            setOpenVideoIndex={setOpenVideoIndex}
          />
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          DESKTOP (lg+): first project non-sticky, then sticky scroll
         ══════════════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:block">
        {/* First project  scrolls with page */}
        <div
          className="relative w-full flex items-center justify-center mb-24"
          style={{ height: SCROLL_PULL_HEIGHT }}
        >
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <div className="w-full flex flex-row items-center justify-center gap-10 xl:gap-14">
              <div className="flex-1 flex items-center justify-center">
                <DesktopFrame
                  project={PROJECTS[0]}
                  index={0}
                  playShimmer={shimmerPlayed[0]}
                  {...frameProps}
                />
              </div>
              <div className="flex-none flex items-center justify-center">
                <MobileFrame
                  project={PROJECTS[0]}
                  index={0}
                  playShimmer={shimmerPlayed[0]}
                  {...frameProps}
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="my-16 md:my-20 border-t border-gray-200 dark:border-gray-800" />

        {/* Sticky scroll: projects 2-4 */}
        <div
          ref={stickyContainerRef}
          className="relative w-full"
          style={{ height: STICKY_SCROLL_HEIGHT }}
        >
          <div
            className="sticky z-10"
            style={{
              top: STICKY_TOP_OFFSET,
              height: STICKY_FRAME_HEIGHT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              willChange: 'transform',
              touchAction: 'pan-y',
            }}
          >
            <div className="relative w-full max-w-7xl h-full flex items-center justify-center px-6">
              <AnimatePresence mode="wait">
                {PROJECTS.slice(1).map((p, i) => {
                  if (i !== activeStickyIndex) return null;
                  const absIdx = i + 1;
                  const variants = entryVariant(absIdx);
                  return (
                    <motion.div
                      key={p.id}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={variants}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-full flex flex-row items-center justify-center gap-10 xl:gap-14">
                        <div className="flex-1 flex items-center justify-center">
                          <DesktopFrame
                            project={p}
                            index={absIdx}
                            playShimmer={shimmerPlayed[absIdx]}
                            {...frameProps}
                          />
                        </div>
                        <div className="flex-none flex items-center justify-center">
                          <MobileFrame
                            project={p}
                            index={absIdx}
                            playShimmer={shimmerPlayed[absIdx]}
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
      </div>

      <hr className="mt-8 mb-12 sm:mt-12 sm:mb-20 border-t border-gray-200 dark:border-gray-800" />

      {/* ── CTA ────────────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 pb-12 sm:pb-16 px-4 sm:px-6 text-center max-w-3xl mx-auto"
      >
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[-0.025em] leading-snug">
          Ready to build something like this?
        </h3>

        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <motion.a
            href="#discovery"
            onClick={handleCta}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5
                       rounded-full bg-yellow-400 text-neutral-900 font-semibold text-[0.95rem]
                       shadow-[0_4px_20px_rgba(234,179,8,0.35)] hover:shadow-[0_8px_32px_rgba(234,179,8,0.5)]
                       hover:bg-yellow-300 active:scale-95 active:bg-yellow-500
                       overflow-hidden transition-all duration-300
                       focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/60
                       min-w-[240px] sm:min-w-0"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/25 to-transparent"
            />
            Let's plan your project
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
};

export default WorkExperience;
