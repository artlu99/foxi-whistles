export const config = {
	runtime: 'edge'
}

import { getEnabledChannels } from './gql'

export async function GET(request: Request) {
	// TODO: tighten security so there's no CORS or CRSF

	try {
		const enabledChannels = await getEnabledChannels()
		return new Response(JSON.stringify(enabledChannels), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		})
	} catch (error: any) {
		console.error('Error response:', error.response || error)
		return new Response(JSON.stringify({ message: 'Failed to get channels list' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		})
	}
}
