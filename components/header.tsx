"use client"

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import localFont from "next/font/local";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { TbBrandWhatsapp } from "react-icons/tb";
import { TCreateBlog, createBlogSchema } from "@/app/api/createpost/utils";
import { FormBtn, FormFieldError, FormFieldGrp, FormFieldWrapper, Spin } from "@/styles/createBlogForms";
import { IoMdClose } from "react-icons/io";
import Alert from "./commom/alert";
import { PiSpinnerBold } from "react-icons/pi";
import { TPostsData } from "@/app/api/getpostdata/utils";

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

function refreshPage(){
  window.location.reload();
} 

export default function Header() {
  const [openPopup, SetOpenPopup] = useState<boolean>(false)
  const [posts, setPosts] = useState<TPostsData>();

  const {
    handleSubmit,
    clearErrors,
    reset,
    setError,
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = useForm<TCreateBlog>({
    resolver: yupResolver(createBlogSchema),
    reValidateMode: "onSubmit",
    defaultValues: {
      existedTheme: "selecione",
      author: "selecione"
    }
  })
  const getPosts = async () => {
    const response = await fetch("/api/getpostdata", {
      credentials: "include",
      cache: "no-cache",
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    const posts = await response.json()
    setPosts(posts.data)
  } 
  useEffect(() => {
    getPosts()
  } , [])

  const onSubmit = async (data: TCreateBlog) => {
    clearErrors()

 

    const responseData = await fetch("/api/createpost", {
      credentials: "include",
      cache: "no-cache",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...data
      })
    })

    if (responseData.status === 201) {
      refreshPage()
      reset(
        {
          title: "",
          subtitle: "",
          author: "",
          createTheme: "",
          content: ""
        },
        {
          keepIsSubmitted: true,
        }
      )
      return;
    } else if (responseData.status === 400 || responseData.status == 403) {
      const response: {
        fields?: (keyof TCreateBlog)[];
      } & ApiReturnError = await responseData.json();

      if (response.status == "error") {
        if (response.message) {
          setError("root", {
            type: "custom",
            message: response.message
          });

          if (response.fields)
            response.fields.forEach((field) => {
              setError(field, {
                type: "custom",
                message: "Verifique o campo!",
              })
            })
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
          return;
        }
      }
    }

    setError("root", {
      type: "custom",
      message: "Ocorreu um erro inesperado! Verifique os dados e tente novamente."
    })

    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }

  return (
    <section className="border-b-third border-b">
      <div className="flex justify-between items-center mx-auto w-5/6 max-w-5xl py-4">
        <Link href="/" className={`text-2xl font-bold ${satoshi.className}`}>Blog</Link>
        <div className="flex items-center gap-4">
          <a href={`https://api.whatsapp.com/send?phone=${process.env.NUMBER}&text=Oi,%20Tudo%20bem!`} className={`${satoshi.className}flex items-center justify-center text-primary bg-secondary transition-all duration-200 hover:opacity-75 px-6 py-2 font-bold text-2xl`}><TbBrandWhatsapp /></a>
          <div
            onClick={() => SetOpenPopup(!openPopup)}
            className={`${satoshi.className} transition-all duration-200 hover:opacity-75 cursor-pointer flex items-center justify-center text-primary bg-secondary px-6 py-2 font-bold text-2xl`}
          ><FaPlus /></div>

          {openPopup && (
            <div className="flex flex-col items-center justify-center bg-black/50 fixed bottom-0 left-0 top-0 select-none w-screen z-50">
              <form
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="on"
                className="relative bg-primary grid justify-items-center mx-auto w-5/6 max-w-[40rem] px-12"
              >
                <div
                  onClick={() => SetOpenPopup(!openPopup)}
                  className={`${satoshi.className} absolute top-0 right-0 flex items-center justify-center text-primary bg-secondary px-4 py-2 font-bold text-lg hover:opacity-75 cursor-pointer`}><IoMdClose /></div>
                <div className="bg-primary mx-auto w-full max-w-[40rem] relative flex justify-start gap-4 border-b border-b-secondaryText py-2">
                  <h1 className="uppercase font-light text-sm text-center w-full">Área de criação</h1>
                </div>
                {Object.keys(errors).length > 0 && (
                  <Alert type="error">
                    {errors.root?.message ??
                      "Corrija os campos abaixo e tente novamente!"}
                  </Alert>
                )}
                {isSubmitSuccessful && (
                  <Alert type="success">
                    Post criado com sucesso!
                  </Alert>
                )}
                <div className="flex items-start justify-between gap-8 mt-6 w-full">
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
                  <FormFieldWrapper $error={!!errors.subtitle}>
                    <FormFieldGrp>
                      <input
                        {...register("subtitle")}
                        inputMode="text"
                        placeholder="Subtítulo"
                        maxLength={100}
                        readOnly={isSubmitting}
                      />
                    </FormFieldGrp>
                    {errors.subtitle && (
                      <FormFieldError>{errors.subtitle.message}</FormFieldError>
                    )}
                  </FormFieldWrapper>
                </div>

                <div className="flex flex-col gap-2 mt-8 w-full">
                  <FormFieldWrapper $error={!!errors.content}>
                    <FormFieldGrp>
                      <textarea
                        {...register("content")}
                        inputMode="text"
                        placeholder="Parágrafo"
                        maxLength={10000}
                        readOnly={isSubmitting}
                        cols={56}
                        rows={8}
                      />
                    </FormFieldGrp>
                    {errors.content && (
                      <FormFieldError>{errors.content.message}</FormFieldError>
                    )}
                  </FormFieldWrapper>
                </div>

                <div className="flex items-start justify-between gap-8 mt-8 w-full">
                  {/* select theme */}
                  <FormFieldWrapper $error={!!errors.existedTheme}>
                    <FormFieldGrp>
                      <select
                        disabled={isSubmitting}
                        {...register("existedTheme")}
                      >
                        <option disabled value="selecione">
                          Tema
                        </option>
                        {posts?.map((post) => (
                          <option key={post.id} value={post.theme}>{post.theme}</option>
                        ))}
                      </select>
                    </FormFieldGrp>
                    {errors.existedTheme && (
                      <FormFieldError>{errors.existedTheme.message}</FormFieldError>
                    )}
                  </FormFieldWrapper>
                  {/* create theme */}
                  <FormFieldWrapper $error={!!errors.createTheme}>
                    <FormFieldGrp>
                      <input
                        {...register("createTheme")}
                        inputMode="text"
                        placeholder="Criar Tema"
                        maxLength={100}
                        readOnly={isSubmitting}
                      />
                    </FormFieldGrp>
                    {errors.createTheme && (
                      <FormFieldError>{errors.createTheme.message}</FormFieldError>
                    )}
                  </FormFieldWrapper>

                  <FormFieldWrapper $error={!!errors.author}>
                    <FormFieldGrp>
                      <select
                        disabled={isSubmitting}
                        {...register("author")}
                      >
                        <option disabled value="selecione">
                          Autor
                        </option>
                        {posts?.map((post) => (
                          <option key={post.id} value={post.author?.name}>{post.author?.name}</option>
                        ))}
                      </select>
                    </FormFieldGrp>
                    {errors.author && (
                      <FormFieldError>{errors.author.message}</FormFieldError>
                    )}
                  </FormFieldWrapper>

                </div>
                <div className="flex items-start justify-end w-full gap-4 mt-8 pb-4">
                  <button
                    onClick={() => SetOpenPopup(!openPopup)}
                    type="submit"
                    className={`${satoshi.className} flex items-center justify-center text-secondary bg-transparent border-secondaryText border px-6 py-2 font-bold text-sm w-fit`}>Cancelar</button>
                  <FormBtn
                    type="submit"
                    $isSubmitting={isSubmitting}
                    disabled={isSubmitting}
                    className={`${satoshi.className}`}>
                    {isSubmitting && (
                      <div className="text-xl">
                        <Spin>
                          <PiSpinnerBold className="text-primary" />
                        </Spin>
                      </div>
                    )}
                    <span>Criar</span>
                  </FormBtn>
                </div>

              </form>
            </div>
          )}
        </div>
      </div >
    </section >
  )
}