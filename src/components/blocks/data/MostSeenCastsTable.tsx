'use client'

import type { Message } from '@farcaster/core'
import { fetcher } from 'itty-fetcher'
import { useEffect, useState } from 'react'
import { FarcasterEmbed } from 'react-farcaster-embed/dist/client'
import type { LeaderboardCastInfo } from '../../../rpc/types'
import { LeaderboardCastInfoResponseSchema } from '../../../rpc/types'

interface SmoothScores {
	nRaw: number
	sumRaw: number
	meanRaw: number
	stdevRaw: number
	sumSmooth: number
	items: {
		castHash: string
		raw: number
		rawZscore: number
		smooth: number
		smoothZscore: number
	}[]
}

const MAX_PAGE_SIZE = 100
const MODERATORS: Record<number, string> = {
	533: 'alexpaden',
	3115: 'ghostlinkz.eth',
	4163: 'kmacb.eth',
	6546: 'artlu',
	8004: 'ahn.eth',
	10174: 'cryptowenmoon.eth',
	10215: 'zoo',
	15850: 'christin',
	16567: 'serendipity',
	191780: 'agrimony.eth',
	475488: 'hankmoody',
	535389: 'xbornid.eth'
}
const MODERATOR_FIDS = Object.keys(MODERATORS).map(Number)

const client = fetcher({ base: 'https://nemes.farcaster.xyz:2281' })

const pluralize = (count: number, singular: string, plural?: string) =>
	count === 1 ? `${count} ${singular}` : `${count} ${plural ?? `${singular}s`}`

const CastContent = ({
	cast,
	showDecoded = false
}: {
	cast: LeaderboardCastInfo
	showDecoded?: boolean
}) => {
	const [modLikes, setModLikes] = useState<number[]>([])

	useEffect(() => {
		const fetchLikes = async () => {
			const res = await client.get<{ messages: Message[] }>(
				`/v1/reactionsByCast?${new URLSearchParams({
					target_fid: cast.fid.toString(),
					target_hash: cast.castHash,
					reaction_type: '1',
					page_size: MAX_PAGE_SIZE.toString()
				})}`
			)

			setModLikes(
				res?.messages.map((m) => m.data?.fid ?? 0).filter((fid) => MODERATOR_FIDS.includes(fid)) ??
					[]
			)
		}
		fetchLikes()
	}, [cast])

	return (
		<div className="w-full">
			{cast.username ? (
				<>
					{showDecoded ? <>{cast.decodedText}</> : null}
					<FarcasterEmbed
						url={`https://warpcast.com/${cast.username}/${cast.castHash.slice(0, 8)}`}
						key={cast.castHash}
					/>
					{showDecoded && modLikes.length > 0 ? (
						<div className="text-sm text-gray-500">
							Liked by: {modLikes.map((fid) => MODERATORS[fid]).join(', ')}
						</div>
					) : (
						<div className="text-sm text-gray-500">
							Liked by: {pluralize(modLikes.length, 'moderator')}
						</div>
					)}
				</>
			) : (
				<span className="text-sm text-gray-900">
					{cast.fid} / {cast.castHash.slice(0, 8)}
				</span>
			)}
		</div>
	)
}

const CastCard = ({ cast, index }: { cast: LeaderboardCastInfo; index: number }) => {
	const [showDecoded, setShowDecoded] = useState(false)
	return (
		<div className="overflow-hidden rounded-lg bg-white shadow">
			<div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2">
				<div className="flex items-center gap-3">
					<span className="text-sm font-medium text-gray-500">#{index + 1}</span>
					<div className="flex items-center gap-1">
						<span className="text-sm font-medium text-gray-900">{cast.count.toLocaleString()}</span>
						<span className="text-xs text-gray-500">unique view attempts</span>
					</div>
				</div>
				{cast.decodedText ? (
					<button type="button" className="text-sm" onClick={() => setShowDecoded(!showDecoded)}>
						{showDecoded ? '🙈' : '💅'}
					</button>
				) : null}
			</div>
			<div className="p-4">
				<CastContent cast={cast} showDecoded={showDecoded} />
			</div>
		</div>
	)
}
const CardSkeleton = ({ index }: { index: number }) => (
	<div className="overflow-hidden rounded-lg bg-white shadow">
		<div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2">
			<div className="flex items-center gap-3">
				<span className="text-sm font-medium text-gray-500">#{index + 1}</span>
				<div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
			</div>
		</div>
		<div className="p-4">
			<div className="h-24 w-full animate-pulse rounded bg-gray-200" />
		</div>
	</div>
)

const TableSkeleton = () => (
	<div className="hidden w-full rounded-lg shadow sm:block">
		<table className="min-w-full divide-y divide-gray-200">
			<thead className="bg-gray-50">
				<tr>
					<th
						scope="col"
						className="w-24 px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
					>
						Raw Score
					</th>{' '}
					<th
						scope="col"
						className="w-24 px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
					>
						Smoothed Score
					</th>
					<th
						scope="col"
						className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
					>
						{' '}
					</th>
					<th
						scope="col"
						className="w-12 px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
					>
						#
					</th>
				</tr>
			</thead>
			<tbody className="divide-y divide-gray-200 bg-white">
				{[...Array(5)].map((_, i) => (
					<tr key={`skeleton-${i}`} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
						<td className="px-3 py-2">
							<div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
						</td>
						<td className="px-3 py-2">
							<div className="h-24 w-full max-w-[280px] animate-pulse rounded bg-gray-200" />
						</td>
						<td className="px-3 py-2">
							<div className="h-4 w-6 animate-pulse rounded bg-gray-200" />
						</td>
					</tr>
				))}
			</tbody>
		</table>
	</div>
)

