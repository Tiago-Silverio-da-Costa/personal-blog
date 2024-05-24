import { prisma } from "../../../adapter/db";
import { Prisma } from "@prisma/client";

export type TPostData = Prisma.PromiseReturnType<typeof getPostData>;
export async function getPostData() {

  const postsPromise = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      subtitle: true,
      content: true,
      Theme: {
        select: {
          name: true,
        },
      },
      author: {
        select: {
          name: true,
          id: true,
          image: true,
        },
      },
      profession: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });

  return postsPromise;
}
