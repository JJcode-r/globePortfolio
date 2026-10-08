// Single source of truth for project copy.
// The homepage reads the short fields (name, kind, summary, metrics, media).
// The projects page reads the long fields (blurb, blocks) for the deep dive.

export type ProjectStatus = 'live' | 'development' | 'prelaunch';

export type ProjectBlock = {
  heading: string;
  body: string;
};

export type ProjectMedia = {
  desktopPoster: string;
  mobilePoster: string;
  desktopVideo?: string;
  mobileVideo?: string;
};

export type ProjectEntry = {
  slug: string;
  name: string;
  kind: string;
  status: ProjectStatus;
  /** One line. Used on cards and in the mockup frames. */
  summary: string;
  /** Opening paragraph on the projects page. */
  blurb: string;
  stack: string[];
  blocks: ProjectBlock[];
  live?: string;
  media?: ProjectMedia;
  /** Only where the number is real and defensible. */
  metrics?: { value: string; label: string }[];
};

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  live: 'Live in production',
  development: 'In development',
  prelaunch: 'Pre-launch',
};

const R2 = 'https://pub-b5a150bb321345d8b75dc53ad13f4d10.r2.dev';

export const PROJECTS: ProjectEntry[] = [
  {
    slug: 'gobig',
    name: 'GoBig MarketPlace',
    kind: 'Digital services platform, client project',
    status: 'live',
    summary:
      'A wallet-based marketplace for SMM, virtual numbers and eSIM data, built on Cloudflare Workers.',
    blurb:
      'A full-stack digital services marketplace built on Cloudflare Workers, Hono, D1 and Next.js. Users buy social media marketing, virtual phone numbers, eSIM data plans and account logs through a wallet-based payment system with Paystack and Flutterwave topups.',
    stack: [
      'Cloudflare Workers',
      'Hono',
      'D1',
      'Drizzle',
      'Next.js',
      'Paystack',
      'Flutterwave',
    ],
    live: 'https://verify-gee.vercel.app/',
    media: {
      desktopPoster: `${R2}/thumbnail.png`,
      mobilePoster: `${R2}/verify-gee-mobile-photo.webp`,
      desktopVideo: `${R2}/SignIntoYourAccount-Desktop2.mp4`,
      mobileVideo: `${R2}/verify-gee-mobile2.mp4`,
    },
    blocks: [
      {
        heading: 'What I built',
        body: 'A multi-provider architecture where each service category runs on more than one supplier, because coverage and reliability are never uniform. A wallet system with idempotent crediting. A D1-backed email queue with exponential backoff. An admin broadcast fan-out. An eSIM purchasing flow, rebuilt after a mid-project provider migration. A second SMM supplier with batched status sync. A second SMS supplier, 1001SMS, integrated end to end: webhook delivery with signature verification, a guarded fallback poll, and a per-minute provider call budget enforced atomically in D1.',
      },
      {
        heading: 'Money safety, by design',
        body: 'Every order that spends wallet balance ends in exactly one settled state. Refunds go through a single settlement function with a unique reference, so a retry, a double click or a repeated webhook can never pay out twice. When a provider outcome is unknown — a timeout, a malformed response — the order is held for review with the charge kept, instead of guessing. Cancels fail closed unless the provider confirms them.',
      },
      {
        heading: 'Production problems I solved',
        body: 'A 753 million to 2 million D1 row-read explosion caused by an unconditional cron and a broken cache key. A silent webhook failure where the catch block returned HTTP 200 while wallet credits never landed. A Paystack reconciliation dashboard so the client could audit and remediate every affected transaction. A provider that listed stock it would not sell: I built a refusal memory, an outcome log and a breaker scoped per provider, so the country list learns from real order results instead of trusting supplier statistics.',
      },
    ],
  },
  {
    slug: 'accafooty',
    name: 'Accafooty',
    kind: 'Sports investment platform',
    status: 'live',
    summary:
      'A managed sports investment platform handling real money, built on a double-entry ledger.',
    blurb:
      'Accafooty is a managed sports investment platform where users deposit crypto, select an investment plan and receive returns. The operator runs everything through a purpose-built admin backend. Live at sportvest.capital, handling real money.',
    stack: [
      'Next.js',
      'Hono',
      'Neon PostgreSQL',
      'Drizzle',
      'Clerk',
      'NOWPayments',
      'Cloudflare R2',
      'Upstash Redis',
    ],
    live: 'https://sportvest.capital/',
    media: {
      desktopPoster: `${R2}/sportvest.png`,
      mobilePoster: `${R2}/sportvest-mobile-photo.webp`,
      desktopVideo: `${R2}/Sportvest-Desktop2.mp4`,
      mobileVideo: `${R2}/sportvest-mobile2.mp4`,
    },
    blocks: [
      {
        heading: 'What I built',
        body: 'The complete public marketing site. Clerk auth with Google OAuth and passkeys. A full customer dashboard covering KYC upload, investments, wallet and withdrawals. A NOWPayments crypto deposit flow with webhook verification. Investment creation and manual settlement. An admin portal covering KYC review, user management, withdrawal processing with tier limits, plan management, scheduled email broadcast, and a full transactional email system.',
      },
      {
        heading: 'Why the ledger is the product',
        body: 'This is not a frontend sitting on top of a payment API. The double-entry ledger is the core of the platform. Every balance is derived from ledger entries in real time, never stored directly, and the table is append-only — no updates, no deletes, ever. Atomic writes use db.batch() and pooledDb.transaction() to wrap ledger calls together with status updates, closing the reconciliation gap between ledger state and investment status.',
      },
      {
        heading: 'Built for operator compliance',
        body: 'KYC files are validated at the byte level via magic-number checking before they ever touch R2, not merely by file extension. The withdrawal tier system, KYC gating and admin audit trail are purpose-built so a real operator can answer for every movement of money on the platform.',
      },
    ],
  },
  {
    slug: 'payconstant',
    name: 'Payconstant',
    kind: 'Webhook monitoring SaaS, Gemynd product',
    status: 'development',
    summary:
      'Payment rescue for Paystack webhooks: catching silent failures before they become support tickets.',
    blurb:
      'African indie developers and small SaaS teams lose money to webhook failures they never see. Hookdeck and Convoy solve this for Stripe. Nobody solved it for Paystack. Payconstant is the monitoring layer that catches those failures first.',
    stack: ['Turborepo', 'Hono', 'Cloudflare Workers', 'D1', 'Next.js 15', 'Resend'],
    blocks: [
      {
        heading: 'What it does',
        body: 'HMAC signature verification, D1 payload logging, and failure classification that separates a SILENT_200 event from an ENDPOINT_DOWN event — because those two failures need completely different responses. Resend alerting dispatched via waitUntil, and an immutable retry audit trail.',
      },
      {
        heading: 'The positioning is deliberate',
        body: 'Payment rescue, not just monitoring. I also published paystack-wallet-teardown on GitHub, a fully deployed Cloudflare Worker demonstrating idempotent wallet crediting, as a public credibility signal to exactly the audience this product serves.',
      },
    ],
  },
  {
    slug: 'hiveos',
    name: 'HiveOS by Gemynd',
    kind: 'Community intelligence SaaS, Gemynd product',
    status: 'development',
    summary:
      'Surfaces the signal buried in Discord communities and makes it actionable.',
    blurb:
      'Discord communities generate enormous signal: questions, friction, the discussions that keep resurfacing, that community managers cannot process in real time. HiveOS surfaces that signal automatically and makes it actionable.',
    stack: ['Bun', 'Elysia', 'Next.js 15', 'PostgreSQL + pgvector', 'Redis', 'Claude API'],
    blocks: [
      {
        heading: 'What is running',
        body: 'The Discord bot runs on Railway with full slash-command functionality and live event publishing. Getting it there meant resolving a multi-step deployment failure chain: workspace package resolution, Prisma generating without DATABASE_URL in the build context, a Sapphire Framework baseUserDirectory misconfiguration, and named-versus-default export conflicts — in sequence, all resolved.',
      },
      {
        heading: 'Where it stands',
        body: 'Phase 1 complete, with pricing live: Free, Starter at $12/mo, Pro at $39/mo and Enterprise at $149/mo.',
      },
    ],
  },
  {
    slug: 'venstore',
    name: 'Venstore',
    kind: 'Social commerce infrastructure for Nigerian vendors',
    status: 'prelaunch',
    summary:
      'Hosted storefronts for Nigerian social sellers, operated entirely through a Telegram bot.',
    blurb:
      'Venstore gives Nigerian TikTok, Instagram and WhatsApp sellers a hosted storefront with full product, order and billing management — operated entirely through a Telegram bot. No dashboard, no technical skill required.',
    stack: [
      'Cloudflare Workers',
      'Hono',
      'Grammy.js',
      'Next.js 15',
      'D1',
      'Drizzle',
      'R2',
      'Queues',
      'Paystack',
    ],
    blocks: [
      {
        heading: 'Why Telegram, not a dashboard',
        body: 'Competitors like Bumpa and Siiqo require a web dashboard. Nigerian vendors already live in Telegram, so Venstore meets them there — with buyer protection built into every transaction via a 4% split. Full vendor onboarding, product management, a customer-facing storefront, Paystack checkout with webhook handling, order lifecycle and billing all run through the bot.',
      },
      {
        heading: 'Notable technical decisions',
        body: 'PBKDF2 via the Web Crypto API for password hashing, since bcrypt is incompatible with the edge runtime. Atomic D1 transactions for inventory decrement to prevent oversell. HMAC-SHA512 webhook verification with an idempotency guard on every Paystack event. KV caching layered over D1 to stay inside free-tier read limits — a pattern locked in only after it caused real production outages. Storefront URLs are path-based on Vercel rather than wildcard subdomains, which simplified DNS and SSL considerably.',
      },
    ],
  },
  {
    slug: 'thrivewitht',
    name: 'ThriveWithT',
    kind: 'Wellness landing page, client project',
    status: 'live',
    summary:
      'A high-converting single-page wellness site for an international client. Clean delivery, no revision cycles.',
    blurb:
      'A high-converting single-page wellness site for Tamika Waller at thrivewitht.com.au. Static HTML, GSAP animations, Formspree, Calendly integration, Vercel deployment, a .com.au domain and Google Search Console configured from day one.',
    stack: ['Static HTML', 'GSAP', 'Formspree', 'Calendly', 'Vercel'],
    live: 'https://www.thrivewitht.com.au/',
    media: {
      desktopPoster: `${R2}/thrivewitht-desktop-image.png`,
      mobilePoster: `${R2}/thrivewith-t-photo.webp`,
      desktopVideo: `${R2}/ThrivewithT-Desktop2.mp4`,
      mobileVideo: `${R2}/Thrivewitht-mobile2.mp4`,
    },
    blocks: [
      {
        heading: 'The brief',
        body: 'International client, single page, built to convert. Delivered clean with no revision cycles.',
      },
    ],
  },
];

/** Shorter engagements, listed rather than given a full case study. */
export const ADDITIONAL_WORK: { name: string; detail: string; link?: string }[] = [
  {
    name: 'Hon. Target Isaiah Segibo',
    detail:
      'Multi-page institutional site for the Executive Chairman of Southern Ijaw LGA. Dark editorial aesthetic, scroll-driven animations, lightbox media gallery.',
  },
  {
    name: 'NCDMB',
    detail: "Government web portal for Nigeria's Niger Delta Development Commission.",
  },
  {
    name: 'Best Western Plus Yenagoa',
    detail: 'Premium hospitality landing page.',
  },
  {
    name: 'ADC',
    detail: 'Political campaign landing page.',
  },
  {
    name: 'Wise Guys NFT',
    detail:
      'Cinematic XRPL mint experience: animated mint flow, claim forms, scroll-choreographed interactions.',
    link: 'https://the-wise-guys.vercel.app/',
  },
  {
    name: 'Dogman XRPL',
    detail:
      'Live XRPL data woven into a scroll-driven narrative rather than a static page.',
  },
];

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
