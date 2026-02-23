/**
 * FAQ content for the chatbot.
 * Add or edit entries here to update the FAQ.
 */

export interface FAQEntry {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
}

export const FAQ_ENTRIES: FAQEntry[] = [
  {
    id: 'get-started',
    question: 'How do I get started?',
    answer:
      "Book an evaluation and we'll match you with the right program and coach based on your goals and schedule. Use our Start Here wizard for a personalized recommendation.",
    tags: ['getting started', 'evaluation', 'booking', 'start'],
  },
  {
    id: 'ages',
    question: 'What ages do you work with?',
    answer:
      'We serve athletes from 10U through high school and beyond. Programs are tailored to age-appropriate development and goals.',
    tags: ['ages', 'age', 'kids', 'youth', 'high school'],
  },
  {
    id: 'drop-in',
    question: 'Do you offer drop-in sessions or only memberships?',
    answer:
      'We offer both. You can drop in for a single session or commit to a monthly plan. View our programs and memberships to find the best fit.',
    tags: ['drop-in', 'membership', 'single session', 'monthly'],
  },
  {
    id: 'location',
    question: 'Where are you located?',
    answer:
      "We're at 4999 Houston Rd Suite 500-2, Florence, KY 41042. Visit our contact page for hours, directions, and to book a facility tour.",
    tags: ['location', 'address', 'where', 'directions', 'hours'],
  },
  {
    id: 'progress',
    question: 'How do you track progress?',
    answer:
      'We use radar, HitTrax, and other tools to measure velocity, exit velo, and more. See our Results page for how we measure and where you can view leaderboards.',
    tags: ['progress', 'tracking', 'velocity', 'leaderboard', 'results'],
  },
  {
    id: 'remote',
    question: 'Can I train remotely?',
    answer:
      'Some of our programs offer remote or hybrid options. Contact us or check program details for availability.',
    tags: ['remote', 'online', 'virtual', 'hybrid'],
  },
];
