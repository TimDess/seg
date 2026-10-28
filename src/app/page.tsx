import Link from "next/link";
import { Fragment, type CSSProperties } from "react";
import Image from "next/image";
import TerritoryMap from "@/components/territory-map";
import ExpertiseMarquee from "@/components/expertise-marquee";
import { ArrowUpRight, ArrowDown, Plus } from "lucide-react";
import { Button, SectionLabel, TextLink, ContactBand } from "@/components/ui";
import { services, steps } from "@/lib/content";
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <SectionLabel>ÉLECTRICITÉ GÉNÉRALE — ÎLE-DE-FRANCE</SectionLabel>
          <h1>
            {[
              "Votre",
              "entreprise",
              "d’électricité",
              "générale",
              "en",
              "Île-de-France.",
            ].map((word, index) => (
              <Fragment key={word}>
                <span
                  className={`hero-word ${index === 5 ? "hero-accent" : ""}`}
                  style={{ "--word-index": index } as CSSProperties}
                >
                  {word}
                </span>
                {index < 5 ? " " : null}
              </Fragment>
            ))}
          </h1>
          <p>
            SEG accompagne les professionnels et les particuliers dans leurs
            projets de rénovation et d’installation électrique depuis 2015.
          </p>
          <div className="hero-actions">
            <Button href="/contact">Demander un devis</Button>
            <Link className="subtle-link" href="/expertises">
              Nos expertises <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="hero-bottom">
            <span>À VOS CÔTÉS DEPUIS 2015.</span>
            <a href="#expertises" aria-label="Découvrir les expertises">
              <ArrowDown size={20} />
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <TerritoryMap />
        </div>
      </section>
      <section className="proof-strip">
        <div>
          <span className="proof-number">2015</span>
          <span>ANNÉE DE CRÉATION</span>
        </div>
        <div>
          <span className="proof-name">Val-d’Oise</span>
          <span>NOTRE ANCRAGE</span>
        </div>
        <div>
          <span className="proof-name">Île-de-France</span>
          <span>NOTRE TERRAIN D’INTERVENTION</span>
        </div>
        <div className="proof-statement">
          Une structure indépendante.
          <br />
          Un engagement de terrain.
          <Plus size={22} />
        </div>
      </section>
      <ExpertiseMarquee />
      <section className="section expertise-section" id="expertises">
        <div className="section-intro">
          <SectionLabel>01 — NOS EXPERTISES</SectionLabel>
          <h2>
            Vos projets évoluent.
            <br />
            Notre exigence demeure.
          </h2>
          <div>
            <p>
              Des installations pensées pour les usages.
              <br />
              Des interventions attentives à chaque détail.
            </p>
            <TextLink href="/expertises">Découvrir nos expertises</TextLink>
          </div>
        </div>
        <div className="service-list">
          {services.map((s) => (
            <Link href={"/" + s.slug} key={s.slug} className="service-row">
              <span className="mono">{s.number}</span>
              <h3>{s.title}</h3>
              <p>{s.short}</p>
              <span className="round-arrow">
                <ArrowUpRight size={22} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="section projects-section">
        <div className="section-intro">
          <SectionLabel>02 — SUR LE TERRAIN</SectionLabel>
          <h2>
            Des espaces à transformer.
            <br />
            Des exigences à partager.
          </h2>
          <TextLink href="/expertises">Explorer nos expertises</TextLink>
        </div>
        <div className="project-grid">
          {[
            {
              title: "Espaces de travail",
              tag: "RÉNOVATION · TERTIAIRE",
              slug: "projet-bureaux",
              image: "bureaux.webp",
            },
            {
              title: "Locaux professionnels",
              tag: "INSTALLATION · BÂTIMENT",
              slug: "projet-locaux-professionnels",
              image: "espaces.webp",
            },
          ].map((p, i) => (
            <Link
              href={"/" + p.slug}
              key={p.slug}
              className={"project project-" + i}
            >
              <div className="project-photo">
                <Image
                  src={"/images/" + p.image}
                  alt={
                    p.title +
                    " — photographie illustrative, pas une réalisation SEG"
                  }
                  fill
                  sizes="(max-width: 700px) 100vw, 50vw"
                />
                <span className="photo-tag">ILLUSTRATION</span>
                <span className="project-arrow">
                  <ArrowUpRight />
                </span>
              </div>
              <div className="project-title">
                <h3>{p.title}</h3>
                <span>{p.tag}</span>
              </div>
            </Link>
          ))}
        </div>
        <p className="editorial-note">
          Visuels d’illustration : des contextes d’intervention, sans référence
          à un chantier SEG.
        </p>
      </section>
      <section className="precision">
        <div className="precision-art">
          <span>SEG / PRINCIPES D’EXÉCUTION</span>
          <div className="technical-lines" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
            <b>+</b>
          </div>
          <span>LE SOIN DU DÉTAIL, À CHAQUE ÉTAPE.</span>
        </div>
        <div className="precision-copy">
          <SectionLabel>03 — NOTRE CONVICTION</SectionLabel>
          <h2>
            La qualité se joue
            <br />
            dans les détails.
          </h2>
          <p>
            Une installation ne se résume pas à ce qui se voit. Elle se
            construit dans la compréhension du besoin, la préparation et le soin
            apporté à l’exécution.
          </p>
          <p>
            Cette attention guide notre manière d’aborder vos projets, du
            premier échange à la livraison.
          </p>
          <TextLink href="/entreprise">Rencontrer SEG</TextLink>
        </div>
      </section>
      <section className="section human-section">
        <SectionLabel>04 — L’ENTREPRISE</SectionLabel>
        <div className="human-grid">
          <h2>
            Une expertise technique.
            <br />
            <span>Une relation directe.</span>
          </h2>
          <div>
            <p>
              Depuis 2015, SEG accompagne les projets d’électricité générale
              depuis Ennery, dans le Val-d’Oise. Une entreprise indépendante à
              taille humaine, avec une conviction : le dialogue et la précision
              avancent ensemble.
            </p>
            <TextLink href="/entreprise">L’entreprise et sa démarche</TextLink>
          </div>
        </div>
      </section>
      <section className="section method">
        <div className="section-intro">
          <SectionLabel>05 — L’APPROCHE</SectionLabel>
          <h2>
            Bien préparer.
            <br />
            Mieux réaliser.
          </h2>
          <p>
            Un cadre d’échange proposé,
            <br />à adapter et valider pour chaque projet.
          </p>
        </div>
        <ol>
          {steps.map((s, i) => (
            <li key={s}>
              <span>0{i + 1}</span>
              <h3>{s}</h3>
            </li>
          ))}
        </ol>
      </section>
      <section className="section area">
        <div className="area-mark" aria-hidden="true">
          <span>95</span>
          <i />
          ÎLE-DE-FRANCE
        </div>
        <div>
          <SectionLabel>06 — À VOS CÔTÉS</SectionLabel>
          <h2>
            Basés dans le Val-d’Oise.
            <br />
            Présents en Île-de-France.
          </h2>
          <p>
            Un ancrage local, une mobilité à l’échelle de vos projets.
            <br />
            Au-delà de la région, étudions ensemble votre besoin.
          </p>
          <TextLink href="/zones-intervention">
            Notre zone d’intervention
          </TextLink>
          <Link className="private-link" href="/particuliers">
            Un projet pour votre logement ? <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
      <ContactBand />
    </>
  );
}
