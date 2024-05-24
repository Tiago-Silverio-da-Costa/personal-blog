import { NextRequest, NextResponse } from "next/server";
import { getUsersdata } from "./utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/adapter/nextAuth";

export async function GET(req: NextRequest) {
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

  const users = await getUsersdata();
  
  return new NextResponse(
    JSON.stringify({
      status: "success",
      data: users
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin":
          process.env.VERCEL_ENV === "production"
            ? "https://personal-blog-cmsn.vercel.app/"
            : "*",
      }
    }
  )
}