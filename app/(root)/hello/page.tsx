'use client'

import { useSettings } from "@/lib/UseSettings"

export default function HelloPage() {
  const { settings, loading } = useSettings()

  if (loading) return <div>Loading...</div>

  return <div>{settings.site || "Welcome to CMS"}</div>
}