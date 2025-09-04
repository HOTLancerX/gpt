"use client"

import { useRouter } from "next/navigation"
import UserForm from "../UserForm"
import React from "react"

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()

  const resolvedParams = React.use(params) // unwrap the promise
  const userId = resolvedParams.id

  const handleSave = () => {
    router.push("/admin/users")
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit User</h1>
      <UserForm userId={userId} onSave={handleSave} />
    </div>
  )
}
