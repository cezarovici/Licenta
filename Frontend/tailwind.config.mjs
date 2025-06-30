/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],

  darkMode: "media",

  theme: {
    extend: {},
  },

  plugins: [require("flowbite/plugin")],
};
