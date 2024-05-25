import { NextResponse } from "next/server";
import { getThemedata } from "./utils";


export async function GET() {
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