import * as yup from "yup";
import { prisma } from "@/adapter/db";

export const createBlogSchema = yup
  .object({
    gRecaptchaToken: yup.string(),
    title: yup.string().trim().required("Campo obrigatório"),
    subtitle: yup.string().trim().required("Campo obrigatório"),
    existedAuthor: yup
      .string()
      .trim()
      .test({
        name: "required",
        exclusive: true,
        message: "Campo obrigatório",
        test: (value) => value !== "selecione",
      }),
    profession: yup
      .string()
      .trim()
      .test({
        name: "required",
        exclusive: true,
        message: "Campo obrigatório",
        test: (value) => value !== "selecione",
      }),
    content: yup.string().trim().required("Campo obrigatório"),
  })
  .shape(
    {
      existedTheme: yup
        .string()
        .trim()
        .when("createTheme", {
          is: "",
          then: (schema) =>
            schema.test({
              name: "required",
              exclusive: true,
              message: "Campo obrigatório",
              test: (value) => value !== "selecione",
            }),
          otherwise: (schema) => schema.notRequired(),
        }),
      createTheme: yup
        .string()
        .trim()
        .when("existedTheme", {
          is: "selecione",
          then: (schema) => schema.required("Campo obrigatório"),
          otherwise: (schema) => schema.notRequired(),
        }),
    },
    [["existedTheme", "createTheme"]]
  );
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
