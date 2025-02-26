import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercelServerless from "@astrojs/vercel";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import auth from "auth-astro";

// https://astro.build/config
export default defineConfig({
	site: "https://sassyhash.artlu.xyz/",
	adapter: vercelServerless(),
	integrations: [auth(), tailwind(), icon(), sitemap(), react()],
	security: { checkOrigin: false },
});
