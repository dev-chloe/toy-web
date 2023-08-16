/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    // https://nextjs.org/docs/architecture/nextjs-compiler#supported-features
    styledComponents: {
      displayName: true, // Enable display of the component name along with the generated className (needed for debugging).
      fileName: true, // Enable the displayName of a component will be prefixed with the filename in order to make the component name as unique as possible
      ssr: true, // Enable SSR support
    },
  },
  // Build outputs
  output: "export",
  distDir: "build",
}

module.exports = nextConfig;
