import { isStrongPassword } from "validator";
import * as yup from "yup";

export const changePasswordSchema = yup
  .object({
    token: yup.string(),
    gRecaptchaToken: yup.string(),
    password: yup
      .string()
      .required("Campo obrigatório")
      .test({
        name: "valid-password",
        message:
          "A senha deve ter no mínimo 8 caracteres e incluir letras maiúsculas e minúsculas e números",
        test: (value) => isStrongPassword(value ?? "", { minSymbols: 0 }),
      })
      .test({
        name: "max-valid-password",
        message: "A senha deve ter no máximo 24 caracteres",
        test: (value) => (value?.length ?? 0) <= 24,
      }),
    confirmPassword: yup
      .string()
      .required("Campo obrigatório")
      .oneOf([yup.ref("password")], "As senhas devem ser iguais"),
  })
  .required();
export type TChangePassword = yup.InferType<typeof changePasswordSchema>;
