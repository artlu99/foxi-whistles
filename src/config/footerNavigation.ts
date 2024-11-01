// Footer Navigation
// ------------
// Description: The footer navigation data for the website.
export interface Logo {
	src: string
	alt: string
	text: string
}

export interface FooterAbout {
	title: string
	aboutText: string
	logo: Logo
}

export interface SubCategory {
	subCategory: string
	subCategoryLink: string
}

export interface FooterColumn {
	category: string
	subCategories: SubCategory[]
}

export interface SubFooter {
	copywriteText: string
}

export interface FooterData {
	footerAbout: FooterAbout
	footerColumns: FooterColumn[]
	subFooter: SubFooter
}

export const footerNavigationData: FooterData = {
	footerAbout: {
		title: 'SassyHash',
		aboutText:
			'SassyHash leverages cryptographic building blocks and the open Farcaster Protocol, to share restricted-distribution information in self-sovereign, transparent, and sufficiently decentralized blah blah.',
		logo: {
			src: '/logo.svg',
			alt: 'SassyHash',
			text: 'SassyHash.'
		}
	},
	footerColumns: [
		{
			category: 'Product',
			subCategories: [
				{
					subCategory: 'FAQ',
					subCategoryLink: '/faq'
				},
				{
					subCategory: 'Pricing',
					subCategoryLink: '/pricing'
				},
				{
					subCategory: 'Changelog',
					subCategoryLink: '/changelog'
				},
			]
		},
		{
			category: 'Developers',
			subCategories: [
				{
					subCategory: 'Quick Start',
					subCategoryLink: '/blog/developer-journey'
				},
				{
					subCategory: 'Whitepaper',
					subCategoryLink: '/rug#whitepaper'
				},
				{
					subCategory: "Composer Action",
					subCategoryLink: 'https://warpcast.com/~/developers/composer-actions?name=keccak-256&postUrl=https%3A%2F%2Fkeccak256-composer-action.artlu.workers.dev'
				},
				{
					subCategory: "Cast Action",
					subCategoryLink: 'https://warpcast.com/~/add-cast-action?url=https%3A%2F%2Fkeccak256-composer-action.artlu.workers.dev%2Fcast-action'
				},
				{
					subCategory: "GraphQL API",
					subCategoryLink: 'https://whistles.artlu.xyz/graphql'
				}
			]
		},
		{
			category: 'About us',
			subCategories: [
				{
					subCategory: 'News',
					subCategoryLink: '/blog'
				},
				{
					subCategory: 'Support',
					subCategoryLink: '/contact'
				},
			]
		},
	],
	subFooter: {
		copywriteText: '© SassyHash 2024.'
	}
}
