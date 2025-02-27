export const prerender = false

export const config = {
	runtime: 'edge'
}

import { sendCorsHeaders } from './common'
import { getMostSeenCasts } from './redis'

export async function GET(request: { request: Request }) {
	sendCorsHeaders(request.request)

	const { searchParams } = new URL(request.request.url)
	const viewerFid = searchParams.get('viewerFid')

	try {
		const mostSeenCasts = await getMostSeenCasts({ fid: viewerFid ? Number(viewerFid) : null })
		return new Response(JSON.stringify(mostSeenCasts), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		})
	} catch (error: any) {
		console.error('Error response:', error.response || error)
		return new Response(JSON.stringify({ message: 'Failed to get leaderboard' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		})
	}
}
