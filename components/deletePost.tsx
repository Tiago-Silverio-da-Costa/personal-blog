"use client";

import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import localFont from "next/font/local";

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

export function DeletePost({ id }: { id: string }) {


  const router = useRouter();

  const deletePost = async () => {



    const response = await fetch("/api/deletepost", {
      credentials: "include",
      cache: "no-cache",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id,
      })
    })
    if (response.ok) {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <>
      <div
        onClick={() => deletePost()}
        className={`${satoshi.className} transition-all duration-200 hover:opacity-75 cursor-pointer flex items-center justify-center text-primary bg-secondary px-6 py-2 font-bold text-2xl`}
      ><FaTrash /></div>
    </>
  )
}