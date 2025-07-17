import { NextResponse } from "next/server"
import { db } from "../../../lib/db"

export async function GET() {
  const [rows] = await db.query("SELECT name, score, created_at FROM leaderboard ORDER BY score DESC LIMIT 10")
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, score } = body

  if (!name || typeof score !== "number") {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  await db.query("INSERT INTO leaderboard (name, score) VALUES (?, ?)", [name, score])
  return NextResponse.json({ message: "Score saved" }, { status: 201 })
}
