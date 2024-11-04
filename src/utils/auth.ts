import { User } from 'src/types/user.type'

// export const LocalStorageEventTarget = new EventTarget()
export const setAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}

export const setRefreshTokenToLS = (refresh_token: string) => {
  localStorage.setItem('refresh_token', refresh_token)
}
export const setRoleToLS = (role: string) => {
  localStorage.setItem('role', role)
}

export const setProfileToLS = (profile: User) => localStorage.setItem('profile', JSON.stringify(profile))

export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || ''
export const getRefreshTokenFromLS = () => localStorage.getItem('refresh_token') || ''

export const getRoleFromLS = () => localStorage.getItem('role') || null

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
  localStorage.removeItem('role')
  localStorage.removeItem('refresh_token')
}
