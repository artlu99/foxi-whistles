const allowedOrigins = ['https://foxi-whistles.vercel.app', 'http://localhost:4321'] // Replace with your allowed origins

export const sendCorsHeaders = (request: Request) => {
	const origin = request.headers.get('Origin') ?? ''

	if (allowedOrigins.includes(origin)) {
		const corsHeaders = {
			'Access-Control-Allow-Origin': origin,
			'Access-Control-Allow-Methods': 'GET',
			'Access-Control-Allow-Headers': 'Content-Type'
		}

		// Handle preflight requests
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: corsHeaders
			})
		}
	} else {
		return new Response(null, {
			status: 403,
			headers: {
				'Content-Type': 'text/plain',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET',
				'Access-Control-Allow-Headers': 'Content-Type'
			}
		})
	}
}
