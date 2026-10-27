import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/header";
import Logo from "@/components/logo";
import "@fontsource/space-grotesk/latin-400.css";
import "@fontsource/space-grotesk/latin-500.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://s-e-g.fr"),
  alternates: { canonical: "/" },
  title: {
    default: "SEG — Électricité générale en Île-de-France",
    template: "%s | SEG",
  },
  description:
    "SEG, Sadeq Électricité Générale. Rénovation et installation électrique pour vos bâtiments professionnels en Île-de-France. Entreprise basée à Ennery depuis 2015.",
  robots:
    process.env.SITE_INDEXABLE === "true"
      ? { index: true, follow: true }
      : { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#contenu">
          Aller au contenu
        </a>
        <Header />
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
