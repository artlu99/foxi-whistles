// Navigation Bar
// ------------
// Description: The navigation bar data for the website.
export interface Logo {
	src: string
	alt: string
	text: string
}

export interface NavSubItem {
	name: string
	link: string
}

export interface NavItem {
	name: string
	link: string
	submenu?: NavSubItem[]
}

export interface NavAction {
	name: string
	link: string
	style: string
	size: string
}

export interface NavData {
	logo: Logo
	navItems: NavItem[]
	navActions: NavAction[]
}

export const navigationBarData: NavData = {
	logo: {
		src: '/logo.svg',
		alt: 'Decentralized Whistles Protocol',
		text: 'Whistles.'
	},
	navItems: [
		{ name: 'Home', link: '/' },
		{ name: 'Pricing', link: '/pricing' },
		{
			name: 'Resources',
			link: '#',
			submenu: [
				{ name: 'FAQ', link: '/faq' },
				{ name: 'See Enabled Channels', link: '/channels'},
				{ name: 'Manage My Channels', link: '/manage' },
				{ name: 'Download My Own Data', link: '/download' },
				{ name: 'Anonymized Analytics', link: '/soonTM' },
				{ name: 'Contact', link: '/contact' }
			]
		},
		{ name: 'Blog', link: '/blog' },
		{ name: 'Changelog', link: '/changelog' },
		{
			name: 'Developers',
			link: '#',
			submenu: [
				{ name: 'Quick Start', link: '/blog/developer-journey' },
				{ name: 'Whitepaper', link: '/rug#whitepaper' },
				{
					name: 'Composer Action',
					link: 'https://warpcast.com/~/developers/composer-actions?name=keccak-256&postUrl=https%3A%2F%2Fkeccak256-composer-action.artlu.workers.dev'
				},
				{
					name: 'Cast Action',
					link: 'https://warpcast.com/~/add-cast-action?url=https%3A%2F%2Fkeccak256-composer-action.artlu.workers.dev%2Fcast-action'
				},
				{ name: 'GraphQL API', link: 'https://whistles.artlu.xyz/graphql' }
			]
		}
	],
	navActions: [{ name: 'Try it now', link: '/', style: 'primary', size: 'lg' }]
}
