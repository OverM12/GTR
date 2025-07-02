"use client";

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
        <div className="flex h-full">
          <Menu />
          <div className="flex flex-col w-full h-full">
            <Navbar className="sticky top-0 z-50" />
            {/* Main content area: allow vertical scroll only here */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
