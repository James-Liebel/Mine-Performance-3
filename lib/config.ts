/**
 * App config — Mine Performance Academy standalone site.
 */
export const MOCK_DATA_LABEL = 'Demo data — sample athletes shown';
export const SITE_NAME = 'Mine Performance Academy';

/** Hero tagline — baseball-focused */
export const SITE_TAGLINE = process.env.NEXT_PUBLIC_SITE_TAGLINE ?? 'Baseball training. Data-driven. See the results.';

/** Short label for Sports Performance Training (strength, movement, conditioning) */
export const SPT_LABEL = 'Strength';
export const SPT_FULL = 'Sports Performance Training';
export const SPT_DESCRIPTION = 'Strength, movement, and conditioning — the foundation that supports pitching, hitting, and recovery.';
export const SITE_PHONE = '(513) 384-3840';
export const SITE_EMAIL = 'Ryan@mineperformanceacademy.com';
export const SITE_ADDRESS = '4999 Houston Rd Suite 500-2, Florence, KY 41042';
export const SITE_HOURS = [
  'Monday – Friday: 8 am – 9 pm',
  'Saturday – Sunday: 10 am – 8 pm',
];

/** Social links — defaults to Mine Performance Academy profiles; override in env to change or leave empty to hide */
export const SOCIAL_INSTAGRAM = process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? 'https://www.instagram.com/mineperformance/?hl=en';
export const SOCIAL_FACEBOOK = process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ?? 'https://www.facebook.com/profile.php?id=61569199182719';
export const SOCIAL_X = process.env.NEXT_PUBLIC_SOCIAL_X ?? 'https://x.com/mineperform_spt';
export const SOCIAL_YOUTUBE = process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE ?? 'https://www.youtube.com/channel/UCnyrrOUDQLPbicY8jutpu1A';
/** e.g. https://thefuturesapp.com — shown as "Powered by The Futures App" in footer */
export const FUTURES_APP_URL = process.env.NEXT_PUBLIC_FUTURES_APP_URL ?? 'https://thefuturesapp.com';
