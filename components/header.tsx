import localFont from "next/font/local";
import Link from "next/link";
import { TbBrandWhatsapp } from "react-icons/tb";

const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/Satoshi-Italic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/Satoshi-Regular.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
})


export default function Header() {
  const number = "+55 11 98239-1118" // pegar do banco

  return (
    <section className="border-b-third border-b">
      <div className="flex justify-between items-center mx-auto w-5/6 max-w-5xl py-4">
        <Link href="/" className={`text-2xl font-bold ${satoshi.className}`}>Blog</Link>
        <a href={`https://api.whatsapp.com/send?phone=${number}&text=Oi,%20Tudo%20bem!`} className={`${satoshi.className}flex items-center justify-center text-primary bg-secondary px-6 py-2 font-bold text-2xl`}><TbBrandWhatsapp /></a>
      </div>
    </section>
  )
}