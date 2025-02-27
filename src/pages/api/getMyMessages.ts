export const prerender = false

export const config = {
	runtime: 'edge'
}

// - Session
import { getSession } from 'auth-astro/server'
// - Utils
import {
	errorResponses,
	sendResponse,
	validateAuthenticatedUser,
	validateCorsAndGenerateHeaders,
	validateFid
} from './common'
import { getMyMessages } from './gql'

export async function GET(request: { request: Request }) {
	const corsHeaders = validateCorsAndGenerateHeaders(request.request)
	// If corsHeaders is a Response, it means there was a CORS error
	if (corsHeaders instanceof Response) {
		return corsHeaders
	}

	const url = new URL(request.request.url)
	const fid = Number.parseInt(url.searchParams.get('fid') || '0')

	// Get the authenticated user's FID from the session
	const session = await getSession(request.request)
	const authenticatedFid = session?.user?.email ? Number.parseInt(session?.user?.email) : null

	if (!authenticatedFid) {
		return errorResponses.unauthorized(corsHeaders)
	}

	// Verify the requested FID matches the authenticated user's FID
	if (!validateAuthenticatedUser(authenticatedFid, fid)) {
		return errorResponses.forbidden(corsHeaders)
	}

	if (!validateFid(fid)) {
		return errorResponses.badRequest('Invalid fid parameter', corsHeaders)
	}

	try {
		const myMessages = await getMyMessages(fid)
		return sendResponse(myMessages, 200, 'application/json', corsHeaders)
	} catch (error) {
		console.error('Error response:', error)
		return errorResponses.serverError(`Failed to get casts for fid: ${fid}`, corsHeaders)
	}
}
