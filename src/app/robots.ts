import type { MetadataRoute } from "next";
import { isSiteIndexable } from "@/lib/indexing";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(isSiteIndexable()
        ? { allow: "/", disallow: "/api/" }
        : { disallow: "/" }),
    },
    sitemap: "https://s-e-g.fr/sitemap.xml",
  };
}
