import { z, defineCollection } from "astro:content";
import { glob } from 'astro/loaders';

const imageObj = z.object({
  url: z.string(),
  alt: z.string(),
});

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: imageObj,
    workImages: z.array(imageObj),
    platform: z.string(),
    stack: z.string(),
    website: z.string(),
    github: z.string(),
  })
});

const postsCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    date: z.string(),
    image: z.object({
      url: z.string(),
      alt: z.string()
    })
  })
});

export const collections = {
  projects: projectsCollection,
  posts: postsCollection
};

