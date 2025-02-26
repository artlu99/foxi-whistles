"use client";

import { AuthKitProvider } from "@farcaster/auth-kit";
import CustomSignInButton from "./CustomSignInButton";

const config = {
	relay: "https://relay.farcaster.xyz",
	rpcUrl: "https://mainnet.optimism.io",
	siweUri: "https://sassyhash.artlu.xyz/download",
	domain: "sassyhash.artlu.xyz",
};

function Siwf() {
	return (
		<AuthKitProvider config={config}>
			<CustomSignInButton />
		</AuthKitProvider>
	);
}

export default Siwf;
