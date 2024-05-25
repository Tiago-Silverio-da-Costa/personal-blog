import { NextResponse } from "next/server";
import { getProfessionData } from "./utils";

export async function GET() {
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
