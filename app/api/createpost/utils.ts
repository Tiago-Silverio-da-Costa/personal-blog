import * as yup from "yup";
import { prisma } from "@/adapter/db";

export const createBlogSchema = yup.object({
  title: yup.string().trim().required("Campo obrigatório"),
  subtitle: yup.string().trim().required("Campo obrigatório"),
  createTheme: yup.string().trim(),
  existedTheme: yup.string().trim(),
  existedAuthor: yup.string().trim().required("Campo obrigatório"),
  content: yup.string().trim().required("Campo obrigatório"),
  profession: yup.string().trim().required("Campo obrigatório"),
});
export type TCreateBlog = yup.InferType<typeof createBlogSchema>;

export async function getPostById(postId: string) {
  if (!postId) {
    throw new Error("ID do post não fornecido.");
  }
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
    },
  });
  return post;
}
