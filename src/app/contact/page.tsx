export const runtime = 'edge';
import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/contact-form";
import { SectionLabel } from "@/components/ui";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Demander un devis électrique",
  description:
    "Demandez un devis à SEG pour vos travaux de rénovation ou d’installation électrique en Île-de-France, que vous soyez professionnel ou particulier.",
  alternates: { canonical: "/contact" },
};
export default function Contact() {
  return (
    <>
      <section className="page-hero">
        <div className="breadcrumb">
          <Link href="/">Accueil</Link>
          <span>/</span>
          <span>Contact</span>
        </div>
        <SectionLabel>FAISONS CONNAISSANCE</SectionLabel>
        <h1>
          Demandez votre
          <br />
          devis électrique.
        </h1>
        <p>
          Décrivez vos travaux, leur localisation et votre calendrier pour nous
          permettre d’étudier votre demande de devis.
        </p>
      </section>
      <section className="contact-layout">
        <aside className="contact-aside">
          <SectionLabel>VOTRE PROJET, EN DIRECT</SectionLabel>
          <h2>
            Les bonnes informations.
            <br />
            Dès le premier contact.
          </h2>
          <p>
            Quelques éléments suffisent pour engager un échange concret. Plans,
            calendrier ou contraintes du bâtiment nous aideront à comprendre
            votre besoin.
          </p>
          <div className="contact-info">
            <SectionLabel>NOTRE IMPLANTATION</SectionLabel>
            <p>
              Ennery · Val-d’Oise
              <br />
              Interventions en Île-de-France
            </p>
          </div>
        </aside>
        <ContactForm configured={Boolean(process.env.CONTACT_WEBHOOK_URL)} />
      </section>
    </>
  );
}
