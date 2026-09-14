export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startFrontendKeepAlive } = await import("./lib/keepAliveScheduler");
    startFrontendKeepAlive();
  }
}
