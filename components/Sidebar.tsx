"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Receipt, 
  BookOpen, 
  LogOut, 
  Bus, 
  Menu, 
  X 
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  // Helper component for consistent links
  const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => (
    <Link
      href={href}
      onClick={() => setIsMobileMenuOpen(false)} // Close menu on click (mobile)
      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
        isActive(href)
          ? "bg-slate-900 text-white shadow-md"
          : "text-slate-600 hover:bg-slate-100 hover:text-black"
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );

  return (
    <>
      {/* --- MOBILE NAVBAR (Visible on Small Screens) --- */}
      <div className="md:hidden bg-white border-b border-gray-200 fixed top-0 w-full z-50">
        <div className="flex justify-between items-center p-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <div className="bg-black text-white p-1.5 rounded-lg">
                    <Bus className="w-5 h-5" />
                </div>
                <span className="font-black text-lg tracking-tighter text-slate-900">
                    CROSSA<span className="text-yellow-600">ADMIN</span>
                </span>
            </div>
            
            {/* Hamburger Button */}
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-md"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
            <div className="border-t border-gray-100 bg-white px-4 py-2 space-y-1 shadow-lg h-screen">
                <NavItem href="/" icon={LayoutDashboard} label="Dashboard" />
                <NavItem href="/bookings" icon={BookOpen} label="All Bookings" />
                <NavItem href="/refunds" icon={Receipt} label="Refund Manager" />
                
                <div className="border-t border-gray-100 my-2 pt-2">
                    {/* FIXED LOGOUT LINK */}
                    <Link 
                        href="/api/auth/logout" 
                        className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium"
                    >
                        <LogOut size={20} /> Logout
                    </Link>
                </div>
            </div>
        )}
      </div>

      {/* --- DESKTOP SIDEBAR (Visible on Medium+ Screens) --- */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-10">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <div className="bg-black text-white p-1.5 rounded-lg">
                <Bus className="w-5 h-5" />
            </div>
            <span className="font-black text-xl tracking-tighter text-slate-900">
                CROSSA<span className="text-yellow-600">ADMIN</span>
            </span>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
            <NavItem href="/" icon={LayoutDashboard} label="Dashboard" />
            <NavItem href="/bookings" icon={BookOpen} label="All Bookings" />
            <NavItem href="/refunds" icon={Receipt} label="Refund Manager" />
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
            {/* FIXED LOGOUT LINK */}
            <Link 
                href="/api/auth/logout" 
                className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all"
            >
                <LogOut size={20} />
                Logout
            </Link>
        </div>
      </aside>
    </>
  );
}