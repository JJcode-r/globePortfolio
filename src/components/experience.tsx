import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, FileText, Play, Wrench, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PROJECTS as CASE_FILES } from '../content/projects';
import CtaPanel from './CtaPanel';

// ─── Types ─────────────────────────────────────────────────────────────────────

type Project = {
  id: number;
  slug: string;
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

// Derived from the case files so the homepage and /projects can never drift
// apart. Only entries with real media appear in the mockup carousel.
const PROJECTS: Project[] = CASE_FILES.filter((p) => p.media).map((p, i) => ({
  id: i + 1,
  slug: p.slug,
  title: p.name,
  desktopPoster: p.media!.desktopPoster,
  mobilePoster: p.media!.mobilePoster,
  desktopVideo: p.media!.desktopVideo,
  mobileVideo: p.media!.mobileVideo,
  live: p.live,
}));

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
      if (videoUrl) videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
      try {
        videoRef.current.currentTime = 0;
      } catch {
        // Seeking can throw while the media element is detached; nothing to recover.
      }
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
  const isOngoing = !project.live || project.live === '#';
  const videoAvail = isMobile ? project.mobileVideo : project.desktopVideo;
  const btnBase = isMobile
    ? 'inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full font-semibold text-[11px] whitespace-nowrap shadow-md transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400'
    : 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-sm whitespace-nowrap shadow-md transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400';

  return (
    <div
      className={
        isMobile
          ? 'flex flex-col items-stretch gap-1.5 w-[116px]'
          : 'flex flex-wrap items-center justify-center gap-2'
      }
    >
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
            <X className="w-3.5 h-3.5" /> {isMobile ? 'Close' : 'Close Demo'}
          </motion.button>
        ) : (
          videoAvail && (
            <motion.button
              key="play"
              onClick={() => setOpenVideoIndex(index)}
              className={`${btnBase} bg-yellow-400 text-neutral-950 hover:bg-yellow-300 active:scale-95`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Play className="w-3.5 h-3.5 fill-current" />{' '}
              {isMobile ? 'Demo' : 'Watch Demo'}
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
          <ExternalLink className="w-3.5 h-3.5" /> {isMobile ? 'Live' : 'Visit Live'}
        </a>
      ) : (
        <span
          className={`${btnBase} border border-neutral-600 text-neutral-400 bg-black/40 cursor-not-allowed`}
        >
          <Wrench className="w-3.5 h-3.5" /> Ongoing
        </span>
      )}

      <Link
        to={`/projects#${project.slug}`}
        className={`${btnBase} bg-white text-black hover:bg-neutral-100 active:scale-95`}
      >
        <FileText className="w-3.5 h-3.5" /> {isMobile ? 'Case' : 'Case Study'}
      </Link>
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
  onEnterView: (index: number) => void;
}> = ({ project, index, playShimmer, openVideoIndex, setOpenVideoIndex, onEnterView }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    onViewportEnter={() => onEnterView(index)}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className="flex flex-col items-center gap-5 w-full"
  >
    {/* Project number + title */}
    <div className="flex items-center gap-3 w-full max-w-xs">
      <span className="text-[0.65rem] font-bold tracking-[0.16em] text-neutral-400 tabular-nums">
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
  const [openVideoIndex, setOpenVideoIndex] = useState<number | null>(null);
  const [shimmerPlayed, setShimmerPlayed] = useState<boolean[]>(() =>
    Array(PROJECTS.length).fill(false)
  );

  // Plays each poster's shimmer sweep once, the first time that project
  // scrolls into view. No scroll-jacking: this is a plain whileInView trigger.
  const markShimmer = (i: number) => {
    setShimmerPlayed((prev) => (prev[i] ? prev : prev.map((v, idx) => (idx === i ? true : v))));
  };

  const frameProps = { openVideoIndex, setOpenVideoIndex };

  return (
    <section
      id="projects"
      className="relative w-full pt-16 sm:pt-20 lg:pt-24 text-neutral-900 font-sans"
      style={{ touchAction: 'pan-y' }}
    >
      {/* ── Section header ─────────────────────────────────────────────────────── */}
      <div className="w-full">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-black"
          >
            Work
          </motion.h2>
        </div>
      </div>

      <hr className="my-6 sm:my-8 border-t border-gray-200" />

      {/* ══════════════════════════════════════════════════════════════════════════
          MOBILE: linear scroll  one project card per viewport section
         ══════════════════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden px-4 sm:px-6 space-y-10 pb-12">
        {PROJECTS.map((p, i) => (
          <MobileProjectCard
            key={p.id}
            project={p}
            index={i}
            playShimmer={shimmerPlayed[i]}
            onEnterView={markShimmer}
            openVideoIndex={openVideoIndex}
            setOpenVideoIndex={setOpenVideoIndex}
          />
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          DESKTOP (lg+): normal stacked scroll, no pinning or scroll-jacking
         ══════════════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:flex-col">
        {PROJECTS.map((p, i) => (
          <React.Fragment key={p.id}>
            {i > 0 && <hr className="my-10 md:my-12 border-t border-gray-200" />}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              onViewportEnter={() => markShimmer(i)}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full flex items-center justify-center mb-14"
            >
              <div className="w-full flex flex-row items-center justify-center gap-10 xl:gap-14 px-6">
                <div className="flex-1 flex items-center justify-center">
                  <DesktopFrame
                    project={p}
                    index={i}
                    playShimmer={shimmerPlayed[i]}
                    {...frameProps}
                  />
                </div>
                <div className="flex-none flex items-center justify-center">
                  <MobileFrame
                    project={p}
                    index={i}
                    playShimmer={shimmerPlayed[i]}
                    {...frameProps}
                  />
                </div>
              </div>
            </motion.div>
          </React.Fragment>
        ))}
      </div>

      <hr className="mt-8 mb-12 sm:mt-12 sm:mb-20 border-t border-gray-200" />

      {/* ── CTA: same card design as every other CTA section, pointed at the
             case-study page rather than the discovery form ───────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 max-w-5xl mx-auto"
      >
        <CtaPanel
          eyebrow="Want more detail?"
          title="See the Full Case Studies"
          body="Every project above has a deeper write-up: what I built, the production problems I hit, and how I fixed them."
          buttonLabel="View All Case Studies"
          to="/projects"
        />
      </motion.div>
    </section>
  );
};

export default WorkExperience;
