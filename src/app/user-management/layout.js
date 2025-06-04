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
		<html lang="en">
			<body className="h-screen overflow-hidden">
				<div className="flex h-full">
					<Menu />
					<div className="flex flex-col w-full h-full">
						<Navbar />
						<div className="flex-1 overflow-y-auto">
							{children}
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}
