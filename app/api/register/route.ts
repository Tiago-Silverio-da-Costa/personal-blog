import { NextRequest, NextResponse } from "next/server";
import { TAuthorRegister } from "./utils";
import { toTitle } from "../../../components/commom/utils";
import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";
import { prisma } from "@/adapter/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  if (req.headers.get("content-type") !== "application/json")
    return new NextResponse(
      JSON.stringify(
        {
          status: "error",
          message: "Formato inválido!",
          error: "createRegisterAuthor-001",
        } as ApiReturnError & { fields: (keyof TAuthorRegister)[]}),
      {
        status: 400,
        headers: {
          Content_Type: "application/json",
          "Access-Control-Allow-Origin":
            process.env.VERCEL_ENV === "production"
              ? "https://something.com"
              : "*",
        },
      }
    );

  let { name, email, profession, password, confirmPassword }: TAuthorRegister =
    await req.json();

  name = toTitle(name?.trim() ?? "").substring(0, 100);
  email = email.trim().substring(0, 60);
  profession = toTitle(profession?.trim() ?? "").substring(0, 60);
  password = password.trim().substring(0, 30);
  confirmPassword = confirmPassword.trim().substring(0, 30);

  if (
    !name 
    || name == "" 
    || name.split(" ").length < 2 
    || !email 
    || !isEmail(email)
    || !profession 
    || !password 
    || !confirmPassword
  ) {
    let fields: (keyof TAuthorRegister)[] = [];
    if (!name || name == "" || name.split(" ").length < 2)
      fields.push("name");
    if (!email || !isEmail(email))
       fields.push("email");
    if (!profession) fields.push("profession");
    !password || password.length < 8 ||
    !(password.length <= 24) ||
    !confirmPassword ||
    !isStrongPassword(password, { minSymbols: 0 }) ||
    password !== confirmPassword

    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Dados inválidos!",
        error: "createRegisterAuthor-002",
      } as ApiReturnError & { fields: (keyof TAuthorRegister)[]}),
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

  const hashedPassword = await bcrypt.hash(
    password,
    process.env.BCRYPT_SALT ?? 10
  )

  // check if author already exists
  const authorAlreadyExists = await prisma.user.findFirst({
    where: {
      OR: [{
        email,
      }, {
        name,
      }],
    },
    select: {
      id: true,
    }
  });

  if (authorAlreadyExists) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Autor já cadastrado!",
        error: "createRegisterAuthor-003",
      } as ApiReturnError),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin":
            process.env.VERCEL_ENV === "production"
              ? "https://something.com"
              : "*",
        }
      }
    )
  }
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
      }
    }
  )
}
