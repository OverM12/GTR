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
			<body className="h-full bg-[#F0F2F5] overflow-hidden">
				<div className="flex h-screen w-screen overflow-hidden">
					<Menu className="w-64 md:w-56 sm:w-48 min-w-[3rem]" /> {/* responsive width */}
					<div className="flex flex-col flex-1 min-w-0">
						<div className="sticky top-0 z-50">
							<Navbar />
						</div>
						<div className="flex-1 overflow-y-auto overflow-x-hidden">
							{children}
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}
