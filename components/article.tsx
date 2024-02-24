
import localFont from "next/font/local";
import { TFilterOptions } from "./filter";

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

export default function Article(
//   {
//   paginationParams
// }: {
//   paginationParams: TPaginationParams;
// }
) {

  // const { sort, perPage } = paginationParams;
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
    <div className="bg-primary w-fit px-8 py-4">
      <div className="flex flex-col gap-2">
        <h1 className={`${satoshi.className} text-2xl font-bold text-secondary`}>Retrospectiva do meu primeiro dia ao atual</h1>
        <p className="text-xs text-slate-100/50">#tags</p>
      </div>
      {/* image */}
    </div>
  )
}