import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSiteUrl } from '@/lib/seo/metadata';

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
    images: [
      {
        url: `${siteUrl}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: 'MNGH - Artiste Peintre',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MNGH - Artiste Peintre',
    description: 'Découvrez et achetez des œuvres d\'art originales et uniques',
    images: [`${siteUrl}/og-default.jpg`],
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
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
