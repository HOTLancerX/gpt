import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Signup attempt started")
    const { name, email, phone, slug, password } = await request.json()
    console.log("[v0] Signup data received:", {
      name: name ? "provided" : "missing",
      email: email ? "provided" : "missing",
      phone: phone ? "provided" : "missing",
      slug: slug ? "provided" : "missing",
      password: password ? "provided" : "missing",
    })

    if (!name || !email || !password) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({ error: "Name, email and password required" }, { status: 400 })
    }

    console.log("[v0] Attempting database connection")
    const db = await getDb()
    console.log("[v0] Database connected successfully")

    // Check if user already exists
    console.log("[v0] Checking for existing user")
    const existingUser = await db.collection("users").findOne({
      $or: [{ email }, { phone }, { slug }],
    })
    console.log("[v0] Existing user found:", existingUser ? "yes" : "no")

    if (existingUser) {
      console.log("[v0] User already exists")
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    console.log("[v0] Hashing password")
    const hashedPassword = await bcrypt.hash(password, 12)

    console.log("[v0] Creating new user")
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
    console.log("[v0] User created with ID:", result.insertedId)

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      id: result.insertedId,
    })
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json(
      { error: "Signup failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
