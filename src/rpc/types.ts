import { z } from 'zod'

export interface EnabledChannelsResponse {
	getEnabledChannels: string[]
}

export const EnabledChannelsSchema = z.object({
	getEnabledChannels: z.array(z.string())
})

export interface MyMessagesResponse {
	getDecryptedMessagesByFid: {
		messages: {
			fid: number
			timestamp: string
			text: string
		}[]
	}
}

export const MyMessagesSchema = z.object({
	getDecryptedMessagesByFid: z.object({
		messages: z.array(
			z.object({
				fid: z.number(),
				timestamp: z.string(),
				text: z.string()
			})
		)
	})
})
