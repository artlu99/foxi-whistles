export const prerender = false

export const config = {
	runtime: 'edge'
}

import { errorResponses, sendResponse, validateCorsAndGenerateHeaders } from './common'
import { getEnabledChannels } from './gql'

export async function GET(request: { request: Request }) {
	const corsHeaders = validateCorsAndGenerateHeaders(request.request)
	// If corsHeaders is a Response, it means there was a CORS error
	if (corsHeaders instanceof Response) {
		return corsHeaders
	}

	try {
		const enabledChannels = await getEnabledChannels()
		return sendResponse(enabledChannels, 200, 'application/json', corsHeaders)
	} catch (error) {
		console.error('Error response:', error)
		return errorResponses.serverError('Failed to get channels list', corsHeaders)
	}
}
