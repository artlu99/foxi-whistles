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
								ciphertext: keccak256(toUtf8Bytes(msg.text)).slice(2)
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

	const downloadCSV = (convertToExcelDate = false) => {
		const csvContent =
			'data:text/csv;charset=utf-8,' +
			'plaintext,timestamp,ciphertext\n' +
			data
				.map((e) => {
					const timestamp = convertToExcelDate
						? new Date(e.timestamp).getTime() / 1000 / 86400 + 25569 // Convert to Excel date
						: e.timestamp
					return `"${e.plaintext.replace(/"/g, '""')}",${timestamp},${e.ciphertext}"`
				})
				.join('\n')
		const encodedUri = encodeURI(csvContent)
		const link = document.createElement('a')
		link.setAttribute('href', encodedUri)
		link.setAttribute('download', fid.toString() + '.csv')
		document.body.appendChild(link) // Required for FF
		link.click()
		document.body.removeChild(link)
	}

	const downloadJSON = () => {
		const jsonContent = JSON.stringify(data, null, 2) // Convert data to JSON string
		const blob = new Blob([jsonContent], { type: 'application/json' }) // Create a Blob from the JSON string
		const url = URL.createObjectURL(blob) // Create a URL for the Blob
		const link = document.createElement('a')
		link.setAttribute('href', url)
		link.setAttribute('download', fid.toString() + '.json') // Set the download filename
		document.body.appendChild(link) // Required for FF
		link.click() // Trigger the download
		document.body.removeChild(link) // Clean up
	}

	return response ? (
		<div className="p-2">
			<div className="flex justify-end">
				Download as [
				<a href="#" onClick={() => downloadCSV()}>
					csv
				</a>
				] [
				<a href="#" onClick={downloadJSON}>
					json
				</a>
				] [
				<a href="#" onClick={() => downloadCSV(true)}>
					csv-xlsx
				</a>
				]
			</div>
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
