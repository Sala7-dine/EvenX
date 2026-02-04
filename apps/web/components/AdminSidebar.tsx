"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Users, LogOut, Ticket } from 'lucide-react';
import { Button } from './Button';
import { logout } from '../lib/api';
import { useRouter } from 'next/navigation';

export const AdminSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    const links = [
        { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/admin/events', label: 'Manage Events', icon: Calendar },
        { href: '/admin/reservations', label: 'Reservations', icon: Ticket },
    ];

    return (
        <div className="w-64 bg-[#0B1121] border-r border-white/5 h-screen flex flex-col fixed left-0 top-0">
            <div className="p-8">
                <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-900/20 group-hover:scale-105 transition-transform">
                        <span className="text-lg font-bold text-white">E</span>
                    </div>
                    <span className="text-xl font-bold tracking-wide text-white">ADMIN</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link key={link.href} href={link.href}>
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}>
                                <Icon size={20} />
                                <span className="font-medium">{link.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5">
                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 justify-start text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                >
                    <LogOut size={20} />
                    Logout
                </Button>
            </div>
        </div>
    );
};
