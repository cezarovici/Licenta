// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

import node from "@astrojs/node";
import flowbiteReact from "flowbite-react/plugin/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), flowbiteReact()],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["flowbite-react"],
    },
  },

  adapter: node({
    mode: "standalone",
  }),
});