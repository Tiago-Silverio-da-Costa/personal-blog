import { NextRequest, NextResponse } from "next/server";
import { TChangePassword } from "./utils";
import axios from "axios";
import { GRecaptchaResponseProps } from "../../utils";
import { isStrongPassword } from "validator";
import {
  deleteForgotPasswordToken,
  validateForgotPasswordToken,
} from "../utils";
import bcrypt from "bcryptjs";
import { prisma } from "@/adapter/db";

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

  let { gRecaptchaToken, token, password, confirmPassword }: TChangePassword =
    await req.json();

  // check if token exists
  if (!token)
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Requisição inválida!",
        error: "ChangePassword-002",
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

  // check g-recaptcha token
  if (!gRecaptchaToken)
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Captcha não encontrado!",
        error: "ChangePassword-003",
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

  try {
    const { data } = await axios.post(
      `https://recaptchaenterprise.googleapis.com/v1/projects/${process.env.RECAPTCHA_PROJECT_ID}/assessments?key=${process.env.RECAPTCHA_API_KEY}`,
      {
        event: {
          token: gRecaptchaToken,
          siteKey: process.env.RECAPTCHA_KEY,
          expectedAction: "changepassword",
        },
      }
    );

    const gRecaptchaData = data as GRecaptchaResponseProps;
    const { score, ...riskAnalysis } = gRecaptchaData.riskAnalysis;

    var gRecaptcha = await prisma?.adminAuditRecaptcha.create({
      data: {
        action: "changepassword",
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
      gRecaptchaData.event.expectedAction !== "changepassword" ||
      score < 0.5
    )
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Ação não autorizada!",
          error: "ChangePassword-004",
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
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Captcha inválido!",
        error: "ChangePassword-005",
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

  // check if password is valid
  password = password?.substring(0, 30);
  confirmPassword = confirmPassword?.substring(0, 30);

  // check if data is valid
  if (
    !password ||
    !(password.length <= 24) ||
    !confirmPassword ||
    isStrongPassword(password, { minSymbols: 0 }) ||
    password !== confirmPassword
  ) {
    let fields = [];

    if (
      !password ||
      !(password.length <= 24) ||
      !isStrongPassword(password, { minSymbols: 0 })
    )
      fields.push("push");
    if (!confirmPassword || confirmPassword !== confirmPassword)
      fields.push("confirmPassword");

    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Dados inválidos!",
        fields: fields,
        error: "ChangePassword-006",
      } as { fields: (keyof TChangePassword)[] } & ApiReturnError),
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

  // validate token
  const userUuid = await validateForgotPasswordToken(token);
  if (!userUuid)
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Solicitação inválida!",
        error: "ChangePassword-007",
      } as ApiReturnError),
      {
        status: 400,
        headers: {
          "Content-Type": "Application/json",
          "Access-Control-Allow-Origin":
            process.env.VERCEL_ENV === "production"
              ? "https://personal-blog-cmsn.vercel.app/"
              : "*",
        },
      }
    );

  // update user password
  const hashedPassword = await bcrypt.hash(
    password,
    process.env.BCRYPT_SALT ?? 10
  );

  const user = await prisma?.user.update({
    where: {
      uuid: userUuid,
    },
    data: {
      password: hashedPassword,
    },
    select: {
      uuid: true,
      email: true,
    },
  });

  //revoke token
  await deleteForgotPasswordToken(token);

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
            ? "https://personal-blog-cmsn.vercel.app/"
            : "*",
      },
    }
  );
}
