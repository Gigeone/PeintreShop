'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';

/**
 * Navbar Component - Navigation principale du site
 *
 * - Logo "MNGH" vers l'accueil
 * - Liens + bouton "Voir les œuvres" sur desktop
 * - Menu déroulant sur mobile
 * - Sticky, fond papier légèrement translucide
 */
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname.startsWith(href);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex h-16 items-center justify-between md:h-[88px]">
          <Link href="/" className="flex items-baseline gap-3.5" onClick={closeMenu}>
            <span className="font-serif text-2xl font-medium tracking-[0.06em] md:text-[30px]">
              MNGH
            </span>
            <span className="hidden text-[13px] uppercase tracking-[0.08em] text-muted sm:inline">
              Peintre
            </span>
          </Link>

          {/* Navigation desktop */}
          <ul className="hidden items-center gap-10 text-[15px] md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={cn(
                    'border-b pb-1 transition-colors hover:text-accent',
                    isActive(link.href) ? 'border-ink font-semibold' : 'border-transparent'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/galerie"
                className="rounded-full border border-ink px-5 py-3 font-medium transition-colors hover:bg-ink hover:text-paper"
              >
                Voir les œuvres
              </Link>
            </li>
          </ul>

          {/* Bouton menu mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="-mr-2.5 flex h-11 w-11 items-center justify-center md:hidden"
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMenuOpen}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true">
              {isMenuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <ul className="flex animate-fadeIn flex-col border-t border-line py-4 md:hidden">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={cn(
                    'block py-3 font-serif text-2xl',
                    isActive(link.href) && 'text-accent'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
