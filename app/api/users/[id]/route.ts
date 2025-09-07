import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

// Update user profile
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.userId !== params.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { name } = await request.json()
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const { db } = await connectToDatabase()
    const userId = new ObjectId(params.id);

    const userUpdateResult = await db.collection("users").updateOne(
      { _id: userId },
      { $set: { name: name.trim() } }
    )

    if (userUpdateResult.matchedCount === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await db.collection("items").updateMany(
        { postedBy: params.id },
        { $set: { postedByName: name.trim() } }
    )

    return NextResponse.json({ success: true, message: "Profile updated successfully" }, { status: 200 })
  } catch (error)
 {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}