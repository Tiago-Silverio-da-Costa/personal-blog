import { NextRequest, NextResponse } from "next/server";
import { getPostsdata } from "./utils";

export async function GET(req: NextRequest) {
  const posts = await getPostsdata();
  
  return new NextResponse(
    JSON.stringify({
      status: "success",
      data: posts
    }),
    {
      status: 200,
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