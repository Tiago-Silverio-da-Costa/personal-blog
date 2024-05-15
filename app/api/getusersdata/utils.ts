import { prisma } from "../../../adapter/db";
import { Prisma } from "@prisma/client";

export type TUsersData = Prisma.PromiseReturnType<typeof getUsersdata>;
export async function getUsersdata() {
  const postsPromise = await prisma.user.findMany({
    select: {
      name: true,
      id: true,
      profession: {
        select: {
          name: true,
        }
      }
    },
  });

  return postsPromise;
  
}
