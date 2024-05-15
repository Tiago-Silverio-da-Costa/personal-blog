
import * as yup from "yup";

export const authorRegisterSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  profession: yup.string().required(),
  password: yup.string().required(),
  confirmPassword: yup.string().required(),
});
export type TAuthorRegister = yup.InferType<typeof authorRegisterSchema>;
