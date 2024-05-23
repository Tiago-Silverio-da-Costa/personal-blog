import { NextRequest, NextResponse } from "next/server";
import { TForgotPassword } from "./utils";
import axios from "axios";
import { GRecaptchaResponseProps } from "../../utils";
import { prisma } from "@/adapter/db";
import isEmail from "validator/lib/isEmail";
import { generateForgotPasswordToken } from "../utils";

export async function POST(req: NextRequest) {
  if (req.headers.get("content-type") !== "application/json")
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Formato inválido!",
        error: "ForgotPassword-001",
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

  const accessIp = req.headers.get("cf-connecting-ip");

  let { gRecaptchaToken, email }: TForgotPassword = await req.json();

  // check token
  if (!gRecaptchaToken)
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Captcha não encontrado!",
        error: "ForgotPassword-002",
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
          siteKey: process.env.RECAPTCHA_KEY,
          expectedAction: "forgotpassword",
        },
      }
    );
    const gRecaptchaData = data as GRecaptchaResponseProps;
    const { score, ...riskAnalysis } = gRecaptchaData.riskAnalysis;

    var gRecaptcha = await prisma.adminAuditRecaptcha.create({
      data: {
        action: "forgotpassword",
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
      gRecaptchaData.event.expectedAction !== "forgotpassword" ||
      score < 0.5
    )
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Ação não autorizada!",
          error: "ForgotPassword-003",
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
        error: "ForgotPassword-004",
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

  email = email?.trim().toLocaleLowerCase().substring(0, 60);

  // check if data is valid
  if (!email || !isEmail(email)) {
    let fields = [];
    fields.push("email");

    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Dados inválidos!",
        fields: fields,
        error: "ForgotPassword-005",
      } as {
        fields: (keyof TForgotPassword)[];
      } & ApiReturnError),
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

  //get user
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
    select: {
      uuid: true,
      name: true,
      email: true,
    },
  });

  //return false success to prevent email discovery
  if (!user)
    return new NextResponse(
      JSON.stringify({
        status: "success",
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

  // update recaptcha with user
  await prisma.adminAuditRecaptcha.update({
    where: {
      id: gRecaptcha.id,
    },
    data: {
      User: {
        connect: {
          uuid: user.uuid,
        },
      },
    },
  });

  // generate token
  const token = await generateForgotPasswordToken(user.uuid);

  if (!token)
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message:
          "Erro ao enviar e-mail de recuperação! Atualize a página e tente novamente.",
        error: "ForgotPassword-006",
      } as ApiReturnError),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin":
            process.env.VERCEL_ENV === "production"
              ? "https://partidomissao.com"
              : "*",
        },
      }
    );

  // send email
  //

  return new NextResponse(
    JSON.stringify({
      status: "success",
    } as ApiReturnSuccess),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin":
          process.env.VERCEL_ENV === "production"
            ? "https://partidomissao.com"
            : "*",
      },
    }
  );
}
