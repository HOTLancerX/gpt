"use client"
import { useState } from "react"
import type React from "react"

interface AuthProps {
  onClose: () => void
}

export default function Auth({ onClose }: AuthProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    slug: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const endpoint = activeTab === "login" ? "/api/auth/login" : "/api/auth/signup"

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        if (activeTab === "login") {
          localStorage.setItem("token", data.token)
          localStorage.setItem("user", JSON.stringify(data.user))
        }
        window.location.reload()
        onClose()
      } else {
        alert(data.error)
      }
    } catch (error) {
      alert("An error occurred")
    }
  }

  const handleGoogleLogin = () => {
    // Google OAuth implementation
    window.location.href = "/api/auth/signin/google"
  }

  const handleGitHubLogin = () => {
    // GitHub OAuth implementation
    window.location.href = "/api/auth/signin/github"
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 px-4 text-center ${
              activeTab === "login" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center ${
              activeTab === "signup" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "signup" && (
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 border rounded-lg"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          )}

          <input
            type="text"
            placeholder="Email/Slug/Phone"
            className="w-full p-3 border rounded-lg"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          {activeTab === "signup" && (
            <>
              <input
                type="tel"
                placeholder="Phone"
                className="w-full p-3 border rounded-lg"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <input
                type="text"
                placeholder="Slug"
                className="w-full p-3 border rounded-lg"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </>
          )}

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">
            {activeTab === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 space-y-2">
          <button onClick={handleGoogleLogin} className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600">
            Continue with Google
          </button>
          <button
            onClick={handleGitHubLogin}
            className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900"
          >
            Continue with GitHub
          </button>
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          ×
        </button>
      </div>
    </div>
  )
}
