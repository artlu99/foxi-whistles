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
		title: 'Decentralized Whistles Protocol',
		aboutText:
			'The Decentralized Whistles Protocol leverages cryptographic building blocks and the open Farcaster Protocol, to share restricted-distribution information in self-sovereign, transparent, and decentralized blah blah.',
		logo: {
			src: '/logo.svg',
			alt: 'Decentralized Whistles Protocol',
			text: 'Whistles.'
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
		copywriteText: '© Whistles 2024.'
	}
}
