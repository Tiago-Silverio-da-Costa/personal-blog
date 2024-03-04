import Article from "@/components/article";
import Footer from "@/components/footer";
import Header from "@/components/header";
import prisma from "@/adapter/prisma"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPostById } from "../api/createpost/utils";

async function getData(userId: string) {

  const data = await prisma.post.findMany({
    where: {
      id: userId
    },
    select: {
      theme: true,
      id: true
    }
  })
  return data
}


export default async function Page({
  params: { articleId },
}: {
  params: { articleId: string };
}) {
  const session = await getServerSession(authOptions)
  const data = await getData(session?.user?.email as string)


  const event = await getPostById(articleId);

  if (!event) { return }
  return (
    <>
      {data?.map((theme) => (
        <div key={theme.theme}>
          <Header theme={theme.theme} />
          <Article id={event.id} />
          <Footer />
        </div>
      ))}
    </>
  )
}