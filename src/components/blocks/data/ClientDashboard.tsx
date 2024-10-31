'use client'

import { useEffect, useState } from 'react'
import { getDatabaseView, getEnabledChannels } from '../../../pages/api/gql'
import { type DatabaseViewResponse } from '../../../rpc/types'

const ClientDashboard = () => {
	const [enabledChannelsCount, setEnabledChannelsCount] = useState<number>(0)
	const [dbView, setDbView] = useState<DatabaseViewResponse | undefined>()

	useEffect(() => {
		const fetchData = async () => {
			const res = await getDatabaseView()
			setDbView(res)
		}
		const fetchEnabledChannels = async () => {
			const res = await getEnabledChannels()
			setEnabledChannelsCount(res.getEnabledChannels.length)
		}
		fetchData()
		fetchEnabledChannels()
	}, [])

	return dbView ? (
		<div className="p-2">
			<div className=""># of enabled channels: {enabledChannelsCount}</div>
			<hr />
			<div className=""># of messages: {dbView.numMessages + dbView.numMessagesMarkedForPruning}</div>
			<div className="">
				&nbsp;&nbsp;&nbsp;&bull;&nbsp;valid:{' '}
				{dbView.numMessages }
			</div>
			<div className="">
				&nbsp;&nbsp;&nbsp;&bull;&nbsp;marked for pruning: {dbView.numMessagesMarkedForPruning}
			</div>
			<div className=""># of unique users (FIDs): {dbView.numFids}</div>
			<span className="text-emphasis text-xs">as of {new Date().toISOString().slice(0, 10)}</span>
		</div>
	) : null
}
export default ClientDashboard
