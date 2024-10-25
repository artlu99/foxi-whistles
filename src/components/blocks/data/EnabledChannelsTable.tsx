'use client'

import { fetcher } from 'itty-fetcher'
import { useEffect, useState } from 'preact/hooks'
import { alphabetical } from 'radash'
import { EnabledChannelsSchema, type EnabledChannelsResponse } from '../../../rpc/types'

const EnabledChannelsTable = () => {
	const [data, setData] = useState<EnabledChannelsResponse | undefined>()

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetcher().get('/api/getEnabledChannels', {})
			const validator = EnabledChannelsSchema.safeParse(res)
			if (validator.success) {
				setData(validator.data)
			} else {
				console.log(validator.error)
			}
		}
		fetchData()
	}, [])

	return data ? (
		<div>
			<ul>
				{alphabetical(data.getEnabledChannels, (c) => c.toLocaleLowerCase()).map((channel) => (
					<li>&bull;&nbsp;{channel}</li>
				))}
			</ul>
		</div>
	) : null
}
export default EnabledChannelsTable
