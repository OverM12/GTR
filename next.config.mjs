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
				pathname: '**',
			},
			{
				protocol: 'https',
				hostname: 'api-test.goodtime.app',
				pathname: '**',
			},
		],
	},

	env: {
		NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
		NEXT_PUBLIC_BASE_URL_LOGOUT: process.env.NEXT_PUBLIC_BASE_URL_LOGOUT,
		NEXT_PUBLIC_BASE_URL_NEWLOG: process.env.NEXT_PUBLIC_BASE_URL_NEWLOG,
		NEXT_PUBLIC_BASE_URL_LOGOUT_PRO: process.env.NEXT_PUBLIC_BASE_URL_LOGOUT_PRO,
		NEXT_PUBLIC_BASE_URL_NEWLOG_PRO: process.env.NEXT_PUBLIC_BASE_URL_NEWLOG_PRO,
	},
};

export default nextConfig;
