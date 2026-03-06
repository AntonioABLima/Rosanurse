/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production"

const nextConfig = {
  output: "export",
  basePath: isProd ? "/Rosanurse" : "",
  env: {
    NEXT_PUBLIC_BASEPATH: isProd ? "/Rosanurse" : "",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    resolveAlias: {
      // pdfjs-dist references canvas in some paths; alias it away in the browser build
      canvas: "./lib/canvas-stub.js",
    },
  },
}

export default nextConfig
