import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get("name")
    const db = await getDb()

    if (name) {
      const setting = await db.collection("settings").findOne({ name })
      return NextResponse.json({ content: setting?.content || "" })
    } else {
      const settings = await db.collection("settings").find({}).toArray()
      const settingsObj: { [key: string]: string } = {}
      settings.forEach((setting) => {
        settingsObj[setting.name] = setting.content
      })
      return NextResponse.json(settingsObj)
    }
  } catch (error) {
    console.error("Settings GET error:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, content, settings } = body
    const db = await getDb()

    // Single field update
    if (name && content !== undefined) {
      try {
        await db.collection("settings").updateOne(
          { name },
          { $set: { name, content: String(content) } },
          { upsert: true } // <-- only upsert, no writeConcern
        )
      } catch (err) {
        console.warn("MongoDB warning on single update:", err)
      }
      return NextResponse.json({ success: true })
    }

    // Multiple fields update
    if (settings && typeof settings === "object") {
      try {
        const bulkOps = Object.entries(settings).map(([settingName, settingContent]) => ({
          updateOne: {
            filter: { name: settingName },
            update: { $set: { name: settingName, content: String(settingContent) } },
            upsert: true,
          },
        }))
        if (bulkOps.length > 0) {
          await db.collection("settings").bulkWrite(bulkOps)
        }
      } catch (err) {
        console.warn("MongoDB warning on bulk update:", err)
      }
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  } catch (error) {
    console.error("Settings POST error:", error)
    return NextResponse.json(
      {
        error: "Failed to update settings",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
