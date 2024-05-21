
import * as yup from "yup";
import { redis } from '@/adapter/redis';
import { v4 as uuidv4 } from "uuid";

export const authorRegisterSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  profession: yup.string().required(),
  password: yup.string().required(),
  confirmPassword: yup.string().required(),
});
export type TAuthorRegister = yup.InferType<typeof authorRegisterSchema>;


const prefix = "auth:forgotpassword"
type ForgotPasswordTokenProps = {
  userUuid: string;
}

export async function generateForgotPasswordToken(uuid: string) {
  const token = uuidv4();
  const expires = 60 * 15; // 15 minutes

  const response = await redis.set(`${prefix}:${token}`, uuid, { ex: expires })
  return response === 'OK' ? token : null;
}

export async function validateForgotPasswordToken(token: string) {
  const uuid:
    | string
    | null
    = await redis.get(`${prefix}:${token}`)
  return uuid;
}

export async function deleteForgotPasswordToken(token: string) {
  const response = await redis.del(`${prefix}:${token}`)
  return response === 1;
}