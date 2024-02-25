import * as yup from "yup";

export const createBlogSchema = yup
.object({
  title: yup
  .string()
  .trim()
  .required("Campo obrigatório"),
  subTitle: yup
  .string()
  .trim()
  .required("Campo obrigatório"),
  themeInput: yup
  .string()
  .trim()
  .required("Campo obrigatório"),
  themeSelect: yup
  .string()
  .trim()
  .required("Campo obrigatório"),
  paragraph: yup
  .string()
  .trim()
  .required("Campo obrigatório"),
})
export type TCreateBlog = yup.InferType<typeof createBlogSchema>;
