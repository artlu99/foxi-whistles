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
				console.log("res:", res)
				console.error("validator.error:", validator.error)
			}
		}
		fetchData()
	}, [])

	return data ? (
		<div>
			<ol>
				{alphabetical(data.getEnabledChannels, (c) => c.toLocaleLowerCase()).map((channel, idx) => (
					<li>
						<span className={'text-xs'}>{idx}</span>&nbsp;{channel}&nbsp;
						<span className={'text-xs'}>
							[
							<a
								href={`https://warpcast.com/~/channel/${channel}`}
								target={'_blank'}
								rel={'noopener noreferrer'}
							>
								Warpcast
							</a>
							{/* ]&nbsp;[
							<a
								href={`https://supercast.xyz/channel/${channel}`}
								target={'_blank'}
								rel={'noopener noreferrer'}
							>
								supercast
							</a> */}
							{/* ]&nbsp;[
							<a
								href={`recaster://channel/${channel}`}
								target={'_blank'}
								rel={'noopener noreferrer'}
							>
								Recaster
							</a> */}
							{/* ]&nbsp;[
							<a
								href={`https://firefly.mask.social/channel/${channel}/recent`}
								target={'_blank'}
								rel={'noopener noreferrer'}
							>
								Firefly
							</a> */}
							]&nbsp;[
							<a
								href={`https://far.quest/channel/${channel}`}
								target={'_blank'}
								rel={'noopener noreferrer'}
							>
								Far.Quest Pro
							</a>
							{/* ]&nbsp;[
							<a
								href={`https://client-bcbhshow.artlu.xyz/~/channel/${channel}`}
								target={'_blank'}
								rel={'noopener noreferrer'}
							>
								BCBHShow Lite Client
							</a> */}
							]
						</span>
					</li>
				))}
			</ol>
		</div>
	) : null
}
export default EnabledChannelsTable
