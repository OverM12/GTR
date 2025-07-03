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
    <html lang="en" className="h-full w-full">
  <body className="h-full w-full bg-[#F0F2F5]">
    <div className="relative h-screen w-screen flex overflow-hidden">
      {/* Menu overlay (ลอย ไม่ดัน content) */}
      <Menu />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  </body>
</html>

  );
}
