import { Oswald, Barlow, Playfair_Display, Inter } from 'next/font/google';
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

/** Theme options: load all so client can switch via site content */
const oswald = Oswald({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display-oswald',
  display: 'swap',
});
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-display-playfair',
  display: 'swap',
});
const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans-barlow',
  display: 'swap',
});
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans-inter',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${oswald.variable} ${playfair.variable} ${barlow.variable} ${inter.variable}`} data-theme="v3">
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
