import { NextResponse } from "next/server"
import { DatabaseManager } from "@/lib/database-manager"

export async function POST() {
  try {
    const dbManager = new DatabaseManager()
    const result = await dbManager.initializeDatabase()

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
