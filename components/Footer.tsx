import Link from "next/link";
import { INSTAGRAM_URL, NAV_LINKS } from "@/lib/constants";

/**
 * Footer Component - Pied de page global du site
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 pb-10 pt-12 sm:px-8 md:pt-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-2">
            <span className="font-serif text-2xl font-medium tracking-[0.06em]">MNGH</span>
            <span className="text-sm text-muted">Peintures originales à l&apos;acrylique</span>
          </div>

          <nav aria-label="Pied de page">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-3 text-[15px] md:flex md:gap-10">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <p className="text-[13px] text-muted">© {currentYear} MNGH. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
