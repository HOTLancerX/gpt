"use client"

interface TextProps {
  name: string
  content: string
  onChange: (name: string, content: string) => void
}

export default function Text({ name, content, onChange }: TextProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{name}</label>
      <textarea
        className="w-full p-3 border rounded-lg h-24"
        value={content}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={`Enter ${name} content...`}
      />
    </div>
  )
}
