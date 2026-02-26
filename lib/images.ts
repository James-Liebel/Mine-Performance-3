/**
 * Centralized image paths. Place image files in public/ and reference here.
 * basePath is used for GitHub Pages (e.g. /Mine-Performance-3) so images load correctly.
 */
const basePath = typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_BASE_PATH || process.env.BASE_PATH || '') : '';

export const IMAGES = {
  logo: {
    src: `${basePath}/mp-logo.png`,
    alt: 'Mine Performance logo',
    width: 36,
    height: 36,
  },
} as const;

export type ImageKey = keyof typeof IMAGES;
