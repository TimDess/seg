"use client";

import { Button } from "@/components/ui";

export default function RealisationsError({ reset }: { reset: () => void }) {
  return (
    <section className="page-hero">
      <h1>Les projets sont momentanément indisponibles.</h1>
      <p>Veuillez réessayer dans quelques instants ou nous contacter pour échanger sur votre projet.</p>
      <button className="button" onClick={reset}>Réessayer</button>
      <Button href="/contact">Demander un devis</Button>
    </section>
  );
}
