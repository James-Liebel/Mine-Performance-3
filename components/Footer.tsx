import Link from 'next/link';
import {
  SITE_PHONE,
  SITE_EMAIL,
  SITE_ADDRESS,
  SITE_HOURS,
  SOCIAL_INSTAGRAM,
  SOCIAL_FACEBOOK,
  SOCIAL_X,
  SOCIAL_YOUTUBE,
  FUTURES_APP_URL,
} from '@/lib/config';
import { EditableContent } from '@/components/EditableContent';

function socialHref(url: string, fallbackPrefix: string): string {
  return url.startsWith('http') ? url : `${fallbackPrefix}${url.replace(/^@/, '')}`;
}

const iconSize = 24;

const InstagramIcon = () => (
  <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const XIcon = () => (
  <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export function Footer() {
  const hasSocial = SOCIAL_INSTAGRAM || SOCIAL_FACEBOOK || SOCIAL_X || SOCIAL_YOUTUBE;
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" className="footer-logo">
            <EditableContent contentKey="footer_logo_text" fallback="Mine Performance" as="span" />
          </Link>
          <p className="footer-tagline">
            <EditableContent contentKey="footer_tagline" fallback="Data-driven baseball training" as="span" />
          </p>
          {hasSocial && (
            <div className="footer-social" aria-label="Social links">
              {SOCIAL_INSTAGRAM && (
                <a className="footer-social-link" href={socialHref(SOCIAL_INSTAGRAM, 'https://www.instagram.com/')} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <InstagramIcon />
                </a>
              )}
              {SOCIAL_FACEBOOK && (
                <a className="footer-social-link" href={socialHref(SOCIAL_FACEBOOK, 'https://www.facebook.com/')} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FacebookIcon />
                </a>
              )}
              {SOCIAL_X && (
                <a className="footer-social-link" href={socialHref(SOCIAL_X, 'https://x.com/')} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                  <XIcon />
                </a>
              )}
              {SOCIAL_YOUTUBE && (
                <a className="footer-social-link" href={socialHref(SOCIAL_YOUTUBE, 'https://www.youtube.com/')} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <YouTubeIcon />
                </a>
              )}
            </div>
          )}
        </div>
        <div className="footer-links-group">
          <h4 className="footer-heading">
            <EditableContent contentKey="footer_heading_train" fallback="Train" as="span" />
          </h4>
          <Link href="/member-registration"><EditableContent contentKey="footer_link_memberships" fallback="Memberships" as="span" /></Link>
          <Link href="/about#coaching-staff"><EditableContent contentKey="footer_link_coaches" fallback="About us" as="span" /></Link>
          <Link href="/events"><EditableContent contentKey="footer_link_events" fallback="Events" as="span" /></Link>
          <Link href="/rentals"><EditableContent contentKey="footer_link_rentals" fallback="Rentals" as="span" /></Link>
        </div>
        <div className="footer-links-group">
          <h4 className="footer-heading">
            <EditableContent contentKey="footer_heading_athletes" fallback="Athletes" as="span" />
          </h4>
          <Link href="/results"><EditableContent contentKey="footer_link_results" fallback="College commits" as="span" /></Link>
          <Link href="/login"><EditableContent contentKey="footer_link_login" fallback="Login" as="span" /></Link>
        </div>
        <div className="footer-links-group">
          <h4 className="footer-heading">
            <EditableContent contentKey="footer_heading_location" fallback="Location & hours" as="span" />
          </h4>
          <p className="footer-address">
            <EditableContent contentKey="contact_address" fallback={SITE_ADDRESS} as="span" />
          </p>
          <a href={`tel:${SITE_PHONE.replace(/\D/g, '')}`}><EditableContent contentKey="contact_phone" fallback={SITE_PHONE} as="span" /></a>
          <a href={`mailto:${SITE_EMAIL}`}><EditableContent contentKey="contact_email" fallback={SITE_EMAIL} as="span" /></a>
          <ul className="footer-hours" aria-label="Hours">
            <li><EditableContent contentKey="footer_hours_line_0" fallback={SITE_HOURS[0]} as="span" /></li>
            <li><EditableContent contentKey="footer_hours_line_1" fallback={SITE_HOURS[1]} as="span" /></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} <EditableContent contentKey="footer_copyright" fallback="Mine Performance Academy. All rights reserved." as="span" /></p>
        {FUTURES_APP_URL && (
          <p className="footer-powered">
            Powered by{' '}
            <a href={FUTURES_APP_URL} target="_blank" rel="noopener noreferrer">
              <EditableContent contentKey="footer_powered" fallback="The Futures App" as="span" />
            </a>
          </p>
        )}
      </div>
    </footer>
  );
}
