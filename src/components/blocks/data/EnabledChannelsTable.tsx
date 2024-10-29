'use client'

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnOrderState,
	type SortingState
} from '@tanstack/react-table'
import { fetcher } from 'itty-fetcher'
import { useEffect, useState } from 'react'
import type { SafeParseReturnType } from 'zod'
import { EnabledChannelsSchema, type EnabledChannelsResponse } from '../../../rpc/types'

const columnHelper = createColumnHelper<{ channelName: string }>()
const columns = [
	columnHelper.accessor('channelName', {
		id: 'idx',
		header: '#',
		cell: (info) => <span className="text-xs">{info.row.index + 1}</span>
	}),
	columnHelper.accessor('channelName', {
		id: 'channelName',
		header: 'Channel'
	}),
	columnHelper.accessor('channelName', {
		id: 'wcLink',
		header: '🚾',
		cell: (info) => {
			return (
				<a
					href={`https://warpcast.com/~/channel/${info.getValue()}`}
					target={'_blank'}
					rel={'noopener noreferrer'}
					className={'text-xs'}
				>
					[Warpcast]
				</a>
			)
		}
	}),
	columnHelper.accessor('channelName', {
		id: 'fcpLink',
		header: 'Far.Quest',
		cell: (info) => {
			return (
				<a
					href={`https://far.quest/channel/${info.getValue()}`}
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
	const [data, setData] = useState<{ channelName: string }[]>([])
	const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(['channelName'])
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0, //initial page index
		pageSize: 5, //default page size
	  });

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
				setData(validator.data.getEnabledChannels.map((c) => ({ channelName: c })))
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
			columnOrder,
			pagination,
			sorting: [{ id: 'channelName', desc: true }]
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(), //load client-side pagination code
		getSortedRowModel: getSortedRowModel(),
		onColumnOrderChange: setColumnOrder,
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
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
			<button
  onClick={() => table.firstPage()}
  disabled={!table.getCanPreviousPage()}
>
  {'<<'}
</button>
<button
  onClick={() => table.previousPage()}
  disabled={!table.getCanPreviousPage()}
>
  {'<'}
</button>
<button
  onClick={() => table.nextPage()}
  disabled={!table.getCanNextPage()}
>
  {'>'}
</button>
<button
  onClick={() => table.lastPage()}
  disabled={!table.getCanNextPage()}
>
  {'>>'}
</button>
<select
  value={table.getState().pagination.pageSize}
  onChange={e => {
    table.setPageSize(Number(e.target.value))
  }}
>
  {[5, 25, 50].map(pageSize => (
    <option key={pageSize} value={pageSize}>
      {pageSize}
    </option>
  ))}
</select>
		</div>
	) : null
}
export default EnabledChannelsTable
