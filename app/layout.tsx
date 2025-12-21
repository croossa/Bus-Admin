import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar"; // Import the component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crossa Admin Panel",
  description: "Bus Booking Administration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 min-h-screen flex flex-col md:flex-row`}>
        
        {/* Navigation Component */}
        <Sidebar />

        {/* Main Content Area */}
        {/* pt-20 adds top padding on mobile for the navbar */}
        {/* md:pt-0 removes top padding on desktop */}
        {/* md:ml-64 adds left margin on desktop for the sidebar */}
        <main className="flex-1 pt-20 md:pt-0 md:ml-64 min-h-screen">
            <div className="p-4 md:p-8">
                {children}
            </div>
        </main>

      </body>
    </html>
  );
}