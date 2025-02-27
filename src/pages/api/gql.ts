import { GraphQLClient, gql } from 'graphql-request'
import type { ZodObject, ZodRawShape } from 'zod'
import { GRAPHQL_ENDPOINT, YOGA_READ_TOKEN, YOGA_WHISTLES_BEARER } from '../../rpc/constants'
import {
	type DatabaseViewResponse,
	DatabaseViewSchema,
	type DisabledChannelsResponse,
	DisabledChannelsSchema,
	type EnabledChannelsResponse,
	EnabledChannelsSchema,
	type MyMessagesResponse,
	MyMessagesSchema,
	type SharedDatabaseMetricsResponse,
	SharedDatabaseMetricsSchema,
	type TextByCastHashResponse,
	TextByCastHashSchema
} from '../../rpc/types'

const queries: Record<string, string> = {
	getDisabledChannels: gql`
		query getDisabledChannels {
			getDisabledChannels
		}
	`,
	getEnabledChannels: gql`
		query getEnabledChannels {
			getEnabledChannels
		}
	`,
	sharedDatabaseMetrics: gql`
		query sharedDatabaseMetrics {
			numPartitions
			numSchemas
		}
	`,
	databaseView: gql`
		query dbView {
			numMessages
			getTimestampOfEarliestMessage
			numMessagesMarkedForPruning
			numFids
		}
	`,
	getDecryptedMessagesByFid: gql`
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
	`,
	getTextByCastHash: gql`
		query getTextByCastHash($castHash: String!, $fid: Int!) {
			getTextByCastHash(castHash: $castHash, viewerFid: $fid) {
				isDecrypted
				timestamp
				text
				decodedText
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

export const getMyMessages = async (fid: number, limit = 500) => {
	const res = await genericGraphQLQuery<MyMessagesResponse>(
		'getDecryptedMessagesByFid',
		MyMessagesSchema,
		{ fid, limit, token: YOGA_READ_TOKEN }
	)
	return res
}

export const getTextByCastHash = async (castHash: string, fid: number | null) => {
	if (!fid) {
		throw new Error('Fid is required')
	}

	try {
		const res = await genericGraphQLQuery<TextByCastHashResponse>(
			'getTextByCastHash',
			TextByCastHashSchema,
			{ castHash, fid },
			YOGA_WHISTLES_BEARER
		)
		return res
	} catch (error) {
		throw new Error(`Failed to get text by cast hash: ${castHash} for: ${fid}`)
	}
}

const genericGraphQLQuery = async <T>(
	queryName: string,
	schema: ZodObject<ZodRawShape>,
	variables?: Record<string, unknown>,
	bearerToken?: string
) => {
	const graphQLClient = bearerToken
		? new GraphQLClient(GRAPHQL_ENDPOINT, {
				headers: { authorization: `Bearer ${bearerToken}` }
			})
		: new GraphQLClient(GRAPHQL_ENDPOINT)

	const query = queries[queryName]
	try {
		const res = await graphQLClient.request<T>(query, variables)

		const validated = schema.safeParse(res)
		if (!validated.success) {
			throw new Error(`Failed to validate response: ${validated.error}`)
		}

		return validated.data as T
	} catch (error: any) {
		console.error('Error response:', error.response || error)
		throw new Error(
			`Failed to get ${queryName} ${variables ? ` on: ${JSON.stringify(variables)}` : ''}`
		)
	}
}
