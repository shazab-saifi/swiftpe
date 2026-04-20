import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../"),
  outputFileTracingIncludes: {
    "/*": ["node_modules/sharp/**/*", "node_modules/aws-crt/dist/bin/**/*"],
  },
};

export default nextConfig;
