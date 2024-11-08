export interface ResponseSuccessApi<Data> {
  message: string
  data: Data
}

export interface ResponseErrorApi<Data> {
  message: string
  data?: Data
}

// cú pháp `-?` sẽ loại bỏ undefiend của key optional
export type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>
}
