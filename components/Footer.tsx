import Link from "next/link";

/**
 * Footer Component - Pied de page global du site
 *
 * Fonctionnalités:
 * - Nom de l'artiste "MNGH"
 * - Liens de navigation (Accueil, Galerie, À propos, Contact)
 * - Copyright avec année dynamique
 * - Layout responsive (3 colonnes desktop, vertical mobile)
 * - Palette pastel cohérente avec Navbar
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/galerie", label: "Galerie" },
    { href: "/a-propos", label: "À propos" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer className="bg-pastel-rose-bg border-t border-pastel-lavender/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Colonne 1: Logo/Nom + Copyright */}
          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold text-pastel-blue-logo mb-4">
              MNGH
            </h3>
            <p className="text-sm text-pastel-gray-text/60">
              © {currentYear} MNGH - Tous droits réservés
            </p>
          </div>

          {/* Colonne 2: Navigation */}
          <nav
            aria-label="Footer navigation"
            className="text-center md:text-left"
          >
            <h4 className="text-lg font-semibold text-pastel-gray-text mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
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

          {/* Colonne 3: Vide (réservé pour réseaux sociaux en V1) */}
          <div></div>
        </div>
      </div>
    </footer>
  );
}
