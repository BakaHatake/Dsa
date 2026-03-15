"use client";

import { Home, LineChart, Users, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { icon: <Home className="w-6 h-6" />, label: "Home", href: "/" },
        { icon: <LineChart className="w-6 h-6" />, label: "Analytics", href: "/analytics" },
        { icon: <Users className="w-6 h-6" />, label: "Compare", href: "/compare" },
        { icon: <User className="w-6 h-6" />, label: "Profile", href: "/dashboard" },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 w-full bg-[#0b101e] border-t border-[#1e293b] flex justify-between items-center px-6 py-3 z-50 pb-[env(safe-area-inset-bottom)] pb-safe">
            {navItems.map((item, idx) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                return (
                    <Link
                        key={idx}
                        href={item.href}
                        className={`flex flex-col items-center gap-1 transition-colors ${
                            isActive ? "text-[#2563eb]" : "text-[#64748b] hover:text-white"
                        }`}
                    >
                        {item.icon}
                        <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}
