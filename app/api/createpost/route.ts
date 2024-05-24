import { NextRequest, NextResponse } from "next/server";
import { TCreateBlog } from "./utils";
import { prisma } from "@/adapter/db";
import { toTitle } from "@/components/commom/utils";
import { GRecaptchaResponseProps } from "../utils";
import axios from "axios";

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

  // const session = await getServerSession(authOptions);
  // if (!session)
  //   return new NextResponse(
  //     JSON.stringify({
  //       status: "error",
  //       message: "Não Autorizado!",
  //     } as ApiReturnError),
  //     {
  //       status: 401,
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Access-Control-Allow-Origin":
  //           process.env.VERCEL_ENV === "production"
  //             ? "https://personal-blog-cmsn.vercel.app/"
  //             : "*",
  //       },
  //     }
  //   );

  const accessIp = req.headers.get("cf-connecting-ip");

  let {
    title,
    subtitle,
    createTheme,
    existedTheme,
    existedAuthor,
    content,
    profession,
    gRecaptchaToken,
  }: TCreateBlog = await req.json();

  title = toTitle(title?.trim() ?? "").substring(0, 100);
  subtitle = toTitle(subtitle?.trim() ?? "").substring(0, 100);
  content = (content?.trim() ?? "").substring(0, 10000);
  existedAuthor = toTitle(existedAuthor?.trim() ?? "").substring(0, 25);
  existedTheme = toTitle(existedTheme?.trim() ?? "").substring(0, 25);
  createTheme = toTitle(createTheme?.trim() ?? "").substring(0, 25);
  profession = toTitle(profession?.trim() ?? "").substring(0, 25);

  // check token
  if (!gRecaptchaToken)
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Captcha não encontrado!",
        error: "CreatePost-002",
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
          expectedAction: "createpost",
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
        action: "createpost",
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
      gRecaptchaData.event.expectedAction !== "createpost" ||
      score < 0.5
    )
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Ação não autorizada!",
          error: "CreatePost-003",
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
        error: "DeletePost-004",
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
        name: existedAuthor,
        image: "https://avatars.githubusercontent.com/u/72054311?v=4",
      },
    });
    if (!authorData) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Autor não encontrado!",
          error: "CreatePost-007",
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
