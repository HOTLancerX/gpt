"use client"
import { Settings } from "@/lib/UseSettings"

export default function HelloPage() {
  const settings = Settings()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">{settings.site || "Welcome to CMS"}</h1>
        </div>
      </div>
    </div>
  )
}
