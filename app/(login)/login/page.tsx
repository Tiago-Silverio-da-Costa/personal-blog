import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personal blog – Fazer Login",
}

export default function Index() {
  return (
    <>
    
    {/* {!isSubmitSuccessful &&
        (errorParam || Object.keys(errors).length > 0) && (
          <div className="mb-2">
            <Alert type="error">
              {Object.keys(errors).length > 0 && !errors.root
                ? "Corrija os campos abaixo!"
                : errors.root?.message == "CredentialsSignin" ||
                  errorParam == "CredentialsSignin"
                  ? "Usuário ou senha inválidos!"
                  : errors.root?.message == "AccessDenied" ||
                    errorParam == "AccessDenied"
                    ? "Acesso não autorizado!"
                    : "Erro ao processar login!"}
            </Alert>
          </div>
        )} */}
    </>
  )
}