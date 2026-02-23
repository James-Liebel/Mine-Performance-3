'use client';

import { useEffect } from 'react';

const DISPLAY_FONTS = ['oswald', 'playfair'] as const;
const BODY_FONTS = ['barlow', 'inter'] as const;

type DisplayFont = (typeof DISPLAY_FONTS)[number];
type BodyFont = (typeof BODY_FONTS)[number];

function isValidDisplay(v: string): v is DisplayFont {
  return DISPLAY_FONTS.includes(v as DisplayFont);
}
function isValidBody(v: string): v is BodyFont {
  return BODY_FONTS.includes(v as BodyFont);
}

/** Applies theme_display_font and theme_body_font from site content to CSS variables on <html>. */
export function ThemeApplicator({
  themeDisplayFont,
  themeBodyFont,
}: {
  themeDisplayFont?: string;
  themeBodyFont?: string;
}) {
  useEffect(() => {
    const display = isValidDisplay(themeDisplayFont || '') ? themeDisplayFont : 'oswald';
    const body = isValidBody(themeBodyFont || '') ? themeBodyFont : 'barlow';
    const root = document.documentElement;
    root.style.setProperty('--font-display-var', `var(--font-display-${display})`);
    root.style.setProperty('--font-sans-var', `var(--font-sans-${body})`);
  }, [themeDisplayFont, themeBodyFont]);
  return null;
}
