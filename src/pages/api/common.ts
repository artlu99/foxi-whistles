const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
const allowedHeaders = ['Content-Type', 'Authorization']

// Helper to check if an origin is allowed
const isOriginAllowed = (origin: string | null) => {
	// If no origin header, it's likely a same-origin request
	if (!origin) return true

	// For localhost development
	if (origin.startsWith('http://localhost:')) return true

	// For production: either use whitelist OR verify HTTPS
	return origin.startsWith('https://')
}

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
	const origin = request.headers.get('Origin')
	const requestMethod = request.method.toUpperCase()

	// If method is not allowed, return 405
	if (!allowedMethods.includes(requestMethod)) {
		return sendResponse({ message: 'Method not allowed' }, 405, 'application/json', {
			Allow: allowedMethods.join(', ')
		})
	}

	// Generate CORS headers based on origin
	const corsHeaders: Record<string, string> = {
		'Access-Control-Allow-Methods': allowedMethods.join(', '),
		'Access-Control-Allow-Headers': allowedHeaders.join(', '),
		'Access-Control-Max-Age': '86400' // 24 hours cache for preflight requests
	}

	// Set origin header based on validation
	if (isOriginAllowed(origin)) {
		// If origin is allowed, echo it back
		if (origin) {
			corsHeaders['Access-Control-Allow-Origin'] = origin
		} else {
			// No origin header (same-origin request) or local development
			corsHeaders['Access-Control-Allow-Origin'] = '*'
		}
	} else {
		// Origin not allowed
		return sendResponse({ message: 'Origin not allowed' }, 403)
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
