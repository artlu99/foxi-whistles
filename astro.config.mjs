import partytown from "@astrojs/partytown";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercelServerless from "@astrojs/vercel/serverless";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import auth from "auth-astro";

// https://astro.build/config
export default defineConfig({
  site: "https://foxi-whistles.vercel.app/",
  output: "hybrid",
  adapter: vercelServerless(),
  integrations: [
    auth(),
    tailwind(),
    icon(),
    sitemap(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    preact(),
  ],
  security: { checkOrigin: true },
});
