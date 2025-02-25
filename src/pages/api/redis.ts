import { Redis } from '@upstash/redis'
import type { LeaderboardCastInfo } from '../../rpc/types'

const redis = new Redis({
	url: import.meta.env.UPSTASH_REDIS_REST_URL,
	token: import.meta.env.UPSTASH_REDIS_REST_READ_ONLY_TOKEN
})

export async function getMostSeenCasts({ limit = 10 }: { limit?: number } = {}): Promise<
	LeaderboardCastInfo[]
> {
	const usage = await redis.hgetall('action-usage')

	if (!usage) {
		return []
	}

	const topNCasts = Object.entries(usage)
		.sort(([, a], [, b]) => Number(b) - Number(a))
		.map(([key, cnt]) => {
			const parts = key.split('-')
			const fid = parts[0]
			const castHash = parts[parts.length - 1]
			const rootParentUrl = parts.slice(1, -1).join('-')
			return {
				fid,
				rootParentUrl,
				castHash,
				count: Number(cnt)
			}
		})

	// Keep track of how many times we've seen each fid
	const fidCounts: { [key: string]: number } = {}
	const filteredCasts = topNCasts.filter((cast) => {
		fidCounts[cast.fid] = (fidCounts[cast.fid] || 0) + 1
		return fidCounts[cast.fid] <= 3
	})

	return filteredCasts
		.map((cast) => ({
			...cast,
			fid: Number(cast.fid),
			rootParentUrl: cast.rootParentUrl === 'null' ? null : cast.rootParentUrl,
			count: Number(cast.count)
		}))
		.slice(0, limit)
}
