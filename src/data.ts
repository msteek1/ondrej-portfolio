/* ----------------------------------------------------------------------------
   Site content — sourced from Ondrej's LinkedIn + aizona.cz
---------------------------------------------------------------------------- */

export const LINKS = {
  linkedin: 'https://www.linkedin.com/in/ondrej-zuscik/',
  aizona: 'https://aizona.cz',
  advisio: 'https://advisio.cz',
  instagram: 'https://instagram.com/', // TODO: handle
  email: 'ondra@aizona.cz',
}

export type NavItem = { id: string; label: string }
export const NAV: NavItem[] = [
  { id: 'create', label: 'How I create' },
  { id: 'work', label: 'What I do' },
  { id: 'path', label: 'Path' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

/* ---- Manifesto ---- */
export const MANIFESTO =
  "I don't use AI just to generate nice visuals. I build systems that help teams move faster, test more, and turn ideas into output you can measure. AI doesn't replace good marketing. It multiplies the knowledge of the people who already understand strategy, context and execution."

/* ---- Career timeline ---- */
export type TimelineEntry = {
  year: string
  role: string
  org: string
  place?: string
  blurb: string
  tag?: string
}

export const TIMELINE: TimelineEntry[] = [
  {
    year: '2016',
    role: 'Digital Data Specialist',
    org: 'Havas Group',
    place: 'Prague',
    blurb:
      'Data reporting and Real-Time-Bidding campaign management (DoubleClick, Appnexus) for Emirates, Kia, L’Oréal and Jacobs.',
  },
  {
    year: '2019',
    role: 'Sales Specialist',
    org: 'Invia Group',
    place: 'Germany',
    blurb: 'Client-facing sales and account work for the German market.',
  },
  {
    year: '2020',
    role: 'Affiliate Marketing',
    org: 'Self-employed',
    blurb:
      'Built and ran affiliate campaigns across social, Google Ads and RTB. Learned performance the hard way. On my own P&L.',
  },
  {
    year: '2024',
    role: 'Account Manager',
    org: 'Advisio.cz',
    place: 'Ostrava',
    blurb:
      'Client strategy and growth across PPC, paid social and RTB. GA4 + Looker Studio reporting. Building AI-assisted creative and automation into the everyday workflow.',
    tag: 'Now',
  },
  {
    year: 'Now',
    role: 'Founder',
    org: 'Aizona.cz',
    blurb:
      'Building an AI magazine and practical knowledge hub: real use cases, workflows and an AI Academy for everyday work.',
    tag: 'Building',
  },
]

/* ---- Expertise pillars (LinkedIn banner: PPC · Paid Social · AI Creatives · Vibe coding · Automation · Growth) ---- */
export type Expertise = { title: string; desc: string; icon: string }

export const EXPERTISE: Expertise[] = [
  {
    title: 'Performance Marketing',
    desc: 'PPC, paid social and RTB campaigns built to hit measurable KPIs, not vanity metrics.',
    icon: 'Target',
  },
  {
    title: 'AI Creative Systems',
    desc: 'An "ad factory": one master creative turned into many formats, copy variants and short-form video.',
    icon: 'Sparkles',
  },
  {
    title: 'Automation & Agents',
    desc: 'Prompt systems, AI assistants and agents that remove repetitive work and free teams for strategy.',
    icon: 'Workflow',
  },
  {
    title: 'Data & Analytics',
    desc: 'GA4, Looker Studio, reporting structures and the data workflows behind good decisions.',
    icon: 'BarChart3',
  },
  {
    title: 'Account & Growth',
    desc: 'Translating business goals into briefs, creative directions and campaigns that grow clients.',
    icon: 'TrendingUp',
  },
  {
    title: 'Vibe Coding',
    desc: 'Practical AI implementation: prototypes, internal tools and the glue that ships ideas.',
    icon: 'Code2',
  },
]

/* ---- Selected projects ---- */
export type Project = {
  n: string
  name: string
  kind: string
  year: string
  desc: string
  tags: string[]
  href?: string
  accent?: string
}

export const PROJECTS: Project[] = [
  {
    n: '01',
    name: 'Aizona.cz',
    kind: 'Founder · AI Magazine',
    year: '2025',
    desc: 'A Czech AI magazine and knowledge hub: "everything essential from the world of AI in one place." News, real use cases, workflows and an AI Academy across marketing, creativity, productivity and automation.',
    tags: ['Content', 'Brand', 'AI Education', 'Product'],
    href: 'https://aizona.cz',
    accent: '#36e0ff',
  },
  {
    n: '02',
    name: 'Advisio.cz',
    kind: 'Account Manager',
    year: '2024–Now',
    desc: 'Leading client strategy and growth for e-commerce and service brands. Coordinating PPC, paid social, RTB and AI-assisted creative production, backed by GA4 + Looker Studio reporting.',
    tags: ['Strategy', 'PPC', 'Paid Social', 'Reporting'],
    href: 'https://advisio.cz',
    accent: '#ff6a3d',
  },
  {
    n: '03',
    name: 'AI Ad-Factory',
    kind: 'Systems & Automation',
    year: 'Ongoing',
    desc: 'Creative and data systems that turn one master asset into a full multi-format ad set, with reporting automations and agents handling the repetitive layer of the workflow.',
    tags: ['Automation', 'Agents', 'Creative Ops'],
    accent: '#9b7bff',
  },
  {
    n: '04',
    name: 'Creative Lab',
    kind: 'Instagram · AI visuals',
    year: 'Ongoing',
    desc: 'An ongoing playground of AI-driven visuals and short-form concepts, testing where generative tooling actually earns its place in real marketing.',
    tags: ['Visual', 'Short-form', 'Experiments'],
    href: 'https://instagram.com/',
    accent: '#36e0ff',
  },
]

/* ---- Tools / tech marquee ---- */
export const TOOLS = [
  'Google Ads', 'Meta Ads', 'GA4', 'Looker Studio', 'RTB / DSP',
  'OpenAI', 'Claude', 'Midjourney', 'n8n', 'Make', 'Prompt Systems', 'Higgsfield',
]
