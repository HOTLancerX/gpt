"use client"
import { User } from "@/types/user"
import Image from "next/image"
import { useState, useEffect } from "react"

interface UserInfo {
  bio?: string
  tagline?: string
}

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState({
    profileCompletion: 0,
    lastLogin: "",
    accountAge: 0,
    settingsUpdated: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userDataStr = localStorage.getItem("user")
    if (userDataStr) {
      try {
        const parsedUser: User & { info?: UserInfo[]; createdAt?: string; updatedAt?: string } = JSON.parse(userDataStr)
        setUser(parsedUser)
        calculateStats(parsedUser)
      } catch (err) {
        console.error("Failed to parse user data:", err)
      }
    }
    setLoading(false)
  }, [])

  const calculateStats = (userData: User & { info?: UserInfo[]; createdAt?: string; updatedAt?: string }) => {
    if (!userData) return

    const fields: (keyof User)[] = ["name", "email", "phone", "photo", "slug"]
    const infoFields: (keyof UserInfo)[] = userData.info?.[0] ? ["bio", "tagline"] : []
    const totalFields = fields.length + infoFields.length

    const completedFields =
      fields.filter((field) => !!userData[field]).length +
      infoFields.filter((field) => !!userData.info?.[0]?.[field]).length

    const completion = Math.round((completedFields / totalFields) * 100)

    const createdDate = new Date(userData.createdAt || Date.now())
    const now = new Date()
    const ageInDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))

    const updatedDays = userData.updatedAt
      ? Math.floor((Date.now() - new Date(userData.updatedAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0

    setStats({
      profileCompletion: completion,
      lastLogin: new Date().toLocaleDateString(),
      accountAge: ageInDays,
      settingsUpdated: updatedDays,
    })
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name || "User"}! Heres your account overview.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center space-x-6">
          <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
            {user?.photo ? (
              <Image
                className="h-20 w-20 rounded-full object-cover"
                src={user.photo || "/placeholder.svg"}
                alt={user.name}
                width={50}
                height={50}
              />
            ) : (
              <span className="text-2xl font-bold text-gray-700">{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{user?.name || "User"}</h2>
            <p className="text-gray-600">{user?.email}</p>
            {user?.info?.[0]?.tagline && (
              <p className="text-sm text-gray-500 mt-1">{user.info[0].tagline}</p>
            )}
            <div className="mt-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Profile Completion:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.profileCompletion}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-blue-600">{stats.profileCompletion}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profile Complete</p>
              <p className="text-3xl font-bold text-blue-600">{stats.profileCompletion}%</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {stats.profileCompletion < 100 ? "Complete your profile" : "Profile completed!"}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Last Login</p>
              <p className="text-lg font-bold text-green-600">{stats.lastLogin}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">Today</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Account Age</p>
              <p className="text-3xl font-bold text-purple-600">{stats.accountAge}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {stats.accountAge === 0 ? "New today!" : `${stats.accountAge} days`}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Account Type</p>
              <p className="text-lg font-bold text-indigo-600 capitalize">{user?.type || "User"}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                user?.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {user?.status || "active"}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/me/settings"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Update Settings</h3>
              <p className="text-sm text-gray-600">Manage your profile</p>
            </div>
          </a>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Refresh Data</h3>
              <p className="text-sm text-gray-600">Update dashboard</p>
            </div>
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token")
              localStorage.removeItem("user")
              window.location.href = "/"
            }}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            <div className="bg-red-100 p-2 rounded-lg mr-3">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Logout</h3>
              <p className="text-sm text-gray-600">Sign out safely</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}