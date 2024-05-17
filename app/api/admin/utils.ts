import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function checkSession() {
  const session = await getServerSession(authOptions);

  if (session) {
    const user = session.user;

    if (user) {
      return session;
    }
  }

  return null;
}
