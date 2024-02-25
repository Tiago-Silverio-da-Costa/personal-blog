
import { Filters, TFilterOptions } from "./filter";
import { TPaginationParams } from "./admin/utils";
import Image from "next/image";
import Link from "next/link";
import Pagination from "./pagination";
import localFont from "next/font/local";
import { IoMdSearch } from "react-icons/io";
import Search from "./search";

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
      description: "Do meu primeiro dia até agora, cresci constantemente na programação, dominando novas habilidades e superando desafios. Estou ansioso para continuar evoluindo neste campo tecnológico dinâmico."
    },
    {
      title: "Retrospectiva do meu primeiro dia ao atual",
      description: "Do meu primeiro dia até agora, cresci constantemente na programação, dominando novas habilidades e superando desafios. Estou ansioso para continuar evoluindo neste campo tecnológico dinâmico."
    },
    {
      title: "Retrospectiva do meu primeiro dia ao atual",
      description: "Do meu primeiro dia até agora, cresci constantemente na programação, dominando novas habilidades e superando desafios. Estou ansioso para continuar evoluindo neste campo tecnológico dinâmico."
    },
    {
      title: "Retrospectiva do meu primeiro dia ao atual",
      description: "Do meu primeiro dia até agora, cresci constantemente na programação, dominando novas habilidades e superando desafios. Estou ansioso para continuar evoluindo neste campo tecnológico dinâmico."
    },
    {
      title: "Retrospectiva do meu primeiro dia ao atual",
      description: "Do meu primeiro dia até agora, cresci constantemente na programação, dominando novas habilidades e superando desafios. Estou ansioso para continuar evoluindo neste campo tecnológico dinâmico."
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
    <section className="flex flex-col gap-6 bg-primary/10 py-8 min-h-screen mx-auto w-5/6 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-end md:items-center">
        <Search />
        <Filters menuOptions={filterMenuOptions} />
      </div>

      {
        articleProps.map((art, idx) => (
          <Link href="/article" key={idx} className="flex gap-6 px-6 py-4 border-third border cursor-pointer transition-all duration-200 hover:border-secondaryText">
            <div className="flex flex-col gap-2">
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