import { gql, GraphQLClient } from 'graphql-request'
import { EnabledChannelsSchema, type EnabledChannelsResponse } from '../../rpc/types'

const endpoint = 'https://whistles.artlu.xyz/graphql'

export const getEnabledChannels = async () => {
	const graphQLClient = new GraphQLClient(endpoint)

	try {
		const res = await graphQLClient.request<EnabledChannelsResponse>(gql`
			query getEnabledChannels {
				getEnabledChannels
			}
		`)
		const validated = EnabledChannelsSchema.safeParse(res)
		if (!validated.success) {
			throw new Error('Failed to validate response')
		}

		return validated.data
	} catch (error: any) {
		console.error('Error response:', error.response || error)
		throw new Error('Failed to get channels list')
	}
}
