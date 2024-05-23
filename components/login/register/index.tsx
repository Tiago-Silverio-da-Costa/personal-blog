"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { TAuthorRegister, authorRegisterSchema } from "@/app/api/login/utils";
import { signIn } from "next-auth/react";
import Alert from "@/components/commom/alert";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FormFieldError, FormFieldWrapper, FormFieldGrp, LoginBtn, Spin } from "@/styles/createBlogForms";
import Link from "next/link";
import { PiSpinnerBold } from "react-icons/pi";

export default function AuthorRegister() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<TAuthorRegister>({
    resolver: yupResolver(authorRegisterSchema),
    reValidateMode: "onSubmit",
  });

  const formSubmit = async (data: TAuthorRegister) => {
    if (isSubmitting || isSubmitSuccessful) return;
    clearErrors();

    const gRecaptchaToken = await window.grecaptcha.enterprise.execute(
      process.env.RECAPTCHA_KEY as string,
      { action: "login" }
    );

    const responseData = await fetch("/api/register", {
      credentials: "include",
      cache: "no-cache",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        gRecaptchaToken,
      }),
    })

    if (responseData?.status === 200) {
      reset(
        {
          email: "",
          password: "",
        },
        {
          keepValues: false,
          keepIsSubmitted: true,
        }
      );
      return;
    }
    setError("root", {
      type: "manual",
      message: "Erro ao processar cadastro!",
    })
  }


  return (
    <div className="w-4/5 mx-auto max-w-md mt-8 text-center min-h-[80vh] flex flex-col  justify-center">

      <h1 className="text-lg font-bold">Cadastro</h1>
      <p className="mb-5 text-xs font-light">
        Deseja Fazer o login?{" "}
        <Link href="/login" className="font-bold text-zinc-300 underline">
          Clique aqui!
        </Link>
      </p>
      <p className="text-center text-sm font-light mb-3 w-5/6 mx-auto">Cadastre-se como autor</p>


      {isSubmitSuccessful && (
        <div className="mb-2">
          <Alert type="success">Cadastrado realizado com sucesso!</Alert>
        </div>
      )}
      {Object.keys(errors).length > 0 && (
        <div className="mb-2">
          <Alert type="error">
            {errors.root?.message ?? "Corrija o campo abaixo!"}
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit(formSubmit)} noValidate>
        <div className="text-start">

          <FormFieldWrapper $error={!!errors.name}>
            <FormFieldGrp>
              <input
                type="text"
                placeholder="Nome"
                {...register("name")}
              />
            </FormFieldGrp>
            {errors.name && <FormFieldError>{errors.name.message}</FormFieldError>}
          </FormFieldWrapper>

          <FormFieldWrapper $error={!!errors.email}>
            <FormFieldGrp>
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className={errors.email ? "error" : ""}
              />
            </FormFieldGrp>
            {errors.email && <FormFieldError>{errors.email.message}</FormFieldError>}
          </FormFieldWrapper>

          <FormFieldWrapper $error={!!errors.profession}>
            <FormFieldGrp>
              <input
                type="text"
                placeholder="Profissão"
                {...register("profession")}
                className={errors.profession ? "error" : ""}
              />
            </FormFieldGrp>
            {errors.profession && <FormFieldError>{errors.profession.message}</FormFieldError>}
          </FormFieldWrapper>

          <FormFieldWrapper $error={!!errors.password}>
            <FormFieldGrp>
              <input
                {...register("password")}
                inputMode="text"
                placeholder="Senha"
                maxLength={24}
                readOnly={isSubmitting}
                type={showPassword ? "text" : "password"}
              />
              <div
                className="cursor-pointer text-lg opacity-70"
                onClick={() => !isSubmitting && setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </div>
            </FormFieldGrp>
            {errors.password && <FormFieldError>{errors.password.message}</FormFieldError>}
          </FormFieldWrapper>

          <FormFieldWrapper $error={!!errors.confirmPassword}>
            <FormFieldGrp>
              <input
                {...register("confirmPassword")}
                inputMode="text"
                placeholder="Senha"
                maxLength={24}
                readOnly={isSubmitting}
                type={showPassword ? "text" : "password"}
              />
              <div
                className="cursor-pointer text-lg opacity-70"
                onClick={() => !isSubmitting && setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </div>
            </FormFieldGrp>
            {errors.confirmPassword && <FormFieldError>{errors.confirmPassword.message}</FormFieldError>}
          </FormFieldWrapper>
        </div>
        <div className="mt-2">
          <LoginBtn
            type="submit"
            $isSubmitting={isSubmitting}
            disabled={isSubmitting}
          >
            <span className="font-bold">Cadastrar</span>
            {isSubmitting && (
              <div className="text-xl">
                <Spin>
                  <PiSpinnerBold />
                </Spin>
              </div>
            )}
          </LoginBtn>
        </div>
      </form>
      {/* providers */}
      <button
        className="text-white"
        type="submit"
        onClick={() => signIn("github")}
      >Signin with GitHub
      </button>

    </div >
  )
}