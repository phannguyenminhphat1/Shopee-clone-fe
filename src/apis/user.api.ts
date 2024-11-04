import { User } from 'src/types/user.type'
import { ResponseSuccessApi } from 'src/types/utils.type'
import http from 'src/utils/http'

// interface BodyUpdateProfile extends Omit<User, 'user_id' | 'roles' | 'createdAt' | 'updatedAt' | 'email' | 'username'> {
//   password?: string
//   newPassword?: string
// }
export const userApi = {
  getProfile: () => http.get<ResponseSuccessApi<User>>('user/get-me'),
  updateProfile: (body: { full_name: string; date_of_birth: string; phone_number: string; address: string }) =>
    http.put<ResponseSuccessApi<User>>('user/update-me', body),
  uploadAvatar: (body: FormData) => {
    return http.post<ResponseSuccessApi<string>>('user/upload-avatar', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  changePassword: (body: { password: string; new_password: string; confirm_password: string }) =>
    http.put<ResponseSuccessApi<User>>('user/change-password', body)
}
