import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Shared call to action. "panel" is the original About design (dark card).
// "blend" drops the card fill so it sits on the night ground.
type CtaPanelProps = {
  variant?: "panel" | "blend";
  eyebrow?: string;
  title?: string;
  body?: string;
  buttonLabel?: string;
  /** Internal route (e.g. "/projects"). Takes priority over onClick. */
  to?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

const defaultClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  const target = document.getElementById("discovery");
  if (target) target.scrollIntoView({ behavior: "smooth" });
  window.dispatchEvent(new Event("openDiscoveryForm"));
};

const CtaPanel: React.FC<CtaPanelProps> = ({
  variant = "panel",
  eyebrow = "Ready to move?",
  title = "Let's Build Something Great",
  body = "Have a vision in mind or just need a fresh online presence? Let's team up and turn your ideas into a site that inspires, converts, and stands out.",
  buttonLabel = "Start a project",
  to,
  onClick = defaultClick,
}) => {
  const buttonClass =
    "group inline-flex items-center gap-3 px-8 py-4 rounded-2xl " +
    "bg-yellow-400 text-neutral-950 font-semibold text-[0.95rem] " +
    "shadow-[0_0_0_0_rgba(234,179,8,0)] hover:shadow-[0_0_32px_6px_rgba(234,179,8,0.35)] " +
    "hover:bg-yellow-300 active:scale-[0.97] active:bg-yellow-500 " +
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/50 " +
    "transition duration-300 ease-out";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border ${
        variant === "blend"
          ? "border-white/[0.08]"
          : "border-white/[0.07] bg-[var(--ground-dark)] backdrop-blur-xl shadow-2xl shadow-black/50"
      }`}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-yellow-400/5 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 w-60 h-60 rounded-full bg-indigo-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 p-8 md:p-10">
        {/* Left: copy */}
        <div className="flex-1 text-center lg:text-left">
          <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-yellow-400/80 mb-2 select-none">
            {eyebrow}
          </p>
          <h3 className="text-2xl md:text-3xl font-bold tracking-[-0.025em] text-white mb-3">
            {title}
          </h3>
          <p className="text-[0.9rem] text-neutral-400 leading-[1.8] max-w-md">{body}</p>
        </div>

        {/* Right: CTA */}
        <div className="flex-shrink-0">
          {to ? (
            <Link to={to} className={buttonClass}>
              {buttonLabel}
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-neutral-900/15 group-hover:translate-x-1 transition-transform duration-300">
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ) : (
            <a href="#discovery" onClick={onClick} className={buttonClass}>
              {buttonLabel}
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-neutral-900/15 group-hover:translate-x-1 transition-transform duration-300">
                <ArrowRight className="w-4 h-4" />
              </span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CtaPanel;
