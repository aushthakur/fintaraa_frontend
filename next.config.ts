import type { NextConfig } from "next";

const backendApiBase = (
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5017/api/"
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
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
