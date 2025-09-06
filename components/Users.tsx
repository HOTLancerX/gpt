"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Auth from "./Auth"
import Image from "next/image"
import { User } from "@/types/user"

export default function Users() {
  const [user, setUser] = useState<User | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setShowDropdown(false)
  }

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
        >
          <Image width={50} height={50} src={user.photo || "/placeholder.svg"} alt={user.name} className="w-8 h-8 rounded-full" />
          <span>{user.name}</span>
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
            <Link
              href="/me"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setShowDropdown(false)}
            >
              My Account
            </Link>
            {user?.type === "admin" && (
              <Link
                href="/admin"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Admin Panel
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <Link
        href="/me"
        onClick={(e) => {
          e.preventDefault()
          setShowAuth(true)
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Login
      </Link>

      {showAuth && <Auth onClose={() => setShowAuth(false)} />}
    </>
  )
}
