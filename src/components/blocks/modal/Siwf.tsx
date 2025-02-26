'use client'

import { AuthKitProvider } from '@farcaster/auth-kit'
import CustomSignInButton from './CustomSignInButton'

const config = {
	relay: 'https://relay.farcaster.xyz',
	rpcUrl: 'https://mainnet.optimism.io',
	siweUri: 'https://whistles.protocol/login',
	domain: 'Whistles.Protocol'
}

function Siwf() {
	return (
		<AuthKitProvider config={config}>
			<CustomSignInButton />
		</AuthKitProvider>
	)
}

export default Siwf
