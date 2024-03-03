import Link from "next/link";
import GoogleIcon from "../../../public/google.svg"
import Image from "next/image"
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FaGithub } from "react-icons/fa6";
import { authOptions } from "@/lib/auth";

export default async function Signup() {
  const session = await getServerSession(authOptions)

  if (session) {
    return redirect("/")
  }

  return (
    <div className="mt-24 rounded bg-black/80 py-10 px-6 md:mt-0 md:max-w-sm md:px-14">
      <form method="post" action="/api/auth/signin">
        <h1 className="text-3xl font-semibold text-white">Sign Up</h1>
        <div className="space-y-4 mt-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="bg-[#333] placeholder:text-xs placeholder:text-gray-400 w-full inline-block"
          />
          <button
            className="w-full bg-[#e50914]">Sign Up</button>
        </div>
      </form>

      <div className="text-gray-500 text-sm mt-2">
        Already Have a account? <Link className="text-white hover:underline" href="/login">Log in now!</Link>
      </div>

      <div className="flex w-full justify-center items-center gap-x-3 mt-6">
        <button
        >
          <FaGithub className="w-4 h-4" />
        </button>
        <button
        >
          <Image
            src={GoogleIcon}
            alt="google icon"
            className="w-6 h-6"
          />
        </button>
      </div>
    </div>
  )
}