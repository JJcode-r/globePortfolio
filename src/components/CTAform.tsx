import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Briefcase, CheckCircle2, Github, Linkedin, Twitter, User } from "lucide-react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xjkpldkz";

const SOCIAL_LINKS = [
  { Icon: Github, href: "https://github.com/JJcode-r/", label: "GitHub" },
  {
    Icon: Linkedin,
    href: "https://www.linkedin.com/in/globe-the-dev-7b178919a/",
    label: "LinkedIn",
  },
  {
    Icon: Twitter,
    href: "https://x.com/globe_the_dev?t=RO6MAOivsMGasX5H5XPZVA&s=09",
    label: "X",
  },
];

type Audience = "employer" | "freelance";

const PROJECT_TYPES = ["Website", "Web app", "Full platform", "Not sure yet"];
const BUDGET_RANGES = ["Under $2k", "$2k – $7k", "$7k – $20k", "$20k+", "Let's discuss"];

type FormErrors = Partial<
  Record<"fullName" | "email" | "orgOrRole" | "secondary" | "message", string>
>;

/**
 * Researched short-form pattern: two always-visible fields (name, email),
 * an audience toggle that reveals two qualification fields via progressive
 * disclosure, then one open message field. Six visible fields total, down
 * from the previous form's fifteen.
 */
