import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/adapter/db";

export async function DELETE(req: NextRequest) {
  if (req.headers.get("content-type") !== "application/json")
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Formato inválido!",
        error: "deletePost-001",
      } as ApiReturnError),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin":
            process.env.VERCEL_ENV === "production"
              ? "https://something.com"
              : "*",
        },
      }
    );

  let {
    postId,
  }: {
    postId: string;
  } = await req.json();

  // check if postId is valid
  if (!postId || !Array.isArray(postId) || postId.length === 0)
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Dados inválidos!",
        error: "DeletePost-001",
      } as ApiReturnError),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin":
            process.env.VERCEL_ENV === "production"
              ? "https://something.com"
              : "*",
        },
      }
    );

  const posts = await prisma.post.findMany({
    where: {
      id: {
        in: postId,
      },
    },
    select: {
      id: true,
    },
  });
}
