import Link from 'next/link';
import { Search } from 'lucide-react';
import { Button } from './Button';

export const Navbar = () => {
    return (
        <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-transparent backdrop-blur-sm">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <span className="text-2xl font-bold tracking-wider text-white">EVENTIFY</span>
                <div className="w-4 h-4 rounded-full bg-purple-600 blur-[2px]" />
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
                <Button variant="primary" className="px-8 !py-2.5 text-xs font-bold tracking-widest uppercase">
                    Contact
                </Button>
            </div>
        </nav>
    );
};
