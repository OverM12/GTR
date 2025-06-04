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
			<body className="overflow-hidden h-screen">
				<div className="flex h-full">
					<Menu />
					<div className="flex flex-col w-full overflow-y-auto">
						<Navbar />
						{children}
					</div>
				</div>
			</body>
		</html>
	);
}
