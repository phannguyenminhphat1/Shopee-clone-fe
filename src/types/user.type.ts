type Role = 'Admin' | 'User' | 'Shipper'
export interface User {
  user_id: number
  username: string
  email: string
  password: string
  full_name: string
  phone_number: string
  address: string
  role: Role
  created_at: string
  updated_at: string
  date_of_birth: string
  avatar: string
}