export default function CTAform() {
  const [audience, setAudience] = useState<Audience>("employer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [orgOrRole, setOrgOrRole] = useState(""); // company name / project type
  const [secondary, setSecondary] = useState(""); // role or opportunity / budget range
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});

  const nameRef = useRef<HTMLInputElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  // External "Start a project" buttons dispatch this: scroll here and focus
  // the first field, rather than toggling a reveal (the form is short enough
  // to show directly, so a reveal-click would only add friction back).
  useEffect(() => {
    const handleOpen = () => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => nameRef.current?.focus(), 350);
    };
    window.addEventListener("openDiscoveryForm", handleOpen);
    return () => window.removeEventListener("openDiscoveryForm", handleOpen);
  }, []);

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!fullName.trim()) next.fullName = "Enter your name.";
    if (!email.trim()) next.email = "Enter your email.";
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = "That email doesn't look right.";
    if (!orgOrRole.trim())
      next.orgOrRole = audience === "employer" ? "Enter your company name." : "Pick a project type.";
    if (!secondary.trim())
      next.secondary = audience === "employer" ? "Enter the role." : "Pick a budget range.";
    if (!message.trim()) next.message = "Tell me a little about it.";
    return next;
  };

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setOrgOrRole("");
    setSecondary("");
    setMessage("");
    setErrors({});
    setSuccess(false);
    setProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    let t = 0;
    const timer = window.setInterval(() => {
      t += 15;
      setProgress(Math.min(95, t));
    }, 60);

    const payload = {
      audience,
      fullName,
      email,
      ...(audience === "employer"
        ? { company: orgOrRole, role: secondary }
        : { projectType: orgOrRole, budget: secondary }),
      message,
      submittedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      window.clearInterval(timer);
      setProgress(100);
      await new Promise((r) => setTimeout(r, 250));

      if (!res.ok) throw new Error(`Formspree responded ${res.status}`);

      setSubmitting(false);
      setSuccess(true);
      window.dispatchEvent(new Event("discoveryFormSuccess"));
    } catch (err) {
      window.clearInterval(timer);
      console.error(err);
      setSubmitting(false);
      setProgress(0);
      setErrors({ message: "Something went wrong sending that. Try again, or use a link below." });
    }
  };

  const fieldBase =
    "w-full rounded-xl border bg-white/[0.04] px-4 py-3 text-[15px] text-white placeholder:text-white/35 outline-none transition-colors focus:border-yellow-400/60 focus:bg-white/[0.06]";
  const fieldOk = "border-white/10";
  const fieldErr = "border-red-400/60";

  const secondaryOptions = audience === "employer" ? null : PROJECT_TYPES;
  const budgetOptions = audience === "employer" ? null : BUDGET_RANGES;

  return (
    <section
      ref={sectionRef}
      id="discovery"
      className="relative w-full py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-3xl px-6">
        {/* Same card language as the other CTA panels: dark ground, soft
            corner glows, yellow accent eyebrow. */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[var(--ground-dark)] p-8 shadow-2xl shadow-black/50 sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-yellow-400/5 blur-3xl" />
            <div className="absolute -bottom-16 -right-16 h-60 w-60 rounded-full bg-indigo-500/5 blur-3xl" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-[-0.025em] text-white sm:text-4xl">
              Start a project
            </h2>
            <p className="mt-3 max-w-[48ch] text-[15px] leading-[1.75] text-white/60">
              Hiring for a role or bringing a freelance build? Six fields, one
              message, and I'll reply with the right next step.
            </p>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-6"
                >
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" aria-hidden="true" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Sent. Thank you.</h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-white/60">
                      I read every message myself and reply within a day or two.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-1 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-2.5 text-[13px] font-semibold text-neutral-950 transition-colors hover:bg-yellow-300"
                  >
                    Start a new inquiry
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  noValidate
                  className="mt-10 flex flex-col gap-5"
                >
                  {/* Audience toggle: drives which pair of fields appears next */}
                  <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="I'm reaching out as">
                    {(
                      [
                        { id: "employer", label: "Hiring company", Icon: Briefcase },
                        { id: "freelance", label: "Freelance client", Icon: User },
                      ] as const
                    ).map(({ id, label, Icon }) => (
                      <button
                        key={id}
                        type="button"
                        role="radio"
                        aria-checked={audience === id}
                        onClick={() => {
                          setAudience(id);
                          setOrgOrRole("");
                          setSecondary("");
                        }}
                        className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-[14px] font-medium transition-colors ${
                          audience === id
                            ? "border-yellow-400/60 bg-yellow-400/10 text-yellow-300"
                            : "border-white/10 bg-white/[0.03] text-white/55 hover:border-white/20 hover:text-white/80"
                        }`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Base fields */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <input
                        ref={nameRef}
                        id="fullNameInput"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your name"
                        className={`${fieldBase} ${errors.fullName ? fieldErr : fieldOk}`}
                        aria-invalid={!!errors.fullName}
                      />
                      {errors.fullName && (
                        <p className="mt-1.5 text-[12.5px] text-red-400">{errors.fullName}</p>
                      )}
                    </div>
                    <div>
                      <input
                        id="emailInput"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className={`${fieldBase} ${errors.email ? fieldErr : fieldOk}`}
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-[12.5px] text-red-400">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Qualification fields: content swaps with the audience toggle */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      {secondaryOptions ? (
                        <select
                          id="orgOrRoleInput"
                          value={orgOrRole}
                          onChange={(e) => setOrgOrRole(e.target.value)}
                          className={`${fieldBase} ${errors.orgOrRole ? fieldErr : fieldOk} ${
                            orgOrRole ? "text-white" : "text-white/35"
                          }`}
                          aria-invalid={!!errors.orgOrRole}
                        >
                          <option value="" disabled>
                            Project type
                          </option>
                          {secondaryOptions.map((opt) => (
                            <option key={opt} value={opt} className="text-black">
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          id="orgOrRoleInput"
                          value={orgOrRole}
                          onChange={(e) => setOrgOrRole(e.target.value)}
                          placeholder="Company name"
                          className={`${fieldBase} ${errors.orgOrRole ? fieldErr : fieldOk}`}
                          aria-invalid={!!errors.orgOrRole}
                        />
                      )}
                      {errors.orgOrRole && (
                        <p className="mt-1.5 text-[12.5px] text-red-400">{errors.orgOrRole}</p>
                      )}
                    </div>
                    <div>
                      {budgetOptions ? (
                        <select
                          id="secondaryInput"
                          value={secondary}
                          onChange={(e) => setSecondary(e.target.value)}
                          className={`${fieldBase} ${errors.secondary ? fieldErr : fieldOk} ${
                            secondary ? "text-white" : "text-white/35"
                          }`}
                          aria-invalid={!!errors.secondary}
                        >
                          <option value="" disabled>
                            Budget range
                          </option>
                          {budgetOptions.map((opt) => (
                            <option key={opt} value={opt} className="text-black">
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          id="secondaryInput"
                          value={secondary}
                          onChange={(e) => setSecondary(e.target.value)}
                          placeholder="Role, e.g. Senior Backend Engineer"
                          className={`${fieldBase} ${errors.secondary ? fieldErr : fieldOk}`}
                          aria-invalid={!!errors.secondary}
                        />
                      )}
                      {errors.secondary && (
                        <p className="mt-1.5 text-[12.5px] text-red-400">{errors.secondary}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <textarea
                      id="messageInput"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        audience === "employer"
                          ? "What are you building, and what does this role own?"
                          : "What are you trying to build or fix?"
                      }
                      rows={4}
                      className={`${fieldBase} resize-none ${errors.message ? fieldErr : fieldOk}`}
                      aria-invalid={!!errors.message}
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-[12.5px] text-red-400">{errors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="group relative mt-2 inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-yellow-400 px-7 py-3.5 text-[15px] font-semibold text-neutral-950 shadow-[0_8px_30px_-10px_rgba(250,204,21,0.6)] transition-colors hover:bg-yellow-300 disabled:cursor-wait disabled:opacity-80"
                  >
                    {submitting && (
                      <span
                        className="absolute inset-y-0 left-0 bg-yellow-300/70"
                        style={{ width: `${progress}%`, transition: "width 120ms linear" }}
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative">{submitting ? "Sending…" : "Send"}</span>
                    {!submitting && (
                      <ArrowRight className="relative h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Fallback contact, always visible */}
            <div className="mt-10 flex items-center gap-4 border-t border-white/10 pt-6">
              <span className="text-[13px] text-white/40">Or reach me directly</span>
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors hover:border-white/25 hover:text-white"
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
