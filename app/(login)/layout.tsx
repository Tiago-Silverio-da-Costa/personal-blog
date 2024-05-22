import Footer from "@/components/footer";
import Header from "@/components/header";
import { Metadata, Viewport } from "next";
 
export const viewport: Viewport = {
  themeColor: "#10100e",
}

export const metadata: Metadata = {
  description: "Cadastre-se como autor no blog",
  metadataBase: new URL("https://partidomissao.com/login"),
  openGraph: {
    title: "Blog – Cadastro Exclusivo",
    description: "Cadastre-se como autor no blog",
    siteName: "Blog",
    images: [
      {
        url: "https://personal-blog-cmsn.vercel.app/blog-banner.jpg",
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
  twitter: {
    card: "summary_large_image",
    title: "Blog – Cadastro Exclusivo",
    description: "Cadastre-se como autor no blog",
    creator: "@tiagosc",
    images: ["https://personal-blog-cmsn.vercel.app/blog-banner.jpg"],
  }
};

export default function LoginLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}