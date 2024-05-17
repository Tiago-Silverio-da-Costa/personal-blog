"use client"

import Link from "next/link";
import { TbBrandWhatsapp } from "react-icons/tb";
import { DeletePost } from "./deletePost";
import { CreatePost } from "./createPost";
import localFont from "next/font/local";
import EditPost from "./editPost";

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

export default function Header({ id }: { id: string }) {

  return (
    <section className="border-b-third border-b">
      <div className="flex justify-between items-center mx-auto w-5/6 max-w-5xl py-4">
        <Link href="/" className={`text-2xl font-bold ${satoshi.className}`}>Blog</Link>
        <div className="flex items-center gap-4">
          <a href={`https://api.whatsapp.com/send?phone=${process.env.NUMBER}&text=Oi,%20Tudo%20bem!`} className={`${satoshi.className}flex items-center justify-center text-primary bg-secondary transition-all duration-200 hover:opacity-75 px-6 py-2 font-bold text-2xl`}><TbBrandWhatsapp /></a>

          {!id && (
            <CreatePost />
          )}
          {id && (
            <>
              <DeletePost id={id} />
              <EditPost id={id} />
            </>
          )}

        </div>
      </div >
    </section >
  )
}