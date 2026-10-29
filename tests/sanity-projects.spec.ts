import { test, expect } from "@playwright/test";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement, type ReactNode } from "react";
import { ImageConfigContext } from "next/dist/shared/lib/image-config-context.shared-runtime";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import config from "../next.config";

const render = (node: ReactNode) => renderToStaticMarkup(createElement(
  ImageConfigContext.Provider,
  { value: { ...imageConfigDefault, ...config.images } },
  node,
));

test("Sanity portfolio renders live projects, galleries and missing-project 404s", async () => {
  // Exercise the server components with CMS fixtures; no live credentials required.
  const previousId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "segtest";
  const { client } = require("../src/sanity/client") as typeof import("../src/sanity/client");
  const { default: List } = require("../src/app/realisations/page") as typeof import("../src/app/realisations/page");
  const { default: Detail, generateMetadata } = require("../src/app/realisations/[slug]/page") as typeof import("../src/app/realisations/[slug]/page");
  const originalFetch = client!.fetch;
  const project = {
    _id: "project-1", title: "Éclairage des bureaux", slug: { current: "bureaux" },
    description: "Un éclairage adapté.\nUne installation rénovée.",
    mainImage: { asset: { url: "https://cdn.sanity.io/images/segtest/production/main-1200x800.jpg" } },
    gallery: [
      { _key: "photo", asset: { url: "https://cdn.sanity.io/images/segtest/production/gallery-1200x800.jpg" } },
      { _key: "deleted", asset: null },
    ],
  };
  const calls: { query: string; params: Record<string, string>; options: { cache: string } }[] = [];
  let empty = false;
  client!.fetch = (async (query: string, params: Record<string, string>, options: { cache: string }) => {
    calls.push({ query, params, options });
    return query.includes("$slug")
      ? params.slug === "bureaux" ? project : null
      : empty ? [] : [project];
  }) as unknown as typeof originalFetch;
  try {
    const list = render(await List());
    expect(list).toContain('href="/realisations/bureaux"');
    expect(list).toContain("Éclairage des bureaux");
    expect(calls[0].query).toContain('_type == "project"');
    expect(calls[0].options.cache).toBe("no-store");
    const props = { params: Promise.resolve({ slug: "bureaux" }) };
    const detail = render(await Detail(props));
    expect(detail).toContain("Une installation rénovée.");
    expect(detail).toContain("Le projet en images");
    expect(detail).toContain("gallery-1200x800.jpg");
    expect(detail).not.toContain("photo 2");
    expect((await generateMetadata(props)).title).toBe(project.title);
    expect(calls.some((call) => call.params.slug === "bureaux")).toBe(true);
    expect(calls.every((call) => call.options.cache === "no-store")).toBe(true);
    project.title = "Un nouveau titre publié";
    expect(render(await List())).toContain(project.title);
    empty = true;
    expect(render(await List())).toContain("Les projets seront présentés prochainement");
    await expect(Detail({ params: Promise.resolve({ slug: "inexistant" }) })).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
  } finally {
    client!.fetch = originalFetch;
    if (previousId === undefined) delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    else process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = previousId;
  }
});
