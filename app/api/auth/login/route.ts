//app/api/auth/login/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    console.log("Login attempt started")
    const { email, password } = await request.json()
    console.log("Login data received:", {
      email: email ? "provided" : "missing",
      password: password ? "provided" : "missing",
    })

    if (!email || !password) {
      console.log("Missing email or password")
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    console.log("Attempting database connection")
    const db = await getDb()
    console.log("Database connected successfully")

    console.log("Searching for user with identifier:", email)
    const user = await db.collection("users").findOne({
      $or: [{ email }, { phone: email }, { slug: email }],
    })
    console.log("User found:", user ? "yes" : "no")

    if (!user) {
      console.log("User not found")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("Comparing passwords")
    const isPasswordValid = await bcrypt.compare(password, user.password)
    console.log("Password valid:", isPasswordValid)

    if (!isPasswordValid) {
      console.log("Invalid password")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("Generating JWT token")
    const token = jwt.sign(
      { userId: user._id, email: user.email, type: user.type },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" },
    )

    const { password: _, ...userWithoutPassword } = user
    console.log("Login successful")

    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Login failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
