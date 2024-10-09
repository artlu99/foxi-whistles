import partytown from "@astrojs/partytown";
import tailwind from "@astrojs/tailwind";
import vercelStatic from "@astrojs/vercel/static";
import icon from "astro-icon";
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://foxi-whistles.vercel.app/",
  output: "static",
  adapter: vercelStatic(),
  integrations: [
    tailwind(),
    icon(),
    sitemap(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
});
