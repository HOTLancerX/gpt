"use client"
import { useEffect, useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/")
      return
    }

    const parsedUser = JSON.parse(userData)

    if (parsedUser.type !== "admin") {
      router.push("/")
      return
    }

    setUser(parsedUser)
    setLoading(false)
  }, [router])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!user || user.type !== "admin") {
    return null
  }

  return (
    <div>
      <div>{children}</div>
    </div>
  )
}
