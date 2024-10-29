export const prerender = false

export const config = {
	runtime: 'edge'
}

import { sendCorsHeaders } from './common'
import { getMyMessages } from './gql'

export async function GET(request: { request: Request }) {
	sendCorsHeaders(request.request)

	const url = new URL(request.request.url)
	const fid = parseInt(url.searchParams.get('fid') || '0')
	if (isNaN(fid)) {
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
		return new Response(JSON.stringify({ message: 'Failed to get casts for fid: ' + fid }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		})
	}
}
