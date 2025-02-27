const allowedOrigins = [
	'https://sassyhash.artlu.xyz',
	'https://foxi-whistles.vercel.app',
	'http://localhost:4321'
]
const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
const allowedHeaders = ['Content-Type', 'Authorization']

export const sendResponse = <T>(
	data: T,
	status: number,
	contentType = 'application/json',
	additionalHeaders: Record<string, string> = {}
) => {
	return new Response(typeof data === 'string' ? data : JSON.stringify(data), {
		status,
		headers: { 'Content-Type': contentType, ...additionalHeaders }
	})
}

// Common error responses
export const errorResponses = {
	unauthorized: (corsHeaders = {}) =>
		sendResponse({ message: 'Unauthorized - Please log in' }, 401, 'application/json', corsHeaders),
	forbidden: (corsHeaders = {}) =>
		sendResponse(
			{ message: "Unauthorized - Cannot access other users' data" },
			403,
			'application/json',
			corsHeaders
		),
	badRequest: (message: string, corsHeaders = {}) =>
		sendResponse({ message }, 400, 'application/json', corsHeaders),
	serverError: (message: string, corsHeaders = {}) =>
		sendResponse({ message }, 500, 'application/json', corsHeaders)
}

// Validate FID from request
export const validateFid = (fid: number | null) => {
	if (!fid || Number.isNaN(fid)) {
		return false
	}
	return true
}

// Validate authenticated user matches requested FID
export const validateAuthenticatedUser = (
	authenticatedFid: number | null,
	requestedFid: number
) => {
	if (!authenticatedFid) {
		return false
	}
	return authenticatedFid === requestedFid
}

export const validateCorsAndGenerateHeaders = (request: Request) => {
	const origin = request.headers.get('Origin') ?? ''
	const requestMethod = request.method.toUpperCase()

	// If origin is not in allowed list, return 403
	if (!allowedOrigins.includes(origin)) {
		return sendResponse({ message: 'Origin not allowed' }, 403)
	}

	// If method is not allowed, return 405
	if (!allowedMethods.includes(requestMethod)) {
		return sendResponse({ message: 'Method not allowed' }, 405, 'application/json', {
			Allow: allowedMethods.join(', ')
		})
	}

	const corsHeaders = {
		'Access-Control-Allow-Origin': origin,
		'Access-Control-Allow-Methods': allowedMethods.join(', '),
		'Access-Control-Allow-Headers': allowedHeaders.join(', '),
		'Access-Control-Max-Age': '86400' // 24 hours cache for preflight requests
	}

	// Handle preflight requests
	if (requestMethod === 'OPTIONS') {
		return new Response(null, {
			status: 204,
			headers: corsHeaders
		})
	}

	// Return the CORS headers to be merged with the actual response
	return corsHeaders
}
