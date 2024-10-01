/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental :{
        serverActions : true,
        mdxRs : true,
        serverComponentsExternalPackages: ['mongoose'], 
    },
    images: {
        domains: ['images.pexels.com'], // Add allowed external domains here
    },
};

export default nextConfig;
