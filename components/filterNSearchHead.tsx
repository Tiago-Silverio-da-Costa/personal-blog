import Search from "@/components/search";
import { Filters, TFilterOptions } from "@/components/filter";
import { TPaginationParams } from "./admin/utils";

export default function FilterNSearchHead({ paginationParams }: { paginationParams: TPaginationParams }) {

  const { sort, perPage } = paginationParams;
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
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 justify-between items-end md:items-center mx-auto w-5/6 max-w-5xl">
      <Search />

      <Filters menuOptions={filterMenuOptions}
      />
    </div>
  )
}