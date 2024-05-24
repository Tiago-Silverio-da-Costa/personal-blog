import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/adapter/db";
import { GRecaptchaResponseProps } from "../utils";
import { getServerSession } from "next-auth/next";
import axios from "axios";
import { authOptions } from "@/adapter/nextAuth";

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
    gRecaptchaToken,
  }: {
    id: string;
    gRecaptchaToken: string;
  } = await req.json();

  // check token
  if (!gRecaptchaToken)
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Captcha não encontrado!",
        error: "DeletePost-002",
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
          expectedAction: "deletepost",
        },
      }
    );
    const gRecaptchaData = data as GRecaptchaResponseProps;
    const { score, ...riskAnalysis } = gRecaptchaData.riskAnalysis;

    await prisma.adminAuditRecaptcha.create({
      data: {
        User: {
          connect: {
            id: session.user.id
          }
        },
        action: "deletepost",
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
      gRecaptchaData.event.expectedAction !== "deletepost" ||
      score < 0.5
    )
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Ação não autorizada!",
          error: "DeletePost-003",
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

  // check if id is valid
  if (!id)
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Dados inválidos!",
        error: "DeletePost-005",
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
        error: "DeletePost-007",
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
            ? "https://personal-blog-cmsn.vercel.app/"
            : "*",
      },
    }
  );
}
