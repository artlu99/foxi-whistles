'use client'

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable
} from '@tanstack/react-table'
import { fetcher } from 'itty-fetcher'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import type { LeaderboardCastInfo } from '../../../rpc/types'
import { LeaderboardCastInfoResponseSchema } from '../../../rpc/types'

const columnHelper = createColumnHelper<LeaderboardCastInfo>()
const columns = [
	columnHelper.display({
		id: 'idx',
		header: '#',
		cell: (info) => <span className="text-xs">{info.row.index + 1}</span>
	}),
	columnHelper.accessor('fid', {
		id: 'fid',
		header: 'fid',
		cell: (info) => {
			return <span className="block text-center text-xs">{info.getValue().toLocaleString()}</span>
		}
	}),
	columnHelper.accessor('rootParentUrl', {
		id: 'rootParentUrl',
		header: 'channel',
		cell: (info) => {
			const url = info.getValue()
			return url ? (
				<span className="text-xs">{url.length > 18 ? `...${url.slice(-15)}` : url}</span>
			) : null
		}
	}),
	columnHelper.accessor('castHash', {
		id: 'castHash',
		header: 'castHash',
		cell: (info) => {
			return (
				<span className="text-xs">
					{info.getValue().slice(0, 5)}...{info.getValue().slice(-5)}
				</span>
			)
		}
	}),
	columnHelper.display({
		id: 'warpcast',
		header: '🚾',
		cell: (info) => {
			const castHash = info.row.getValue('castHash') as string
			return (
				<div className="text-center">
					<a
						href={`https://warpcast.com/~/conversations/${castHash}`}
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-500 hover:text-blue-700"
					>
						🚾
					</a>
				</div>
			)
		}
	}),
	columnHelper.accessor('count', {
		id: 'count',
		header: 'count',
		cell: (info) => {
			return <span className="block text-center text-xs">{info.getValue()}</span>
		}
	})
]

const MostSeenCastsTable = () => {
	const [data, setData] = useState<LeaderboardCastInfo[]>([])

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetcher().get('/api/getMostSeenCasts')
				const data = typeof res === 'string' ? JSON.parse(res) : res
				const validator = LeaderboardCastInfoResponseSchema.safeParse(data)

				if (validator.success) {
					setData(validator.data)
				} else {
					console.error('Validation error:', validator.error)
				}
			} catch (error) {
				console.error('Fetch error:', error)
			}
		}
		fetchData()
	}, [])

	console.log('data:', data)

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting: [{ id: 'count', desc: true }]
		}
	})

	const renderCell = (content: unknown): ReactNode => {
		if (typeof content === 'bigint') {
			return content.toString()
		}
		return content as ReactNode
	}

	return data.length > 0 ? (
		<div className="p-2">
			<table>
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th key={header.id}>
									{renderCell(flexRender(header.column.columnDef.header, header.getContext()))}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row, index) => (
						<tr
							key={row.id}
							className={
								index % 2 === 0 ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
							}
						>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id}>
									{renderCell(flexRender(cell.column.columnDef.cell, cell.getContext()))}
								</td>
							))}
						</tr>
					))}
				</tbody>
				<tfoot>
					{table.getFooterGroups().map((footerGroup) => (
						<tr key={footerGroup.id}>
							{footerGroup.headers.map((header) => (
								<th key={header.id}>
									{renderCell(flexRender(header.column.columnDef.footer, header.getContext()))}
								</th>
							))}
						</tr>
					))}
				</tfoot>
			</table>
		</div>
	) : null
}
export default MostSeenCastsTable
