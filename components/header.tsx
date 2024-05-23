"use client"

import Link from "next/link";
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

export default function Header({ id }: { id?: string }) {
 

  return (
    <section className="border-b-third border-b">
      <div className="flex justify-between items-center mx-auto w-5/6 max-w-5xl py-4">
        <Link href="/" className={`text-2xl font-bold ${satoshi.className}`}>Blog</Link>
        <div className="flex items-center gap-4">
          {!id && (
            <CreatePost />
          )}
          {id && (
            <>
              <DeletePost id={id}  />
              <EditPost id={id} />
            </>
          )}

        </div>
      </div >
    </section >
  )
}