
import { Filters, TFilterOptions } from "./filter";
import { TPaginationParams } from "./admin/utils";
import Link from "next/link";
import Pagination from "./pagination";
import localFont from "next/font/local";
import Search from "./search";
import prisma from "@/adapter/prisma"
import momentTz from "moment-timezone";

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

async function getData() {

  const data = await prisma.post.findFirst({
    select: {
      title: true,
      theme: true,
      content: true,
      createdAt: true
    }
  })
  return data
}

export default async function ArticleItem({
  paginationParams,
  searchParams,
}: {
  paginationParams?: TPaginationParams;
  searchParams?: { [key: string]: string | undefined };
}) {

  const data = await getData()

  if (!data) return

  const { sort, perPage } = paginationParams || {}
  const filterMenuOptions: TFilterOptions[] = [
    {
      label: "Ordernar por",
      slug: "sort",
      selected:
        sort == "last" || sort == "fisrt" || sort == "name" ? sort : "last",
      options: {
        last: "Últimas",
        first: "Primeiras",
        name: "Nome",
      },
    },
    {
      label: "Mostrar",
      slug: "perPage",
      selected: !!perPage ? perPage : 10,
      options: {
        10: 10,
        25: 25,
        50: 50,
        100: 100
      },
    },
  ]

  return (
    <section className="flex flex-col gap-6 bg-primary/10 py-8 min-h-screen mx-auto w-5/6 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-end md:items-center">
        <Search />
        <Filters menuOptions={filterMenuOptions} />
      </div>
      <Link href="/article" className="flex gap-6 px-6 py-4 border-third border cursor-pointer transition-all duration-200 hover:border-secondaryText">
        <div className="flex flex-col gap-2">
          <h1 className={`${satoshi.className} text-2xl font-bold text-secondary`}>{data.title}</h1>
          <p className="text-secondaryText line-clamp-2">{data.content}</p>
          <div className="flex justify-between">
            <p className="text-xs text-secondaryText">#{data.theme}</p>
            <p className="text-xs text-secondaryText">
              {momentTz(data.createdAt)
                .tz("America/Sao_Paulo")
                .format("DD/MM/YYYY HH:mm:ss")}
            </p>
          </div>
        </div>
      </Link>
      <Pagination
        pathname={"/admin/administracao/assinaturas"}
        searchParams={searchParams}
      />
    </section>
  )
}