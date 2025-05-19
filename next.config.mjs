/** @type {import('next').NextConfig} */
const nextConfig = {
	basePath: '',
	reactStrictMode: true,
	poweredByHeader: false, // Remove X-Powered-By header

	// Static optimization
	experimental: {
		optimizeCss: true,
		memoryBasedWorkersCount: true,
		serverActions: {
			allowedOrigins: ['localhost:3000'],
		},
	},
};

export default nextConfig;
