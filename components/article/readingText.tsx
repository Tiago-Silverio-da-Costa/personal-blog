"use client"

import { useEffect, useState } from "react";
import localFont from "next/font/local";

const satoshi = localFont({
  src: [
    {
      path: "../../public/fonts/Satoshi-Italic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/Satoshi-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
})

export default function ReadingText({ content }: { content: string }) {
  const [readingTime, setReadingTime] = useState<number>(0)

  useEffect(() => {
  const readingTimeInMin = (text: string) => {
    const wordsPerMinute = 225;
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wordsPerMinute);
    setReadingTime(time)
  }
  readingTimeInMin(content)
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []) 

  return (
    <p className={`${satoshi.className} uppercase font-light text-xs text-secondary tracking-tighter`}>{readingTime} minutos de leitura</p>
  )
}