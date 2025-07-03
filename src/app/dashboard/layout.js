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
			router.push(process.env.NEXT_PUBLIC_BASE_URL_LOGOUT);
		}
	}, [router]);

	return (
		<html lang="en" className="h-full">
			<body className="h-full bg-[#F0F2F5]">
				<div className="flex h-screen">
					<Menu />
					<div className="flex flex-col flex-1">
						<div className="sticky top-0 z-10">
							<Navbar />
						</div>
						<div className="flex-1 overflow-auto min-h-0">
							{children}
						</div>
					</div>
				</div>
			</body>
		</html>

	);
}
