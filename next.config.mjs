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
	},

	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 's3.ap-southeast-1.amazonaws.com',
				pathname: '**', // ✅ เปลี่ยนจาก /good-time-radio-assets-test/** → ** เพื่อรองรับ query string
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
