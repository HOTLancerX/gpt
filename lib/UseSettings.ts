"use client"
import { useState, useEffect } from "react"

export function Settings() {
  const [settings, setSettings] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data))
  }, [])

  return settings
}
