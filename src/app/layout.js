
import { Inter } from "next/font/google";
import "./globals.css";
import { NavbarProvider } from "@/context/NavbarProvider";
import { DateRangeProvider } from '@/context/DateRangeContext';
import { CookiesProvider } from 'next-client-cookies/server';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "GTR Score",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <DateRangeProvider>
          <NavbarProvider>
          <CookiesProvider>
            {children}
          </CookiesProvider>
          </NavbarProvider>
        </DateRangeProvider>
      </body>
    </html>
  );
}
