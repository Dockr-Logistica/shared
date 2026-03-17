export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  user_type?: string
  company_name?: string
  cnpj?: string
  activity?: string
  full_name: string
  email: string
  phone?: string
  city?: string
  state?: string
  referral_source?: string
  extra_message?: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface UserResponse {
  id: string
  email: string
  full_name: string
  role: string
  is_active: boolean
  status: string
  user_type?: string
  phone?: string
  city?: string
  state?: string
}
