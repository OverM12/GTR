'use client';
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
