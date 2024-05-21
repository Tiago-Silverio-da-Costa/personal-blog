import { NextResponse } from "next/server";
import { getThemedata } from "./utils";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth/next";

export async function GET() {
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
    
  const themes = await getThemedata();
  
  return new NextResponse(
    JSON.stringify({
      status: "success",
      data: themes
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