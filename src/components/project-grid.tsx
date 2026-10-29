import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { illustrativeProjects } from "@/lib/content";

export default function ProjectGrid({
  staggered = false,
  descriptions = false,
}: {
  staggered?: boolean;
  descriptions?: boolean;
}) {
  return (
    <div className="project-grid">
      {illustrativeProjects.map((project, index) => (
        <Link
          href={"/" + project.slug}
          key={project.slug}
          className={`project${staggered ? " project-" + index : ""}`}
        >
          <div className="project-photo">
            <Image
              src={"/images/" + project.image}
              alt={
                project.title +
                " — visuel d’illustration, pas une réalisation SEG"
              }
              fill
              sizes="(max-width: 700px) 100vw, 50vw"
            />
            <span className="photo-tag">ILLUSTRATION</span>
            <span className="project-arrow" aria-hidden="true">
              <ArrowUpRight />
            </span>
          </div>
          <div className="project-title">
            <h3>{project.title}</h3>
            <span>{project.tag}</span>
          </div>
          {descriptions && (
            <>
              <p className="project-summary">{project.description}</p>
              <span className="project-detail-link">
                Découvrir le contexte{" "}
                <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </>
          )}
        </Link>
      ))}
    </div>
  );
}
