import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/adapter/db";

export async function PUT(req: NextRequest) {
  if (req.headers.get("content-type") !== "application/json")
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Formato inválido!",
        error: "editPost-001",
      } as ApiReturnError),
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

    // const prevPost = await prisma.post.findFirst({
    //   where: {
    //     id: 
    //   },
    //   select: {
    //     id: true,
    //     title: true,
    //     subtitle: true,
    //     content: true,
    //     Theme: {
    //       select: {
    //         name: true
    //       }
    //     },
    //     author: {
    //       select: {
    //         name: true,
    //       }
    //     },
    //     profession: {
    //       select: {
    //         name: true,
    //       }
    //     }
    //   }
    // })

}