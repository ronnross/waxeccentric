/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

if (process.env.NODE_ENV === "development") {
  nextConfig.rewrites = async () => [
    {
      source: "/kallos-sthenos/:path*",
      destination: "http://localhost:3001/kallos-sthenos/:path*",
    },
  ];
}

module.exports = nextConfig;
