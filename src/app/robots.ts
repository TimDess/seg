import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(process.env.SITE_INDEXABLE === "true"
        ? { allow: "/", disallow: "/api/" }
        : { disallow: "/" }),
    },
    sitemap: "https://s-e-g.fr/sitemap.xml",
  };
}
