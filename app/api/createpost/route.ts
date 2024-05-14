import { NextRequest, NextResponse } from "next/server";
import { TCreateBlog } from "./utils";
import { prisma } from "@/adapter/db";
import { toTitle } from "@/components/commom/utils";

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

  let {
    title,
    subtitle,
    theme,
    // author,
    content,
  }: TCreateBlog = await req.json();

  title = toTitle(title?.trim() ?? "").substring(0, 100);
  subtitle = toTitle(subtitle?.trim() ?? "").substring(0, 100);
  content = (content?.trim() ?? "").substring(0, 10000);
  // author = toTitle(title?.trim() ?? "").substring(0, 25);

  // validate post info
  if (
    !title 
    || !subtitle
    || !content
    || !theme
    // || !author
    
  ) {
    let fields = [];
    if (!title) fields.push("title");
    if (!subtitle) fields.push("subTitle");
    if (!content) fields.push("content");
    if (!theme) fields.push("theme");
    // if (!author) fields.push("author")

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
        content,
        theme,
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
        message: err,
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
