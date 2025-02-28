import { Redis } from '@upstash/redis'
import { sort, sift, unique } from 'radash'
import type { LeaderboardCastInfo } from '../../rpc/types'
import { getTextByCastHash } from './gql'

const redis = new Redis({
	url: import.meta.env.UPSTASH_REDIS_REST_URL,
	token: import.meta.env.UPSTASH_REDIS_REST_READ_ONLY_TOKEN
})

export async function getMostSeenCasts({
	viewerFid,
	limit = 10
}: {
	viewerFid: number | null
	limit?: number
}): Promise<LeaderboardCastInfo[]> {
	const usage = await redis.hgetall('action-usage')

	if (!usage) {
		return []
	}

	const allCasts = Object.entries(usage)
		.sort(([, a], [, b]) => Number(b) - Number(a))
		.map(([key, cnt]) => {
			const parts = key.split('-')
			const fid = Number(parts[0])
			const username = parts[1]
			const castHash = parts[parts.length - 1]
			const rootParentUrl = parts.slice(2, -1).join('-')
			return {
				fid,
				username,
				rootParentUrl,
				castHash,
				count: Number(cnt)
			}
		})

	// Keep track of how many times we've seen each fid
	const fidCounts: { [key: string]: number } = {}
	const filteredCasts = allCasts.filter((cast) => {
		fidCounts[cast.fid] = (fidCounts[cast.fid] || 0) + 1
		return fidCounts[cast.fid] <= 3
	})

	const topNCasts = filteredCasts
		.map((cast) => {
			return {
				...cast,
				rootParentUrl: cast.rootParentUrl === 'null' ? null : cast.rootParentUrl
			}
		})
		.slice(0, limit)

	const viewersCasts = allCasts
		.filter((cast) => cast.fid === viewerFid)
		.map((stringifiedCast) => ({
			...stringifiedCast,
			rootParentUrl: stringifiedCast.rootParentUrl === 'null' ? null : stringifiedCast.rootParentUrl
		}))

	const topNCastsPlusViewersCasts = sort(
		unique(topNCasts.concat(viewersCasts), (c) => c.castHash),
		(c) => c.count,
		true // descending === true
	)

	const enhancedTopNCasts = sift(
		await Promise.all(
			topNCastsPlusViewersCasts.map(async (cast) => {
				try {
					const res = await getTextByCastHash(cast.castHash, viewerFid)
					return {
						...cast,
						decodedText: res?.getTextByCastHash.decodedText
					}
				} catch (error) {
					return cast
				}
			})
		)
	)
	return enhancedTopNCasts
}
