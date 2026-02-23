import { DM_Sans } from 'next/font/google';
import './globals.css';
import '@/lib/env';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { StickyCTA } from '@/components/StickyCTA';
import { ChatWidget } from '@/components/ChatWidget';
import { ClientProviders } from '@/components/ClientProviders';
import { defaultMetadata, getLocalBusinessJsonLd } from '@/lib/seo';

export const metadata = defaultMetadata;

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover' as const,
};

/** Single professional geometric font — no mixing */
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.variable} data-theme="cinematic">
      <body className="font-theme-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getLocalBusinessJsonLd()) }}
        />
        <ClientProviders>
          <Nav />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <StickyCTA />
          <ChatWidget />
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
