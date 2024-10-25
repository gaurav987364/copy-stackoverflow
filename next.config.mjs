/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental :{
        serverActions : true,
        mdxRs : true,
        serverComponentsExternalPackages: ['mongoose'], 
    },
    images: {
         // Add allowed external domains here
         remotePatterns:[
           {
            protocol : 'https',
            hostname: '*',
           },
           {
            protocol : 'http',
            hostname: '*',
           },

         ]
    },
};

export default nextConfig;
