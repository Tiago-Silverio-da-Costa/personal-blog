import AuthorRegister from "@/components/authorRegister";
import Footer from "@/components/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  description: "Cadastre-se como autor no blog",
  metadataBase: new URL("https://partidomissao.com/login"),
  openGraph: {
    title: "Blog – Cadastro Exclusivo",
    description: "Cadastre-se como autor no blog",
    siteName: "Blog",
    images: [
      {
        url: "https://something.com/missao-banner.jpg",
        width: 1280,
        height: 720,
      },
    ],
    locale: "pt-BR",
    type: "website",
  },
  robots: {
    index: false,
  },
  themeColor: "#18181b",
  twitter: {
    card: "summary_large_image",
    title: "Blog – Cadastro Exclusivo",
    description: "Cadastre-se como autor no blog",
    creator: "@tiagosc",
    images: ["https://partidomissao.com/missao-banner.jpg"],
  }
};

export default function Index() {
  return (
    <div className="flex flex-col">
      <AuthorRegister />
      <Footer />
    </div>
  )
}