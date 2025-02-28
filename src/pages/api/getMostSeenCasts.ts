export const prerender = false

export const config = {
	runtime: 'edge'
}

import { errorResponses, sendResponse, validateCorsAndGenerateHeaders } from './common'
import { getMostSeenCasts } from './redis'

export async function GET(request: { request: Request }) {
	const corsHeaders = validateCorsAndGenerateHeaders(request.request)
	// If corsHeaders is a Response, it means there was a CORS error
	if (corsHeaders instanceof Response) {
		return corsHeaders
	}

	const { searchParams } = new URL(request.request.url)
	const viewerFid = searchParams.get('viewerFid')

	try {
		const mostSeenCasts = await getMostSeenCasts({
			viewerFid: viewerFid ? Number(viewerFid) : null
		})
		return sendResponse(mostSeenCasts, 200, 'application/json', corsHeaders)
	} catch (error) {
		console.error('Error response:', error)
		return errorResponses.serverError('Failed to get leaderboard', corsHeaders)
	}
}
