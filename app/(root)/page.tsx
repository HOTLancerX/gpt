import { Settings } from "@/lib/Settings"

export default async function HomePage() {
  const settings = await Settings()

  return <div>{settings.site || "Welcome to CMS"}</div>
}
