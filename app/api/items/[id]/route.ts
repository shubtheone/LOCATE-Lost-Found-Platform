import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const { status } = await request.json()

    // Verify the item belongs to the user
    const item = await db.collection("items").findOne({
      _id: new ObjectId(params.id),
      postedBy: decoded.userId,
    })

    if (!item) {
      return NextResponse.json({ error: "Item not found or unauthorized" }, { status: 404 })
    }

    await db
      .collection("items")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: { status, updatedAt: new Date() } })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Update item error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Verify the item belongs to the user
    const item = await db.collection("items").findOne({
      _id: new ObjectId(params.id),
      postedBy: decoded.userId,
    })

    if (!item) {
      return NextResponse.json({ error: "Item not found or unauthorized" }, { status: 404 })
    }

    await db.collection("items").deleteOne({ _id: new ObjectId(params.id) })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Delete item error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
