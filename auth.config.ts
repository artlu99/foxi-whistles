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
      async authorize(credentials) {
        const csrfToken = "noncey";

        const appClient = createAppClient({
          ethereum: viemConnector(),
        });

        const verifyResponse = await appClient.verifySignInMessage({
          message: credentials?.message as string,
          signature: credentials?.signature as `0x${string}`,
          domain: "example.com",
          nonce: csrfToken,
        });
        // const { success, fid } = verifyResponse;

        // if (!success) {
        //   return null;
        // }
        const fid = 3;

        return {
          id: fid.toString(),
          // name: credentials?.name ,
          name: "dwr.eth",
          // image: credentials?.pfp,
          image:
            "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bc698287-5adc-4cc5-a503-de16963ed900/original",
        };
      },
    }),
  ],
});
