import { Inter } from "next/font/google";
import "@/styles/globals.css";
import StyledComponentsRegistry from "@/lib/styledRegistry";
import AuthSessionProvider from "@/lib/authSessionRegistry";
import type { Metadata, Viewport } from "next";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
	themeColor: "#10100e",
};

export const metadata: Metadata = {
	title:
		"TiagoSC – Blog | artigos sobre tecnologia, programação e desenvolvimento web.",
	metadataBase: new URL("https://tiagosc-blog.com.br"),
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
				url: "https://tiagosc-blog.com.br/tiagosc-blog.png",
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
		images: ["https://tiagosc-blog.com.br/tiagosc-blog.png"],
	},
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {

	return (
		<html lang="en">
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
