import { prisma } from "@/adapter/db";
import { Prisma } from "@prisma/client";

export type TThemeData = Prisma.PromiseReturnType<typeof getThemedata>;
export async function getThemedata() {
  const themePromise = await prisma.theme.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return themePromise;
}
