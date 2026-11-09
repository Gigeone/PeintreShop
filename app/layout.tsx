import type { Metadata } from 'next';
import { Fraunces, Instrument_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSiteUrl } from '@/lib/seo/metadata';

const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-fraunces',
  display: 'swap',
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
  display: 'swap',
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'MNGH - Artiste Peintre',
    template: '%s | MNGH',
  },
  description: 'Découvrez et achetez des œuvres d\'art originales et uniques. Galerie en ligne d\'une artiste peintre passionnée.',
  keywords: ['art', 'peinture', 'œuvres originales', 'artiste peintre', 'galerie art', 'achat tableau'],
  authors: [{ name: 'MNGH' }],
  creator: 'MNGH - Artiste Peintre',
  publisher: 'MNGH',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    siteName: 'MNGH - Artiste Peintre',
    title: 'MNGH - Artiste Peintre',
    description: 'Découvrez et achetez des œuvres d\'art originales et uniques',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MNGH - Artiste Peintre',
    description: 'Découvrez et achetez des œuvres d\'art originales et uniques',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${instrumentSans.variable} ${fraunces.variable} font-sans antialiased`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
