import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/contact-form";
import { SectionLabel } from "@/components/ui";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Présenter votre projet électrique",
  description:
    "Professionnels ou particuliers : présentez votre projet de rénovation ou d’installation électrique à SEG, à Ennery en Île-de-France.",
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
          Tout commence
          <br />
          par un échange.
        </h1>
        <p>
          Présentez-nous votre projet. Son contexte, vos attentes et les détails
          qui comptent pour vous.
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
