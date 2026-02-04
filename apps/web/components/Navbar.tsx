"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, LogOut, User } from 'lucide-react';
import { Button } from './Button';
import { logout } from '../lib/api';
import Cookies from 'js-cookie';

export const Navbar = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check auth status on mount
        const checkAuth = () => {
            const token = Cookies.get('token');
            setIsAuthenticated(!!token);
        };

        checkAuth();

        // Listen for storage events (login/logout from other tabs or components)
        window.addEventListener('storage', checkAuth);
        // Custom event for same-tab updates
        window.addEventListener('auth-change', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('auth-change', checkAuth);
        };
    }, []);

    const handleLogout = async () => {
        await logout();
        Cookies.remove('token');
        setIsAuthenticated(false);
        window.dispatchEvent(new Event('auth-change')); // Notify other components
        router.push('/login');
    };

    return (
        <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-transparent backdrop-blur-sm">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold tracking-wider text-white">EVENTIFY</span>
                    <div className="w-4 h-4 rounded-full bg-purple-600 blur-[2px]" />
                </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">ABOUT</Link>
                <Link href="#" className="text-white transition-colors">EVENT</Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">SPEAKER</Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">TICKET</Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">BLOGS</Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
                <Search className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />

                {isAuthenticated ? (
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-gray-300 hover:text-white px-4 text-xs font-bold tracking-widest uppercase">
                                Dashboard
                            </Button>
                        </Link>
                        <Button
                            variant="primary"
                            onClick={handleLogout}
                            className="px-6 !py-2 text-xs font-bold tracking-widest uppercase flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </Button>
                    </div>
                ) : (
                    <>
                        <Link href="/login" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                            LOGIN
                        </Link>
                        <Link href="/register">
                            <Button variant="primary" className="px-6 !py-2 text-xs font-bold tracking-widest uppercase">
                                Sign Up
                            </Button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};
