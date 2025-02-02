// Social Links
// ------------
// Description: The social links data for the website.

export interface SocialLink {
	name: string;
	link: string;
	icon: string;
}

export const socialLinks: SocialLink[] = [
	{
		name: "farcaster",
		link: "https://warpcast.com/bcbhshow.eth/0x84ebc0cf",
		icon: "fb-icon",
	},
	{
		name: "github",
		link: "https://github.com/artlu99/keccak256-composer-action",
		icon: "discord-icon",
	},
	{
		name: "twitter",
		link: "https://x.com/artlu99",
		icon: "twitter-icon",
	},
];
