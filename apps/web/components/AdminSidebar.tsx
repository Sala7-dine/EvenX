"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Ticket, ChevronDown, Plus, LogOut, Settings } from 'lucide-react';
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

    const mainTools = [
        { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/admin/events', label: 'Events List', icon: Calendar },
        { href: '/admin/reservations', label: 'Reservations', icon: Ticket },
    ];

    return (
        <div className="w-64 bg-[#050505] border-r border-[#1F1F1F] h-screen flex flex-col fixed left-0 top-0 text-[#9A9A9A] font-sans">
            {/* Header / Team Selector */}
            <div className="h-16 flex items-center px-4 border-b border-[#1F1F1F] hover:bg-[#111] cursor-pointer transition-colors">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold mr-3 shadow-lg shadow-purple-500/20">
                    E
                </div>
                <div className="flex-1">
                    <div className="text-sm font-semibold text-[#E1E1E1]">EvenX Studio</div>
                    <div className="text-xs text-[#666]">Pro Team</div>
                </div>
                <ChevronDown size={14} />
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
                {/* Tools Section */}
                <div>
                    <div className="flex items-center justify-between px-3 mb-2 group cursor-pointer">
                        <span className="text-xs font-medium uppercase tracking-wider text-[#666] group-hover:text-[#999] transition-colors">Tools</span>
                        <ChevronDown size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="space-y-0.5">
                        {mainTools.map((link) => {
                            const Icon = link.icon;
                            let isActive = pathname === link.href;
                            // Special case for dashboard root
                            if (link.href === '/admin/events' && pathname.startsWith('/admin/events')) isActive = true;

                            return (
                                <Link key={link.href} href={link.href}>
                                    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                        ? 'bg-[#1C1C1E] text-white'
                                        : 'hover:bg-[#1C1C1E] hover:text-[#E1E1E1]'
                                        }`}>
                                        <Icon size={16} />
                                        <span>{link.label}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Categories / Rooms (Mock) */}
                <div>
                    <div className="flex items-center justify-between px-3 mb-2 group cursor-pointer">
                        <span className="text-xs font-medium uppercase tracking-wider text-[#666] group-hover:text-[#999] transition-colors">Categories</span>
                        <Plus size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="space-y-0.5">
                        {['Music Festivals', 'Tech Conferences', 'Workshops'].map((item) => (
                            <div key={item} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#1C1C1E] hover:text-[#E1E1E1] cursor-pointer">
                                <span className="text-lg leading-none text-[#666]">#</span>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team (Mock) */}
                <div>
                    <div className="flex items-center justify-between px-3 mb-2 group cursor-pointer">
                        <span className="text-xs font-medium uppercase tracking-wider text-[#666] group-hover:text-[#999] transition-colors">Team</span>
                    </div>
                    <div className="space-y-3 px-3">
                        {['Sarah Connor', 'John Doe'].map((name, i) => (
                            <div key={name} className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full ${i === 0 ? 'bg-amber-500' : 'bg-blue-500'}`} />
                                <span className="text-sm cursor-pointer hover:text-white transition-colors">{name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer / User Profile */}
            <div className="p-3 border-t border-[#1F1F1F]">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1C1C1E] cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600"></div>
                    <div className="flex-1 overflow-hidden">
                        <div className="text-sm font-medium text-white truncate">Admin User</div>
                        <div className="text-xs text-[#666]">admin@evenx.com</div>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="p-1 h-auto text-[#666] hover:text-red-400"
                        title="Logout"
                    >
                        <LogOut size={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
};
