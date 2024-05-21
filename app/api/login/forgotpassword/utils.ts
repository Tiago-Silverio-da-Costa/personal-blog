import { isEmail } from "validator";
import * as yup from "yup";

export const forgotPasswordSchema = yup
  .object({
    gRecaptchaToken: yup.string(),
    email: yup
      .string()
      .lowercase()
      .trim()
      .required("Campo obrigatório")
      .test({
        name: "valid-email",
        message: "Digite um email válido",
        test: (value) => isEmail(value ?? ""),
      }),
  })
  .required();
export type TForgotPassword = yup.InferType<
  typeof forgotPasswordSchema
>;
