/**
 * Key-value store for admin-editable site content (all pages).
 * Persisted to data/persisted/site-content.json when the filesystem is writable.
 */

import { SITE_NAME, SITE_ADDRESS, SITE_PHONE, SITE_EMAIL, SITE_HOURS } from '@/lib/config';
import { FEATURES, PROGRAMS, STATS } from '@/data/home-content';
import { loadJSON, saveJSON } from './persist';

const contactHoursDefault = SITE_HOURS.join('\n');

export const SITE_CONTENT_DEFAULTS: Record<string, string> = {
  // Home (hero used on homepage StoryProblem)
  hero_tag: 'Florence, KY — Baseball training',
  hero_heading: 'Your baseball training, quantified.',
  hero_sub: '',
  hero_space_offerings: 'Batting cages, pitching lab, weight room, assessment area.',
  hero_train_rent_line: 'Book a rental by the hour, or get a membership and do training with our programs — choose what fits.',
  hero_title: 'Baseball training. Data-driven. See the results.',
  site_tagline: 'Baseball training. Data-driven. See the results.',
  hero_subtitle: `${SITE_NAME} combines expert coaching, measurable progress tracking, and structured programs — memberships, scheduling for events and camps, and lab and cage rentals so athletes and parents always know where they stand and what comes next.`,
  features_heading: 'Why athletes choose Mine Performance',
  features_sub: 'A training facility built around measurable results — not just reps.',
  feature_0_title: FEATURES[0].title,
  feature_0_description: FEATURES[0].description,
  feature_1_title: FEATURES[1].title,
  feature_1_description: FEATURES[1].description,
  feature_2_title: FEATURES[2].title,
  feature_2_description: FEATURES[2].description,
  feature_3_title: FEATURES[3].title,
  feature_3_description: FEATURES[3].description,
  programs_heading: 'Programs',
  programs_sub: "Whether you're building velocity, refining your swing, or coming back from injury — we have a path designed for you.",
  program_0_name: PROGRAMS[0].name,
  program_0_desc: PROGRAMS[0].desc,
  program_1_name: PROGRAMS[1].name,
  program_1_desc: PROGRAMS[1].desc,
  program_2_name: PROGRAMS[2].name,
  program_2_desc: PROGRAMS[2].desc,
  stat_0_value: STATS[0].value,
  stat_0_label: STATS[0].label,
  stat_1_value: STATS[1].value,
  stat_1_label: STATS[1].label,
  stat_2_value: STATS[2].value,
  stat_2_label: STATS[2].label,
  stat_3_value: STATS[3].value,
  stat_3_label: STATS[3].label,
  about_heading: 'About the facility',
  about_text: `${SITE_NAME} is a purpose-built baseball training facility at ${SITE_ADDRESS}. Batting cages, pitching lab, weight room, and assessment area. We serve athletes from 10U through high school and beyond — memberships, scheduling for camps and clinics, and lab and cage rentals available year-round.`,
  cta_heading: 'Ready to train?',
  cta_sub: "View memberships, book events on the calendar, or reserve a lab or cage. We'll help you find the right fit.",
  coaching_heading: 'Our coaching team',
  coaching_sub: "D1 playing experience. 500+ pitchers trained. 70+ successful rehabs. Our coaches bring real credentials and a commitment to every athlete's growth.",
  // About page
  about_page_heading: 'About Mine Performance Academy',
  about_page_intro: 'Mine Performance Academy is a purpose-built baseball training facility in Florence, KY. We combine data-driven coaching, a fully equipped training space, and clear development plans for athletes from youth through college.',
  about_coaching_heading: 'Coaching staff',
  about_coaching_sub: "Our coaches bring D1 playing experience, certifications, and hundreds of athletes trained. They're focused on measurable progress, smart programming, and long-term development.",
  about_facility_heading: 'Facility',
  about_facility_sub: 'Our space includes batting cages, a pitching lab, strength and conditioning area, and assessment zones designed for capturing velocity, spin rate, exit velocity, and more.',
  about_see_facility_heading: 'See the facility',
  about_see_facility_sub: 'Take a look inside our training space.',
  about_video_placeholder: 'Video coming soon',
  // Contact page
  contact_heading: 'Contact Us',
  contact_intro: "Book a session, ask about programs, or schedule a facility tour. We're here to help.",
  contact_send_message_heading: 'Send a message',
  contact_location_heading: 'Location & hours',
  contact_address: SITE_ADDRESS,
  contact_phone: SITE_PHONE,
  contact_email: SITE_EMAIL,
  contact_hours: contactHoursDefault,
  contact_directions_label: 'Get directions →',
  // Events page
  events_heading: 'Scheduling',
  events_intro: "Training schedule — camps, clinics, and sessions. This calendar is for training slots only; rentals have a separate schedule. Use the calendar to view and book by day. Toggle to show only slots you're signed up for or all slots. Green outline = open slot; red = full.",
  // Member registration page
  member_reg_heading: 'Training options',
  member_reg_subtitle: 'Billed every 4 weeks. Youth = under 10U · Adults = 10U+.',
  member_reg_spt_definition: 'Strength = Sports Performance Training (strength, movement, conditioning).',
  member_reg_what_can_purchase: 'What you can purchase',
  member_reg_offerings_intro: 'Select a category to jump to plans:',
  member_reg_listings_intro: 'Plans below match the categories above — click a plan for details and pricing.',
  member_reg_adult_title: 'Adult (10U and older)',
  member_reg_adult_desc: 'Skill development, performance training, and recovery.',
  member_reg_youth_remote_title: 'Youth & remote (under 10U)',
  member_reg_youth_remote_desc: 'Youth athletes under 10U and remote training programs.',
  member_reg_help_text: 'Not sure which plan fits? Contact us and we\'ll help you choose.',
  member_reg_help_before: 'Not sure which plan fits? ',
  member_reg_help_after: ' and we\'ll help you choose.',
  // Rentals page
  rentals_heading: 'Rentals',
  rentals_subtitle: 'Rentals have a separate schedule from training. Reserve labs, cages, and turf by date and time for your own training or team sessions.',
  rentals_choose_date_heading: 'Choose a date',
  rentals_choose_date_desc: 'Select a day on the calendar, then pick a resource and time slot below.',
  rentals_pick_resource_heading: 'Pick a resource and time',
  rentals_pick_resource_desc_no_date: 'Select a date above first.',
  rentals_pick_resource_desc_with_date: 'Available times for {date}. We\'ll confirm after you submit.',
  // Home — StoryMethod
  story_method_label: 'The Method',
  story_method_heading: 'Data-driven development, expert-led training',
  story_method_body: '',
  // Home — StoryProof (stats/features use feature_* stat_* above)
  story_proof_label: 'The Proof',
  story_proof_heading: 'Results that speak for themselves',
  story_proof_body: 'D1 playing experience. Hundreds of athletes trained. Real numbers — not hype.',
  story_proof_link_portal: 'Portal',
  story_proof_link_coaches: 'Meet the coaches',
  story_proof_link_events: 'Upcoming events',
  // Home — StoryPlace
  story_place_label: 'The Place',
  story_place_heading: 'Florence, KY — purpose-built for athletes',
  story_place_body: 'Batting cages, pitching lab, weight room, and assessment area. We serve athletes from 10U through high school and beyond — lessons, memberships, camps, and open sessions year-round.',
  story_place_cta_heading: 'Ready to get started?',
  story_place_cta_sub: "Book an evaluation and we'll match you with the right program and coach.",
  story_place_footer_before: 'Questions? ',
  story_place_footer_contact: 'Contact us',
  story_place_footer_after: ' or call (513) 384-3840.',
  // Home — TestimonialsSection
  testimonials_heading: 'What athletes say',
  testimonials_sub: 'Placeholder — needs client testimonials. Replace with real quotes and attribution.',
  testimonial_0_quote: 'Placeholder — Client testimonial 1. Real athlete quote and outcome.',
  testimonial_0_author: 'Parent / Athlete name',
  testimonial_0_role: 'Placeholder',
  testimonial_1_quote: 'Placeholder — Client testimonial 2. Real athlete quote and outcome.',
  testimonial_1_author: 'Parent / Athlete name',
  testimonial_1_role: 'Placeholder',
  testimonial_2_quote: 'Placeholder — Client testimonial 3. Real athlete quote and outcome.',
  testimonial_2_author: 'Parent / Athlete name',
  testimonial_2_role: 'Placeholder',
  // Footer
  footer_logo_text: 'Mine Performance',
  footer_tagline: 'Data-driven baseball training',
  footer_heading_train: 'Train',
  footer_heading_athletes: 'Athletes',
  footer_heading_location: 'Location & hours',
  footer_link_memberships: 'Memberships',
  footer_link_coaches: 'About us',
  footer_link_events: 'Events',
  footer_link_rentals: 'Rentals',
  footer_link_results: 'College commits',
  footer_link_login: 'Login',
  footer_copyright: 'Mine Performance Academy. All rights reserved.',
  footer_powered: 'The Futures App',
  footer_hours_line_0: SITE_HOURS[0] ?? '',
  footer_hours_line_1: SITE_HOURS[1] ?? '',
  // Results page
  results_heading: 'College commits',
  results_sub: 'Athletes from our facility who have committed to play at the next level. We\'re proud of every one of them.',
  results_athletes_heading: 'Athletes & colleges',
  results_no_commits: 'No college commits listed yet. Check back soon.',
  results_endorsements_heading: 'Player endorsements',
  results_endorsements_sub: 'What athletes and families say about training at Mine Performance.',
  results_no_endorsements: 'No endorsements yet. Check back soon.',
  // Login page
  login_heading: 'Login',
  login_sub: 'Sign in to your account to access your profile.',
  login_no_account_before: "Don't have an account? ",
  login_no_account_link: 'Contact us',
  login_no_account_after: ' to get started.',
  // Theme (website editor — display and body fonts)
  theme_display_font: 'oswald',
  theme_body_font: 'inter',
};

const loaded = loadJSON<Record<string, string>>('site-content.json');
let store: Record<string, string> = loaded
  ? { ...SITE_CONTENT_DEFAULTS, ...loaded }
  : { ...SITE_CONTENT_DEFAULTS };

function persist(): void {
  saveJSON('site-content.json', store);
}

export function getAllContent(): Record<string, string> {
  return { ...store };
}

export function getContentKey(key: string): string | undefined {
  return store[key];
}

export function getContent(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.keys(SITE_CONTENT_DEFAULTS)) {
    out[k] = store[k] ?? SITE_CONTENT_DEFAULTS[k];
  }
  return out;
}

export function updateContent(key: string, value: string): void {
  if (Object.prototype.hasOwnProperty.call(SITE_CONTENT_DEFAULTS, key)) {
    store[key] = value;
    persist();
  }
}
