/** @type {import('next').NextConfig} */
const nextConfig = {
	basePath: '/your-gtr',
	images: {
		remotePatterns: [
		  {
			protocol: 'https',
			hostname: 'api-test.goodtime.app',
			pathname: '/**',
		  },
		],
	  },
};

export default nextConfig;
