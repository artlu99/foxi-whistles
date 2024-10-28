'use client'

import { AuthKitProvider, SignInButton, type StatusAPIResponse } from '@farcaster/auth-kit'
import '@farcaster/auth-kit/styles.css'
import { signIn, signOut } from 'auth-astro/client'
import { useCallback, useState } from 'react'

const config = {
	relay: 'https://relay.farcaster.xyz',
	rpcUrl: 'https://mainnet.optimism.io',
	siweUri: 'http://example.com/login',
	domain: 'example.com'
}

export default function Siwf() {
	const [error, setError] = useState(false)

	const getNonce = useCallback(async () => {
		const nonce = 'abcd1234' // await getCsrfToken();
		if (!nonce) throw new Error('Unable to generate nonce')
		return nonce
	}, [])

	const handleSuccess = useCallback((res: StatusAPIResponse) => {
		signIn('credentials', {
			message: res.message,
			signature: res.signature,
			name: res.username,
			pfp: res.pfpUrl,
			redirect: false
		})
	}, [])

	return (
		<AuthKitProvider config={config}>
			<>
				<SignInButton
					nonce={getNonce}
					onSuccess={handleSuccess}
					onError={() => setError(true)}
					onSignOut={() => signOut()}
				/>
				{error && <div>Unable to sign in at this time.</div>}
			</>
		</AuthKitProvider>
	)
}
