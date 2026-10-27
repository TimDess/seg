import type { MetadataRoute } from "next";
import { services, pages } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "contact",
    ...services.map((s) => s.slug),
    ...Object.keys(pages),
  ].map((slug) => ({
    url: "https://s-e-g.fr/" + slug,
    changeFrequency: slug ? "monthly" : "weekly",
    priority: slug ? 0.7 : 1,
  }));
}
