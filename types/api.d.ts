type ApiReturnSuccess = {
  status: "success"
  message?: string
}

type ApiReturnError = {
  status: "error"
  message: string
  error?: string
}