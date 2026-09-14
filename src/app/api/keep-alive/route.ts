import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Keep-alive ping endpoint for Render web services.
 * Checks frontend health and pings backend health without causing any load.
 */
export async function GET() {
  const backendApiBase = (
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/"
  ).replace(/\/+$/, "");

  // Resolve backend health check endpoint
  let backendHealthUrl = `${backendApiBase}/health`;
  if (backendApiBase.endsWith("/api")) {
    backendHealthUrl = backendApiBase.replace(/\/api$/, "/health");
  }

  let backendStatus = "healthy";
  let backendLatencyMs = 0;

  try {
    const startTime = Date.now();
    const response = await fetch(backendHealthUrl, {
      method: "GET",
      headers: {
        "User-Agent": "FintaraaKeepAlive-Frontend/1.0",
        "Cache-Control": "no-cache, no-store",
      },
      signal: AbortSignal.timeout(6000), // 6 second max timeout
    });
    backendLatencyMs = Date.now() - startTime;
    backendStatus = response.ok ? "healthy" : `http_${response.status}`;
  } catch (error: any) {
    backendStatus = error?.name === "AbortError" ? "timeout" : error?.message || "unreachable";
  }

  return NextResponse.json(
    {
      status: "ok",
      service: "fintaraa-frontend",
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      keepAliveIntervalMinutes: 3,
      backend: {
        url: backendHealthUrl,
        status: backendStatus,
        latencyMs: backendLatencyMs,
      },
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
