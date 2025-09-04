"use client"
import type React from "react"

interface TextProps {
  name: string
  value: string
  onChange: (val: string) => void
}

export default function Text({ name, value, onChange }: TextProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <label className="block text-sm font-semibold text-gray-800 mb-3 capitalize">
        {name.replace(/([A-Z])/g, " $1").trim()}
      </label>

      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:border-transparent resize-none focus:ring-blue-500 transition-colors"
        value={value}
        onChange={handleChange}
        placeholder={`Enter ${name} content...`}
      />

      <div className="text-xs text-gray-500 mt-1">{value?.length || 0} characters</div>
    </div>
  )
}



