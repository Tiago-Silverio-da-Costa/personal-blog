import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/adapter/db";
import { TCreateBlog } from "../createpost/utils";

export async function PUT(req: NextRequest) {
  if (req.headers.get("content-type") !== "application/json")
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Formato inválido!",
        error: "EditPost-001",
      } as ApiReturnError),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin":
            process.env.VERCEL_ENV === "production"
              ? "https://personal-blog-cmsn.vercel.app/"
              : "*",
        },
      }
    );

  let {
    id,
    title,
    subtitle,
    content,
    existedAuthor,
    profession,
    createTheme,
    existedTheme,
  }: {
    id: string;
  } & TCreateBlog = await req.json();

  // validate post info
  if (!id || !title || !subtitle || !content || !existedAuthor || !profession) {
    let fields = [];
    if (!id) fields.push("id");
    if (!title) fields.push("title");
    if (!subtitle) fields.push("subTitle");
    if (!content) fields.push("content");
    if (!existedAuthor) fields.push("existedAuthor");
    if (!profession) fields.push("profession");
    if (createTheme === "") fields.push("existedTheme");
    if (existedTheme === "") fields.push("createTheme");

    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Dados inválidos!",
        error: "editPost-005",
      } as ApiReturnError),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin":
            process.env.VERCEL_ENV === "production"
              ? "https://personal-blog-cmsn.vercel.app/"
              : "*",
        },
      }
    );
  }

  try {
    // check if theme already exists
    const themeAlreadyExists = await prisma.theme.findFirst({
      where: {
        name: createTheme,
      },
      select: {
        id: true,
      },
    });

    if (themeAlreadyExists) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Tema já existe!",
          error: "editPost-006",
        } as ApiReturnError),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin":
              process.env.VERCEL_ENV === "production"
                ? "https://personal-blog-cmsn.vercel.app/"
                : "*",
          },
        }
      );
    }
  } catch (err) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Erro ao verificar se o tema já existe!",
        error: "editPost-007",
      } as ApiReturnError),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin":
            process.env.VERCEL_ENV === "production"
              ? "https://personal-blog-cmsn.vercel.app/"
              : "*",
        },
      }
    );
  }

  await prisma.post.update({
    where: {
      id: id,
    },
    data: {
      title: title,
      subtitle: subtitle,
      content: content,
      Theme: {
        update: {
          name: createTheme === "" ? existedTheme : createTheme,
        },
      },
      profession: {
        update: {
          name: profession,
        },
      },
      author: {
        update: {
          name: existedAuthor,
        },
      },
    },
  });

  return new NextResponse(
    JSON.stringify({
      status: "success",
      message: "Post atualizado com sucesso!",
    } as ApiReturnSuccess),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin":
          process.env.VERCEL_ENV === "production"
            ? "https://personal-blog-cmsn.vercel.app/"
            : "*",
      },
    }
  );
}
