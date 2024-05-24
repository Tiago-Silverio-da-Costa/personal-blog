import { authOptions } from "@/adapter/nextAuth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getProfessionData } from "./utils";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
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
  }

  const professions = await getProfessionData()

  return new NextResponse(
    JSON.stringify({
      status: "success",
      data: professions,
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