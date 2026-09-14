/**
 * Automated lightweight keep-alive scheduler for Next.js on Render.
 * Sends a lightweight GET ping every 3 minutes to keep both frontend and backend awake.
 */

const THREE_MINUTES_MS = 3 * 60 * 1000;
let keepAliveTimer: NodeJS.Timeout | null = null;
let isPinging = false;

export function startFrontendKeepAlive() {
  // Never run during static build or compilation phase
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return;
  }

  if (process.env.KEEP_ALIVE_ENABLED === "false") {
    return;
  }

  if (keepAliveTimer) {
    return;
  }

  const backendApiBase = (
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/"
  ).replace(/\/+$/, "");

  let backendHealthUrl = `${backendApiBase}/health`;
  if (backendApiBase.endsWith("/api")) {
    backendHealthUrl = backendApiBase.replace(/\/api$/, "/health");
  }

  // Self URL for Render
  const siteUrl = (
    process.env.RENDER_EXTERNAL_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3002"
  ).replace(/\/+$/, "");
  const frontendHealthUrl = `${siteUrl}/api/health`;

  const pingUrls = [backendHealthUrl, frontendHealthUrl];

  const runPing = async () => {
    if (isPinging) return;
    isPinging = true;

    for (let i = 0; i < pingUrls.length; i++) {
      const url = pingUrls[i];
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "User-Agent": "FintaraaFrontendKeepAlive/1.0",
            "Cache-Control": "no-cache",
          },
          signal: controller.signal,
        });
        clearTimeout(timeout);
        await res.text().catch(() => {});
      } catch {
        // Silently ignore ping errors - will retry next 3-minute cycle
      }

      if (i < pingUrls.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    isPinging = false;
  };

  // Initial ping 20 seconds after server starts
  setTimeout(() => {
    runPing().catch(() => {});
  }, 20000);

  // Repeat every 3 minutes
  keepAliveTimer = setInterval(() => {
    runPing().catch(() => {});
  }, THREE_MINUTES_MS);

  if (keepAliveTimer.unref) {
    keepAliveTimer.unref();
  }
}
