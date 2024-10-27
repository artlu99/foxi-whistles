'use client'

import { AuthKitProvider } from "@farcaster/auth-kit";
import SignIn from "./SignIn";

const config = {
	relay: "https://relay.farcaster.xyz",
	rpcUrl: "https://mainnet.optimism.io",
	siweUri: "http://example.com/login",
	domain: "example.com",
};
  
const Siwf = () => <AuthKitProvider config={config}>
		<SignIn />
	</AuthKitProvider>

export default Siwf