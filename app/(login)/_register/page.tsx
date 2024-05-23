import AuthorRegister from "@/components/login/register/index";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personal blog – Fazer cadastro",
}

export default function Index() {
  return (
    <AuthorRegister />
  )
}