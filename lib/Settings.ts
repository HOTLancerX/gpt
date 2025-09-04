import { getDb } from "./db"

export async function Settings() {
  try {
    const db = await getDb()
    const settings = await db.collection("settings").find({}).toArray()

    const settingsObj: { [key: string]: string } = {}
    settings.forEach((setting) => {
      settingsObj[setting.name] = setting.content
    })

    return settingsObj
  } catch (error) {
    console.log("[v0] Database connection failed during build, using defaults:", error)
    return {
      site: "Welcome to CMS",
      title: "Content Management System",
    }
  }
}
