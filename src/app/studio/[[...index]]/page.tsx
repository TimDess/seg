export const runtime = 'edge';

import type { Metadata } from "next";
import { metadata as studioMetadata } from "next-sanity/studio";
import SanityStudio from "@/components/sanity-studio";

export { viewport } from "next-sanity/studio";

export const metadata: Metadata = {
  ...studioMetadata,
  title: "Administration SEG",
  robots: { index: false, follow: false },
  alternates: { canonical: "/studio" },
};

export default function StudioPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return (
      <section className="studio-configuration">
        <h1>Configuration Sanity requise</h1>
        <p>Renseignez NEXT_PUBLIC_SANITY_PROJECT_ID et NEXT_PUBLIC_SANITY_DATASET sur l’hébergement, puis redéployez le site pour accéder au Studio.</p>
      </section>
    );
  }

  return <SanityStudio />;
}
