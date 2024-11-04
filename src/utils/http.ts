import axios, { AxiosError, AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import HttpStatusCode from 'src/constant/httpStatusCode.enum'
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokenToLS,
  setRoleToLS
} from './auth'
import { AuthResponse, RefreshTokenResponse } from 'src/types/auth.type'
import { isAxiosUnauthorizedError } from './utils'
const DOMAIN = 'https://nguyenminhphat.io.vn/api/'
class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null

  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: DOMAIN,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          // config.headers.Authorization = this.accessToken
          config.headers.Authorization = `Bearer ${this.accessToken}`
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === 'auth/login') {
          const data = response.data as AuthResponse
          // this.accessToken = `Bearer ${data.data.access_token as string}`
          this.accessToken = data.data.access_token as string
          this.refreshToken = data.data.refresh_token
          setAccessTokenToLS(this.accessToken)
          setRefreshTokenToLS(this.refreshToken)
          setProfileToLS(data.data.user)
          setRoleToLS(data.data.user.role)
        } else if (url === 'user/logout') {
          this.accessToken = ''
          this.refreshToken = ''
          clearLS()
        }
        return response
      },
      // Lỗi
      (error: AxiosError) => {
        // Chỉ toast lỗi không phải 422 và 401
        if (
          ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          toast.error(message, { autoClose: 2000 })
        }

        // Lỗi 401
        if (isAxiosUnauthorizedError(error)) {
          const config = error.response?.config
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { url } = config as any
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((error.response?.data as any).data.name === 'EXPRIRED_ACCESS_TOKEN' && url !== 'user/refresh-token') {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  // Giữ refresh_token lại trong 10s tránh tình trạng gọi 2 API khiến refresh_token lại bị gọi lại
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })
            return this.refreshTokenRequest.then((access_token) => {
              if (config?.headers) {
                config.headers.Authorization = `Bearer ${access_token}`
                return this.instance(config)
              }
              // if (config) {
              //   return this.instance({ ...config, headers: { ...config.headers, Authorization: access_token } })
              // }
            })
          }

          clearLS()
          this.accessToken = ''
          this.refreshToken = ''
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          toast.error((error.response?.data as any).data.message || (error.response?.data as any).message)
          window.location.reload()
        }
        return Promise.reject(error)
      }
    )
  }

  private handleRefreshToken() {
    return (
      this.instance
        .post<RefreshTokenResponse>('user/refresh-token', {
          refresh_token: this.refreshToken
        })
        .then((result) => {
          const { access_token, refresh_token } = result.data.data
          setAccessTokenToLS(access_token)
          setRefreshTokenToLS(refresh_token)
          this.accessToken = access_token
          this.refreshToken = refresh_token
          return access_token
        })
        // Khi thất bại, do refresh_token hết hạn hoặc invalid thì logout
        .catch((err) => {
          clearLS()
          this.accessToken = ''
          this.refreshToken = ''
          throw err.response
        })
    )
  }
}
const http = new Http().instance

export default http
