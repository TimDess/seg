import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/header";
import Logo from "@/components/logo";
import SiteMotion from "@/components/site-motion";
import { themeInitScript } from "@/lib/theme";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "./globals.css";
import "./dark-theme.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://s-e-g.fr"),
  alternates: { canonical: "/" },
  title: {
    default: "SEG — Électricité générale en Île-de-France",
    template: "%s | SEG",
  },
  description:
    "SEG accompagne les professionnels et les particuliers dans leurs projets de rénovation et d’installation électrique depuis 2015. Ennery, Île-de-France.",
  robots:
    process.env.SITE_INDEXABLE === "true"
      ? { index: true, follow: true }
      : { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <a className="skip-link" href="#contenu">
          Aller au contenu
        </a>
        <Header />
        <SiteMotion />
        <main id="contenu">{children}</main>
        <footer>
          <div className="footer-top">
            <Link className="footer-brand" href="/">
              <Logo />
            </Link>
            <p>
              L’exigence, jusque dans les détails.
              <br />
              <small>Sadeq Électricité Générale · Depuis 2015</small>
            </p>
            <div>
              <span>ENNERY / VAL-D’OISE</span>
              <p>Ennery, Île-de-France</p>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} SEG</span>
            <Link href="/zones-intervention">Zones d’intervention</Link>
            <Link href="/conseils">Conseils & ressources</Link>
            <Link href="/mentions-legales">Mentions légales</Link>
            <Link href="/confidentialite">Confidentialité</Link>
          </div>
        </footer>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Electrician",
              name: "SEG — Sadeq Électricité Générale",
              url: "https://s-e-g.fr",
              foundingDate: "2015",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Ennery",
                addressRegion: "Val-d’Oise",
                addressCountry: "FR",
              },
              areaServed: "Île-de-France",
            }),
          }}
        />
      </body>
    </html>
  );
}
