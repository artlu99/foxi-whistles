import { z } from 'zod'

export interface DisabledChannelsResponse {
	getDisabledChannels: string[]
}

export const DisabledChannelsSchema = z.object({
	getDisabledChannels: z.array(z.string())
})

export interface EnabledChannelsResponse {
	getEnabledChannels: string[]
}

export const EnabledChannelsSchema = z.object({
	getEnabledChannels: z.array(z.string())
})

export interface SharedDatabaseMetricsResponse {
	numSchemas: number
	numPartitions: number
}

export const SharedDatabaseMetricsSchema = z.object({
	numSchemas: z.number(),
	numPartitions: z.number()
})

export interface DatabaseViewResponse {
	numMessages: number
	getTimestampOfEarliestMessage: number
	numMessagesMarkedForPruning: number
	numFids: number
}

export const DatabaseViewSchema = z.object({
	numMessages: z.number(),
	getTimestampOfEarliestMessage: z.number(),
	numMessagesMarkedForPruning: z.number(),
	numFids: z.number()
})

export interface MyMessagesResponse {
	getDecryptedMessagesByFid: {
		messages: {
			fid: number
			timestamp: string
			text: string
			deletedAt: string | null
		}[]
	}
}

export const MyMessagesSchema = z.object({
	getDecryptedMessagesByFid: z.object({
		messages: z.array(
			z.object({
				fid: z.number(),
				timestamp: z.string(),
				text: z.string(),
				deletedAt: z.string().nullable()
			})
		)
	})
})

export interface TextByCastHashResponse {
	getTextByCastHash: {
		isDecrypted: boolean
		timestamp: string
		text: string
		decodedText: string | null
	}
}

export const TextByCastHashSchema = z.object({
	getTextByCastHash: z.object({
		isDecrypted: z.boolean(),
		timestamp: z.string(),
		text: z.string(),
		decodedText: z.string().nullable()
	})
})

export interface LeaderboardCastInfo {
	fid: number
	username: string
	rootParentUrl: string | null
	castHash: string
	count: number
	decodedText?: string | null
}

const LeaderboardCastInfoSchema = z.object({
	fid: z.number(),
	username: z.string(),
	rootParentUrl: z.string().nullable(),
	castHash: z.string(),
	count: z.number(),
	decodedText: z.string().nullable().optional()
})

export const LeaderboardCastInfoResponseSchema = z.array(LeaderboardCastInfoSchema)
