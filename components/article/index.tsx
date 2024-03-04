import Image from "next/image";
import localFont from "next/font/local";
import prisma from "@/adapter/prisma"
import { Fragment } from "react";

const albra = localFont({
  src: [
    {
      path: "../../public/fonts/AlbraSansLightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/AlbraSansTRIAL-Regular-Italic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/AlbraSansTRIAL-Bold-Italic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/fonts/AlbraTextTRIAL-Black-Italic.otf",
      weight: "900",
      style: "italic",
    },
  ],
})

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

async function getData({id}: {id: string}) {

  const data = await prisma.post.findFirst({
    where: {
      id: id
    },
    select: {
      title: true,
      subtitle: true,
      theme: true,
      author: true,
      profission: true,
      content: true,
    }
  })
  return data
}

async function ArticleHead({id}: {id: string}) {
  const data = await getData({id})

  if (!data) return

  return (
    <div className="flex flex-col border-b-2 border-b-secondary/50 pb-6">
      <div className="flex items-center gap-4">
        <p className={`${satoshi.className} rounded-lg uppercase border border-secondary px-4 py-2 font-medium text-secondary text-xs tracking-tighter`}>{data.theme}</p>
        <p className={`${satoshi.className} uppercase font-light text-xs text-secondary tracking-tighter`}>9 minutos de leitura</p>
      </div>

      <div className="flex flex-col">
        <h1 className={`${albra.className} mt-8 italic pl-1 text-5xl font-medium text-secondary tracking-tighter leading-10 md:leading-6`}>
          {data.title}
        </h1>
        <span className={`${satoshi.className} max-w-[40rem] mt-2 text-5xl not-italic font-medium text-secondary tracking-tighter leading-10 md:leading-[3rem]`}>{data.subtitle.charAt(0).toUpperCase() + data.subtitle.slice(1)}</span>
      </div>

      <div className="flex items-center gap-4 mt-8">
        <Image className="rounded-full border-2 border-secondary scale-90" src={data.author?.profileImage as string} alt="Autor" width={50} height={50} />
        <div className="flex flex-col gap-2">
          <p className={`${satoshi.className} text-sm text-secondary font-normal tracking-tighter leading-4`}>{data.author?.name}</p>
          <p className="text-xs text-secondary font-light tracking-tighter uppercase leading-3">{data.profission?.name}</p>
        </div>
      </div>
    </div>
  )
}

async function ArticleBody({id}: {id: string}) {
  const data = await getData({id})

  if (!data) return

  return (
    <div className="mx-auto w-5/6 max-w-3xl mt-16">
      <p className="text-lg tracking-tighter leading-6">
        {data.content?.split("  ").map((paragraph, index) => (
          <Fragment key={index}>
            {paragraph}
            <br />
            <br />
          </Fragment>
        ))}
      </p>
    </div>
  )
}

export default function Article({id}: {id: string}) {

  return (
    <div className="mx-auto w-5/6 max-w-5xl py-6">
      <ArticleHead id={id} />
      <ArticleBody id={id} />
      
    </div>
  )
}