export const prerender = false

export const config = {
	runtime: 'edge'
}

// - Utils
import { keccak256 } from '@ethersproject/keccak256'
import { toUtf8Bytes } from '@ethersproject/strings'
// - Session
import { getSession } from 'auth-astro/server'
// - Utils
import { fetcher } from 'itty-fetcher'
import { sort } from 'radash'
// - Types
import { MyMessagesSchema } from '../../rpc/types'
// - Utils
import { sendCorsHeaders } from './common'

export async function GET(request: { request: Request }) {
	sendCorsHeaders(request.request)

	const url = new URL(request.request.url)
	const requestedFid = Number.parseInt(url.searchParams.get('fid') || '0')
	const format = url.searchParams.get('format') || 'json'

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
	if (requestedFid !== authenticatedFid) {
		return new Response(
			JSON.stringify({ message: "Unauthorized - Cannot access other users' data" }),
			{
				status: 403,
				headers: { 'Content-Type': 'application/json' }
			}
		)
	}

	if (!requestedFid || !format) {
		return new Response(JSON.stringify({ message: 'Missing required parameters' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		})
	}

	try {
		// Fetch messages using existing endpoint
		const response = await fetcher().get('/api/getMyMessages', { fid: requestedFid })
		const validator = MyMessagesSchema.safeParse(
			typeof response === 'string' ? JSON.parse(response) : response
		)

		if (!validator.success) {
			throw new Error('Invalid data format')
		}

		const messages = sort(
			validator.data.getDecryptedMessagesByFid.messages.map((msg) => {
				const maybeUnixTimestamp = (Number(msg.timestamp) + Number(1609459200)) * 1000
				const fallbackTimestamp =
					maybeUnixTimestamp > Date.now() ? Number(msg.timestamp) : maybeUnixTimestamp

				return {
					plaintext: msg.text,
					timestamp: fallbackTimestamp,
					ciphertext: keccak256(toUtf8Bytes(msg.text)).slice(2),
					deleted: !!msg.deletedAt
				}
			}),
			(c) => c.timestamp,
			true
		)

		// Handle different format types
		switch (format) {
			case 'json': {
				return new Response(JSON.stringify(messages), {
					status: 200,
					headers: { 'Content-Type': 'application/json' }
				})
			}

			case 'csv':
			case 'csv-xlsx': {
				const isExcelFormat = format === 'csv-xlsx'
				const csvContent = `plaintext,timestamp,ciphertext,deleted\n${messages
					.map((e) => {
						const timestamp = isExcelFormat
							? new Date(e.timestamp).getTime() / 1000 / 86400 + 25569
							: e.timestamp
						return `"${e.plaintext.replace(/"/g, '""')}",${timestamp},${e.ciphertext},${e.deleted}`
					})
					.join('\n')}`

				return new Response(csvContent, {
					status: 200,
					headers: { 'Content-Type': 'text/csv' }
				})
			}

			default:
				return new Response(JSON.stringify({ message: 'Invalid format specified' }), {
					status: 400,
					headers: { 'Content-Type': 'application/json' }
				})
		}
	} catch (error) {
		console.error('Download error:', error)
		return new Response(JSON.stringify({ message: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		})
	}
}
