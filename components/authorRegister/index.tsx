"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TAuthorRegister, authorRegisterSchema } from "@/app/api/register/utils";
import { signIn } from "next-auth/react";

export default function AuthorRegister() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const router = useRouter();

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
    if (isSubmitting) return;
    clearErrors();

    const responseData = await fetch("/api/register", {
      credentials: "include",
      cache: "no-cache",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    // token 


    const loginResponse = await signIn("credentials", {
      email: data.email,
      password: data.password,
      // loginToken: token,
      redirect: false,
    });
    }


  return (
    <div className="flex items-center justify-center py-8">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(formSubmit)}>
        <h1 className="text-2xl font-bold">Cadastre-se como autor</h1>
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
      </form>
    </div>
  )
}