"use client";

import { TForgotPassword, forgotPasswordSchema } from "@/app/api/login/forgotpassword/utils";
import Alert from "@/components/commom/alert";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function ForgotPassword() {

  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = useForm<TForgotPassword>({
    resolver: yupResolver(forgotPasswordSchema),
    reValidateMode: "onSubmit",
  });

  const formSubmit = async (data: TForgotPassword) => {
    if (isSubmitting) return;
    clearErrors();

    const gRecaptchaToken = await window.grecaptcha.enterprise.execute(
      process.env.NEXT_PUBLIC_RECAPTCHA_KEY as string,
      { action: "forgotpassword" }
    );

    const responseData = await fetch("/api/login/forgotpassword", {
      credentials: "include",
      cache: "no-cache",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gRecaptchaToken,
        ...data,
      }),
    });

    if (responseData.status == 200) {
      const response: ApiReturnSuccess = await responseData.json();
      if (response.status == "success") {
        reset(
          {
            email: "",
          },
          {
            keepIsSubmitted: true,
          }
        );
        return;
      }
    } else if (responseData.status == 400 || responseData.status == 403) {
      const response: {
        fields?: (keyof TForgotPassword)[];
      } & ApiReturnError = await responseData.json();

      if (response.status == "error") {
        if (response.message)
          setError("root", {
            type: "custom",
            message: response.message
          });

        if (response.fields)
          response.fields.forEach((field) => {
            setError(field, {
              type: "custom",
              message: "Verifique o campo!",
            });
          });

        return;
      }
    }

    setError("root", {
      type: "custom",
      message: "Ocorreu um erro inesperado!"
    });
  };

  return (
    <div className="w-4/5 mx-auto max-w-md mt-8 text-center">
      <h1 className="text-lg font-bold">Esqueci a Senha</h1>
      <p className="mb-5 text-xs font-light">
        Deseja Fazer o login?{" "}
        <Link href="/login" className="font-bold text-zinc-300 underline">
          Clique aqui!
        </Link>
      </p>

      <p className="text-center text-sm font-light mb-3 w-5/6 mx-auto">
        Informe o e-mail associasdo à sia conta para trocar a senha
      </p>
      {/* 
        verificar se email existe no banco, antes de permitir o envio do formulário
      */}
      {isSubmitSuccessful && (
        <div className="mb-2">
          Vá ao e-mail e siga as instruções para trocar a senha.
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
            <div>
              
            </div>
        </div>
      </form>

    </div>
  )
}