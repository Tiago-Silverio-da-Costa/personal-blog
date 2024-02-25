
import { Filters, TFilterOptions } from "./filter";
import { TPaginationParams } from "./admin/utils";
import Image from "next/image";
import Link from "next/link";
import Pagination from "./pagination";
import localFont from "next/font/local";
import { IoMdSearch } from "react-icons/io";

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

interface IArticleProps {
  title: string;
  image: string;
  description: string;
}

export default function ArticleItem({
  paginationParams,
  searchParams,
}: {
  paginationParams?: TPaginationParams;
  searchParams?: { [key: string]: string | undefined };
}) {

  const articleProps: IArticleProps[] = [
    {
      title: "Retrospectiva do meu primeiro dia ao atual",
      image: "/thumb.jpg",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
      title: "Retrospectiva do meu primeiro dia ao atual",
      image: "/thumb.jpg",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
      title: "Retrospectiva do meu primeiro dia ao atual",
      image: "/thumb.jpg",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
      title: "Retrospectiva do meu primeiro dia ao atual",
      image: "/thumb.jpg",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
      title: "Retrospectiva do meu primeiro dia ao atual",
      image: "/thumb.jpg",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
  ]

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
    <section className="flex flex-col gap-6 bg-primary/10 p-8 min-h-screen mx-auto w-5/6 max-w-5xl">
      <div className="flex gap-6 justify-between items-center">
        <div className="group">
          <div className=" flex items-center border-b border-b-third group-hover:border-b-secondary pb-4">
            <IoMdSearch className="group-hover:text-secondary text-secondaryText" />
            <input
              className="placeholder:group-hover:text-secondary bg-transparent pl-2 placeholder:text-secondaryText outline-none"
              placeholder="Pesquisa"
            />
          </div>
        </div>
        <Filters menuOptions={filterMenuOptions} />
      </div>

      {
        articleProps.map((art, idx) => (
          <Link href="/article" key={idx} className="flex gap-6 border-third border cursor-pointer transition-all duration-200 hover:border-secondaryText">
            <Image src={art.image} alt="article thumb" width={200} height={200} />
            <div className="flex flex-col gap-2 pr-6 py-4">
              <h1 className={`${satoshi.className} text-2xl font-bold text-secondary`}>{art.title}</h1>
              <p className="text-secondaryText">{art.description}</p>
              <div className="flex justify-between">
                <p className="text-xs text-secondaryText">#tags</p>
                <p className="text-xs text-secondaryText">14:40 24/02/2024</p>
              </div>
            </div>
          </Link>
        ))
      }
      <Pagination
        pathname={"/admin/administracao/assinaturas"}
        searchParams={searchParams}
      />
    </section>
  )
}