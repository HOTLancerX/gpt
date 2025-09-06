import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  try {
    const db = await getDb()
    const settings = await db.collection("settings").find({}).toArray()

    const settingsObj: { [key: string]: string } = {}
    settings.forEach((setting) => {
      settingsObj[setting.name] = setting.content
    })

    return NextResponse.json(settingsObj)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { settings } = body

    const db = await getDb()

    for (const [name, content] of Object.entries(settings)) {
      await db.collection("settings").updateOne({ name }, { $set: { name, content } }, { upsert: true })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
