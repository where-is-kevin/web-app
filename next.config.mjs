import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
});



/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    trailingSlash: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'whereiskevin.com',
                pathname: '**',
            },     {
                protocol: 'https',
                hostname: 'api.whereiskevin.com',
                pathname: '**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                // port: '8888',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'localhost',
                // port: '8888',
                pathname: '**',
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://api.whereiskevin.com/:path*',
            },
        ]
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
            {
                source: '/sw.js',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/javascript; charset=utf-8',
                    },
                    {
                        key: 'Cache-Control',
                        value: 'no-cache, no-store, must-revalidate',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self'",
                    },
                ],
            },
        ]
    },
};

// Your Next config is automatically typed!
export default withPWA(nextConfig);
