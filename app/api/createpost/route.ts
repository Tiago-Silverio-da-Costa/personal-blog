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
        error: "CreatePost-001",
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
    title,
    subtitle,
    createTheme,
    existedTheme,
    existedAuthor,
    createAuthor,
    content,
    profession,
  }: TCreateBlog = await req.json();

  title = toTitle(title?.trim() ?? "").substring(0, 100);
  subtitle = toTitle(subtitle?.trim() ?? "").substring(0, 100);
  content = (content?.trim() ?? "").substring(0, 10000);
  existedAuthor = toTitle(existedAuthor?.trim() ?? "").substring(0, 25);
  createAuthor = toTitle(createAuthor?.trim() ?? "").substring(0, 25);
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
        error: "CreatePost-004",
      } as ApiReturnError),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Acess-Control-Allow-Origin":
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
          error: "CreatePost-005",
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
          error: "CreatePost-006",
        } as ApiReturnError),
        {
          status: 404,
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

    const authorData = await prisma.user.findFirst({
      where: {
        Posts: {
          every: {
            author: {
              name: existedAuthor,
            },
          },
        },
      },
    });

    const postData = await prisma.post.create({
      data: {
        title,
        subtitle,
        content,
        themeId: themeData?.id,
        authorId: authorData?.id,
        professionId: professionData.id,
      },
      select: {
        id: true,
      },
    });

    if (createAuthor !== "")
      await prisma.user.create({
        data: {
          name: createAuthor.charAt(0).toUpperCase() + createAuthor.slice(1),
          Posts: {
            connect: {
              id: postData.id,
            },
          },
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
              ? "https://personal-blog-cmsn.vercel.app/"
              : "*",
        },
      }
    );
  } catch (err) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: err,
        error: "CreatePost-008",
      } as ApiReturnError),
      {
        status: 500,
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
}
