'use client'

import { fetcher } from 'itty-fetcher'
import { useEffect, useState } from 'react'
import { GRAPHQL_ENDPOINT } from '../../../rpc/constants'
import { MyMessagesSchema, type MyMessagesResponse } from '../../../rpc/types'

const ClientDashboard = () => {
	const [response, setResponse] = useState<MyMessagesResponse | undefined>()

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetcher({ base: GRAPHQL_ENDPOINT }).get('/api/getMyMessages')
			const validator = MyMessagesSchema.safeParse(res)

			if (validator.success) {
				setResponse(validator.data)
			} else {
				console.error('validator.error:', validator)
			}
		}
		fetchData()
	}, [])

	return response || true ? (
		<div className="p-2">
			<div className=""># of enabled channels: {10}</div>
			<hr />
			<div className=""># of messages: {152}</div>
			<div className="">&nbsp;&nbsp;&nbsp;&bull;&nbsp;valid: {152 - 0}</div>
			<div className="">&nbsp;&nbsp;&nbsp;&bull;&nbsp;earliest message: {'2024-10-17'}</div>
			<div className="">&nbsp;&nbsp;&nbsp;&bull;&nbsp;marked for pruning: {0}</div>
			<div className=""># of unique users (FIDs): {17}</div>
			<span className="text-emphasis text-xs">
				as of {new Date().toISOString().slice(0, 10)}
			</span>
		</div>
	) : null
}
export default ClientDashboard
