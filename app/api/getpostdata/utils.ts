import { prisma } from "../../../adapter/db";
import { Prisma } from "@prisma/client";

export type TPostsData = Prisma.PromiseReturnType<typeof getPostsdata>;
export async function getPostsdata() {
  const postsPromise = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      theme: true,
      content: true,
      createdAt: true,
      author: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });

  return postsPromise;
}
