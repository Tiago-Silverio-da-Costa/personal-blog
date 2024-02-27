"use client"

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import localFont from "next/font/local";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { TbBrandWhatsapp } from "react-icons/tb";
import { TCreateBlog, createBlogSchema } from "@/app/api/blog/utils";
import { FormFieldError, FormFieldGrp, FormFieldWrapper } from "@/styles/createBlogForms";
import { IoMdClose } from "react-icons/io";

const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/Satoshi-Italic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/Satoshi-Regular.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
})

interface iTheme {
  id: number;
  name: string;
}


export default function Header() {
  // process.env.NUMBER pegar do banco

  const themeList: iTheme[] = [
    {
      id: 1,
      name: "Programação"
    },
    {
      id: 2,
      name: "Design"
    },
    {
      id: 3,
      name: "Marketing"
    },
    {
      id: 4,
      name: "Vida de freelancer"
    }
  ]

  const [openPopup, SetOpenPopup] = useState<boolean>(false)
  // const popupRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const handleClick = (event: Event) => {
  //     if (
  //       !openPopup &&
  //       popupRef.current &&
  //       event.target instanceof Node &&
  //       !popupRef.current.contains(event.target as Node)
  //     ){
  //       SetOpenPopup(!openPopup)
  //     }
  //   }

  //   document.addEventListener("click", handleClick)
  //   document.addEventListener("touchend", handleClick)
  //   return () => {
  //     document.removeEventListener("click", handleClick)
  //     document.removeEventListener("touchend", handleClick)
  //   }
  // }, [openPopup, popupRef])

  const {
    handleSubmit,
    clearErrors,
    watch,
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = useForm<TCreateBlog>({
    resolver: yupResolver(createBlogSchema),
    reValidateMode: "onSubmit",
    defaultValues: {
      themeSelect: "selecione"
    }
  })

  const onSubmit = async (data: TCreateBlog) => {
    if (isSubmitting) return;
    clearErrors()
  }

  return (
    <section className="border-b-third border-b">
      <div className="flex justify-between items-center mx-auto w-5/6 max-w-5xl py-4">
        <Link href="/" className={`text-2xl font-bold ${satoshi.className}`}>Blog</Link>
        <div className="flex items-center gap-4">
          <a href={`https://api.whatsapp.com/send?phone=${process.env.NUMBER}&text=Oi,%20Tudo%20bem!`} className={`${satoshi.className}flex items-center justify-center text-primary bg-secondary px-6 py-2 font-bold text-2xl`}><TbBrandWhatsapp /></a>
          <div
            onClick={() => SetOpenPopup(!openPopup)}
            className={`${satoshi.className}flex items-center justify-center text-primary bg-secondary px-6 py-2 font-bold text-2xl`}
          ><FaPlus /></div>

          {openPopup && (
            <div className="flex flex-col items-center justify-center bg-black/50 fixed bottom-0 left-0 top-0 select-none w-screen z-50">
              <div className="bg-primary mx-auto w-5/6 max-w-[40rem] relative flex justify-start gap-4 border-b border-b-secondaryText py-2">
                <h1 className="uppercase font-light text-sm text-center w-full">Área de criação</h1>
                <div
                  onClick={() => SetOpenPopup(!openPopup)}
                  className={`${satoshi.className} absolute top-0 right-0 flex items-center justify-center text-primary bg-secondary px-4 py-2 font-bold text-lg`}><IoMdClose /></div>
              </div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="on"
                className="bg-primary grid justify-items-center mx-auto w-5/6 max-w-[40rem] px-8"
              >
                <div className="flex items-start justify-between gap-8 mt-8">
                  <FormFieldWrapper $error={!!errors.title}>
                    <FormFieldGrp>
                      <input
                        {...register("title")}
                        inputMode="text"
                        placeholder="Título"
                        maxLength={100}
                        readOnly={isSubmitting}
                      />
                    </FormFieldGrp>
                    {errors.title && (
                      <FormFieldError>{errors.title.message}</FormFieldError>
                    )}
                  </FormFieldWrapper>
                  <FormFieldWrapper $error={!!errors.subTitle}>
                    <FormFieldGrp>
                      <input
                        {...register("subTitle")}
                        inputMode="text"
                        placeholder="Subtítulo"
                        maxLength={100}
                        readOnly={isSubmitting}
                      />
                    </FormFieldGrp>
                    {errors.subTitle && (
                      <FormFieldError>{errors.subTitle.message}</FormFieldError>
                    )}
                  </FormFieldWrapper>
                </div>

                <div className="flex flex-col gap-2 mt-8">
                  <FormFieldWrapper $error={!!errors.paragraph}>
                    <FormFieldGrp>
                      <textarea
                        {...register("paragraph")}
                        inputMode="text"
                        placeholder="Parágrafo"
                        maxLength={100}
                        readOnly={isSubmitting}
                        cols={56}
                        rows={8}
                      />
                    </FormFieldGrp>
                    {errors.paragraph && (
                      <FormFieldError>{errors.paragraph.message}</FormFieldError>
                    )}
                  </FormFieldWrapper>
                  <div className={`${satoshi.className} flex items-center justify-center text-primary bg-secondary px-6 py-2 font-bold text-2xl w-full`}><FaPlus /></div>
                </div>

                <div className="flex items-start justify-between gap-8 mt-8">
                  <FormFieldWrapper $error={!!errors.themeInput}>
                    <FormFieldGrp>
                      <input
                        {...register("themeInput")}
                        inputMode="text"
                        placeholder="Tema"
                        maxLength={100}
                        readOnly={isSubmitting}
                      />
                    </FormFieldGrp>
                    {errors.themeInput && (
                      <FormFieldError>{errors.themeInput.message}</FormFieldError>
                    )}
                  </FormFieldWrapper>
                  <FormFieldWrapper $error={!!errors.themeSelect}>
                    <FormFieldGrp>
                      <select
                        disabled={isSubmitting}
                        {...register("themeSelect")}
                      >
                        <option disabled value="selecione">
                          Selecione
                        </option>
                        {themeList.map((theme) => (
                          <option value={theme.name} key={theme.id}>
                            {theme.name}
                          </option>
                        ))}

                      </select>
                    </FormFieldGrp>
                    {errors.themeSelect && (
                      <FormFieldError>{errors.themeSelect.message}</FormFieldError>
                    )}
                  </FormFieldWrapper>
                </div>
                <div className="flex items-center gap-4 mt-8 pb-4">
                  <button type="submit" className={`${satoshi.className} flex items-center justify-center text-secondary bg-transparent border-secondaryText border px-6 py-2 font-bold text-sm w-full`}>Cancelar</button>
                  <button type="submit" className={`${satoshi.className} flex items-center justify-center text-primary bg-secondary px-6 py-2 font-bold text-sm w-full`}>Criar</button>
                </div>

              </form>
            </div>
          )}
        </div>
      </div >
    </section >
  )
}