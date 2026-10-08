// Site-level copy. Kept short on purpose: the homepage sells, the projects
// page proves. Depth that belongs to a specific build lives in projects.ts.

export const HERO = {
  name: 'Joshua Igburu',
  alias: 'Globe the Dev',
  role: 'Full-Stack Engineer & Product Builder',
  pitch:
    'I build web systems that handle real money, real users, and real edge cases: product infrastructure, payment integrations, and client-facing platforms, from zero to production.',
  location: 'Based in Nigeria. Working globally.',
};

export const ABOUT = {
  lead:
    "I'm a full-stack developer and CS student at Federal University Otuoke who builds production software in the same hours other people study it.",
  depth:
    "My instinct is to go deeper, not around. When a D1 database read count hit 753 million rows overnight, I didn't restart and hope. I traced it to an unconditional cron combined with a broken pagination cache key, fixed it, and built a layer to stop it happening again. Problems get understood before they get closed.",
  brands:
    'I operate two brands. GlobeTheDev handles client work: websites, web apps and platforms for businesses across Nigeria and internationally. Gemynd is where I build products I actually want to exist.',
};

export type Service = {
  title: string;
  body: string;
};

export const SERVICES: Service[] = [
  {
    title: 'Full-Stack Development',
    body: 'APIs on Cloudflare Workers, relational data modelling, Next.js frontends. Systems designed for production, not demos.',
  },
  {
    title: 'Payment Infrastructure',
    body: "Webhook verification, idempotent crediting, silent-failure detection, retry logic, reconciliation dashboards. I've debugged wallet credits that never landed and built the admin tooling to catch it before support tickets arrive.",
  },
  {
    title: 'SaaS Architecture',
    body: 'Monorepo structure, multi-tenant design, background job patterns, KV caching: the boring decisions that let products scale without rewrites.',
  },
  {
    title: 'Web Design & Landing Pages',
    body: 'Editorial aesthetics, scroll-driven animation, conversion-focused layouts. Built to load fast and look like they cost more than they did.',
  },
];

export type Fluency = {
  area: string;
  body: string;
};

/** Framed as claims that can be defended in an interview, not a logo wall. */
export const TECHNICAL_FLUENCY: Fluency[] = [
  {
    area: 'Cloudflare Workers',
    body: 'Execution model, waitUntil, KV caching, D1, per-request CPU limits and how to design around them on the free plan.',
  },
  {
    area: 'Payment Infrastructure',
    body: 'HMAC webhook verification, idempotent event processing, failure classification, reconciliation tooling, Paystack and Flutterwave edge cases.',
  },
  {
    area: 'Database Design',
    body: "D1 with Drizzle, PostgreSQL with pgvector, double-entry ledger architecture, and D1's 100-parameter-per-statement limit with practical workarounds.",
  },
  {
    area: 'Financial Systems',
    body: 'Double-entry ledger design, append-only transaction tables, atomic batch writes, KYC gating, withdrawal tier enforcement.',
  },
  {
    area: 'Monorepo Architecture',
    body: 'Turborepo with pnpm workspaces, shared packages, cross-boundary type safety.',
  },
  {
    area: 'AI-Native Development',
    body: 'Claude API in production SaaS, pgvector embeddings, building features where AI is infrastructure rather than a feature flag.',
  },
];

/** Sliding logo strip under the hero CTAs. Hovering reveals the detail. */
export type StackItem = {
  name: string;
  /** Omitted where no reliable mark exists; the strip falls back to a wordmark. */
  logo?: string;
  blurb: string;
};

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';

export const HERO_STACK: StackItem[] = [
  {
    name: 'Cloudflare Workers',
    logo: `${DEVICON}/cloudflare/cloudflare-original.svg`,
    blurb: 'Edge runtime for every API I ship. waitUntil, KV, and CPU limits designed around, not fought.',
  },
  {
    name: 'Next.js',
    logo: `${DEVICON}/nextjs/nextjs-original.svg`,
    blurb: 'App Router frontends, rendered for speed rather than for the framework.',
  },
  {
    name: 'TypeScript',
    logo: `${DEVICON}/typescript/typescript-original.svg`,
    blurb: 'Type safety carried across package boundaries, not stopped at the file.',
  },
  {
    name: 'Hono',
    blurb: 'The router behind my Workers APIs. Small, fast, and honest about the edge.',
  },
  {
    name: 'PostgreSQL',
    logo: `${DEVICON}/postgresql/postgresql-original.svg`,
    blurb: 'Relational modelling, pgvector embeddings, and ledgers that must always reconcile.',
  },
  {
    name: 'Cloudflare D1',
    logo: `${DEVICON}/cloudflare/cloudflare-original.svg`,
    blurb: 'SQLite at the edge. I know its 100-parameter statement limit by heart, and why.',
  },
  {
    name: 'Drizzle',
    blurb: 'Typed schema and migrations across D1 and Postgres without an ORM tax.',
  },
  {
    name: 'React',
    logo: `${DEVICON}/react/react-original.svg`,
    blurb: 'Interfaces built to stay fast once real data arrives.',
  },
  {
    name: 'Paystack',
    blurb: 'Webhook verification, idempotent crediting, and reconciliation when payments go quiet.',
  },
  {
    name: 'Tailwind CSS',
    logo: `${DEVICON}/tailwindcss/tailwindcss-original.svg`,
    blurb: 'A design system expressed in constraints rather than in a stylesheet nobody reads.',
  },
];
