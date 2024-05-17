import { getCustomFilterParams, getPaginationParams } from "@/components/admin/utils";
import ArticleItem from "@/components/articleItem";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Pagination from "@/components/pagination";
import Search from "@/components/search";
import { getArticles } from "./api/utils";
import { Filters, TFilterOptions } from "@/components/filter";

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {

  const paginationParams = getPaginationParams(searchParams);
  const customFilterParams = getCustomFilterParams(searchParams);

  const { data: articleData, count } = await getArticles({
    paginationParams,
    customFilterParams,
  });

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
      selected: !!perPage ? perPage : 5,
      options: {
        5: 5,
        10: 10,
        25: 25,
        50: 50
      },
    },
  ]

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center py-8">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-end md:items-center mx-auto w-5/6 max-w-5xl">
          <Search />

          <Filters menuOptions={filterMenuOptions}
          />
        </div>
        {articleData.length > 0 ? (
          <ArticleItem articles={articleData} />
        ) : (
          <p className="flex items-center min-h-screen">Nenhum artigo encontrado</p>
        )}
        <Pagination
          pathname={"/"}
          searchParams={searchParams}
          valuesCount={count}
        />
      </div>
      <Footer />
    </>
  );
}
