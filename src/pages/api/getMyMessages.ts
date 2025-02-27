export const prerender = false

export const config = {
	runtime: 'edge'
}

// - Session
import { getSession } from 'auth-astro/server'
// - Utils
import { sendCorsHeaders } from './common'
import { getMyMessages } from './gql'

export async function GET(request: { request: Request }) {
	sendCorsHeaders(request.request)

	const url = new URL(request.request.url)
	const fid = Number.parseInt(url.searchParams.get('fid') || '0')

	// Get the authenticated user's FID from the session
	const session = await getSession(request.request)
	const authenticatedFid = session?.user?.email ? Number.parseInt(session?.user?.email) : null

	if (!authenticatedFid) {
		return new Response(JSON.stringify({ message: 'Unauthorized - Please log in' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		})
	}

	// Verify the requested FID matches the authenticated user's FID
	if (fid !== authenticatedFid) {
		return new Response(
			JSON.stringify({ message: "Unauthorized - Cannot access other users' data" }),
			{
				status: 403,
				headers: { 'Content-Type': 'application/json' }
			}
		)
	}

	if (Number.isNaN(fid)) {
		return new Response(JSON.stringify({ message: 'Invalid fid parameter' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		})
	}

	try {
		const myMessages = await getMyMessages(fid)
		return new Response(JSON.stringify(myMessages), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		})
	} catch (error: any) {
		console.error('Error response:', error.response || error)
		return new Response(JSON.stringify({ message: `Failed to get casts for fid: ${fid}` }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		})
	}
}
