'use client'

import { SignInButton, type StatusAPIResponse } from '@farcaster/auth-kit'
import sdk, { type Context, type SignIn } from '@farcaster/frame-sdk'
import { signIn, signOut } from 'auth-astro/client'
import { useCallback, useEffect, useState } from 'react'
import './authKitStyles.css'

async function getCsrfToken() {
	const csrfToken = await fetch('/api/auth/csrf')
		.then((response) => {
			if (!response.ok) throw new Error('Failed to fetch CSRF token')
			return response.json()
		})
		.then((data) => data.csrfToken as string)
	if (!csrfToken) throw new Error('No CSRF token found')
	return csrfToken
}

function CustomSignInButton() {
	const [error, setError] = useState(false)
	const [isSDKLoaded, setIsSDKLoaded] = useState(false)
	const [context, setContext] = useState<Context.FrameContext>()

	useEffect(() => {
		const load = async () => {
			setContext(await sdk.context)

			sdk.on('primaryButtonClicked', () => sdk.actions.close())
			await sdk.actions.setPrimaryButton({ text: 'Close Frame' })

			sdk.actions.ready({})
		}

		if (sdk && !isSDKLoaded) {
			setIsSDKLoaded(true)
			load()
		}
	}, [isSDKLoaded])

	useEffect(() => {
		const seamlessSignIn = async () => {
			const nonce = await getNonce()
			const result = await sdk.actions.signIn({ nonce })
			handleSuccess2(result, context?.user?.username, context?.user?.pfpUrl)
		}

		if (context) {
			seamlessSignIn()
		}
	}, [context])

	const getNonce = useCallback(async () => {
		const nonce = await getCsrfToken()
		if (!nonce) throw new Error('Unable to generate nonce')
		return nonce
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

	const handleSuccess2 = useCallback(
		(res: SignIn.SignInResult, username?: string, pfpUrl?: string) => {
			signIn('credentials', undefined, {
				message: res.message,
				signature: res.signature,
				name: username,
				pfp: pfpUrl,
				redirect: false
			})
		},
		[]
	)
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
