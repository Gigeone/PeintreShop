import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";
import { InstagramIcon } from "@/components/icons";

/**
 * Footer Component - Pied de page global du site
 *
 * Fonctionnalités:
 * - Logo "MNGH" à gauche
 * - Liens de navigation au centre (sans titre)
 * - Lien Instagram à droite
 * - Copyright centré en dessous
 * - Layout responsive (3 colonnes desktop, vertical mobile)
 * - Palette pastel cohérente avec Navbar
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-pastel-rose-bg border-t border-pastel-lavender/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 3 colonnes centrées verticalement */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center mb-8">
          {/* Colonne 1: Logo */}
          <div className="text-center md:text-left">
            <h3 className="font-serif text-xl md:text-2xl font-bold text-pastel-blue-logo">
              MNGH
            </h3>
          </div>

          {/* Colonne 2: Navigation (sans titre) */}
          <nav aria-label="Footer navigation" className="text-center">
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base text-pastel-lavender hover:text-pastel-rose-mauve transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Colonne 3: Instagram */}
          <div className="text-center md:text-right">
            <a
              href="https://instagram.com/mngh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-pastel-lavender hover:text-pastel-rose-mauve transition-colors duration-300"
              aria-label="Suivez-nous sur Instagram"
            >
              <InstagramIcon />
              <span className="text-base">Instagram</span>
            </a>
          </div>
        </div>

        {/* Copyright centré */}
        <div className="text-center pt-8 border-t border-pastel-lavender/20">
          <p className="text-sm text-pastel-gray-text/60">
            © {currentYear} MNGH. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
