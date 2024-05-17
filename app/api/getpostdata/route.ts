import { NextResponse } from "next/server";
import { prisma } from "@/adapter/db";

export async function GET() {

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
  
  return new NextResponse(
    JSON.stringify({
      status: "success",
      data: postsPromise
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin":
          process.env.VERCEL_ENV === "production"
            ? "https://something.com"
            : "*",
      }
    }
  )
}