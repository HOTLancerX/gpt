"use client"
import { useRouter } from "next/navigation"
import UserForm from "../UserForm"

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  const handleSave = () => {
    router.push("/admin/users")
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit User</h1>
      <UserForm userId={params.id} onSave={handleSave} />
    </div>
  )
}
