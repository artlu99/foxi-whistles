'use client'

import { SignInButton, type StatusAPIResponse } from '@farcaster/auth-kit'
import { signIn, signOut } from 'auth-astro/client'
import { useCallback, useState } from 'react'
import './authKitStyles.css'

async function getCsrfToken() {
	const csrfToken = await fetch('/api/auth/csrf')
		.then((response) => {
			if (!response.ok) throw new Error('Failed to fetch CSRF token')
			return response.json()
		})
		.then((data) => data.csrfToken)
	if (!csrfToken) throw new Error('No CSRF token found')
	return csrfToken
}

function CustomSignInButton() {
	const [error, setError] = useState(false)

	const getNonce = useCallback(async () => {
		const nonce = await getCsrfToken()
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
		<>
			<SignInButton
				nonce={getNonce}
				onSuccess={handleSuccess}
				onError={() => setError(true)}
				onSignOut={() => signOut()}
			/>
			{error && <div>Unable to sign in at this time.</div>}
		</>
	)
}

export default CustomSignInButton
