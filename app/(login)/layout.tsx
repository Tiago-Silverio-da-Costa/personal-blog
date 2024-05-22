import Footer from "@/components/footer";
import Header from "@/components/header";

export default function LoginLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}