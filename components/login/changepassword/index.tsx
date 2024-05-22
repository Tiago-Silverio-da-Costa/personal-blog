import { TChangePassword, changePasswordSchema } from "@/app/api/login/changepassword/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormFieldError, FormFieldWrapper, FormFieldGrp, LoginBtn, Spin } from "@/styles/createBlogForms";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import Alert from "@/components/commom/alert";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { PiSpinnerBold } from "react-icons/pi";

export default function ChangePassword({ token }: { token: string }) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const router = useRouter()
  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    setError,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<TChangePassword>({
    resolver: yupResolver(changePasswordSchema),
    reValidateMode: "onSubmit",
  });

  const formSubmit = async (data: TChangePassword) => {
    if (isSubmitting) return;
    clearErrors();

    const gRecaptchaToken = await window.grecaptcha.enterprise.execute(
      process.env.NEXT_PUBLIC_RECAPTCHA_KEY as string,
      { action: "changepassword" }
    );

    const responseData = await fetch("/api/login/changepassword", {
      credentials: "include",
      cache: "no-cache",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        gRecaptchaToken,
        token,
        ...data,
      })
    })

    if (responseData.status == 200) {
      const response: ApiReturnSuccess = await responseData.json();
      if (response.status == "success") {
        reset(
          {
            password: "",
            confirmPassword: "",
          },
          {
            keepIsSubmitted: true,
          }
        );
        setTimeout(() => {
          router.push("/login");
        }, 3000);
        return;
      }
    } else if (responseData.status == 400 || responseData.status == 403) {
      const response: {
        fields?: (keyof TChangePassword)[];
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
              message: "verifique o campo"
            })
          })
        return
      }
    }
    setError("root", {
      type: "custom",
      message:
        "Ocorreu um erro inesperado! Verifique os dados e tente novamente.",
    });


  }


  return (
    <div className="w-4/5 mx-auto max-w-md mt-8 text-center">
      <h1 className="text-lg font-bold">Trocar Senha</h1>
      <p className="mb-5 text-xs font-light">
        Quer fazer login?{" "}
        <Link href="/admin/login" className="font-bold text-zinc-300 underline">
          Clique aqui!
        </Link>
      </p>

      <p className="text-center text-sm font-light mb-3 w-5/6 mx-auto">
        Informe a nova senha e confirme-a para trocar a senha da sua conta
      </p>

      {isSubmitSuccessful && (
        <div className="mb-2">
          <Alert type="success">
            Senha alterada com sucesso! Redirecionando para o login...
          </Alert>
        </div>
      )}

      {Object.keys(errors).length > 0 && (
        <div className="mb-2">
          <Alert type="error">
            {errors.root?.message ?? "Corrija os campos abaixo!"}
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit(formSubmit)} noValidate>
        <div className="flex gap-2 flex-col text-start">
          <FormFieldWrapper $error={!!errors.password}>
            <FormFieldGrp>
              <input
                {...register("password")}
                inputMode="text"
                placeholder="Nova Senha"
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
            {errors.password && (
              <FormFieldError>{errors.password.message}</FormFieldError>
            )}
          </FormFieldWrapper>

          <FormFieldWrapper $error={!!errors.confirmPassword}>
            <FormFieldGrp>
              <input
                {...register("confirmPassword")}
                inputMode="text"
                placeholder="Confirmar Nova Senha"
                maxLength={24}
                readOnly={isSubmitting}
                type={showConfirmPassword ? "text" : "password"}
              />
              <div
                className="cursor-pointer text-lg opacity-70"
                onClick={() =>
                  !isSubmitting && setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? (
                  <AiOutlineEye />
                ) : (
                  <AiOutlineEyeInvisible />
                )}
              </div>
            </FormFieldGrp>
            {errors.confirmPassword && (
              <FormFieldError>{errors.confirmPassword.message}</FormFieldError>
            )}
          </FormFieldWrapper>
        </div>

        <div className="mt-2">
          <LoginBtn
            type="submit"
            $isSubmitting={isSubmitting}
            disabled={isSubmitting}
          >
            <span className="font-bold">Trocar Senha</span>
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
    </div>
  );
}
