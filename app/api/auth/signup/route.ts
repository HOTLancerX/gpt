import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, slug, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password required" }, { status: 400 })
    }

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
      phone: phone || "",
      slug: slug || email.split("@")[0],
      password: hashedPassword,
      photo: "",
      type: "user",
      status: "active",
      info: [{ bio: "", tagline: "" }],
      createdAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      id: result.insertedId,
    })
  } catch (error) {
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}
