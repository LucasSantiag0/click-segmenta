import { NextRequest, NextResponse } from "next/server"
import { FLASK_BASE } from "@/lib/config"

export async function GET(req: NextRequest) {
  const target = `${FLASK_BASE}/api/segmentos${req.nextUrl.search}`
  const r = await fetch(target, { headers: { accept: "application/json" } })
  const data = await r.arrayBuffer()
  return new NextResponse(data, { status: r.status, headers: r.headers })
}
