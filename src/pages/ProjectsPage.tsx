import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Play } from 'lucide-react';
import {
  PROJECTS,
  ADDITIONAL_WORK,
  STATUS_LABEL,
  type ProjectEntry,
  type ProjectStatus,
} from '../content/projects';

const statusTone: Record<ProjectStatus, string> = {
  live: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  development: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  prelaunch: 'text-sky-700 bg-sky-50 border-sky-200',
};

const StatusChip: React.FC<{ status: ProjectStatus }> = ({ status }) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[12px] font-medium ${statusTone[status]}`}
  >
    <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
    {STATUS_LABEL[status]}
  </span>
);

/** One poster/video pair for a given breakpoint; swaps to video on click. */
const MediaFrame: React.FC<{
  project: ProjectEntry;
  poster: string;
  video?: string;
  className: string;
  mediaClassName: string;
}> = ({ project, poster, video, className, mediaClassName }) => {
  const [playing, setPlaying] = useState(false);
  return (
    <div className={className}>
      <div className={mediaClassName}>
        {playing && video ? (
          <video src={video} className="h-full w-full object-cover" controls autoPlay playsInline />
        ) : (
          <img
            src={poster}
            alt={`${project.name} interface`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )}
      </div>
      {!playing && video && (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/50 to-transparent transition-colors hover:bg-black/30"
          aria-label={`Play the ${project.name} demo`}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-2.5 text-[14px] font-semibold text-neutral-950 shadow-lg transition-colors group-hover:bg-yellow-300">
            <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            Play demo
          </span>
        </button>
      )}
    </div>
  );
};

/**
 * Below sm, the phone mockup is the primary (and only) visual, matching the
 * homepage's mobile treatment exactly. At sm and up, the desktop frame leads
 * with the phone overlapped at the corner. The device frames themselves stay
 * black regardless of page theme, like any real phone or laptop bezel.
 */
const ProjectMedia: React.FC<{ project: ProjectEntry }> = ({ project }) => {
  const media = project.media;
  if (!media) return null;

  return (
    <>
      {/* Phone-primary, below sm */}
      <div className="flex justify-center sm:hidden">
        <MediaFrame
          project={project}
          poster={media.mobilePoster}
          video={media.mobileVideo}
          className="relative w-[220px] overflow-hidden rounded-[32px] border-[6px] border-neutral-800 bg-black shadow-2xl"
          mediaClassName="relative aspect-[9/19] w-full overflow-hidden rounded-[24px] bg-black"
        />
      </div>

      {/* Desktop frame + overlapped phone, sm and up */}
      <div className="relative hidden sm:block">
        <div className="relative overflow-hidden rounded-xl border border-neutral-900/10 bg-black shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)]">
          <MediaFrame
            project={project}
            poster={media.desktopPoster}
            video={media.desktopVideo}
            className="relative"
            mediaClassName="aspect-[16/10] w-full"
          />
        </div>
        <div className="pointer-events-none absolute -bottom-8 -right-3 w-[112px] overflow-hidden rounded-[18px] border-[5px] border-neutral-800 bg-black shadow-2xl lg:w-[128px]">
          <img
            src={media.mobilePoster}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="aspect-[9/19] w-full object-cover"
          />
        </div>
      </div>
    </>
  );
};

const ProjectSection: React.FC<{ project: ProjectEntry; index: number }> = ({
  project,
  index,
}) => (
  <motion.article
    id={project.slug}
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.12 }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className="scroll-mt-28 border-t border-neutral-900/10 pt-14 first:border-t-0 lg:pt-20"
  >
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-3">
      <span
        className="font-mono text-[13px] text-neutral-400 tabular-nums"
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <h2
        className="text-[clamp(1.9rem,4vw,2.9rem)] font-semibold tracking-[-0.02em] text-neutral-900"
        style={{ fontFamily: "'Newsreader', Georgia, serif" }}
      >
        {project.name}
      </h2>
      <StatusChip status={project.status} />
    </div>

    <p className="mt-2 text-[14px] text-neutral-500">{project.kind}</p>

    <p className="mt-6 max-w-[62ch] text-[1.0625rem] leading-[1.75] text-neutral-700">
      {project.blurb}
    </p>

    <div className="mt-7 flex flex-wrap gap-2">
      {project.stack.map((tech) => (
        <span
          key={tech}
          className="rounded-md border border-neutral-900/10 bg-neutral-50 px-2.5 py-1 font-mono text-[12px] text-neutral-600"
        >
          {tech}
        </span>
      ))}
    </div>

    {project.live && (
      <a
        href={project.live}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-yellow-700 underline-offset-4 transition-colors hover:text-yellow-600 hover:underline"
      >
        Visit the live site
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </a>
    )}

    {project.media && (
      <div className="mt-12 mb-20 lg:mb-14">
        <ProjectMedia project={project} />
      </div>
    )}

    <div className="mt-12 grid gap-10 md:grid-cols-2 lg:gap-x-14">
      {project.blocks.map((block, i) => {
        // An odd final block would otherwise orphan in a two-column grid.
        const spans = project.blocks.length % 2 === 1 && i === project.blocks.length - 1;
        return (
          <div
            key={block.heading}
            className={`border-l-2 border-yellow-500/40 pl-5 ${spans ? 'md:col-span-2' : ''}`}
          >
            <h3 className="text-[1.05rem] font-semibold tracking-[-0.01em] text-neutral-900">
              {block.heading}
            </h3>
            <p
              className={`mt-3 text-[15px] leading-[1.8] text-neutral-600 ${
                spans ? 'max-w-[82ch]' : ''
              }`}
            >
              {block.body}
            </p>
          </div>
        );
      })}
    </div>
  </motion.article>
);

const ProjectsPage: React.FC = () => {
  const { hash } = useLocation();
  const [activeSlug, setActiveSlug] = useState(PROJECTS[0]?.slug ?? '');
  const didJump = useRef(false);

  // Deep links (/projects#accafooty) must land on the right section. React
  // Router does not restore hash scroll on its own.
  useEffect(() => {
    if (didJump.current) return;
    didJump.current = true;
    const slug = hash.replace('#', '');
    if (!slug) {
      window.scrollTo(0, 0);
      return;
    }
    // Wait a frame so layout has settled before measuring.
    requestAnimationFrame(() => {
      document.getElementById(slug)?.scrollIntoView({ block: 'start' });
    });
  }, [hash]);

  // Highlights the current project in the index rail.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveSlug(visible.target.id);
      },
      { rootMargin: '-25% 0px -65% 0px', threshold: 0 }
    );
    PROJECTS.forEach((p) => {
      const el = document.getElementById(p.slug);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-neutral-900/10 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[15px] text-neutral-600 transition-colors hover:text-neutral-900"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to portfolio
          </Link>
          <Link
            to="/#discovery"
            className="rounded-full bg-yellow-400 px-5 py-2 text-[13px] font-semibold text-neutral-950 transition-colors hover:bg-yellow-300"
          >
            Start a project
          </Link>
        </div>
      </header>

      {/* Page hero */}
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-12 lg:pt-24">
        <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end">
          <h1
            className="text-[clamp(2.6rem,6vw,4.4rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-neutral-900"
            style={{ fontFamily: "'Newsreader', Georgia, serif" }}
          >
            The work, and what it cost to get right.
          </h1>
          <p className="max-w-[46ch] text-[1.0625rem] leading-[1.8] text-neutral-600 lg:pb-2">
            Six platforms spanning payment infrastructure, financial ledgers and social
            commerce. Each entry includes what I built, and the production problems that
            only appear once real money is moving.
          </p>
        </div>

        {/* Real figures only. Each one is defensible in an interview. */}
        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-neutral-900/10 pt-10 sm:grid-cols-4">
          {[
            { v: '753M → 2M', l: 'D1 row reads, after the fix' },
            { v: '3', l: 'Live in production' },
            { v: '2', l: 'Payment providers integrated' },
            { v: '0', l: 'Duplicate payouts, by design' },
          ].map((stat) => (
            <div key={stat.l}>
              <dt className="sr-only">{stat.l}</dt>
              <dd>
                <span className="block text-[clamp(1.4rem,2.4vw,1.9rem)] font-semibold tracking-[-0.02em] text-yellow-600 tabular-nums">
                  {stat.v}
                </span>
                <span className="mt-1.5 block text-[13px] leading-snug text-neutral-500">
                  {stat.l}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Index rail + case files */}
      <div className="mx-auto max-w-6xl px-6 pb-24">
        <div className="lg:grid lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="Projects" className="hidden lg:block">
            <div className="sticky top-28">
              <p className="mb-4 text-[12px] font-medium tracking-wide text-neutral-400">
                Case files
              </p>
              <ul className="space-y-1">
                {PROJECTS.map((p) => {
                  const active = activeSlug === p.slug;
                  return (
                    <li key={p.slug}>
                      <a
                        href={`#${p.slug}`}
                        className={`block border-l-2 py-1.5 pl-3 text-[14px] transition-colors ${
                          active
                            ? 'border-yellow-500 text-neutral-900'
                            : 'border-neutral-900/10 text-neutral-400 hover:border-neutral-900/25 hover:text-neutral-700'
                        }`}
                      >
                        {p.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          <div className="space-y-16 lg:space-y-24">
            {PROJECTS.map((project, i) => (
              <ProjectSection key={project.slug} project={project} index={i} />
            ))}

            {/* Additional work */}
            <div className="border-t border-neutral-900/10 pt-14 lg:pt-20">
              <h2
                className="text-[clamp(1.6rem,3vw,2.2rem)] font-semibold tracking-[-0.02em] text-neutral-900"
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
              >
                Also delivered
              </h2>
              <dl className="mt-8 divide-y divide-neutral-900/10 border-t border-neutral-900/10">
                {ADDITIONAL_WORK.map((item) => (
                  <div
                    key={item.name}
                    className="grid gap-2 py-5 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-8"
                  >
                    <dt className="text-[15px] font-medium text-neutral-900">{item.name}</dt>
                    <dd className="text-[15px] leading-[1.7] text-neutral-600">
                      {item.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Closing CTA */}
            <div className="border-t border-neutral-900/10 pt-14 lg:pt-20">
              <h2
                className="max-w-[22ch] text-[clamp(1.7rem,3.4vw,2.5rem)] font-semibold leading-tight tracking-[-0.02em] text-neutral-900"
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
              >
                If your money path has a quiet failure in it, I can find it.
              </h2>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/#discovery"
                  className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-7 py-3.5 text-[15px] font-semibold text-neutral-950 shadow-[0_8px_30px_-10px_rgba(250,204,21,0.45)] transition-colors hover:bg-yellow-300"
                >
                  Start a project
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-900/15 px-7 py-3.5 text-[15px] font-medium text-neutral-700 transition-colors hover:border-neutral-900/35 hover:text-neutral-900"
                >
                  Back to portfolio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
