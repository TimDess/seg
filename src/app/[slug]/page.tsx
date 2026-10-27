import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { services, pages, steps } from "@/lib/content";
import { Button, ContactBand, SectionLabel, TextLink } from "@/components/ui";
export function generateStaticParams() {
  return [
    ...services.map((s) => ({ slug: s.slug })),
    ...Object.keys(pages).map((slug) => ({ slug })),
  ];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = services.find((s) => s.slug === slug) || pages[slug];
  return {
    title: data?.title.replaceAll("\n", " "),
    description: data?.description,
    alternates: { canonical: "/" + slug },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  const page = pages[slug];
  if (!service && !page) notFound();
  const data = service || page;
  return (
    <>
      <section className="page-hero">
        <div className="breadcrumb">
          <Link href="/">Accueil</Link>
          <span>/</span>
          <span>{service ? "Expertises" : page.eyebrow.toLowerCase()}</span>
        </div>
        <SectionLabel>
          {service ? "EXPERTISE / " + service.number : page.eyebrow}
        </SectionLabel>
        <h1>{data.title}</h1>
        <p>{data.description}</p>
        {service && (
          <Button href={"/contact?projet=" + service.slug}>
            Échanger sur votre projet
          </Button>
        )}
      </section>
      <div className="page-content">
        {service ? (
          <>
            <div className="split-content">
              <div>
                <h2>{service.context}</h2>
                <p>{service.body}</p>
                <TextLink href="/contact">Décrire votre besoin</TextLink>
              </div>
              <div>
                <h3 className="content-heading">
                  Les points à étudier ensemble
                </h3>
                <ul className="detail-list">
                  {service.items.map((t, i) => (
                    <li key={t}>
                      <span>0{i + 1}</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="faq">
              <h2 className="content-heading">Préparer votre intervention</h2>
              <details>
                <summary>Quels documents transmettre ?</summary>
                <p>
                  Plans disponibles, descriptif des travaux, photographies de
                  l’existant et rapports de contrôle éventuels permettent de
                  mieux comprendre votre besoin.
                </p>
              </details>
              <details>
                <summary>Quels bâtiments sont concernés ?</summary>
                <p>
                  Les bureaux, commerces et locaux professionnels, selon les
                  caractéristiques du projet et le périmètre confirmé lors de
                  l’étude.
                </p>
              </details>
              <details>
                <summary>Comment organiser le calendrier ?</summary>
                <p>
                  Précisez vos échéances, les périodes d’occupation du bâtiment
                  et les contraintes d’accès. L’organisation sera définie après
                  échange avec SEG.
                </p>
              </details>
            </div>
          </>
        ) : null}
        {slug === "expertises" && (
          <div className="service-list">
            {services.map((s) => (
              <Link key={s.slug} className="service-row" href={"/" + s.slug}>
                <span className="mono">{s.number}</span>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <span className="round-arrow">↗</span>
              </Link>
            ))}
          </div>
        )}
        {slug === "realisations" && (
          <div className="split-content portfolio-pending">
            <div>
              <SectionLabel>LE SOIN DU TRAVAIL RÉALISÉ</SectionLabel>
              <h2>
                Chaque chantier
                <br />a ses détails.
              </h2>
            </div>
            <div>
              <p>
                Notre sélection de réalisations est en cours de préparation.
                Nous partagerons ici des projets documentés, avec leur contexte
                et les interventions de SEG.
              </p>
              <p>
                En attendant, découvrez nos domaines d’intervention ou
                présentez-nous votre besoin.
              </p>
              <TextLink href="/expertises">Découvrir nos expertises</TextLink>
            </div>
          </div>
        )}
        {slug === "entreprise" && (
          <>
            <div className="split-content">
              <div>
                <h2>
                  Indépendants.
                  <br />
                  Impliqués sur le terrain.
                </h2>
                <p>
                  Depuis sa création en 2015, Sadeq Électricité Générale
                  développe son activité depuis le Val-d’Oise. L’entreprise
                  s’adresse en priorité aux professionnels pour leurs projets de
                  rénovation et d’installation électrique.
                </p>
                <p>
                  La précision d’exécution et une relation directe constituent
                  le fil conducteur de cette nouvelle présentation de SEG.
                </p>
              </div>
              <div>
                <SectionLabel>LES REPÈRES</SectionLabel>
                <ul className="detail-list">
                  <li>
                    <span>01</span>Création en 2015
                  </li>
                  <li>
                    <span>02</span>Implantation à Ennery, Val-d’Oise
                  </li>
                  <li>
                    <span>03</span>Interventions principalement en Île-de-France
                  </li>
                </ul>
                <div className="notice">
                  Les portraits, la présentation du dirigeant et de l’équipe,
                  ainsi que les qualifications seront ajoutés sur la base
                  d’informations validées par SEG.
                </div>
              </div>
            </div>
            <section className="method">
              <h2>Une approche à construire ensemble.</h2>
              <p>Cadre proposé, à valider auprès de SEG avant publication.</p>
              <ol>
                {steps.map((s, i) => (
                  <li key={s}>
                    <span>0{i + 1}</span>
                    <h3>{s}</h3>
                  </li>
                ))}
              </ol>
            </section>
          </>
        )}
        {slug === "particuliers" && (
          <>
            <div className="split-content">
              <div>
                <h2>Faire évoluer votre installation.</h2>
                <p>
                  Une rénovation complète ou une adaptation de votre logement
                  commence par une bonne compréhension de l’installation
                  existante. Décrivez votre situation pour étudier les travaux
                  possibles.
                </p>
                <Button href="/contact?profil=particulier">
                  Présenter mon projet résidentiel
                </Button>
              </div>
              <ul className="detail-list">
                <li>
                  <span>01</span>Rénovation électrique du logement
                </li>
                <li>
                  <span>02</span>Modernisation et adaptation aux usages
                </li>
                <li>
                  <span>03</span>Travaux à définir après étude de l’existant
                </li>
              </ul>
            </div>
            <div className="faq">
              <details>
                <summary>Que préciser dans ma demande ?</summary>
                <p>
                  Indiquez le type de logement, sa localisation, la surface
                  concernée, l’état connu de l’installation et votre calendrier.
                  Quelques photographies et un plan peuvent aider.
                </p>
              </details>
              <details>
                <summary>Est-ce un service d’urgence ?</summary>
                <p>
                  Ce site permet de présenter un projet de travaux. Il ne
                  constitue pas un dispositif d’intervention d’urgence.
                </p>
              </details>
            </div>
          </>
        )}
        {slug === "zones-intervention" && (
          <div className="split-content">
            <div className="area-mark">
              <span>95</span>
              <i />
              ENNERY · VAL-D’OISE
            </div>
            <div>
              <h2>
                Une implantation locale.
                <br />
                Des projets régionaux.
              </h2>
              <p>
                La localisation du chantier, ses accès, le calendrier et la
                nature des travaux permettent de confirmer les conditions
                d’intervention en Île-de-France.
              </p>
              <p>
                Pour un projet situé hors de la région, indiquez sa localisation
                dans votre demande : la faisabilité sera étudiée au cas par cas.
              </p>
              <Button href="/contact">Nous situer votre projet</Button>
            </div>
          </div>
        )}
        {slug === "conseils" && (
          <>
            <h2>Préparer votre demande de travaux.</h2>
            <div className="article-grid">
              <article>
                <span>01 / LE BESOIN</span>
                <h3>Décrire les usages attendus</h3>
                <p>
                  Quels espaces seront concernés ? Quels équipements devront
                  être alimentés ? Identifiez les évolutions prévues plutôt
                  qu’une solution technique supposée.
                </p>
              </article>
              <article>
                <span>02 / L’EXISTANT</span>
                <h3>Rassembler les documents utiles</h3>
                <p>
                  Plans, photographies et rapports de contrôle disponibles
                  donnent un premier aperçu du bâtiment. N’envoyez aucun
                  document contenant des données sensibles inutiles.
                </p>
              </article>
              <article>
                <span>03 / LE CHANTIER</span>
                <h3>Préciser vos contraintes</h3>
                <p>
                  Occupation des locaux, accès, autres corps d’état et échéances
                  : ces informations aident à préparer un échange concret sur
                  l’organisation des travaux.
                </p>
              </article>
            </div>
            <div className="notice">
              Ces repères ne remplacent ni une étude de votre installation ni un
              contrôle réglementaire. N’intervenez jamais vous-même sur une
              installation sous tension.
            </div>
          </>
        )}
        {slug.startsWith("projet-") && (
          <>
            <div className="notice">
              Contenu de démonstration. Mission, localisation, contraintes,
              interventions et résultats de chantier restent à renseigner après
              validation. Aucun résultat commercial ou technique n’est inventé.
            </div>
            <div className="split-content">
              <div>
                <h2>
                  {slug === "projet-bureaux"
                    ? "Repenser les usages des bureaux."
                    : "Adapter les réseaux à l’activité."}
                </h2>
                <p>
                  {slug === "projet-bureaux"
                    ? "Réaménagement des postes de travail, éclairage, alimentation des équipements : un projet tertiaire demande de rapprocher les besoins des occupants et les possibilités du bâtiment."
                    : "Les besoins électriques d’un local professionnel dépendent de son activité, de ses équipements et de ses contraintes d’exploitation. Le premier échange sert à en préciser le périmètre."}
                </p>
                <TextLink href="/contact">
                  Parlons d’un projet similaire
                </TextLink>
              </div>
              <div className="project-photo">
                <Image
                  src={
                    "/images/" +
                    (slug === "projet-bureaux"
                      ? "bureaux.webp"
                      : "espaces.webp")
                  }
                  alt="Architecture — illustration générée, sans référence à un chantier SEG"
                  fill
                  sizes="(max-width:800px) 100vw, 50vw"
                />
              </div>
            </div>
          </>
        )}
        {slug === "mentions-legales" && (
          <div className="legal">
            <h2>1. Éditeur du site</h2>
            <p>
              Le site s-e-g.fr présente l’activité de SEG — Sadeq Électricité
              Générale, entreprise d’électricité générale implantée à Ennery,
              dans le Val-d’Oise.
            </p>
            <dl className="legal-details">
              <div>
                <dt>Dénomination sociale</dt>
                <dd>À compléter</dd>
              </div>
              <div>
                <dt>Forme juridique et capital social</dt>
                <dd>À compléter</dd>
              </div>
              <div>
                <dt>Adresse du siège social</dt>
                <dd>À compléter — Ennery, France</dd>
              </div>
              <div>
                <dt>SIREN / RCS</dt>
                <dd>À compléter</dd>
              </div>
              <div>
                <dt>TVA intracommunautaire</dt>
                <dd>À compléter, si applicable</dd>
              </div>
              <div>
                <dt>Téléphone et adresse e-mail</dt>
                <dd>À compléter</dd>
              </div>
              <div>
                <dt>Directeur de la publication</dt>
                <dd>À compléter</dd>
              </div>
            </dl>
            <h2>2. Hébergement</h2>
            <p>
              Nom ou raison sociale, adresse et téléphone de l’hébergeur : à
              compléter lors de la mise en ligne.
            </p>
            <h2>3. Objet du site</h2>
            <p>
              Ce site présente les activités de SEG et permet de préparer une
              demande de renseignements ou de travaux. Les informations sont
              fournies à titre indicatif et peuvent évoluer. Les prestations,
              délais et conditions d’intervention sont précisés après étude du
              projet et, le cas échéant, dans un devis.
            </p>
            <h2>4. Propriété intellectuelle</h2>
            <p>
              Le logo SEG et les éléments de marque sont utilisés pour présenter
              l’entreprise. Toute reproduction ou réutilisation des contenus du
              site, hors usages autorisés par la loi, nécessite l’autorisation
              préalable des titulaires des droits concernés.
            </p>
            <h2>5. Photographies et illustrations</h2>
            <p>
              Les visuels signalés comme illustrations sont des images de
              présentation générées. Ils ne représentent pas des chantiers
              réalisés par SEG et ne constituent pas des références clients.
            </p>
            <h2>6. Accès au site et responsabilité</h2>
            <p>
              L’éditeur s’efforce de fournir des informations exactes et de
              maintenir le site accessible. Des interruptions peuvent toutefois
              survenir, notamment pour maintenance. Les liens vers des sites
              tiers sont fournis à titre pratique ; leur contenu relève de leurs
              éditeurs respectifs. Ces dispositions ne limitent pas les droits
              reconnus par la législation applicable.
            </p>
            <h2>7. Données personnelles et cookies</h2>
            <p>
              Les modalités de traitement des données du formulaire et les
              informations relatives aux cookies sont détaillées dans notre{" "}
              <Link href="/confidentialite">politique de confidentialité</Link>.
            </p>
            <h2>8. Droit applicable</h2>
            <p>
              Le site est soumis au droit français. En cas de différend, les
              parties sont invitées à rechercher une solution amiable avant
              toute procédure, sans préjudice des droits et voies de recours
              prévus par la loi.
            </p>
            <div className="notice">
              Mentions provisoires : les renseignements identifiés « à compléter
              » doivent être renseignés avant la publication publique du site.
              Les coordonnées du médiateur de la consommation devront également
              être ajoutées si l’activité auprès de particuliers le requiert.
            </div>
          </div>
        )}
        {slug === "confidentialite" && (
          <div className="legal">
            <h2>Données du formulaire</h2>
            <p>
              Le formulaire recueille les coordonnées, l’entreprise le cas
              échéant, la nature du projet, sa localisation, le calendrier, le
              descriptif et un éventuel document technique. Ces éléments servent
              uniquement à examiner votre demande et à vous répondre.
            </p>
            <h2>Transmission</h2>
            <p>
              Sans service de réception configuré, aucune demande n’est
              transmise et un message l’indique. Lorsqu’il est activé, le
              service destinataire doit être validé par SEG. Aucune confirmation
              n’apparaît si le service n’a pas accepté l’envoi.
            </p>
            <h2>Durée de conservation et droits</h2>
            <p>
              Avant mise en ligne, SEG doit préciser le responsable du
              traitement, la base légale applicable, la durée de conservation et
              un contact permettant d’exercer les droits d’accès, de
              rectification, d’effacement et d’opposition. Vous pouvez adresser
              une réclamation à la CNIL.
            </p>
            <h2>Cookies</h2>
            <p>
              Cette version n’installe aucun outil publicitaire ni mesure
              d’audience. Aucun cookie non essentiel n’est nécessaire à son
              utilisation.
            </p>
            <h2>Documents</h2>
            <p>
              Un document PDF ou une image de 5 Mo maximum peut accompagner la
              demande. Transmettez uniquement les informations nécessaires au
              projet.
            </p>
          </div>
        )}
      </div>
      {!["mentions-legales", "confidentialite"].includes(slug) && (
        <ContactBand />
      )}
    </>
  );
}
