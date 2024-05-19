import { ReadonlyURLSearchParams } from "next/navigation";

export type TPaginationParams = ReturnType<typeof getPaginationParams>;
export function getPaginationParams(
  searchParams?:
    | ReadonlyURLSearchParams
    | URLSearchParams
    | { [key: string]: string | undefined }
) {
  var initPage: string | undefined | null;
  var initPerPage: string | undefined | null;
  var initSearch: string | undefined | null;
  var initSort: string | undefined | null;

  if (
    searchParams instanceof ReadonlyURLSearchParams ||
    searchParams instanceof URLSearchParams
  ) {
    initPage = searchParams?.get("page");
    initPerPage = searchParams?.get("PerPage");
    initSearch = searchParams?.get("search");
    initSort = searchParams?.get("sort");
  } else {
    initPage = searchParams?.page;
    initPerPage = searchParams?.perPage;
    initSearch = searchParams?.search;
    initSort = searchParams?.sort;
  }

  const page =
    initPage && !isNaN(Number(initPage)) && Number(initPage) > 0
      ? Number(initPage)
      : 1;
  const perPage =
    initPerPage &&
    !isNaN(Number(initPerPage)) &&
    Number(initPerPage) > 0 &&
    Number(initPerPage) <= 100
      ? Number(initPerPage)
      : undefined;
  const search = initSearch && initSearch != "" ? initSearch : undefined;
  const sort = initSort ? initSort.toLowerCase() : undefined;

  return {
    sort,
    page,
    perPage,
    search,
  };
}

export function getQueryParams(
  params?: {
    [key: string]: string | number | undefined | null;
  },
  searchParams?: ReadonlyURLSearchParams
) {
  var search: {
    [key: string]: string | number | undefined | null;
  } = {};

  if (searchParams)
    searchParams.forEach((value, key) => {
      search[key] = value;
    });

  return Object.entries({ ...search, ...params }).reduce(
    (acc, [key, value]) => {
      if (value) {
        if (key == "status" && value == "selecione") return acc;
        if (key == "page" && value == "1") return acc;

        return { ...acc, [key]: value.toString() };
      }
      return acc;
    },
    {} as { [key: string]: string }
  );
}

export type TCustomFilterParams = ReturnType<typeof getCustomFilterParams>;
export function getCustomFilterParams(
  searchParams?:
    | ReadonlyURLSearchParams
    | URLSearchParams
    | { [key: string]: string | undefined }
) {
  var initUser: string | undefined | null;

  if (
    searchParams instanceof ReadonlyURLSearchParams ||
    searchParams instanceof URLSearchParams
  ) {
    initUser = searchParams?.get("user");
  } else {
    initUser = searchParams?.user;
  }

  const user = initUser ?? undefined;

  return {
    user,
  };
}
