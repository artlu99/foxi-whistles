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
				{ name: 'Manage My Channels', link: '/' },
				{ name: 'Download My Whistles Casts', link: '/' },
				{ name: 'Contact', link: '/contact' }
			]
		},
		{ name: 'Blog', link: '/blog' },
		{ name: 'Changelog', link: '/changelog' },
		{
			name: 'Developers',
			link: '#',
			submenu: [
				{ name: 'Introduction', link: '/developers#introduction' },
				{ name: 'Whitepaper', link: '/developers#whitepaper' },
				{ name: 'Getting Started', link: '/developers#getting-started' },
				{ name: 'Examples', link: '/developers#examples' },
				{ name: 'Composer Action', link: '/developers#composer-action' },
				{ name: 'Cast Action', link: '/developers#cast-action' },
				{ name: 'Whistles GQL API', link: '/developers#whistles-gql-api' },
			]
		},
	],
	navActions: [{ name: 'Try it now', link: '/', style: 'primary', size: 'lg' }]
}
