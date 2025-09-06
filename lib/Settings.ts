import { getDb } from "./db"

export async function Settings() {
  const db = await getDb()
  const settings = await db.collection("settings").find({}).toArray()

  const settingsObj: { [key: string]: string } = {}
  settings.forEach((setting) => {
    settingsObj[setting.name] = setting.content
  })

  return settingsObj
}
