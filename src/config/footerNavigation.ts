// Footer Navigation
// ------------
// Description: The footer navigation data for the website.
export interface Logo {
	src: string;
	alt: string;
	text: string;
}

export interface FooterAbout {
	title: string;
	aboutText: string;
	logo: Logo;
}

export interface SubCategory {
	subCategory: string;
	subCategoryLink: string;
}

export interface FooterColumn {
	category: string;
	subCategories: SubCategory[];
}

export interface SubFooter {
	copywriteText: string;
}

export interface FooterData {
	footerAbout: FooterAbout;
	footerColumns: FooterColumn[];
	subFooter: SubFooter;
}

export const footerNavigationData: FooterData = {
	footerAbout: {
		title: "SassyHash",
		aboutText:
			"SassyHash leverages cryptographic building blocks and the open Farcaster Protocol, to share restricted-distribution information in self-sovereign, transparent, and sufficiently decentralized blah blah.",
		logo: {
			src: "/logo.svg",
			alt: "SassyHash",
			text: "SassyHash.",
		},
	},
	footerColumns: [
		{
			category: "Developers",
			subCategories: [
				{
					subCategory: "Quick Start",
					subCategoryLink: "/blog/developer-journey",
				},
				{
					subCategory: "GraphQL API",
					subCategoryLink: "https://whistles.artlu.xyz/graphql",
				},
			],
		},
	],
	subFooter: {
		copywriteText: "© SassyHash 2025.",
	},
};
