import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = 10
    const skip = (page - 1) * limit

    const db = await getDb()
    const users = await db.collection("users").find({}).skip(skip).limit(limit).toArray()

    const total = await db.collection("users").countDocuments()

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, slug, password, photo, type, status, info } = body

    const db = await getDb()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({
      $or: [{ email }, { phone }, { slug }],
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const result = await db.collection("users").insertOne({
      name,
      email,
      phone,
      slug,
      password: hashedPassword,
      photo: photo || "",
      type: type || "user",
      status: status || "active",
      info: info || [{ bio: "", tagline: "" }],
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}