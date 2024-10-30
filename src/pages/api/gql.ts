import { gql, GraphQLClient } from 'graphql-request'
import {
	EnabledChannelsSchema,
	MyMessagesSchema,
	SharedDatabaseMetricsSchema,
	type EnabledChannelsResponse,
	type MyMessagesResponse,
	type SharedDatabaseMetricsResponse
} from '../../rpc/types'

const endpoint = 'https://whistles.artlu.xyz/graphql'
const token = import.meta.env.YOGA_READ_TOKEN

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

export const getSharedDatabaseMetrics = async () => {
	const graphQLClient = new GraphQLClient(endpoint)

	try {
		const res = await graphQLClient.request<SharedDatabaseMetricsResponse>(gql`
			query sharedDatabaseMetrics {
				numPartitions
  				numSchemas
			}
		`)
		const validated = SharedDatabaseMetricsSchema.safeParse(res)
		if (!validated.success) {
			console.log(res)
			throw new Error('Failed to validate response')
		}

		return validated.data
	} catch (error: any) {
		console.error('Error response:', error.response || error)
		throw new Error('Failed to get shared database metrics')
	}
}

export const getMyMessages = async (fid: number, limit: number = 500) => {
	const graphQLClient = new GraphQLClient(endpoint)

	try {
		const res = await graphQLClient.request<MyMessagesResponse>(
			gql`
				query getDecryptedMessagesByFid($fid: Int!, $limit: Int, $token: String) {
					getDecryptedMessagesByFid(
						limit: $limit
						order: { asc: true }
						fid: $fid
						bearerToken: $token
					) {
						messages {
							fid
							timestamp
							text
						}
					}
				}
			`,
			{ fid, limit, token }
		)
		const validated = MyMessagesSchema.safeParse(res)
		if (!validated.success) {
			throw new Error('Failed to validate response')
		}

		return validated.data
	} catch (error: any) {
		console.error('Error response:', error.response) // || error.response || error)
		throw new Error('Failed to get casts for fid: ' + fid)
	}
}
