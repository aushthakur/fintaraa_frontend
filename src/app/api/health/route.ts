import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Ultra-lightweight health check endpoint for Render.
 * Returns in <1ms with zero database queries and zero CPU/memory load.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "fintaraa-frontend",
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    }
  );
}

export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    },
  });
}
