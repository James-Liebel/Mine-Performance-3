/**
 * Centralized image paths. Place image files in public/images/ and reference here.
 * Usage: <Image src={IMAGES.logo.src} alt={IMAGES.logo.alt} width={36} height={36} />
 */
export const IMAGES = {
  logo: {
    src: '/mp-logo.png',
    alt: 'Mine Performance logo',
    width: 36,
    height: 36,
  },
} as const;

export type ImageKey = keyof typeof IMAGES;
