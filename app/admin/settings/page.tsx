"use client"
import { useEffect, useState } from "react"
import Text from "./Text"

export default function AdminSettingsPage() {
  const [site, setSite] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [footer, setFooter] = useState("")

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState(false)

  // Fetch all settings once
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings")
        const data = await res.json()
        setSite(data.site || "")
        setTitle(data.title || "")
        setDescription(data.description || "")
        setFooter(data.footer || "")
      } catch (err) {
        console.error("Failed to load settings:", err)
        setError("Failed to load settings")
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  // Submit all settings at once
  const handleSubmit = async () => {
    setSaving(true)
    setError("")
    setSuccess(false)
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            site,
            title,
            description,
            footer,
          },
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Save failed: ${res.status} - ${text}`)
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (err) {
      console.error("Failed to save settings:", err)
      setError(err instanceof Error ? err.message : "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <p className="text-gray-500 animate-pulse">Loading settings...</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Settings</h1>
      <div className="space-y-6">
        <Text name="site" value={site} onChange={setSite} />
        <Text name="title" value={title} onChange={setTitle} />
        <Text name="description" value={description} onChange={setDescription} />
        <Text name="footer" value={footer} onChange={setFooter} />
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      {success && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
          Settings saved successfully!
        </div>
      )}

      <div className="mt-8">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors ${
            saving
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? "Saving..." : "Save All Settings"}
        </button>
      </div>
    </div>
  )
}