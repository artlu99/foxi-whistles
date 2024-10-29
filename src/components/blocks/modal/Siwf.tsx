'use client'

import { AuthKitProvider } from '@farcaster/auth-kit'
import CustomSignInButton from './CustomSignInButton'

const config = {
	relay: 'https://relay.farcaster.xyz',
	rpcUrl: 'https://mainnet.optimism.io',
	siweUri: 'http://Whistles-Protocol.com/login',
	domain: 'Whistles-Protocol.com'
}

function Siwf() {
	return (
		<AuthKitProvider config={config}>
			<CustomSignInButton />
		</AuthKitProvider>
	)
}

export default Siwf
