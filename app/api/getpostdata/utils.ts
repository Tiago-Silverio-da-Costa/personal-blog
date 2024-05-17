import { prisma } from "../../../adapter/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export type TPostsData = Prisma.PromiseReturnType<typeof getPostsdata>;
export async function getPostsdata(req: NextRequest) {
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
