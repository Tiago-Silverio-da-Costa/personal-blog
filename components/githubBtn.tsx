import { signIn } from "next-auth/react";

export default function GithubSignInButton() {
  return (
    <button
      className="text-white"
      type="submit"
      onClick={() => signIn("github")}
    >Signin with GitHub
    </button>
  )
}