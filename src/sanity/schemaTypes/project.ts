import { defineField, defineType } from 'sanity';

export const project = defineType({
  name: 'project',
  title: 'Projets',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre du projet',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL (Slug)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'mainImage',
      title: 'Image principale',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie de photos',
      type: 'array',
      of: [{ type: 'image' }],
    }),
  ],
});
