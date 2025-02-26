'use client'

import { SignInButton, type StatusAPIResponse } from '@farcaster/auth-kit'
import sdk, { type Context } from '@farcaster/frame-sdk'
import { signIn, signOut } from 'auth-astro/client'
import { useCallback, useEffect, useState } from 'react'
import './authKitStyles.css'

function CustomSignInButton() {
	const [error, setError] = useState(false)
	const [isSDKLoaded, setIsSDKLoaded] = useState(false)
	const [context, setContext] = useState<Context.FrameContext>()

	useEffect(() => {
		const load = async () => {
			setContext(await sdk.context)
			sdk.actions.ready({})
		}

		if (sdk && !isSDKLoaded) {
			setIsSDKLoaded(true)
			load()
		}
	}, [isSDKLoaded])

	const getNonce = useCallback(async () => {
		const csrfToken = await fetch('/api/auth/csrf')
			.then((response) => {
				if (!response.ok) throw new Error('Failed to fetch CSRF token')
				return response.json()
			})
			.then((data) => data.csrfToken as string)
		if (!csrfToken) throw new Error('No CSRF token found')
		return csrfToken
	}, [])

	const handleSuccess = useCallback((res: StatusAPIResponse) => {
		signIn('credentials', undefined, {
			message: res.message,
			signature: res.signature,
			name: res.username,
			pfp: res.pfpUrl,
			redirect: false
		})
	}, [])

	return (
		<>
			{context ? (
				<div>Frames V2 Sign In turned off until IAB security is improved.</div>
			) : (
				<SignInButton
					nonce={getNonce}
					onSuccess={handleSuccess}
					onError={() => setError(true)}
					onSignOut={() => signOut()}
				/>
			)}
			{error && <div>Unable to sign in at this time.</div>}
		</>
	)
}

export default CustomSignInButton
