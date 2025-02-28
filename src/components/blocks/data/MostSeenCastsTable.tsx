'use client'

import type { Message } from '@farcaster/core'
import { fetcher } from 'itty-fetcher'
import { useEffect, useState } from 'react'
import { FarcasterEmbed } from 'react-farcaster-embed/dist/client'
import type { LeaderboardCastInfo } from '../../../rpc/types'
import { LeaderboardCastInfoResponseSchema } from '../../../rpc/types'

const MAX_PAGE_SIZE = 100
const MODERATOR_FIDS = [6546, 3115, 475488]

// Common styles as constants
const styles = {
	th: 'px-2 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-3',
	td: 'px-2 py-2 text-sm text-gray-500 sm:px-3',
	tdContent: 'px-2 py-2 sm:px-3',
	skeleton: 'animate-pulse bg-gray-200 rounded'
} as const

// Helper components for table structure
const TableHeader = ({
	children,
	className = ''
}: {
	children: React.ReactNode
	className?: string
}) => (
	<th scope="col" className={`${styles.th} ${className}`}>
		{children}
	</th>
)

const TableCell = ({
	children,
	className = ''
}: {
	children: React.ReactNode
	className?: string
}) => <td className={`${styles.td} ${className}`}>{children}</td>

const TableRow = ({ isEven, children }: { isEven: boolean; children: React.ReactNode }) => (
	<tr className={isEven ? 'bg-white' : 'bg-gray-50'}>{children}</tr>
)

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
			const res = await fetcher({
				base: 'https://nemes.farcaster.xyz:2281'
			}).get<{ messages: Message[] }>(
				`/v1/reactionsByCast?target_fid=${cast.fid}&target_hash=${cast.castHash}&reaction_type=1&page_size=${MAX_PAGE_SIZE}`
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
					{showDecoded ? (
						<div className="text-sm text-gray-500">
							Liked by: {modLikes.map((fid) => fid.toString()).join(', ')}
						</div>
					) : (
						<div className="text-sm text-gray-500">
							Liked by: {modLikes.length.toLocaleString()} moderators
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
						Unique View Attempts
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

interface MostSeenCastsTableProps {
	fid: number | null
}

const MostSeenCastsTable = ({ fid }: MostSeenCastsTableProps) => {
	const [data, setData] = useState<LeaderboardCastInfo[]>([])
	const [isLoading, setIsLoading] = useState(true)

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
								Unique View Attempts
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
						{data.map((cast, index) => (
							<tr key={cast.castHash} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
								<td className="px-3 py-2 text-right text-sm text-gray-500">
									{cast.count.toLocaleString()}
								</td>
								<td className="px-3 py-2">
									<CastContent cast={cast} />
								</td>
								<td className="px-3 py-2 text-center text-sm text-gray-500">{index + 1}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	)
}

export default MostSeenCastsTable
