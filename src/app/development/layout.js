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
		<div className="flex h-screen">
			<Menu />
			<div className="flex flex-col flex-1">
				<div className="sticky top-0 z-50">
					<Navbar />
				</div>
				<div className="flex-1 bg-gray-100 overflow-auto">
					{children}
				</div>
			</div>
		</div>
	);
}
