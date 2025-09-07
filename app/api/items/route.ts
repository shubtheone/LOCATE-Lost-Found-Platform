import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const items = await db.collection("items").find({}).sort({ createdAt: -1 }).toArray()
    const formattedItems = items.map((item) => ({
      ...item,
      id: item._id.toString(),
      _id: undefined,
    }))
    return NextResponse.json({ items: formattedItems }, { status: 200 })
  } catch (error) {
    console.error("Get items error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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
    const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.userId) })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    const { title, description, category, location, dateFound, contactInfo, imageUrl } = await request.json()
    if (!title || !description || !category || !location || !dateFound || !contactInfo) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    const newItem = {
      title,
      description,
      category,
      location,
      dateFound,
      contactInfo,
      imageUrl,
      postedBy: user._id.toString(),
      postedByName: user.name,
      createdAt: new Date(),
      status: "available",
    }
    const result = await db.collection("items").insertOne(newItem)
    const responseItem = {
      ...newItem,
      id: result.insertedId.toString(),
    }
    return NextResponse.json({ item: responseItem }, { status: 201 })
  } catch (error) {
    console.error("Create item error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}