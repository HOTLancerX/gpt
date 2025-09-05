//app/api/auth/signup/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    console.log("Signup attempt started")
    const { name, email, phone, slug, password } = await request.json()
    console.log("Signup data received:", {
      name: name ? "provided" : "missing",
      email: email ? "provided" : "missing",
      phone: phone ? "provided" : "missing",
      slug: slug ? "provided" : "missing",
      password: password ? "provided" : "missing",
    })

    if (!name || !email || !password) {
      console.log("Missing required fields")
      return NextResponse.json({ error: "Name, email and password required" }, { status: 400 })
    }

    console.log("Attempting database connection")
    const db = await getDb()
    console.log("Database connected successfully")

    // Check if user already exists
    console.log("Checking for existing user")
    const existingUser = await db.collection("users").findOne({
      $or: [{ email }, { phone }, { slug }],
    })
    console.log("Existing user found:", existingUser ? "yes" : "no")

    if (existingUser) {
      console.log("User already exists")
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    console.log("Hashing password")
    const hashedPassword = await bcrypt.hash(password, 12)

    console.log("Creating new user")
    const newUser = {
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
    }
    
    const result = await db.collection("users").insertOne(newUser)
    console.log("User created with ID:", result.insertedId)

    // Generate JWT token for automatic login
    console.log("Generating JWT token for automatic login")
    const token = jwt.sign(
      { userId: result.insertedId, email: newUser.email, type: newUser.type },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" },
    )

    // Remove password from user object before returning
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      token,
      user: { ...userWithoutPassword, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Signup failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}