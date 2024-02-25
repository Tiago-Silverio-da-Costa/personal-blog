import { TPaginationDisabledItem, TPaginationItem, TPaginationWrapper } from "@/styles/pagination";
import { getPaginationParams, getQueryParams } from "./admin/utils";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";

export default function Pagination({
  pathname,
  searchParams,
  valuesCount
}: {
  pathname: string;
  searchParams?: { [key: string]: string | undefined };
  valuesCount?: number;
}) {
  const paginationParams = getPaginationParams(searchParams);
  const queryParams = getQueryParams({ ...searchParams, ...paginationParams })

  if (queryParams.page) delete queryParams.page;

  const currentPage = paginationParams.page;
  const valuesPerPage = paginationParams.perPage;

  const pagesCount = Math.ceil(
    // valuesCount /
   (valuesPerPage ?? 10));

  const startPage =
    pagesCount < 5
      ? 1
      : currentPage > pagesCount - 2
        ? pagesCount - 4
        : currentPage > 2
          ? currentPage - 2
          : currentPage > 1
            ? currentPage - 1
            : 1;
  const pages = Array.from(
    { length: Math.min(pagesCount, 5) },
    (_, i) => i + startPage
  )

  return (
    <TPaginationWrapper>
      {currentPage > 1 && (
        <TPaginationItem
          href={{
            pathname,
            query: { ...queryParams },
          }}
        >
          <MdKeyboardDoubleArrowLeft />
        </TPaginationItem>
      )}
      {pages.map((page) =>
        page === currentPage ? (
          <TPaginationDisabledItem href="" key={page}>
            {page}
          </TPaginationDisabledItem>
        ) :
          (
            <TPaginationItem
              key={page}
              href={{
                pathname,
                query: { ...queryParams, page: page !== 1 ? page : undefined }
              }}
            >
              {page}
            </TPaginationItem>
          ))}
      {currentPage < pagesCount && (
        <TPaginationItem
          href={{
            pathname,
            query: {
              ...queryParams,
              page: pagesCount
            }
          }}
        >
          <MdKeyboardDoubleArrowRight />
        </TPaginationItem>
      )}
    </TPaginationWrapper>
  )
}