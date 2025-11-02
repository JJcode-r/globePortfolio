import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion"; // ✅ Type-only import

// Define social media links (Customize these!)
const SOCIAL_HANDLES = {
  linkedin: "https://www.linkedin.com/in/joshua-igburu-7b178919a/", 
  github: "https://github.com/JJcode-r/", 
  x: "https://x.com/IJ_the_Dev?t=rWYlDEtG1PnMrDCNpRoSNQ&s=09", 
};

// ✅ Replaced enum with const + type alias for TS 5 safety
export const ContactMethod = {
  Email: "Email",
  WhatsApp: "WhatsApp",
  Discord: "Discord",
  Twitter: "Twitter",
  LinkedIn: "LinkedIn",
} as const;

export type ContactMethod = (typeof ContactMethod)[keyof typeof ContactMethod];

type AdditionalLink = {
  id: string;
  label: string;
  url: string;
};

type FormErrors = {
  fullName?: string;
  contactHandle?: string;
  projectTitle?: string;
  vision?: string;
  projectScope?: string;
};

const PROJECT_SCOPES = [
  {
    id: "simple",
    label: "Simple Landing Page / Portfolio",
    range: "$600 - $2,500",
    desc: "Basic site, few pages, standard design. No user accounts or e-commerce.",
  },
  {
    id: "standard",
    label: "Standard Business Site / CMS",
    range: "$3,000 - $7,000",
    desc: "Multiple pages, blog/CMS integration, contact forms, moderate interactivity.",
  },
  {
    id: "complex",
    label: "Custom App / E-commerce Platform",
    range: "$7,500 +",
    desc: "Requires user accounts, payment processing, dashboards, or complex APIs.",
  },
];

