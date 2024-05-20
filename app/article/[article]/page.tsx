import Article from "@/components/article";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default async function Page({
	params: { article },
}: {
	params: { article: string };
}) {
  const id = article

  return (
    <>
      <Header id={id} />
      <Article id={id} />
      <Footer />
    </>
  )
}