import type { Metadata } from 'next';
import Script from 'next/script';
import { I18nProvider } from '@/components/I18nProvider';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import './globals.css';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://flexroyale.vercel.app').trim();

export const metadata: Metadata = {
  title: 'FlexRoyale — Combien vaut ton compte Clash Royale ?',
  description: 'Calcule la valeur estimée de ton compte Clash Royale en euros. Grade S, A, B, C, D — découvre ton archétype et ta place dans le top mondial.',
  keywords: ['Clash Royale', 'valeur compte', 'calculateur', 'gems', 'FlexRoyale', 'grade'],
  authors: [{ name: 'FlexRoyale' }],
  openGraph: {
    title: 'FlexRoyale — Combien vaut ton compte Clash Royale ?',
    description: 'Calcule la valeur de ton compte CR en euros. Flex hard.',
    url: siteUrl,
    siteName: 'FlexRoyale',
    images: [
      {
        url: `${siteUrl}/og-default.png`,
        width: 1200,
        height: 630,
        alt: 'FlexRoyale — Clash Royale Account Value Calculator',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlexRoyale — Combien vaut ton compte Clash Royale ?',
    description: 'Calcule la valeur de ton compte CR en euros. Flex hard.',
    images: [`${siteUrl}/og-default.png`],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(siteUrl),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="fr">
      <body className="bg-espresso text-bone antialiased">
        <I18nProvider>
          <LanguageSwitcher />
          {children}
          {adsenseId && (
            <Script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
              crossOrigin="anonymous"
              strategy="lazyOnload"
            />
          )}
        </I18nProvider>
      </body>
    </html>
  );
}