export default function CTAform() {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [preferredContact, setPreferredContact] = useState<ContactMethod>(
    ContactMethod.Email
  );
  const [contactHandle, setContactHandle] = useState("");
  const [projectScope, setProjectScope] = useState(PROJECT_SCOPES[0].id);
  const [projectTitle, setProjectTitle] = useState("");
  const [vision, setVision] = useState("");
  const [goals, setGoals] = useState("");
  const [inspirationLinks, setInspirationLinks] = useState("");
  const [features, setFeatures] = useState<string>("");
  const [timeline, setTimeline] = useState("");
  const [budget, setBudget] = useState("");
  const [howFound, setHowFound] = useState("");
  const [additionalLinks, setAdditionalLinks] = useState<AdditionalLink[]>([]);
  const [validationErrors, setValidationErrors] = useState<FormErrors>({});

  const contactRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (showForm) setTimeout(() => contactRef.current?.focus(), 120);
  }, [showForm]);

  useEffect(() => {
    const handleOpenForm = () => {
      if (!showForm && !success) setShowForm(true);
    };
    window.addEventListener("openDiscoveryForm", handleOpenForm);
    return () =>
      window.removeEventListener("openDiscoveryForm", handleOpenForm);
  }, [showForm, success]);

  // Simulated async form submission
  const sendForm = async (_payload: Record<string, any>) => {
    return new Promise<{ ok: boolean }>((resolve) => {
      let t = 0;
      const timer = setInterval(() => {
        t += 15;
        setProgress(Math.min(100, t));
      }, 60);
      setTimeout(() => {
        clearInterval(timer);
        setProgress(100);
        setTimeout(() => setProgress(0), 250);
        resolve({ ok: true });
      }, 1400);
    });
  };

  const FEATURE_OPTIONS = [
    "E-commerce / Payments",
    "User Accounts / Dashboard",
    "Admin Panel",
    "Blog / CMS",
    "NFT Minting / Wallet",
    "Animations & Motion",
    "Integrations (API/Payments)",
    "SEO & Analytics",
  ];

  const toggleFeature = (name: string) =>
    setFeatures(features === name ? "" : name);

  const validate = (): FormErrors => {
    const errors: FormErrors = {};
    if (!fullName.trim()) errors.fullName = "Please enter your full name.";
    if (!contactHandle.trim())
      errors.contactHandle = `Please add your ${preferredContact} contact.`;
    if (!projectTitle.trim())
      errors.projectTitle = "Please enter a project title.";
    if (!vision.trim()) errors.vision = "Tell me about the project vision.";
    if (!projectScope.trim())
      errors.projectScope = "Please select a project scope.";
    return errors;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const errors = validate();
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      const firstErrorKey = Object.keys(errors)[0] as keyof FormErrors;
      document.getElementById(firstErrorKey + "Input")?.focus();
      return;
    }

    setSubmitting(true);
    setProgress(6);

    const payload = {
      fullName,
      company,
      preferredContact,
      contactHandle,
      projectScope,
      projectTitle,
      vision,
      goals,
      inspirationLinks,
      features: features || null,
      timeline,
      budget,
      howFound,
      additionalLinks,
      submittedAt: new Date().toISOString(),
    };

    try {
      const res = await sendForm(payload);
      if (res.ok) {
        setSubmitting(false);
        setSuccess(true);
        // NOTE: Scroll to the success message
        setTimeout(() => {
          document
            .getElementById("discovery-success")
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      } else throw new Error("Send failed");
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      setProgress(0);
      // NOTE: Replaced standard alert() with a console error message and an instructional console log.
      console.error(
        "Form submission failed. Replace sendForm with your email endpoint and ensure it returns { ok: true } on success."
      );
    }
  };

  const ErrorMessage = ({ error }: { error?: string }) => (
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="text-red-400 text-sm mt-1"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );

  const selectedScope = PROJECT_SCOPES.find(
    (scope) => scope.id === projectScope
  );

  const buttonVariants: Variants = {
    visible: { opacity: 1, y: 0, scale: 1 },
    hidden: { opacity: 0, y: 18, scale: 0.98 },
  };

  const formVariants: Variants = {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  // Variants for the new success message
  const SuccessVariants: Variants = {
    hidden: { opacity: 0, y: 36, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 20, scale: 0.95 },
  };

  const resetForm = () => {
    setFullName("");
    setCompany("");
    setPreferredContact(ContactMethod.Email);
    setContactHandle("");
    setProjectTitle("");
    setVision("");
    setGoals("");
    setInspirationLinks("");
    setFeatures("");
    setTimeline("");
    setBudget("");
    setHowFound("");
    setAdditionalLinks([]);
    setValidationErrors({});
    setProjectScope(PROJECT_SCOPES[0].id);
    setSuccess(false); // Also reset success state
    setShowForm(false); // Hide the form trigger button too
  };

  // Helper component for social links
  const SocialLink = ({ href, icon, label }: { href: string; icon: string; label: string }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-2 text-blue-500 hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20"
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium text-sm hidden sm:inline">{label}</span>
    </a>
  );

  return (
    <section
      id="discovery"
      className="relative flex flex-col items-center py-16 px-6 md:px-12"
      style={{
        background: "linear-gradient(180deg,#1e2a44 0%, #0a0f1f 100%)",
        color: "white",
      }}
    >
      {/* ✨ Stars Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 28 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              background: "white",
              opacity: 0.06,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl w-full text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
          💡 Let’s build something exceptional
        </h2>
        <p className="text-gray-300 mb-6 max-w-3xl mx-auto">
          Whether you are a startup, brand, or creative team your next digital
          success story starts here. Tell me about your project so I can reach
          out with the right plan.
        </p>

        {/* 💬 CTA Button */}
        <div className="flex justify-center">
          <AnimatePresence>
            {!showForm && !success && (
              <motion.button
                key="cta"
                initial="visible"
                animate="visible"
                exit="hidden"
                variants={buttonVariants}
                transition={{ duration: 0.36, ease: "easeOut" }}
                onClick={() => setShowForm(true)}
                className="relative inline-flex items-center justify-center px-8 py-3 rounded-full font-semibold text-black shadow-lg hover:bg-yellow-300 transition-colors duration-200"
                style={{
                  background: "#ffdd57",
                  boxShadow: "0 8px 30px rgba(255,221,87,0.12)",
                }}
              >
                <span className="mr-3 text-lg">Start Discovery</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="opacity-80"
                >
                  <path
                    d="M5 12h14M13 5l7 7-7 7"
                    stroke="#111827"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* 🧠 Discovery Form / Success Message Container */}
        <div className="mt-8">
          <AnimatePresence>
            {showForm && !success && (
              <motion.form
                key="form"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={formVariants}
                transition={{ duration: 0.45, ease: "circOut" }}
                onSubmit={handleSubmit}
                className="w-full bg-white/4 backdrop-blur-md border border-white/6 rounded-2xl p-6 md:p-8 shadow-xl mb-16 text-left"
              >
                {/* 1️⃣ Contact Info */}
                <div className="mb-4">
                  <div className="flex flex-col md:flex-row gap-3">
                    <label htmlFor="fullNameInput" className="flex-1">
                      <div className="text-lg text-gray-200 font-medium mb-2">
                        Full name
                      </div>
                      <input
                        id="fullNameInput"
                        ref={contactRef}
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          setValidationErrors((p) => ({
                            ...p,
                            fullName: undefined,
                          }));
                        }}
                        className={`w-full rounded-md px-3 py-2 bg-black/40 placeholder-gray-400 text-base ${
                          validationErrors.fullName
                            ? "border-2 border-red-500"
                            : ""
                        }`}
                        placeholder="Your full name"
                      />
                      <ErrorMessage error={validationErrors.fullName} />
                    </label>

                    <label className="flex-1">
                      <div className="text-lg text-gray-200 font-medium mb-2">
                        Company / Brand (optional)
                      </div>
                      <input
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full rounded-md px-3 py-2 bg-black/40 placeholder-gray-400 text-base"
                        placeholder="Company or brand"
                      />
                    </label>
                  </div>
                </div>

                {/* 2️⃣ Contact Method */}
                <div className="mb-4">
                  <div className="text-lg text-gray-200 font-medium mb-2">
                    Preferred contact method
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(Object.values(ContactMethod) as ContactMethod[]).map(
                      (m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setPreferredContact(m)}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 ease-out ${
                            preferredContact === m
                              ? "bg-yellow-400 text-black shadow-md"
                              : "bg-white/6 text-gray-200 hover:bg-white/10 hover:shadow-sm"
                          }`}
                        >
                          {m}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <label htmlFor="contactHandleInput">
                    <div className="text-lg text-gray-200 font-medium mb-2">
                      {preferredContact} handle / link
                    </div>
                    <input
                      id="contactHandleInput"
                      value={contactHandle}
                      onChange={(e) => {
                        setContactHandle(e.target.value);
                        setValidationErrors((p) => ({
                          ...p,
                          contactHandle: undefined,
                        }));
                      }}
                      className={`w-full rounded-md px-3 py-2 bg-black/40 placeholder-gray-400 text-base ${
                        validationErrors.contactHandle
                          ? "border-2 border-red-500"
                          : ""
                      }`}
                      placeholder={`e.g. ${
                        preferredContact === ContactMethod.Email
                          ? "your@email.com"
                          : "your handle"
                      }`}
                    />
                    <ErrorMessage error={validationErrors.contactHandle} />
                  </label>
                </div>

                {/* 3️⃣ Project Scope */}
                <div className="mb-6">
                  <label>
                    <div className="text-lg text-gray-200 font-medium mb-3">
                      Select Project Scope (Required)
                    </div>
                    <div
                      className={`grid md:grid-cols-3 gap-3 p-4 rounded-xl ${
                        validationErrors.projectScope
                          ? "border-2 border-red-500"
                          : "border border-white/10"
                      }`}
                    >
                      {PROJECT_SCOPES.map((scope) => (
                        <div key={scope.id}>
                          <input
                            type="radio"
                            id={scope.id}
                            name="projectScope"
                            value={scope.id}
                            checked={projectScope === scope.id}
                            onChange={() => {
                              setProjectScope(scope.id);
                              setValidationErrors((p) => ({
                                ...p,
                                projectScope: undefined,
                              }));
                            }}
                            className="sr-only peer"
                          />
                          <label
                            htmlFor={scope.id}
                            className="block p-3 rounded-lg text-left cursor-pointer transition-all duration-200 text-sm font-medium border border-white/10
                            peer-checked:bg-yellow-400 peer-checked:text-black peer-checked:border-yellow-400 peer-checked:shadow-xl
                            bg-white/6 text-gray-200 hover:bg-white/10"
                          >
                            {scope.label}
                            <p className="text-xs mt-1 opacity-70 peer-checked:text-black/80">
                              {scope.desc}
                            </p>
                          </label>
                        </div>
                      ))}
                    </div>
                    <ErrorMessage error={validationErrors.projectScope} />
                  </label>
                </div>

                <AnimatePresence>
                  {selectedScope && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, scaleY: 0.8 }}
                      animate={{ opacity: 1, height: "auto", scaleY: 1 }}
                      exit={{ opacity: 0, height: 0, scaleY: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="w-full bg-yellow-400/95 text-black p-4 rounded-lg shadow-2xl mb-6 origin-top"
                    >
                      <h4 className="text-lg font-bold">
                        Scope Price Guidance:
                      </h4>
                      <p className="text-2xl font-extrabold my-1">
                        {selectedScope.range}
                      </p>
                      <p className="text-xs mt-2">
                        NOTE: This is the base range for a{" "}
                        <strong>{selectedScope.label}</strong> project.
                        Complex features selected below (like E-commerce or
                        Admin Panel) will increase the final scope and
                        investment.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 4️⃣ Project Details */}
                <div className="mb-4">
                  <label htmlFor="projectTitleInput">
                    <div className="text-lg text-gray-200 font-medium mb-2">
                      Project title
                    </div>
                    <input
                      id="projectTitleInput"
                      value={projectTitle}
                      onChange={(e) => {
                        setProjectTitle(e.target.value);
                        setValidationErrors((p) => ({
                          ...p,
                          projectTitle: undefined,
                        }));
                      }}
                      className={`w-full rounded-md px-3 py-2 bg-black/40 placeholder-gray-400 text-base ${
                        validationErrors.projectTitle
                          ? "border-2 border-red-500"
                          : ""
                      }`}
                      placeholder="e.g. New eCommerce site for my brand"
                    />
                    <ErrorMessage error={validationErrors.projectTitle} />
                  </label>
                </div>

                <div className="mb-4">
                  <label htmlFor="visionInput">
                    <div className="text-lg text-gray-200 font-medium mb-2">
                      Describe your vision
                    </div>
                    <textarea
                      id="visionInput"
                      value={vision}
                      onChange={(e) => {
                        setVision(e.target.value);
                        setValidationErrors((p) => ({
                          ...p,
                          vision: undefined,
                        }));
                      }}
                      rows={4}
                      className={`w-full rounded-md px-3 py-2 bg-black/40 placeholder-gray-400 text-base ${
                        validationErrors.vision ? "border-2 border-red-500" : ""
                      }`}
                      placeholder="What do you want this site to achieve? Who is it for? Any core features?"
                    />
                    <ErrorMessage error={validationErrors.vision} />
                  </label>
                </div>

                {/* 5️⃣ Add-ons */}
                <div className="mb-4">
                  <div className="text-lg text-gray-200 font-medium mb-2">
                    Desired features (Select ONLY ONE primary add-on)
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {FEATURE_OPTIONS.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => toggleFeature(f)}
                        className={`px-3 py-1 rounded-md text-xs transition-all duration-150 ease-out ${
                          features === f
                            ? "bg-yellow-400 text-black shadow-md"
                            : "bg-white/6 text-gray-200 hover:bg-white/10 hover:shadow-sm"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4 grid md:grid-cols-2 gap-4">
                  <label>
                    <div className="text-lg text-gray-200 font-medium mb-2">
                      Timeline (approx.)
                    </div>
                    <input
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full rounded-md px-3 py-2 bg-black/40 placeholder-gray-400 text-base"
                      placeholder="e.g. 4-8 weeks, Q1 2026"
                    />
                  </label>
                  <label>
                    <div className="text-lg text-gray-200 font-medium mb-2">
                      Budget range (optional)
                    </div>
                    <input
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full rounded-md px-3 py-2 bg-black/40 placeholder-gray-400 text-base"
                      placeholder="e.g. $2k - $5k (Use the guidance above)"
                    />
                  </label>
                </div>

                <div className="mb-4">
                  <div className="text-lg text-gray-200 font-medium mb-2">
                    How did you find me? (optional)
                  </div>
                  <input
                    value={howFound}
                    onChange={(e) => setHowFound(e.target.value)}
                    className="w-full rounded-md px-3 py-2 bg-black/40 placeholder-gray-400 text-base"
                    placeholder="e.g. Twitter, referral, Google"
                  />
                </div>

                {/* ✅ Submit Row */}
                <div className="mt-4 flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="relative inline-flex items-center gap-3 px-5 py-2 rounded-full font-semibold text-black text-sm hover:bg-yellow-300 transition-colors duration-200"
                    style={{
                      background: "#ffdd57",
                      boxShadow: "0 0 10px rgba(255,221,87,0.3)",
                    }}
                  >
                    {submitting ? (
                      <>
                        <span>Sending…</span>
                        <span className="absolute left-0 bottom-0 h-[4px] rounded-b-full w-full overflow-hidden">
                          <span
                            style={{
                              display: "block",
                              height: 4,
                              width: `${progress}%`,
                              background:
                                "linear-gradient(90deg,#ffd54a,#fff07a)",
                              transition: "width 120ms linear",
                            }}
                          />
                        </span>
                      </>
                    ) : (
                      <span>Send Discovery</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setTimeout(() => resetForm(), 300);
                    }}
                    className="px-4 py-2 rounded-full bg-white/6 text-gray-200 text-sm hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}
            {/* 🚀 Success Message */}
            {success && (
              <motion.div
                key="success"
                id="discovery-success"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={SuccessVariants}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="w-full mb-10 bg-green-500/10 backdrop-blur-md border border-green-500/30 rounded-2xl p-8 md:p-12 shadow-xl text-center"
              >
                <div className="text-5xl mb-4 animate-pulse">🎉</div>
                <h3 className="text-3xl font-extrabold text-green-300 mb-3">
                  Submission Successful!
                </h3>
                <p className="text-xl text-gray-200 mb-6 max-w-xl mx-auto">
                  Thank you, <span className ="text-yellow-400"> {fullName || "Friend"} </span> I've received your project details and will review them shortly. You can expect a response via <span className ="text-yellow-400">{preferredContact} </span> within 1-2 business days.
                </p>

                <div className="border-t border-white/10 pt-6">
                  <p className="text-lg font-medium text-yellow-400 mb-4">
                    In the meantime, let's connect!
                  </p>
                  <div className="flex justify-center space-x-4 mb-8">
                    <SocialLink
                      href={SOCIAL_HANDLES.linkedin}
                      icon="🔗"
                      label="LinkedIn"
                    />
                    <SocialLink
                      href={SOCIAL_HANDLES.github}
                      icon="👨‍💻"
                      label="GitHub"
                    />
                    <SocialLink
                      href={SOCIAL_HANDLES.x}
                      icon="🐦"
                      label="X (Twitter)"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-full font-semibold text-black text-sm transition-colors duration-200 bg-yellow-400 hover:bg-yellow-300 shadow-md"
                  >
                    Start a New Inquiry
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
