import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { hashPassword, generateToken } from "@/lib/auth"

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // Parse and validate body
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    let { name, email, password } = body as { name?: string; email?: string; password?: string }

    name = (name ?? "").trim()
    email = (email ?? "").trim().toLowerCase()
    password = (password ?? "").trim()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields: name, email, password" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Ensure unique index on email (idempotent)
    await db.collection("users").createIndex({ email: 1 }, { unique: true }).catch(() => {})

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
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
