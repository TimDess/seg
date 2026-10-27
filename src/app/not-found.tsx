import { Button } from "@/components/ui";
export default function NotFound() {
  return (
    <section className="notfound">
      <h1>
        404<span style={{ color: "var(--blue)" }}>.</span>
      </h1>
      <p>Cette page n’existe pas ou a été déplacée.</p>
      <Button href="/">Revenir à l’accueil</Button>
    </section>
  );
}
