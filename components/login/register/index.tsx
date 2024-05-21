"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { TAuthorRegister, authorRegisterSchema } from "@/app/api/login/utils";
import { signIn } from "next-auth/react";
import Alert from "@/components/commom/alert";
import { useSearchParams } from "next/navigation";

export default function AuthorRegister() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const errorParam = useSearchParams()?.get("error")
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

    // const responseData = await fetch("/api/register", {
    //   credentials: "include",
    //   cache: "no-cache",
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(data),
    // })

    // token 

    const token = await window.grecaptcha.enterprise.execute(
			process.env.NEXT_PUBLIC_RECAPTCHA_KEY as string,
			{ action: "login" }
		);

    const loginResponse = await signIn("credentials", {
      email: data.email,
      password: data.password,
      loginToken: token,
      redirect: false,
    });

    if (loginResponse?.status === 200) {
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
      message: loginResponse?.error ?? "Erro ao processar login!",
    })
  }


  return (
    <div className="flex flex-col items-center justify-center py-8">
      {isSubmitSuccessful && (
        <div className="mb-2">
          <Alert type="success">Login realizado! Redirecionando...</Alert>
        </div>
      )}
      {!isSubmitSuccessful &&
        (errorParam || Object.keys(errors).length > 0) && (
          <div className="mb-2">
            <Alert type="error">
              {Object.keys(errors).length > 0 && !errors.root
                ? "Corrija os campos abaixo!"
                : errors.root?.message == "CredentialsSignin" ||
                  errorParam == "CredentialsSignin"
                  ? "Usuário ou senha inválidos!"
                  : errors.root?.message == "AccessDenied" ||
                    errorParam == "AccessDenied"
                    ? "Acesso não autorizado!"
                    : "Erro ao processar login!"}
            </Alert>
          </div>
        )}
      <h1 className="text-2xl font-bold text-white">Cadastre-se como autor</h1>
      <form className="flex flex-col gap-4 text-black" onSubmit={handleSubmit(formSubmit)}>

        <input
          type="text"
          placeholder="Nome"
          {...register("name")}
          className={errors.name ? "error" : ""}
        />
        {errors.name && <p>{errors.name.message}</p>}

        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className={errors.email ? "error" : ""}
        />
        {errors.email && <p>{errors.email.message}</p>}

        <input
          type="text"
          placeholder="Profissão"
          {...register("profession")}
          className={errors.profession ? "error" : ""}
        />
        {errors.profession && <p>{errors.profession.message}</p>}

        <div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            {...register("password")}
            className={errors.password ? "error" : ""}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        {errors.password && <p>{errors.password.message}</p>}

        <div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirme a senha"
            {...register("confirmPassword")}
            className={errors.confirmPassword ? "error" : ""}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

        {errors.root && <p>{errors.root.message}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar"}
        </button>
      </form >
      {/* providers */}
      <button
        className="text-white"
        type="submit"
        onClick={() => !isSubmitting && !isSubmitSuccessful && signIn("github")}
      >Signin with GitHub
      </button>

    </div >
  )
}