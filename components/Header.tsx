import Link from "next/link"
import Users from "./Users"
import { Settings } from "@/lib/Settings"

export default async function HomePage() {
  const settings = await Settings()
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              <h1>{settings.site || "NX-CMS"}</h1>
            </Link>
          </div>
          <Users />
        </div>
      </div>
    </header>
  )
}
