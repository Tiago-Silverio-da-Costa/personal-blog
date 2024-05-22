import ForgotPassword from "@/components/login/forgotpassword";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Personal blog – Esqueci a senha "
}

export default function Index() {
  return <ForgotPassword />;
}