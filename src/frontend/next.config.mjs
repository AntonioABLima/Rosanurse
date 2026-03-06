/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/Rosanurse",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    resolveAlias: {
      // pdfjs-dist references canvas in some paths; alias it away in the browser build
      canvas: { browser: "false" },
    },
  },
}

export default nextConfig
