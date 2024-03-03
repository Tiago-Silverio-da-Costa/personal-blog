import Article from "@/components/article";
import Footer from "@/components/footer";
import Header from "@/components/header";
import prisma from "@/adapter/prisma"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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


export default async function Page() {
  const session = await getServerSession(authOptions)
  const data = await getData(session?.user?.email as string)

  return (
    <>
      {data?.map((theme) => (
          <div key={theme.theme}>
            <Header theme={theme.theme} />
            <Article />
            <Footer />
          </div>
        ))}
    </>
  )
}