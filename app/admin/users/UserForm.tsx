"use client"
import { useState, useEffect } from "react"
import type React from "react"

interface UserFormProps {
  userId?: string
  onSave: () => void
}

export default function UserForm({ userId, onSave }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    slug: "",
    password: "",
    photo: "",
    type: "user",
    status: "active",
    bio: "",
    tagline: "",
  })

  useEffect(() => {
    if (userId) {
      fetch(`/api/users/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            slug: data.slug || "",
            password: "",
            photo: data.photo || "",
            type: data.type || "user",
            status: data.status || "active",
            bio: data.info?.[0]?.bio || "",
            tagline: data.info?.[0]?.tagline || "",
          })
        })
    }
  }, [userId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const endpoint = userId ? `/api/users/${userId}` : "/api/users"
    const method = userId ? "PUT" : "POST"

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          info: [{ bio: formData.bio, tagline: formData.tagline }],
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert(userId ? "User updated successfully" : "User created successfully")
        onSave()
      } else {
        alert(data.error || "Failed to save user")
      }
    } catch (error) {
      alert("An error occurred")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
        <input
          type="text"
          className="w-full p-3 border rounded-lg"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          className="w-full p-3 border rounded-lg"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
        <input
          type="tel"
          className="w-full p-3 border rounded-lg"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
        <input
          type="text"
          className="w-full p-3 border rounded-lg"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password {userId && "(leave blank to keep current)"}
        </label>
        <input
          type="password"
          className="w-full p-3 border rounded-lg"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required={!userId}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Photo URL</label>
        <input
          type="url"
          className="w-full p-3 border rounded-lg"
          value={formData.photo}
          onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
        <select
          className="w-full p-3 border rounded-lg"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <select
          className="w-full p-3 border rounded-lg"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
        <textarea
          className="w-full p-3 border rounded-lg h-24"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
        <input
          type="text"
          className="w-full p-3 border rounded-lg"
          value={formData.tagline}
          onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
        />
      </div>

      <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
        {userId ? "Update User" : "Create User"}
      </button>
    </form>
  )
}
