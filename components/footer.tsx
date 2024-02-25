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

export default function Footer() {
  return (
    <section className="border-t-third border-t">
      <div className="flex justify-between items-center mx-auto w-5/6 max-w-5xl py-8">
        <h1 className={`text-sm font-bold ${satoshi.className}`}>Blog</h1>
        <h1 className={`text-sm font-bold ${satoshi.className}`}>© {new Date().getFullYear()} | Tiago S.C.</h1>
      </div>
    </section>
  )
}