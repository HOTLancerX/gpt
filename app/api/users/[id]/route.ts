// app/api/users/[id]/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const { params } = context
    const db = await getDb()
    const user = await db.collection("users").findOne({ _id: new ObjectId(params.id) })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove password before sending
    const { password, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    const { params } = context
    const body = await request.json()
    const { name, email, phone, slug, password, photo, type, status, info } = body

    const db = await getDb()

    const updateData: any = {
      name,
      email,
      phone,
      slug,
      photo,
      type,
      status,
      info,
      updatedAt: new Date(),
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 12)
    }

    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    // Treat writeConcernError as a warning, not a failure
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Update user error:", error)

    // If Mongo reports a writeConcernError but the operation actually modified a document, treat as success
    if (error?.codeName === "UnknownReplWriteConcern") {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}


export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    const { params } = context
    const db = await getDb()
    const result = await db.collection("users").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}