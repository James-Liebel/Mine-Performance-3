/**
 * Centralized site copy for Mine Performance Academy.
 * Single source of truth for headings, body, and CTAs.
 */

export const site = {
  name: 'Mine Performance Academy',
  tagline: 'Assessment-driven training and rehab so you perform at your peak.',
  oneLiner: 'Stop guessing. Start measuring.',
} as const;

export const nav = {
  home: 'Home',
  start: 'Start Here',
  method: 'The Method',
  programs: 'Programs',
  coaches: 'Coaches',
  facility: 'The Facility',
  results: 'Results',
  events: 'Events',
  rehab: 'Rehab & Return-to-Throw',
  contact: 'Contact',
} as const;

export const hero = {
  headline: 'Train Smarter. Recover Confident. Compete at Your Peak.',
  subhead: 'Evidence-based assessment, individualized programming, and a facility built for athletes who refuse to plateau.',
  ctaPrimary: 'Book an Evaluation',
  ctaSecondary: 'View Programs',
} as const;

export const story = {
  problem: {
    title: 'The Problem',
    lead: 'Athletes plateau. Risk injury. Lack a real plan.',
    body: 'Too many programs rely on guesswork and one-size-fits-all templates. Without assessment, you don’t know where you stand—or what to fix first. We built Mine Performance Academy to change that.',
  },
  method: {
    title: 'The Method',
    lead: 'Assess → Plan → Train → Measure.',
    body: 'We start with data. Assessment drives your program. You train with purpose, and we measure progress so the next cycle is even better. It’s a repeatable system, not a random workout.',
  },
  proof: {
    title: 'The Proof',
    lead: 'Results and accountability.',
    body: 'From before/after stories to leaderboard highlights, we put outcomes front and center. Our athletes and referrers see what’s possible when training is individualized and measured.',
  },
  place: {
    title: 'The Place',
    lead: 'A facility built for results.',
    body: 'Space, equipment, and tech that support serious training and rehab. This is where the method becomes reality.',
  },
} as const;

export const methodPage = {
  title: 'The Method',
  description: 'How we turn assessment into progress.',
  steps: [
    { title: 'Assess', body: 'We establish baselines so we know exactly where you are—strength, mobility, throwing, sport-specific markers.' },
    { title: 'Plan', body: 'Your program is built around your data and goals, not a generic template.' },
    { title: 'Train', body: 'Coached sessions with clear intent. Every rep has a place in the bigger picture.' },
    { title: 'Measure', body: 'We track progress and retest so the next phase is smarter than the last.' },
  ],
  cta: 'Book an Evaluation',
} as const;

export const programsPage = {
  title: 'Programs',
  lead: 'Pathways built around the athlete.',
  description: 'Whether you’re in-season, off-season, or returning from injury, we have a path that fits. All programs are assessment-informed and coach-led.',
  cta: 'View Programs',
} as const;

export const coachesPage = {
  title: 'Meet the Coaches',
  lead: 'Credentials and experience you can trust.',
  description: 'Our team brings sport science, rehab, and long-term athlete development together under one roof.',
} as const;

export const facilityPage = {
  title: 'The Facility',
  lead: 'Built for performance and rehab.',
  description: 'Space, equipment, and technology that support assessment-driven training and safe return-to-sport progressions.',
  cta: 'Book an Evaluation',
} as const;

export const resultsPage = {
  title: 'Results',
  lead: 'Outcomes and accountability.',
  description: 'Before/after stories, leaderboard highlights, and clear definitions of what we measure and why.',
  leaderboardCta: 'View Leaderboard',
  definitionsNote: 'We define our metrics so you know what “results” actually mean.',
} as const;

export const eventsPage = {
  title: 'Events',
  lead: 'Featured events and programming.',
  description: 'Camps, clinics, and events at Mine Performance Academy. Full schedule and registration via StatStak.',
  cta: 'View Full Schedule',
  statstakUrl: 'https://mine-performance.statstak.io/events',
} as const;

export const rehabPage = {
  title: 'Rehab & Return-to-Throw',
  lead: 'Responsible progressions. No shortcuts.',
  disclaimer: 'Rehab outcomes depend on many factors. We do not guarantee specific results. All return-to-sport progressions are guided by assessment and professional judgment.',
  body: 'We support athletes through structured return-to-throw and return-to-sport progressions. Our approach is assessment-driven: we use baselines and staged progressions to guide loading and volume, with the goal of a safe, durable return. This is not a substitute for medical advice; we work alongside your care team when appropriate.',
  points: [
    'Assessment establishes baselines and guides progression.',
    'Loading and volume are progressed in stages, not by date alone.',
    'We emphasize long-term durability, not rushing back.',
  ],
  cta: 'Book an Evaluation',
} as const;

export const contactPage = {
  title: 'Contact',
  lead: 'Get in touch.',
  description: 'Ready to start with an evaluation or have questions? Reach out.',
  cta: 'Book an Evaluation',
} as const;

/** Start Here wizard: goal → age/level → schedule → recommended program + next action */
export const startWizard = {
  title: 'Start Here',
  lead: 'Answer a few questions and we’ll recommend the best path for you.',
  step1: {
    title: 'What’s your main goal?',
    options: [
      { id: 'evaluate', label: 'Get evaluated — I want to know where I stand and what to work on.' },
      { id: 'stronger', label: 'Get stronger / improve performance.' },
      { id: 'rehab', label: 'Return from injury or build back after time off.' },
      { id: 'other', label: 'Something else — I’d like to talk it through.' },
    ],
  },
  step2: {
    title: 'Age / level',
    options: [
      { id: 'youth', label: 'Youth' },
      { id: 'hs', label: 'High school' },
      { id: 'college', label: 'College' },
      { id: 'adult', label: 'Adult / rec' },
      { id: 'any', label: 'Not sure' },
    ],
  },
  step3: {
    title: 'When do you want to train?',
    options: [
      { id: 'inseason', label: 'In-season (maintain / compete)' },
      { id: 'offseason', label: 'Off-season (build)' },
      { id: 'flexible', label: 'Flexible' },
    ],
  },
  result: {
    title: 'Your recommended next step',
    ctaPrimary: 'Book an Evaluation',
    ctaSecondary: 'View Programs',
    /** Placeholder — needs client content. Map (goal, age, schedule) → program name + short blurb. */
    recommendations: {
      default: {
        program: 'Performance Evaluation',
        blurb: 'Start with an evaluation so we can build a plan around your goals and baseline.',
      },
      rehab: {
        program: 'Rehab & Return-to-Sport',
        blurb: 'Our return-to-throw and rehab pathway is assessment-driven and staged. Book an evaluation to get started.',
      },
    },
  },
} as const;

export const ctaBar = {
  mobile: {
    primary: 'Book an Evaluation',
    secondary: 'View Programs',
  },
} as const;

export const footer = {
  tagline: 'Assessment-driven training and rehab.',
  links: { start: 'Start Here', method: 'The Method', programs: 'Programs', coaches: 'Coaches', facility: 'Facility', results: 'Results', events: 'Events', rehab: 'Rehab', contact: 'Contact' },
  legal: 'Privacy & Terms',
  statstak: 'Powered by StatStak',
} as const;
