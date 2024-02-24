import localFont from "next/font/local";

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


export default function Header() {
  return (
    <section className="border-b-third border-b">
      <div className="flex justify-between items-center mx-auto w-5/6 max-w-5xl py-4">
        <h1 className={`text-2xl font-bold ${satoshi.className}`}>Blog</h1>
        <a href="" className={`${satoshi.className}flex items-center justify-center text-primary bg-secondary hover:bg-secondary/50 transition-all duration-500 px-12 py-3 font-bold`}>Contato</a>
      </div>
    </section>
  )
}