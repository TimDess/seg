export const runtime = 'edge';
export const revalidate = 0;

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject } from "@/sanity/projects";
import { ContactBand, SectionLabel } from "@/components/ui";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  return {
    title: project.title,
    description: project.description?.slice(0, 160) || `Découvrez le projet ${project.title} de SEG.`,
    alternates: { canonical: `/realisations/${encodeURIComponent(slug)}` },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  const gallery = project.gallery?.filter((image) => image.asset?.url) || [];

  return (
    <>
      <section className="page-hero">
        <div className="breadcrumb"><Link href="/">Accueil</Link><span>/</span><Link href="/realisations">Réalisations</Link></div>
        <SectionLabel>RÉALISATION SEG</SectionLabel>
        <h1>{project.title}</h1>
      </section>
      <div className="page-content">
        <div className="split-content">
          <div>
            <SectionLabel>LE PROJET</SectionLabel>
            {project.description && <p style={{ whiteSpace: "pre-line" }}>{project.description}</p>}
          </div>
          {project.mainImage?.asset?.url && (
            <div className="project-photo">
              <Image src={project.mainImage.asset.url} alt={project.title} fill sizes="(max-width: 800px) 100vw, 50vw" loading="eager" />
            </div>
          )}
        </div>
        {gallery.length > 0 && (
          <section aria-labelledby="gallery-title">
            <h2 id="gallery-title">Le projet en images</h2>
            <div className="project-grid">
              {gallery.map((image, index) => (
                <div className="project-photo" key={image._key || index}>
                  <Image src={image.asset!.url} alt={`${project.title} — photo ${index + 1}`} fill sizes="(max-width: 700px) 100vw, 50vw" />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      <ContactBand />
    </>
  );
}
