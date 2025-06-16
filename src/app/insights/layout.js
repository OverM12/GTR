"use client"
import Menu from "@/components/layout/Menu";
import Navbar from "@/components/layout/Navbar";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function RootLayout({ children }) {
	const router = useRouter();

	useEffect(() => {
		const accessToken = localStorage.getItem('accessToken');

		if (!accessToken) {
			router.push('https://my.goodtime.app/login');
		}
	}, [router]);

	return (
		<html lang="en" className="h-full">
			<body className="h-full bg-[#F0F2F5]">
				<div className="flex h-full">
					<Menu />
					<div className="flex flex-col w-full h-full overflow-y-auto">
						<Navbar />
						<div className="flex-1 bg-gray-100">
							{children}
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}
