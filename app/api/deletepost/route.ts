import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/adapter/db";
import { checkSession } from "../admin/utils";

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

  // const session = await checkSession();

  // if (!session)
  //   return new NextResponse(
  //     JSON.stringify({
  //       status: "error",
  //       message: "Não Autorizado!",
  //       error: "deletePost-002",
  //     } as ApiReturnError),
  //     {
  //       status: 401,
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Access-Control-Allow-Origin":
  //           process.env.VERCEL_ENV === "production"
  //             ? "https://something.com"
  //             : "*",
  //       },
  //     }
  //   );

  let {
    id,
  }: {
    id: string;
  } = await req.json();

  // check if id is valid
  if (!id)
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Dados inválidos!",
        error: "DeletePost-003",
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

  const posts = await prisma.post.findFirst({
    where: {
      id: id,
    },
    select: {
      id: true,
    },
  });

  if (!posts)
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Ação não permitida!",
        error: "DeletePost-002",
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

  await prisma.post.delete({
    where: {
      id: id,
    },
  });

  return new NextResponse(
    JSON.stringify({
      status: "success",
      message: "Post deletado com sucesso!",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin":
          process.env.VERCEL_ENV === "production"
            ? "https://something.com"
            : "*",
      },
    }
  );
}
