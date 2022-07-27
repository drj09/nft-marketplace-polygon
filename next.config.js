/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    env: {
        WEB3STORAGE_TOKEN: process.env.WEB3STORAGE_TOKEN,
        INFURA_IPFS_PROJECT_ID: process.env.INFURA_IPFS_PROJECT_ID,
        INFURA_IPFS_PROJECT_SECRET: process.env.INFURA_IPFS_PROJECT_SECRET,
    },
};

module.exports = nextConfig;
