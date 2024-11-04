import { User } from './user.type'
import { ResponseSuccessApi } from './utils.type'

export type AuthResponse = ResponseSuccessApi<{
  access_token: string
  refresh_token: string
  user: User
}>

export type AuthRequestBody = {
  full_name: string
  username: string
  email: string
  password: string
  confirm_password: string
  phone_number: string
}

export type RefreshTokenResponse = ResponseSuccessApi<{
  access_token: string
  refresh_token: string
}>
