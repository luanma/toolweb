import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const collections = {
  landing: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/landing' }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      from: z.enum(['wgs84', 'gcj02', 'bd09', 'cgcs2000']),
      to: z.enum(['wgs84', 'gcj02', 'bd09', 'cgcs2000']),
      h1: z.string(),
      intro: z.array(z.string()).optional(),
      faq: z
        .array(z.object({ q: z.string(), a: z.string() }))
        .optional(),
    }),
  }),
  guide: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/guide' }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      h1: z.string(),
      order: z.number().optional(),
    }),
  }),
};