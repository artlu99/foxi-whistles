import { z } from 'zod'

export interface EnabledChannelsResponse {
	getEnabledChannels: string[]
}

export const EnabledChannelsSchema = z.object({
	getEnabledChannels: z.array(z.string())
})
