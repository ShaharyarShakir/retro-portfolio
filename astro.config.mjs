// @ts-check
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectDetailRoute = path.join(__dirname, 'src/pages/projects/[id].astro');
const projectsDataFile = path.join(__dirname, 'src/components/projects/projectsData.ts');

/** Re-run getStaticPaths when project data changes (Astro does not do this by default). */
function watchProjectsData() {
  return {
    name: 'watch-projects-data',
    handleHotUpdate({ file }) {
      if (file === projectsDataFile || file.endsWith('projectsData.ts')) {
        return [file, projectDetailRoute];
      }
    },
  };
}

// https://astro.build/config
export default defineConfig({
  integrations: [react(), mdx()],

  vite: {
    plugins: [tailwindcss(), watchProjectsData()],
  },
});