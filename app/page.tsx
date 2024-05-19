import { getCustomFilterParams, getPaginationParams } from "@/components/admin/utils";
import ArticleItem from "@/components/articleItem";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Pagination from "@/components/pagination";
import { getArticles } from "./api/utils";
import FilterNSearchHead from "@/components/filterNSearchHead";

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

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center py-8">
        <FilterNSearchHead paginationParams={paginationParams} />

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
