import { Inter } from "next/font/google";
import "@/styles/globals.css";
import StyledComponentsRegistry from "@/lib/styledRegistry";
import AuthSessionProvider from "@/lib/authSessionRegistry";
import type { Metadata, Viewport } from "next";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
	themeColor: "#10100e",
};

export const metadata: Metadata = {
	title:
		"TiagoSC – Blog | artigos sobre tecnologia, programação e desenvolvimento web.",
	metadataBase: new URL("https://personal-blog-cmsn.vercel.app"),
	description:
		"Blog pessoal com artigos sobre tecnologia, programação e desenvolvimento web.",
	openGraph: {
		title:
			"TiagoSC – Blog | artigos sobre tecnologia, programação e desenvolvimento web.",
		description:
			"Blog pessoal com artigos sobre tecnologia, programação e desenvolvimento web.",
		siteName: "TiagoSC – Blog ",
		images: [
			{
				url: "https://personal-blog-cmsn.vercel.app/tiagosc-blog.png",
				width: 1280,
				height: 720,
			},
		],
		locale: "pt-BR",
		type: "website",
	},
	robots: {
		index: process.env.VERCEL_ENV === "production",
	},
	twitter: {
		card: "summary_large_image",
		title:
			"TiagoSC – Blog | artigos sobre tecnologia, programação e desenvolvimento web.",
		description:
			"Blog pessoal com artigos sobre tecnologia, programação e desenvolvimento web.",
		images: ["https://personal-blog-cmsn.vercel.app/tiagosc-blog.png"],
	},
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {

	return (
		<html lang="en">
			<Script
				src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_KEY}`}
			/>
			<body className={inter.className}>
				<StyledComponentsRegistry>
					<AuthSessionProvider>
						{children}
					</AuthSessionProvider>
				</StyledComponentsRegistry>
			</body>
		</html >
	);
}
