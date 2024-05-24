import { prisma } from "@/adapter/db";
import { Prisma } from "@prisma/client";

export type TProfessionData = Prisma.PromiseReturnType<typeof getProfessionData>;
export async function getProfessionData() {
  const professionPromise = await prisma.profession.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return professionPromise;
}