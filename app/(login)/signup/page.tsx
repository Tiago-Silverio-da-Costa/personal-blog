
import Link from "next/link";
import { FormFieldGrp, FormFieldWrapper, LoginBtn } from "@/styles/createBlogForms";
import { authOptions } from "@/adapter/nextAuth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import GithubSignInButton from "@/components/githubBtn";

export default async function Signup() {

  const session = await getServerSession(authOptions)

  if (session) {
    return redirect("/")
  }

  return (
    <section className="rounded border-b-third border-b m-auto min-h-[80vh] flex flex-col justify-center items-center">
      <form className="flex flex-col items-center" method="post" action="/api/auth/signin">
        <h1 className="text-3xl font-semibold text-white w-fit">
          Cadastro
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
        Já tem uma conta? <Link className="text-white hover:underline" href="/login">Entre agora!</Link>
      </div>

      <div className="flex w-full justify-center items-center gap-x-3 mt-6">
        <GithubSignInButton />
      </div>
    </section>
  )
}