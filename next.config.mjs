/** @type {import('next').NextConfig} */
const nextConfig = {
	basePath: '',
	reactStrictMode: true,
	poweredByHeader: false,

	experimental: {
		optimizeCss: true,
		memoryBasedWorkersCount: true,
		serverActions: {
			allowedOrigins: ['localhost:3000'],
		},
		turbo: false,
	},

	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 's3.ap-southeast-1.amazonaws.com',
				pathname: '**',
			},
			{
				protocol: 'https',
				hostname: 'api-test.goodtime.app',
				pathname: '**',
			},
		],
	},
};

export default nextConfig;
