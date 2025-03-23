// Navigation Bar
// ------------
// Description: The navigation bar data for the website.
export interface Logo {
	src: string;
	alt: string;
	text: string;
}

export interface NavSubItem {
	name: string;
	link: string;
}

export interface NavItem {
	name: string;
	link: string;
	submenu?: NavSubItem[];
}

export interface NavAction {
	name: string;
	link: string;
	style: string;
	size: string;
}

export interface NavData {
	logo: Logo;
	navItems: NavItem[];
	navActions: NavAction[];
}

export const navigationBarData: NavData = {
	logo: {
		src: "/logo.svg",
		alt: "Decentralized Whistles Protocol",
		text: "SassyHash",
	},
	navItems: [
		{ name: "🏆", link: "https://warpcast.com/~/frames/launch?domain=gib-rewards.artlu.xyz" },
		{ name: "Blog", link: "/blog" },
		{
			name: "Resources",
			link: "#",
			submenu: [
				{ name: "See Disabled Channels", link: "/nospam" },
				{ name: "See Enabled Channels", link: "/channels" },
				{ name: "Manage My Channels", link: "/manage" },
				{ name: "Download My Own Data", link: "/download" },
				{ name: "Anonymized Analytics", link: "/dashboard" },
			],
		},
		{
			name: "Developers",
			link: "#",
			submenu: [
				{ name: "Quick Start", link: "/blog/developer-journey" },
				{ name: "GraphQL API", link: "https://whistles.artlu.xyz/graphql" },
				{ name: "Changelog", link: "/changelog" },
			],
		},
	],
	navActions: [],
};
