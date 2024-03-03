"use client";

import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa6";

export default function GithubSignInButton() {
  return (
    <button
      onClick={() => signIn("github")}
    >
      <FaGithub  className="w-4 h-4" />
    </button>
  )
}