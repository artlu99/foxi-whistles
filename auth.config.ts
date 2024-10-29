import CredentialsProvider from "@auth/core/providers/credentials";
import { createAppClient, viemConnector } from "@farcaster/auth-client";
import { defineConfig } from "auth-astro";

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
          domain: "Whistles.Protocol",
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
