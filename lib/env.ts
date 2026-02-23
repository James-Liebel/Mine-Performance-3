/**
 * Startup env validation. Import in layout so it runs early.
 * In production: warns if critical secrets missing; auth layer rejects default creds.
 */

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  const missing: string[] = [];
  if (!process.env.NEXTAUTH_SECRET) missing.push('NEXTAUTH_SECRET');
  if (!process.env.ADMIN_EMAIL) missing.push('ADMIN_EMAIL');
  if (!process.env.ADMIN_PASSWORD) missing.push('ADMIN_PASSWORD');

  if (missing.length > 0) {
    console.error(
      `[Security] Production requires: ${missing.join(', ')}. Admin login will be disabled until set.`
    );
  }

  const pwd = process.env.ADMIN_PASSWORD;
  if (pwd && (pwd.length < 8 || pwd === 'admin')) {
    console.error(
      '[Security] ADMIN_PASSWORD must be at least 8 characters and not "admin".'
    );
  }
}

// Optional: warn if STATSTAK URL is not HTTPS in production
const statstak = process.env.NEXT_PUBLIC_STATSTAK_BASE_URL;
if (isProd && statstak && !statstak.startsWith('https://')) {
  console.warn(
    '[Security] NEXT_PUBLIC_STATSTAK_BASE_URL should use HTTPS in production.'
  );
}
