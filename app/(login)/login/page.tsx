import { authOptions } from "@/adapter/nextAuth";
import GithubSignInButton from "@/components/githubBtn";
import { FormFieldGrp, FormFieldWrapper, LoginBtn } from "@/styles/createBlogForms";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Personal blog – Fazer Login",
}

export default async function Index() {
  const session = await getServerSession(authOptions)

  if (session) {
    return redirect("/")
  }

  return (
    <section className="rounded border-b-third border-b m-auto min-h-[80vh] flex flex-col justify-center items-center">
      <form className="flex flex-col items-center" method="post" action="/api/auth/signin">
        <h1 className="text-3xl font-semibold text-white w-fit">
          Login
        </h1>
        <div className="space-y-4 mt-5">
          <FormFieldWrapper>
            <FormFieldGrp>
              <input
                type="email"
                name="email"
                placeholder="Email"
                maxLength={24}
              />
            </FormFieldGrp>
          </FormFieldWrapper>
          <LoginBtn
            type="submit"
          >
            <span className="font-bold">Entrar</span>
          </LoginBtn>
        </div>
      </form>

      <div className="text-gray-500 text-sm mt-2">
        Novo? <Link className="text-white hover:underline" href="/signup">Cadastre-se agora!</Link>
      </div>

      <div className="flex w-full justify-center items-center gap-x-3 mt-6">
        <GithubSignInButton />
      </div>
    </section>
  )
}