const calculateSmoothScores = (data: LeaderboardCastInfo[]) => {
	const smoothData: SmoothScores = {
		nRaw: 0,
		sumRaw: 0,
		sumSmooth: 0,
		meanRaw: 0,
		stdevRaw: 0,
		items: []
	}
	for (const cast of data) {
		smoothData.nRaw++
		smoothData.sumRaw += cast.count
		smoothData.items.push({
			castHash: cast.castHash,
			raw: cast.count,
			rawZscore: 0,
			smooth: 0,
			smoothZscore: 0
		})
	}
	smoothData.meanRaw = smoothData.sumRaw / smoothData.nRaw
	smoothData.stdevRaw = Math.sqrt(
		smoothData.items.reduce((acc, item) => acc + (item.raw - smoothData.meanRaw) ** 2, 0) /
			smoothData.nRaw
	)
	for (const item of smoothData.items) {
		item.rawZscore = (item.raw - smoothData.meanRaw) / smoothData.stdevRaw
		item.smoothZscore = Math.atan(item.rawZscore)
	}
	for (const item of smoothData.items) {
		item.smooth = item.smoothZscore * smoothData.stdevRaw + smoothData.meanRaw
		smoothData.sumSmooth += item.smooth
	}
	return smoothData
}

interface MostSeenCastsTableProps {
	fid: number | null
	totalPool: number
	minPayout: number
}

const MostSeenCastsTable = ({ fid, totalPool, minPayout }: MostSeenCastsTableProps) => {
	const [data, setData] = useState<LeaderboardCastInfo[]>([])
	const [isLoading, setIsLoading] = useState(true)

	const [smoothData, setSmoothData] = useState<SmoothScores>()
	const [availablePool, setAvailablePool] = useState(totalPool - 10 * minPayout)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetcher().get(
					fid ? `/api/getMostSeenCasts?viewerFid=${fid}` : '/api/getMostSeenCasts'
				)
				const data = typeof res === 'string' ? JSON.parse(res) : res
				const validator = LeaderboardCastInfoResponseSchema.safeParse(data)

				if (validator.success) {
					setData(validator.data)
				} else {
					console.error('Validation error:', validator.error)
				}
			} catch (error) {
				console.error('Fetch error:', error)
			} finally {
				setIsLoading(false)
			}
		}
		fetchData()
	}, [fid])

	useEffect(() => {
		if (data.length) {
			const smoothData = calculateSmoothScores(data.filter((cast) => cast.fid !== 6546).slice(0, 10))
			setSmoothData(smoothData)
		}
		// count how many unique FIDs are in the top 10 of the (valid) data
		const top10Fids = data.slice(0, 10).map((cast) => cast.fid)
		const uniqueTop10Fids = new Set(top10Fids)
		setAvailablePool(totalPool - minPayout * uniqueTop10Fids.size)
	}, [data, totalPool, minPayout])

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="space-y-4 sm:hidden">
					{[...Array(5)].map((_, i) => (
						<CardSkeleton key={`mobile-skeleton-${i}`} index={i} />
					))}
				</div>
				<TableSkeleton />
			</div>
		)
	}

	if (!data.length) return null

	return (
		<>
			{/* Mobile Card View */}
			<div className="space-y-4 sm:hidden">
				{data.map((cast, index) => (
					<CastCard key={cast.castHash} cast={cast} index={index} />
				))}
			</div>

			{/* Desktop Table View */}
			<div className="hidden w-full rounded-lg shadow sm:block">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th
								scope="col"
								className="w-24 px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>
								Raw Score
							</th>
							<th
								scope="col"
								className="w-24 px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>
								Smoothed Score
							</th>
							<th
								scope="col"
								className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>
								{' '}
							</th>
							<th
								scope="col"
								className="w-12 px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>
								#
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 bg-white">
						{data.map((cast, index) => {
							const smoothItem = smoothData?.items.find((item) => item.castHash === cast.castHash)
							const payoutRaw = (availablePool * cast.count) / (smoothData?.sumRaw ?? 1)
							const payoutSmooth =
								(availablePool * (smoothItem?.smooth ?? 0)) / (smoothData?.sumSmooth ?? 1)

							return (
								<tr key={cast.castHash} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
									<td className="px-3 py-2 text-right text-sm text-gray-500">
										{cast.count.toFixed(2)} (${payoutRaw.toFixed(2)})
									</td>
									<td className="px-3 py-2 text-right text-sm text-gray-500">
										{smoothItem?.smooth.toFixed(2)} (${payoutSmooth.toFixed(2)})
									</td>
									<td className="px-3 py-2">
										<CastContent cast={cast} />
									</td>
									<td className="px-3 py-2 text-center text-sm text-gray-500">{index + 1}</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
		</>
	)
}

export default MostSeenCastsTable
