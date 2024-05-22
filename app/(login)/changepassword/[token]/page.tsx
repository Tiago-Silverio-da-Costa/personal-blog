import { validateForgotPasswordToken } from "@/app/api/login/utils";
import ChangePassword from "@/components/login/changepassword";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Missão – Trocar Senha",
};

export default async function Index({
  params: { token },
}: {
  params: { token: string };
}) {
  const validateToken = await validateForgotPasswordToken(token);

  if (!validateToken) notFound();

  return <ChangePassword token={token} />;
}
