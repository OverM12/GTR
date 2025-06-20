import { Inter } from "next/font/google";
import "./globals.css";
import { NavbarProvider } from "@/context/NavbarProvider";
import { DateRangeProvider } from '@/context/DateRangeContext';
import { CookiesProvider } from 'next-client-cookies/server';
import { UserPageProvider } from "@/context/UserPageContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "GTR Dashboard",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="min-h-screen">
      <body className={`min-h-screen ${inter.className}`}>
        <DateRangeProvider>
          <NavbarProvider>
            <CookiesProvider>
              <UserPageProvider>
                {children}
              </UserPageProvider>
            </CookiesProvider>
          </NavbarProvider>
        </DateRangeProvider>
      </body>
    </html>
  );
}
