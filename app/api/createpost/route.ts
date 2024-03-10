import { NextRequest, NextResponse } from "next/server";
import { TCreateBlog } from "./utils";
import { prisma } from "@/adapter/db";

export async function POST(req: NextRequest) {
  if (req.headers.get("content-type") !== "application/json")
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Formato inválido!",
        error: "createPost-001",
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

  const accessIp = req.headers.get("cf-connecting-ip");

  let { title, subtitle, theme, content }: {} & TCreateBlog = await req.json();

  // validate post info
  if (!title || !subtitle || !theme) {
    let fields = [];
    if (!title) fields.push("title");
    if (!subtitle) fields.push("subTitle");
    if (!theme) fields.push("themeInput");

    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Dados inválidos!",
        error: "createPost-002",
      } as ApiReturnError),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Acess-Control-Allow-Origin":
            process.env.VERCEL_ENV === "production"
              ? "https://something.com"
              : "*",
        },
      }
    );
  }

  try {
    await prisma.post.create({
      data: {
        title,
        subtitle,
        theme,
        content,
        
      },
      select: {
        id: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        status: "success",
      } as ApiReturnSuccess),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin":
            process.env.VERCEL_ENV === "production"
              ? "https://something.com"
              : "*",
        },
      }
    );
  } catch (err) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Erro ao criar post!",
        error: "createPost-003",
      } as ApiReturnError),
      {
        status: 500,
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
}
