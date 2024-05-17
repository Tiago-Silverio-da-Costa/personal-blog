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
    createTheme,
    existedTheme,
    existedAuthor,
    content,
    profession,
  }: TCreateBlog = await req.json();

  title = toTitle(title?.trim() ?? "").substring(0, 100);
  subtitle = toTitle(subtitle?.trim() ?? "").substring(0, 100);
  content = (content?.trim() ?? "").substring(0, 10000);
  existedAuthor = toTitle(existedAuthor?.trim() ?? "").substring(0, 25);
  existedTheme = toTitle(existedTheme?.trim() ?? "").substring(0, 25);
  createTheme = toTitle(createTheme?.trim() ?? "").substring(0, 25);
  profession = toTitle(profession?.trim() ?? "").substring(0, 25);

  // validate post info
  if (!title || !subtitle || !content || !existedAuthor || !profession) {
    let fields = [];
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
          error: "createPost-003",
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
    }

    const themeData = await prisma.theme.findFirst({
      where: {
        Posts: {
          every: {
            Theme: {
              name: existedTheme,
            },
          },
        },
      },
    });

    const professionData = await prisma.profession.findFirst({
      where: {
        name: profession,
      },
    });

    if (!professionData) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Profissão não encontrada!",
          error: "createPost-004",
        } as ApiReturnError),
        {
          status: 404,
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

    const authorData = await prisma.user.findFirst({
      where: {
        name: existedAuthor,
        profileImage: "https://avatars.githubusercontent.com/u/72054311?v=4",
      },
    });
    if (!authorData) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Autor não encontrado!",
          error: "createPost-005",
        } as ApiReturnError),
        {
          status: 404,
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

    const postData = await prisma.post.create({
      data: {
        title,
        subtitle,
        content,
        themeId: themeData?.id,
        authorId: authorData.id,
        professionId: professionData.id,
      },
      select: {
        id: true,
      },
    });

    if (createTheme !== "")
      await prisma.theme.create({
        data: {
          name: createTheme.charAt(0).toUpperCase() + createTheme.slice(1),
          Posts: {
            connect: {
              id: postData.id,
            },
          },
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
        error: "createPost-006",
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
