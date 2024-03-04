import * as yup from "yup";
import { prisma } from "@/adapter/db";

export const createBlogSchema = yup
.object({
  title: yup
  .string()
  .trim()
  .required("Campo obrigatório"),
  subtitle: yup
  .string()
  .trim()
  .required("Campo obrigatório"),
  theme: yup
  .string()
  .trim()
  .required("Campo obrigatório"),
  themeSelect: yup
  .string()
  .trim(),
  content: yup
  .string()
  .trim()
  .required("Campo obrigatório")
  ,
})
export type TCreateBlog = yup.InferType<typeof createBlogSchema>;


export async function getPostById(id: string) {
  const post = await prisma.post.findUnique({
    where: {
      id: "4a77ab5c-bf1c-415b-8fd3-dbbd47532752",
    }, 
    select: {
      id: true,
    }
  });
  return post;
}