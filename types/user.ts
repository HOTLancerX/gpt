export interface UserInfo {
  bio?: string
  tagline?: string
}

export interface User {
  _id: string
  name: string
  email: string
  phone?: string
  photo?: string
  slug?: string
  type: "user" | "admin" | string
  status: "active" | "inactive" | string
  info?: UserInfo[]
  createdAt?: string
  updatedAt?: string
  password: string
}
