'use client'

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type SortingState
} from '@tanstack/react-table'
import { fetcher } from 'itty-fetcher'
import { alphabetical } from 'radash'
import { useEffect, useState } from 'react'
import type { SafeParseReturnType } from 'zod'
import { EnabledChannelsSchema, type EnabledChannelsResponse } from '../../../rpc/types'

type Channel = {
	channelName: string
	wcLink: string
	fqpLink: string
}

const columnHelper = createColumnHelper<Channel>()
const columns = [
	columnHelper.display({
		id: 'idx',
		header: '#',
		cell: (info) => <span className="text-xs">{info.row.index + 1}</span>
	}),
	columnHelper.accessor('channelName', {
		id: 'channelName',
		header: 'Channel'
	}),
	columnHelper.accessor('wcLink', {
		id: 'wcLink',
		header: '🚾',
		cell: (info) => {
			return (
				<a
					href={info.getValue()}
					target={'_blank'}
					rel={'noopener noreferrer'}
					className={'text-xs'}
				>
					[Warpcast]
				</a>
			)
		}
	}),
	columnHelper.accessor('fqpLink', {
		id: 'fqpLink',
		header: 'Far.Quest',
		cell: (info) => {
			return (
				<a
					href={info.getValue()}
					target={'_blank'}
					rel={'noopener noreferrer'}
					className={'text-xs'}
				>
					[Far.Quest Pro]
				</a>
			)
		}
	})
]

const EnabledChannelsTable = () => {
	const [response, setResponse] = useState<EnabledChannelsResponse | undefined>()
	const [data, setData] = useState<Channel[]>([])
	const [pagination, setPagination] = useState({
		pageIndex: 0, //initial page index
		pageSize: 100 //default page size
	})

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetcher().get('/api/getEnabledChannels', {})
			let validator: SafeParseReturnType<EnabledChannelsResponse, EnabledChannelsResponse>
			try {
				validator = EnabledChannelsSchema.safeParse(JSON.parse(res as string))
			} catch {
				validator = EnabledChannelsSchema.safeParse(res)
			}

			if (validator.success) {
				setResponse(validator.data)
				setData(
					alphabetical(validator.data.getEnabledChannels.map((c) => ({
						channelName: c,
						wcLink: `https://warpcast.com/~/channel/${c}`,
						fqpLink: `https://far.quest/channel/${c}`
					})), (c) => c.channelName, 'desc')
				)
			} else {
				console.error('validator.error:', validator)
			}
		}
		fetchData()
	}, [])

	const table = useReactTable({
		data,
		columns,
		initialState: {
			sorting: [{ id: 'channelName', desc: true }]
		},
		state: {
			pagination,
			sorting: [{ id: 'channelName', desc: true }]
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(), //load client-side pagination code
		getSortedRowModel: getSortedRowModel(),
		onPaginationChange: setPagination,
	})

	return response ? (
		<div className="p-2">
			<table>
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(header.column.columnDef.header, header.getContext())}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
							))}
						</tr>
					))}
				</tbody>
				<tfoot>
					{table.getFooterGroups().map((footerGroup) => (
						<tr key={footerGroup.id}>
							{footerGroup.headers.map((header) => (
								<th key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(header.column.columnDef.footer, header.getContext())}
								</th>
							))}
						</tr>
					))}
				</tfoot>
			</table>
		</div>
	) : null
}
export default EnabledChannelsTable
