/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.medium.com",
      },
    ],
  },
  env: {
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET
	},
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
