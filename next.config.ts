import type { NextConfig } from "next";

const backendApiBase = (
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5017/api/"
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.31.10", "*.loca.lt", "*.ngrok-free.app", "*.trycloudflare.com"],
  experimental: {
    proxyClientMaxBodySize: "100mb",
  },
  async rewrites() {
    return [
      {
        source: "/backend-api/:path*",
        destination: `${backendApiBase}/:path*`,
      },
    ];
  },
};

export default nextConfig;
