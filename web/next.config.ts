import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El paquete "shared" del monorepo se publica como TypeScript sin compilar,
  // por lo que Next debe transpilarlo.
  transpilePackages: ["shared"],
};

export default nextConfig;
