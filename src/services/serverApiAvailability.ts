import { Socket } from "node:net";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const CACHE_TTL_MS = 5000;
const CONNECT_TIMEOUT_MS = 180;

const cache = new Map<string, { ok: boolean; expiresAt: number }>();

export async function isServerApiReachable(baseUrl: string) {
  let url: URL;
  try {
    url = new URL(baseUrl);
  } catch {
    return false;
  }

  if (!LOCAL_HOSTS.has(url.hostname)) return true;

  const port = Number(url.port || (url.protocol === "https:" ? 443 : 80));
  if (!port) return false;

  const cacheKey = `${url.hostname}:${port}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.ok;

  const ok = await new Promise<boolean>((resolve) => {
    const socket = new Socket();
    let settled = false;

    const finish = (value: boolean) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(value);
    };

    socket.setTimeout(CONNECT_TIMEOUT_MS);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
    socket.connect(port, url.hostname);
  });

  cache.set(cacheKey, { ok, expiresAt: Date.now() + CACHE_TTL_MS });
  return ok;
}
