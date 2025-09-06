"use client"
import { useState, useEffect } from "react"
import type React from "react"

import Text from "./Text"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<{ [key: string]: string }>({
    site: "",
    title: "",
    description: "",
    footer: "",
  })

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings((prev) => ({ ...prev, ...data })))
  }, [])

  const handleSettingChange = (name: string, content: string) => {
    setSettings((prev) => ({ ...prev, [name]: content }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      })

      const data = await response.json()

      if (data.success) {
        alert("Settings updated successfully")
      } else {
        alert("Failed to update settings")
      }
    } catch (error) {
      alert("An error occurred")
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Text name="site" content={settings.site} onChange={handleSettingChange} />

        <Text name="title" content={settings.title} onChange={handleSettingChange} />

        <Text name="description" content={settings.description} onChange={handleSettingChange} />

        <Text name="footer" content={settings.footer} onChange={handleSettingChange} />

        <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
          Save Settings
        </button>
      </form>
    </div>
  )
}
