'use client';
interface TextProps {
  name: string;
  content: string;
  onChange: (value: string) => void;
}

export default function Text({ name, content, onChange }: TextProps) {
  return (
    <div className="mb-6">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </label>
      <textarea
        id={name}
        name={name}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}