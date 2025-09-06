export interface User {
  _id: string
  name: string
  email: string
  phone: string
  slug: string
  password: string
  photo: string
  type: "admin" | "user"
  status: "active" | "inactive"
  info: {
    bio: string
    tagline: string
  }[]
}
