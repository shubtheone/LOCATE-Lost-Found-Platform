import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { hashPassword, generateToken } from "@/lib/auth"

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    })

    // Generate JWT token
    const token = generateToken(result.insertedId.toString())

    const user = {
      id: result.insertedId.toString(),
      name,
      email,
    }

    return NextResponse.json({ user, token }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
