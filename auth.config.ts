import CredentialsProvider from "@auth/core/providers/credentials";
import { defineConfig } from "auth-astro";

export default defineConfig({
  providers: [
    CredentialsProvider({
      name: "Farcaster",
      credentials: {
        message: {
          label: "csrfToken",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "callbackUrl",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials, request) {
        // @ts-ignore - hack to get around credentials object not typed correctly
        const passedNonce = credentials.csrfToken as string;

        const searchParams = new URL(request.url).searchParams;
        const message = searchParams.get("message");

        const nonceMatch = message?.match(/Nonce: ([a-f0-9]+)/i);
        const nonce = nonceMatch ? nonceMatch[1] : null;

        if (passedNonce !== nonce) {
          console.error("nonce mismatch: ", passedNonce, nonce);
          return null;
        }

        const fidMatch = message?.match(/farcaster:\/\/fid\/(\d+)/);
        const fid = fidMatch ? fidMatch[1] : null;

        if (!fid) return null;

        return {
          email: fid,
          name: searchParams.get("name"),
          image: searchParams.get("pfp"),
        };
      },
    }),
  ],
});
