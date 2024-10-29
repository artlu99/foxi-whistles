'use client'

import { fetcher } from 'itty-fetcher'
import { useEffect, useState } from 'react'
import type { SafeParseReturnType } from 'zod'
import { MyMessagesSchema, type MyMessagesResponse } from '../../../rpc/types'

interface MyMessagesTableProps {
	fid: number
}
const MyMessagesTable = (props: MyMessagesTableProps) => {
	const { fid } = props
	const [data, setData] = useState<MyMessagesResponse | undefined>()

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
				setData(validator.data)
			} else {
				console.error('validator.error:', validator)
			}
		}
		fetchData()
	}, [])

	const messages = data?.getDecryptedMessagesByFid.messages

	return messages && messages.length > 0 ? (
		<div>
			<ol>
				{messages.map((msg, idx) => {
					const maybeUnixTimestamp = (Number(msg.timestamp) + Number(1609459200)) * 1000
					const fallbackTimestamps =
						maybeUnixTimestamp > Date.now() ? Number(msg.timestamp) : maybeUnixTimestamp
					const readableTimestamp = new Date(fallbackTimestamps).toLocaleString()

					return (
						<li key={`${fid}-message-${idx}`}>
							<span className={'text-xs'}>{idx + 1}</span>
							&nbsp;
							{msg.text}
							&nbsp;
							<span className={'text-xs'}>{readableTimestamp}</span>
						</li>
					)
				})}
			</ol>
		</div>
	) : null
}
export default MyMessagesTable
