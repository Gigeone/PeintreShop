'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { NAV_LINKS } from '@/lib/constants';

/**
 * Navbar Component - Navigation principale du site
 *
 * Fonctionnalités:
 * - Logo "MNGH" cliquable vers l'accueil
 * - Navigation desktop (liens horizontaux)
 * - Menu mobile avec hamburger icon
 * - Indication visuelle de la page active
 * - Sticky positioning (reste en haut lors du scroll)
 * - Palette de couleurs pastels
 */
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Vérifie si un lien est actif
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Ferme le menu mobile
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-pastel-rose-bg shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo MNGH */}
          <Link
            href="/"
            className="font-serif text-2xl font-bold text-pastel-blue-logo hover:text-pastel-lavender transition-colors duration-300"
            onClick={closeMenu}
          >
            MNGH
          </Link>

          {/* Navigation Desktop */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`
                    text-base font-medium pb-1 transition-all duration-300
                    ${
                      isActive(link.href)
                        ? 'text-pastel-rose-mauve border-b-2 border-pastel-rose-mauve font-semibold'
                        : 'text-pastel-gray-text hover:text-pastel-lavender border-b-2 border-transparent'
                    }
                  `}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Hamburger Button (Mobile) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-7 h-6 flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-pastel-lavender rounded"
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              // Croix (X) quand le menu est ouvert
              <>
                <span className="w-full h-0.5 bg-pastel-lavender transform rotate-45 translate-y-2.5 transition-transform duration-300" />
                <span className="w-full h-0.5 bg-pastel-lavender opacity-0 transition-opacity duration-300" />
                <span className="w-full h-0.5 bg-pastel-lavender transform -rotate-45 -translate-y-2.5 transition-transform duration-300" />
              </>
            ) : (
              // Hamburger (≡) quand le menu est fermé
              <>
                <span className="w-full h-0.5 bg-pastel-lavender transition-transform duration-300" />
                <span className="w-full h-0.5 bg-pastel-lavender transition-opacity duration-300" />
                <span className="w-full h-0.5 bg-pastel-lavender transition-transform duration-300" />
              </>
            )}
          </button>
        </div>

        {/* Menu Mobile (Overlay) */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 animate-fadeIn">
            <ul className="flex flex-col gap-3 pt-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className={`
                      block px-4 py-3 rounded-lg text-lg font-medium transition-all duration-300
                      ${
                        isActive(link.href)
                          ? 'bg-pastel-rose-mauve/15 text-pastel-rose-mauve font-semibold'
                          : 'text-pastel-gray-text hover:bg-pastel-lavender/10 hover:text-pastel-lavender'
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
