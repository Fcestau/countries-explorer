import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El paquete "shared" del monorepo se publica como TypeScript sin compilar,
  // por lo que Next debe transpilarlo.
  transpilePackages: ["shared"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flags.restcountries.com",
      },
    ],
  },
};

export default nextConfig;
