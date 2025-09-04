import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Login attempt started")
    const { email, password } = await request.json()
    console.log("[v0] Login data received:", {
      email: email ? "provided" : "missing",
      password: password ? "provided" : "missing",
    })

    if (!email || !password) {
      console.log("[v0] Missing email or password")
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    console.log("[v0] Attempting database connection")
    const db = await getDb()
    console.log("[v0] Database connected successfully")

    console.log("[v0] Searching for user with identifier:", email)
    const user = await db.collection("users").findOne({
      $or: [{ email }, { phone: email }, { slug: email }],
    })
    console.log("[v0] User found:", user ? "yes" : "no")

    if (!user) {
      console.log("[v0] User not found")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("[v0] Comparing passwords")
    const isPasswordValid = await bcrypt.compare(password, user.password)
    console.log("[v0] Password valid:", isPasswordValid)

    if (!isPasswordValid) {
      console.log("[v0] Invalid password")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("[v0] Generating JWT token")
    const token = jwt.sign(
      { userId: user._id, email: user.email, type: user.type },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" },
    )

    const { password: _, ...userWithoutPassword } = user
    console.log("[v0] Login successful")

    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json(
      { error: "Login failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
