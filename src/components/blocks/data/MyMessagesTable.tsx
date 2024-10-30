'use client'

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from '@tanstack/react-table'
import { fetcher } from 'itty-fetcher'
import { sort } from 'radash'
import { useEffect, useState } from 'react'
import type { SafeParseReturnType } from 'zod'
import { MyMessagesSchema, type MyMessagesResponse } from '../../../rpc/types'

type Message = {
	plaintext: string
	timestamp: number
	ciphertext: string
}

const columnHelper = createColumnHelper<Message>()
const columns = [
	columnHelper.display({
		id: 'idx',
		header: '#',
		cell: (info) => <span className="text-xs">{info.row.index + 1}</span>
	}),
	columnHelper.accessor('plaintext', {
		id: 'text',
		header: 'plaintext'
	}),
	columnHelper.accessor('timestamp', {
		id: 'timestamp',
		header: 'timestamp',
		cell: (info) => {
			return <span className="text-xs">{new Date(info.getValue()).toLocaleString()}</span>
		}
	}),
	columnHelper.accessor('ciphertext', {
		id: 'ciphertext',
		header: 'ciphertext',
		cell: (info) => {
			return <span className="text-xs">{info.getValue()}</span>
		}
	})
]

interface MyMessagesTableProps {
	fid: number
}
const MyMessagesTable = (props: MyMessagesTableProps) => {
	const { fid } = props
	const [response, setResponse] = useState<MyMessagesResponse | undefined>()
	const [data, setData] = useState<Message[]>([])
	const [pagination, setPagination] = useState({
		pageIndex: 0, //initial page index
		pageSize: 1000 //default page size
	})

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetcher().get('/api/getMyMessages', { fid })
			let validator: SafeParseReturnType<MyMessagesResponse, MyMessagesResponse>
			try {
				validator = MyMessagesSchema.safeParse(JSON.parse(res as string))
			} catch {
				validator = MyMessagesSchema.safeParse(res)
			}

			if (validator.success) {
				setResponse(validator.data)
				setData(
					sort(
						validator.data.getDecryptedMessagesByFid.messages.map((msg) => {
							const maybeUnixTimestamp = (Number(msg.timestamp) + Number(1609459200)) * 1000
							const fallbackTimestamp =
								maybeUnixTimestamp > Date.now() ? Number(msg.timestamp) : maybeUnixTimestamp

							return {
								plaintext: msg.text,
								timestamp: fallbackTimestamp,
								ciphertext: msg.text
							}
						}),
						(c) => c.timestamp,
						true
					)
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
			sorting: [{ id: 'timestamp', desc: true }]
		},
		state: {
			pagination,
			sorting: [{ id: 'timestamp', desc: true }]
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(), //load client-side pagination code
		getSortedRowModel: getSortedRowModel(),
		onPaginationChange: setPagination
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
					{table.getRowModel().rows.map((row, index) => (
						<tr
							key={row.id}
							className={
								index % 2 === 0 ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
							}
						>
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
export default MyMessagesTable
