"use client";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";

export default function GithubSignInButton() {
  return (
    <button
      className="text-white text-2xl transition-all duration-200 hover:opacity-75"
      type="submit"
      onClick={() => signIn("github")}
    ><FaGithub />
    </button>
  )
}