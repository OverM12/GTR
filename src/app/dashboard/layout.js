"use client"
import Menu from "@/components/layout/Menu";
import Navbar from "@/components/layout/Navbar";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { cookies } from 'next/headers'

export default function RootLayout({ children }) {
	const router = useRouter();
	const cookieStore = cookies()
	const accessToken = cookieStore.get('accessToken')

	useEffect(() => {
		// const accessToken = cookies.getItem('accessToken');

		if (!accessToken) {
			router.push('/auth/signup');
		}
	}, [router]);

	return (
		<html lang="en">
			<body className="">
				<div className="flex">
					<Menu />
					<div className="flex flex-col w-full">
						<Navbar />
						{children}
					</div>
				</div>
			</body>
		</html>
	);
}
