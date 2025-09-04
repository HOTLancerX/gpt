"use client"
import { useState, useEffect } from "react"
import type React from "react"

export default function UserSettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    slug: "",
    photo: "",
    type: "user",
    status: "active",
    info: [],
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      setFormData({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
        slug: parsedUser.slug || "",
        photo: parsedUser.photo || "",
        type: parsedUser.type || "user",
        status: parsedUser.status || "active",
        info: parsedUser.info || [],
      })
    }
  }, [])

  const handleInfoChange = (index: number, key: string, value: string) => {
    const newInfo = [...formData.info]
    if (!newInfo[index]) newInfo[index] = {}
    newInfo[index][key] = value
    setFormData({ ...formData, info: newInfo })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?._id) return

    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        alert("Settings updated successfully")
        const updatedUser = { ...user, ...formData }
        localStorage.setItem("user", JSON.stringify(updatedUser))
        setUser(updatedUser)
      } else {
        alert(data.error || "Failed to update settings")
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred")
    }
  }

  if (!user) return <div>Loading...</div>

  // User cannot change type if they are not an admin
  const isAdmin = user.type === "admin"

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">User Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <InputField label="Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} />

        {/* Email */}
        <InputField label="Email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} />

        {/* Phone */}
        <InputField label="Phone" value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} />

        {/* Slug */}
        <InputField label="Slug" value={formData.slug} onChange={(v) => setFormData({ ...formData, slug: v })} />

        {/* Photo URL */}
        <InputField label="Photo URL" value={formData.photo} onChange={(v) => setFormData({ ...formData, photo: v })} />

        {/* Type (user/admin) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select
            className="w-full p-3 border rounded-lg"
            value={formData.type}
            disabled={!isAdmin} // User cannot change type if not admin
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {!isAdmin && <p className="text-sm text-gray-500 mt-1">Only admins can change user type</p>}
        </div>

        {/* Status */}
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

        {/* Info fields dynamically */}
        {formData.info.map((infoItem: any, index: number) => (
          <div key={index} className="space-y-4">
            <InputField
              label="Bio"
              value={infoItem.bio || ""}
              onChange={(v) => handleInfoChange(index, "bio", v)}
            />
            <InputField
              label="Tagline"
              value={infoItem.tagline || ""}
              onChange={(v) => handleInfoChange(index, "tagline", v)}
            />
          </div>
        ))}

        <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">
          Update Settings
        </button>
      </form>
    </div>
  )
}

function InputField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type="text"
        className="w-full p-3 border rounded-lg"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
