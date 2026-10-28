import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
export function Button({
  href,
  children,
  light = false,
}: {
  href: string;
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <Link className={`button ${light ? "light" : ""}`} href={href}>
      {children}
      <ArrowUpRight size={18} />
    </Link>
  );
}
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-label">
      <span />
      {children}
    </div>
  );
}
export function ContactBand() {
  return (
    <section className="contact-band">
      <div>
        <SectionLabel>CONSTRUISONS LA SUITE</SectionLabel>
        <h2>
          Parlons de votre
          <br />
          prochain projet<span>.</span>
        </h2>
        <p>
          Une rénovation, une installation neuve, un besoin à préciser ?<br />
          Le premier pas, c’est un échange.
        </p>
      </div>
      <Button href="/contact" light>
        Demander un devis
      </Button>
      <span className="band-number" aria-hidden="true">
        <ArrowUpRight />
      </span>
    </section>
  );
}
export function TextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link className="text-link" href={href}>
      {children}
      <ArrowRight size={17} />
    </Link>
  );
}
