export interface Profile {
  id: string
  full_name: string
  email: string
  phone: string | null
  created_at: string
}

export interface ProfileFormData {
  full_name: string
  phone: string
}

