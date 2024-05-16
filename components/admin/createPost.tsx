import { FaPlus } from "react-icons/fa6";
import localFont from "next/font/local";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const satoshi = localFont({
  src: [
    {
      path: "../../public/fonts/Satoshi-Italic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/Satoshi-Regular.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
})

export default async function CreatePostButon() {
  const session = await getServerSession(authOptions);


  return (
    <>
      {
        session  && (
          <div
            // onClick={() => SetOpenPopup(!openPopup)}
            className={`${satoshi.className} transition-all duration-200 hover:opacity-75 cursor-pointer flex items-center justify-center text-primary bg-secondary px-6 py-2 font-bold text-2xl`}
          ><FaPlus /></div>
        )
      }
    </>
  )
}