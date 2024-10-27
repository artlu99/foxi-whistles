'use client'

import "@farcaster/auth-kit/styles.css";

import { useCallback, useState } from 'preact/hooks'
import {
	SignInButton,
	type StatusAPIResponse,
  } from "@farcaster/auth-kit";
import { signIn, signOut } from 'auth-astro/client'
    
const SignIn = () => {
	// const [error, setError] = useState(false);

	const getNonce = useCallback(async () => {
	  const nonce = 'abcd1234'; // await getCsrfToken();
	  if (!nonce) throw new Error("Unable to generate nonce");
	  return nonce;
	}, []);
  
	const handleSuccess = useCallback(
	  (res: StatusAPIResponse) => {
		signIn("credentials", {
		  message: res.message,
		  signature: res.signature,
		  name: res.username,
		  pfp: res.pfpUrl,
		  redirect: false,
		});
	  },
	  []
	);
    
	return <>
		<SignInButton
			nonce={getNonce}
			onSuccess={handleSuccess}
			// onError={() => setError(true)}
			onSignOut={() => signOut()}
		/>
        {/* {error && <div>Unable to sign in at this time.</div>} */}
	</>
}

export default SignIn