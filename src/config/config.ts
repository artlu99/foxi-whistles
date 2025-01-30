// Config
// ------------
// Description: The configuration file for the website.

export interface Logo {
	src: string
	alt: string
}

export type Mode = 'auto' | 'light' | 'dark'

export interface Config {
	siteTitle: string
	siteDescription: string
	ogImage: string
	logo: Logo
	canonical: boolean
	noindex: boolean
	mode: Mode
	scrollAnimations: boolean
}

export const configData: Config = {
	siteTitle: 'SassyHash',
	siteDescription:
		'SassyHash leverages cryptographic building blocks and the open Farcaster Protocol, to share restricted-distribution information in self-sovereign, transparent, and sufficiently decentralized blah blah.',
	ogImage: new URL('/og-clean.jpg', import.meta.env.SITE).href,
	logo: {
		src: new URL('/logo.svg', import.meta.env.SITE).href,
		alt: 'SassyHash.logo'
	},
	canonical: true,
	noindex: false,
	mode: 'auto',
	scrollAnimations: true
}
