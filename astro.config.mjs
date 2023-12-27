import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: 'https://jaylin.wang',
  integrations: [mdx(), sitemap(), tailwind()],
  output: 'server',
  adapter: vercel({
    edgeMiddleware: true,
    webAnalytics: {
      enabled: true
    },
    speedInsights: {
      enabled: true
    }
  })
});