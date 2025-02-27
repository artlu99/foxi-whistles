'use client'

import { keccak256 } from '@ethersproject/keccak256'
import { toUtf8Bytes } from '@ethersproject/strings'
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
import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { UAParser } from 'ua-parser-js'
import { type MyMessagesResponse, MyMessagesSchema } from '../../../rpc/types'

type Message = {
	plaintext: string
	timestamp: number
	ciphertext: string
	deleted: boolean
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
		header: 'plaintext',
		cell: (info) => {
			const isDeleted = info.row.original.deleted
			return (
				<span style={{ textDecoration: isDeleted ? 'line-through' : 'none' }}>
					{info.getValue()}
				</span>
			)
		}
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
			return (
				<span className="text-xs">
					{info.getValue().slice(0, 5)}...{info.getValue().slice(-5)}
				</span>
			)
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
			try {
				const res = await fetcher().get('/api/getMyMessages', { fid })
				const data = typeof res === 'string' ? JSON.parse(res) : res
				const validator = MyMessagesSchema.safeParse(data)

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
									ciphertext: keccak256(toUtf8Bytes(msg.text)).slice(2),
									deleted: !!msg.deletedAt
								}
							}),
							(c) => c.timestamp,
							true
						)
					)
				} else {
					console.error('Validation error:', validator.error)
				}
			} catch (error) {
				console.error('Fetch error:', error)
			}
		}
		fetchData()
	}, [fid])

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

	const renderCell = (content: unknown): ReactNode => {
		if (typeof content === 'bigint') {
			return content.toString()
		}
		return content as ReactNode
	}

	const downloadData = useCallback(
		async (format: 'csv' | 'json' | 'csv-xlsx', platform?: 'mac' | 'windows') => {
			try {
				// Create a hidden anchor element to trigger the download
				const link = document.createElement('a')
				link.href = `/api/downloadMessages?fid=${fid}&format=${format}${platform ? `&platform=${platform}` : ''}`
				const extension = format === 'json' ? 'json' : 'csv'
				link.download = `${fid}.${extension}` // Set the filename
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)
			} catch (error) {
				console.error('Download failed:', error)
				// You might want to add some user feedback here
			}
		},
		[fid]
	)

	const platformSpecificDownloadButtons = useMemo(() => {
		const parser = new UAParser()
		const os = parser.getOS().name?.toLowerCase() || ''

		return ['windows'].includes(os) ? (
			<>
				[
				<button type="button" onClick={() => downloadData('csv-xlsx', 'windows')}>
					csv-xlsx
				</button>
				]
			</>
		) : ['ios', 'macos'].includes(os) ? (
			<>
				[
				<button type="button" onClick={() => downloadData('csv-xlsx', 'mac')}>
					csv-xlsx
				</button>
				]
			</>
		) : (
			<>
				[
				<button type="button" onClick={() => downloadData('csv-xlsx', 'mac')}>
					Mac Excel
				</button>
				] [
				<button type="button" onClick={() => downloadData('csv-xlsx', 'windows')}>
					Win Excel
				</button>
				]
			</>
		)
	}, [downloadData])

	return response ? (
		<div className="p-2">
			<div className="flex justify-end">
				Download as [
				<button type="button" onClick={() => downloadData('csv')}>
					csv
				</button>
				] [
				<button type="button" onClick={() => downloadData('json')}>
					json
				</button>
				] {platformSpecificDownloadButtons}
			</div>
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
export default MyMessagesTable
