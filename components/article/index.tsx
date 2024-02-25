import Image from "next/image";
import localFont from "next/font/local";

const albra = localFont({
  src: [
    {
      path: "../../public/fonts/AlbraSansLightItalic.otf",
      weight: "300",
      style: "italic",
    },
  ],
})

const satoshi = localFont({
  src: [
    {
      path: "../../public/fonts/Satoshi-Italic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/Satoshi-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
})

function ArticleHead() {
  return (
    <div className="flex flex-col border-b-2 border-b-secondary/50 pb-6">
      <div className="flex items-center gap-4">
        <p className={`${satoshi.className} rounded-lg uppercase border border-secondary px-4 py-2 font-medium text-secondary text-xs tracking-tighter`}>Programação</p>
        <p className={`${satoshi.className} uppercase font-light text-xs text-secondary tracking-tighter`}>9 minutos de leitura</p>
      </div>

      <div className="flex flex-col">
        <h1 className={`${albra.className} mt-8 italic pl-1 text-5xl font-medium text-secondary tracking-tighter leading-10 md:leading-6`}>
          Programação 1º ano:
        </h1>
        <span className={`${satoshi.className} max-w-[40rem] mt-2 text-5xl not-italic font-medium text-secondary tracking-tighter leading-10 md:leading-[3rem]`}>Retrospectiva do meu primeiro dia ao atual</span>
      </div>

      <div className="flex items-center gap-4 mt-8">
        <Image className="rounded-full border-2 border-secondary scale-90" src="/autor.png" alt="Autor" width={50} height={50} />
        <div className="flex flex-col gap-2">
          <p className={`${satoshi.className} text-sm text-secondary font-normal tracking-tighter leading-4`}>Tiago S.C.</p>
          <p className="text-xs text-secondary font-light tracking-tighter uppercase leading-3">Dev - Programador</p>
        </div>
      </div>
    </div>
  )
}

function ArticleBody() {

  return (
    <div className="mx-auto w-5/6 max-w-3xl mt-16">
      <p className="text-lg tracking-tighter leading-6">
        No mundo agitado em que vivemos, é fácil sentir-se sobrecarregado pelo excesso de informações, compromissos e posses materiais. No entanto, muitos estão descobrindo os benefícios de adotar um estilo de vida minimalista. O minimalismo não se trata apenas de ter menos coisas, mas sim de simplificar e focar no que realmente importa. Ao reduzir o excesso de distrações e simplificar nossas vidas, podemos encontrar mais espaço para a alegria e a realização.
      </p>
      <p className="text-lg tracking-tighter leading-6 mt-8">
        No mundo agitado em que vivemos, é fácil sentir-se sobrecarregado pelo excesso de informações, compromissos e posses materiais. No entanto, muitos estão descobrindo os benefícios de adotar um estilo de vida minimalista. O minimalismo não se trata apenas de ter menos coisas, mas sim de simplificar e focar no que realmente importa. Ao reduzir o excesso de distrações e simplificar nossas vidas, podemos encontrar mais espaço para a alegria e a realização.
      </p>
      <p className="text-lg tracking-tighter leading-6 mt-8">
        No mundo agitado em que vivemos, é fácil sentir-se sobrecarregado pelo excesso de informações, compromissos e posses materiais. No entanto, muitos estão descobrindo os benefícios de adotar um estilo de vida minimalista. O minimalismo não se trata apenas de ter menos coisas, mas sim de simplificar e focar no que realmente importa. Ao reduzir o excesso de distrações e simplificar nossas vidas, podemos encontrar mais espaço para a alegria e a realização.
      </p>
    </div>
  )
}

export default function Article() {

  return (
    <div className="mx-auto w-5/6 max-w-5xl py-6">
      <ArticleHead />
      <ArticleBody />
    </div>
  )
}