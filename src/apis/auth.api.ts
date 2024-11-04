import { AuthRequestBody, AuthResponse } from 'src/types/auth.type'
import http from 'src/utils/http'

const authApi = {
  registerApi: (body: AuthRequestBody) =>
    http.post<Omit<AuthResponse, 'access_token' | 'refresh_token'>>(`auth/register`, body),
  loginApi: (body: { username: string; password: string }) => http.post<AuthResponse>('auth/login', body),
  lougoutApi: (body: { refresh_token: string }) => http.post<{ message: string }>('user/logout', body)
}
export default authApi
