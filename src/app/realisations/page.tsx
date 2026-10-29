export const runtime = 'edge';
export const revalidate = 0;

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { client } from "@/sanity/client";
import type { Project } from "@/sanity/projects";
import { ContactBand, SectionLabel } from "@/components/ui";

export const metadata: Metadata = {
  title: "Nos réalisations",
  description: "Découvrez les projets d’électricité générale de SEG en Île-de-France.",
  alternates: { canonical: "/realisations" },
};

export default async function RealisationsPage() {
  const projects = client
    ? await client.fetch<Project[]>(
        `*[_type == "project" && defined(slug.current) && slug.current != ""] | order(_createdAt desc){
          _id, title, slug, mainImage{asset->{url}}
        }`,
        {},
        { cache: "no-store" },
      )
    : [];

  return (
    <>
      <section className="page-hero">
        <div className="breadcrumb"><Link href="/">Accueil</Link><span>/</span><span>Réalisations</span></div>
        <SectionLabel>RÉALISATIONS</SectionLabel>
        <h1>Des projets concrets.<br />La même exigence.</h1>
        <p>Découvrez les projets d’électricité générale de SEG, des espaces professionnels aux lieux de vie.</p>
      </section>
      <div className="page-content">
        {projects.length ? (
          <div className="project-grid">
            {projects.map((project) => (
              <Link className="project" key={project._id} href={`/realisations/${encodeURIComponent(project.slug.current)}`}>
                {project.mainImage?.asset?.url && (
                  <div className="project-photo">
                    <Image src={project.mainImage.asset.url} alt={project.title} fill sizes="(max-width: 700px) 100vw, 50vw" />
                    <span className="project-arrow" aria-hidden="true"><ArrowUpRight /></span>
                  </div>
                )}
                <div className="project-title"><h2>{project.title}</h2></div>
                <span className="project-detail-link">Découvrir le projet <ArrowUpRight size={16} aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="notice">Les projets seront présentés prochainement. Contactez-nous pour échanger sur votre besoin.</p>
        )}
      </div>
      <ContactBand />
    </>
  );
}
