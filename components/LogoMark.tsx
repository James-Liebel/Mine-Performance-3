/**
 * SVG "M" mark for Mine Performance — geometric, outline-only, matches brand.
 * Use in nav; color inherits (e.g. white on dark header).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* Stylized M: left leg, two peaks, right leg, inverted V base */}
      <path d="M2 20V4l5 6 5-6 5 6 5-6v16" />
    </svg>
  );
}
