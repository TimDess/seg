import { cache } from "react";
import { client } from "./client";

export type ProjectImage = {
  _key?: string;
  asset: { url: string } | null;
};

export type Project = {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: ProjectImage | null;
  description?: string | null;
  gallery?: ProjectImage[] | null;
};

export const getProject = cache(async (slug: string) => {
  if (!client) return null;
  return client.fetch<Project | null>(
    `*[_type == "project" && slug.current == $slug][0]{
      _id, title, slug, description,
      mainImage{asset->{url}},
      gallery[]{_key, asset->{url}}
    }`,
    { slug },
    { cache: "no-store" },
  );
});
