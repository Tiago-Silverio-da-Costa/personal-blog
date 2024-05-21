import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/adapter/db";
import { TCreateBlog } from "../createpost/utils";
import axios from "axios";
import { GRecaptchaResponseProps } from "../utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/authOptions";

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

  const session = await getServerSession(authOptions);
  if (!session)
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Não Autorizado!",
      } as ApiReturnError),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin":
            process.env.VERCEL_ENV === "production"
              ? "https://personal-blog-cmsn.vercel.app/"
              : "*",
        },
      }
    );

  const accessIp = req.headers.get("cf-connecting-ip");

  let {
    id,
    title,
    subtitle,
    content,
    existedAuthor,
    profession,
    createTheme,
    existedTheme,
    gRecaptchaToken,
  }: {
    id: string;
  } & TCreateBlog = await req.json();

  // check token
  if (!gRecaptchaToken)
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Captcha não encontrado!",
        error: "EditPost-002",
      } as ApiReturnError),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Acces-Control-Allow-Origin":
            process.env.VERCEL_ENV === "production"
              ? "https://personal-blog-cmsn.vercel.app/"
              : "*",
        },
      }
    );

  try {
    const { data } = await axios.post(
      `https://recaptchaenterprise.googleapis.com/v1/projects/${process.env.RECAPTCHA_PROJECT_ID}/assessments?key=${process.env.RECAPTCHA_API_KEY}`,
      {
        event: {
          token: gRecaptchaToken,
          siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_KEY,
          expectedAction: "editpost",
        },
      }
    );
    const gRecaptchaData = data as GRecaptchaResponseProps;
    const { score, ...riskAnalysis } = gRecaptchaData.riskAnalysis;

    await prisma.adminAuditRecaptcha.create({
      data: {
        // User: {
        //   connect: {
        //     uuid: session.user.id
        //   }
        // },
        action: "editpost",
        valid: gRecaptchaData.tokenProperties.valid,
        invalidReason: gRecaptchaData.tokenProperties.invalidReason,
        expectedAction: gRecaptchaData.event.expectedAction,
        score,
        riskAnalysis,
        ip: accessIp,
      },
      select: {
        id: true,
      },
    });

    if (
      !gRecaptchaData.tokenProperties.valid ||
      gRecaptchaData.event.expectedAction !== "editpost" ||
      score < 0.5
    )
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Ação não autorizada!",
          error: "EditPost-003",
        } as ApiReturnError),
        {
          status: 403,
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
        message: "Captcha inválido!",
        error: "EditPost-004",
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
