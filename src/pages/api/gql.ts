import { gql, GraphQLClient } from 'graphql-request'
import type { ZodObject } from 'zod'
import { GRAPHQL_ENDPOINT, YOGA_READ_TOKEN } from '../../rpc/constants'
import {
	DatabaseViewSchema,
	DisabledChannelsSchema,
	EnabledChannelsSchema,
	MyMessagesSchema,
	SharedDatabaseMetricsSchema,
	type DatabaseViewResponse,
	type DisabledChannelsResponse,
	type EnabledChannelsResponse,
	type MyMessagesResponse,
	type SharedDatabaseMetricsResponse
} from '../../rpc/types'

const queries: Record<string, string> = {
	['getDisabledChannels']: gql`
		query getDisabledChannels {
			getDisabledChannels
		}
	`,
	['getEnabledChannels']: gql`
		query getEnabledChannels {
			getEnabledChannels
		}
	`,
	['sharedDatabaseMetrics']: gql`
		query sharedDatabaseMetrics {
			numPartitions
			numSchemas
		}
	`,
	['databaseView']: gql`
		query dbView {
			numMessages
			getTimestampOfEarliestMessage
			numMessagesMarkedForPruning
			numFids
		}
	`,
	['getDecryptedMessagesByFid']: gql`
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
					deletedAt
				}
			}
		}
	`
}

export const getDisabledChannels = async () => {
	const res = await genericGraphQLQuery<DisabledChannelsResponse>(
		'getDisabledChannels',
		DisabledChannelsSchema
	)
	return res
}

export const getEnabledChannels = async () => {
	const res = await genericGraphQLQuery<EnabledChannelsResponse>(
		'getEnabledChannels',
		EnabledChannelsSchema
	)
	return res
}

export const getSharedDatabaseMetrics = async () => {
	const res = await genericGraphQLQuery<SharedDatabaseMetricsResponse>(
		'sharedDatabaseMetrics',
		SharedDatabaseMetricsSchema
	)
	return res
}

export const getDatabaseView = async () => {
	const res = await genericGraphQLQuery<DatabaseViewResponse>('databaseView', DatabaseViewSchema)
	return res
}

export const getMyMessages = async (fid: number, limit: number = 500) => {
	const res = await genericGraphQLQuery<MyMessagesResponse>(
		'getDecryptedMessagesByFid',
		MyMessagesSchema,
		{ fid, limit, token: YOGA_READ_TOKEN }
	)
	return res
}

const genericGraphQLQuery = async <T>(
	queryName: string,
	schema: ZodObject<any>,
	variables?: any
) => {
	const graphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT)

	const query = queries[queryName]
	try {
		const res = await graphQLClient.request<T>(query, variables)

		const validated = schema.safeParse(res)
		if (!validated.success) {
			throw new Error('Failed to validate response:' + validated.error)
		}

		return validated.data as T
	} catch (error: any) {
		console.error('Error response:', error.response || error)
		throw new Error(
			'Failed to get ' + queryName + variables ? ` on: ${JSON.stringify(variables)}` : ''
		)
	}
}
