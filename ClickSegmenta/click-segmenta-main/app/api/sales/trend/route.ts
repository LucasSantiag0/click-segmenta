import { NextResponse } from "next/server"
import { FLASK_BASE } from "@/lib/config"

export async function GET() {
  const r = await fetch(`${FLASK_BASE}/api/sales/trend`, { headers: { accept: "application/json" } })
  const data = await r.arrayBuffer()
  return new NextResponse(data, { status: r.status, headers: r.headers })
}
