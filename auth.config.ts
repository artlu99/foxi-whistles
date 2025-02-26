import CredentialsProvider from "@auth/core/providers/credentials";
import { createAppClient, viemConnector } from "@farcaster/auth-client";
import { defineConfig } from "auth-astro";

const SAFISH_SHORT_CIRCUIT = true;

export default defineConfig({
  providers: [
    CredentialsProvider({
      name: "Farcaster",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
        // In a production app with a server, these should be fetched from
        // your Farcaster data indexer rather than have them accepted as part
        // of credentials.
        name: {
          label: "Name",
          type: "text",
          placeholder: "0x0",
        },
        pfp: {
          label: "Pfp",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials, request) {
        if (SAFISH_SHORT_CIRCUIT) {
          // @ts-ignore - hack to get around credentials object not typed correctly
          const passedNonce = credentials.csrfToken as string;

          const searchParams = new URL(request.url).searchParams;
          const message = searchParams.get("message");

          const nonceMatch = message?.match(/Nonce: ([a-f0-9]+)/i);
          const nonce = nonceMatch ? nonceMatch[1] : null;

          if (passedNonce !== nonce) {
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
        }

        // ths is the old code that no longer works. It looks like the domain Whistles.Protocol is not valid anymore.
        const body = await request.body?.getReader().read();
        const text = new TextDecoder().decode(body?.value);
        const parsedBody = JSON.parse(text);
        const csrfToken = parsedBody.csrfToken;

        const appClient = createAppClient({
          ethereum: viemConnector(),
        });

        const verifyResponse = await appClient.verifySignInMessage({
          message: credentials?.message as string,
          signature: credentials?.signature as `0x${string}`,
          domain: "sassyhash.artlu.xyz",
          nonce: csrfToken,
        });

        const { success, fid } = verifyResponse;

        if (!success) {
          return null;
        }

        return {
          email: fid.toString(),
          name: credentials?.name as string,
          image: credentials?.pfp as string,
        };
      },
    }),
  ],
});
