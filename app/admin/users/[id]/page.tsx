"use client"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import UserForm from "../UserForm"

export default function EditUserPage() {
  const router = useRouter()
  const pathname = usePathname() // e.g., "/admin/users/123"
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Extract the ID from the pathname
    const segments = pathname.split("/")
    const id = segments[segments.length - 1] // last segment is the user ID
    setUserId(id)
  }, [pathname])

  const handleSave = () => {
    router.push("/admin/users")
  }

  if (!userId) return <div>Loading...</div>

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit User</h1>
      <UserForm userId={userId} onSave={handleSave} />
    </div>
  )
}
