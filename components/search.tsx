"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form"
import { getPaginationParams, getQueryParams } from "./admin/utils";
import { IoMdSearch } from "react-icons/io";

export default function Search() {
  const router = useRouter();
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const paginationParams = getPaginationParams(searchParams)
  const queryParams = getQueryParams(paginationParams, searchParams)

  if (queryParams.page) delete queryParams.page;

  const initalSearch = searchParams?.get("search") ?? "";

  const { register, handleSubmit, watch } = useForm({
    values: {
      search: initalSearch,
    },
    resetOptions: {
      keepTouched: false,
    }
  })

  const searchOrClear = !initalSearch
    ? "search"
    : (watch("search") == initalSearch && initalSearch != "") ||
      (watch("search") == "" && initalSearch != "")
      ? "clear"
      : "search";

  function handleSearch(data: FieldValues) {
    const search = data.search;

    if (searchOrClear == "search" && search && search != "") {
      const queryUrl = new URLSearchParams({ ...queryParams, search })
      router.push(`${pathname}?${queryUrl.toString()}`);
    } else {
      if (queryParams.search) delete queryParams.search;
      if (Object.keys(queryParams).length == 0) {
        router.push(`${pathname}`)
      } else {
        const queryUrl = new URLSearchParams(queryParams)
        router.push(`${pathname}?${queryUrl.toString()}`)
      }
    }
  }

  return (
    <div className="group w-full md:w-fit">
      <form onSubmit={handleSubmit(handleSearch)} className=" flex items-center border-b border-b-third group-hover:border-b-secondary pb-4">
        <button type="submit">
          <IoMdSearch className="group-hover:text-secondary text-secondaryText" />
        </button>
        <input
          className="placeholder:group-hover:text-secondary bg-transparent pl-2 placeholder:text-secondaryText outline-none"
          placeholder="Pesquisa"
          {...register("search")}
        />
      </form>
    </div>
  )
}