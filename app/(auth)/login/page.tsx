import GithubSignInButton from "@/components/githubSigingBtn";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await getServerSession(authOptions)

  // if (session) {
  //   return redirect("/")
  // }

  return (
    <div className="mt-24 rounded bg-black/80 py-10 px-6 md:mt-0 md:max-w-sm md:px-14">
      <form method="post" action="/api/auth/signin">
        <h1 className="text-3xl font-semibold text-white">Log in</h1>
        <div className="space-y-4 mt-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="bg-[#333] placeholder:text-xs placeholder:text-gray-400 w-full inline-block"
          />
          <button
            type="submit"
            className="w-full bg-[#e50914]">Log in</button>
        </div>
      </form>

      <div className="text-gray-500 text-sm mt-2">
        New to netflix? <Link className="text-white hover:underline" href="/signup">Sign up in now!</Link>
      </div>

      <div className="flex w-full justify-center items-center gap-x-3 mt-6">
        <GithubSignInButton />
      </div>
    </div>
  )
}